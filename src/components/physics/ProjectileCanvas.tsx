
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { calculateProjectileTrajectory } from '@/utils/physics/projectileUtils';

interface ProjectileCanvasProps {
  launcher: {
    id: number;
    name: string;
    velocityMean: number;
    velocityStdDev: number;
    color: string;
  };
  sampleSize: number;
  launchAngle: number;
  simulationData: number[];
  isActive: boolean;
}

const ProjectileCanvas: React.FC<ProjectileCanvasProps> = ({
  launcher,
  sampleSize,
  launchAngle,
  simulationData,
  isActive
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [projectilePos, setProjectilePos] = useState<{x: number, y: number} | null>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Resize handler for responsive canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Set initial dimensions
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationFrame]);

  // Draw the field and measurements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw field background - more vibrant green
    const fieldGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
    fieldGradient.addColorStop(0, '#e7f5e2');  // Lighter green at top
    fieldGradient.addColorStop(1, '#c5e8ba');  // Darker green at bottom
    ctx.fillStyle = fieldGradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Add field texture - subtle grid pattern
    ctx.strokeStyle = '#d0ebc8';
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    // Draw vertical lines
    for (let x = 0; x <= dimensions.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dimensions.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= dimensions.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
    }

    // Calculate scale based on max possible distance
    // Using v^2 * sin(2θ) / g from the ideal projectile motion formula
    const gravity = 9.8;
    const maxVelocity = launcher.velocityMean + 3 * launcher.velocityStdDev; // To account for variation
    const maxDistance = Math.pow(maxVelocity, 2) * Math.sin(2 * launchAngle * Math.PI / 180) / gravity;
    
    // Scale factor (pixels per meter) - leave some margin
    const scaleX = (dimensions.width - 60) / (maxDistance + 5);
    
    // Draw horizontal distance markers every 5 meters
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    
    // Y-position for distance markers
    const markerY = dimensions.height - 10;
    
    // Draw distance markers with improved visibility
    for (let dist = 0; dist <= maxDistance + 5; dist += 5) {
      const xPos = 30 + (dist * scaleX);
      
      // Draw marker line and background
      ctx.fillStyle = '#fff';
      ctx.fillRect(xPos - 10, markerY - 8, 20, 12);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xPos, markerY);
      ctx.lineTo(xPos, markerY - 8);
      ctx.stroke();
      
      // Draw distance label
      ctx.fillStyle = '#333';
      ctx.fillText(`${dist}m`, xPos, markerY + 4);
    }
    
    // Draw launcher and ground
    const launcherX = 30;
    const groundY = dimensions.height - 20;
    
    // Ground line with shadow
    ctx.beginPath();
    ctx.moveTo(0, groundY + 2);
    ctx.lineTo(dimensions.width, groundY + 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(dimensions.width, groundY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Launcher base - more colorful and cartoon-style
    ctx.fillStyle = '#444';
    ctx.fillRect(launcherX - 12, groundY - 10, 24, 10);
    
    // Launcher body
    ctx.fillStyle = launcher.color;
    ctx.beginPath();
    ctx.arc(launcherX, groundY - 16, 14, Math.PI, 2 * Math.PI);
    ctx.fill();
    ctx.fillRect(launcherX - 14, groundY - 16, 28, 8);
    
    // Launcher barrel
    ctx.beginPath();
    ctx.moveTo(launcherX, groundY - 16);
    const barrelLength = 25;
    const angleInRadians = launchAngle * Math.PI / 180;
    
    // Barrel base coordinates
    const barrelEndX = launcherX + Math.cos(angleInRadians) * barrelLength;
    const barrelEndY = groundY - 16 - Math.sin(angleInRadians) * barrelLength;
    
    // Draw wider barrel
    const barrelWidth = 6;
    ctx.lineWidth = barrelWidth;
    ctx.strokeStyle = launcher.color;
    ctx.beginPath();
    ctx.moveTo(launcherX, groundY - 16);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();
    
    // Barrel outline
    ctx.lineWidth = barrelWidth + 2;
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(launcherX, groundY - 16);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();
    
    // Barrel inner line
    ctx.lineWidth = barrelWidth - 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(launcherX, groundY - 16);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();
    
    // Draw mean indicators on the field for existing data
    if (simulationData && simulationData.length > 0) {
      const meanDistance = simulationData.reduce((a, b) => a + b, 0) / simulationData.length;
      const meanX = 30 + (meanDistance * scaleX);
      
      // Draw decorative target zone
      const targetRadius = 15;
      const targetX = meanX;
      const targetY = groundY - 2;
      
      // Target outer circle
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
      ctx.strokeStyle = launcher.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Target inner circle
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetRadius * 0.7, 0, 2 * Math.PI);
      ctx.fillStyle = launcher.color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Target center dot
      ctx.beginPath();
      ctx.arc(targetX, targetY, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
      
      // Draw the mean marker - flag style
      ctx.beginPath();
      ctx.moveTo(meanX, groundY);
      ctx.lineTo(meanX, groundY - 45);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Flag
      ctx.beginPath();
      ctx.moveTo(meanX, groundY - 45);
      ctx.lineTo(meanX + 18, groundY - 40);
      ctx.lineTo(meanX, groundY - 35);
      ctx.closePath();
      ctx.fillStyle = launcher.color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Label with mean value
      ctx.fillStyle = '#fff';
      ctx.fillRect(meanX - 25, groundY - 65, 50, 18);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(meanX - 25, groundY - 65, 50, 18);
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`μ = ${meanDistance.toFixed(2)}m`, meanX, groundY - 52);
      
      // Draw n value with a bubble background
      const sampleText = `n = ${simulationData.length}`;
      const textWidth = ctx.measureText(sampleText).width;
      
      ctx.fillStyle = launcher.color;
      ctx.beginPath();
      ctx.arc(meanX, groundY - 75, textWidth + 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(sampleText, meanX, groundY - 72);
    }

    // Animate a projectile if active
    if (isActive && launcher) {
      // If we have a position from the animation, draw the projectile there
      if (projectilePos) {
        const { x, y } = projectilePos;
        
        // Draw trail - fading arc
        const trajectory = calculateProjectileTrajectory(launcher.velocityMean, launchAngle);
        ctx.beginPath();
        
        // Draw dashed path
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = `${launcher.color}88`;
        ctx.lineWidth = 2;
        
        trajectory.forEach((point, index) => {
          const pointX = launcherX + (point.x * scaleX);
          // Flip y-coordinate since canvas y increases downwards
          const pointY = groundY - (point.y * scaleY);
          
          if (index === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        });
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw shadow
        ctx.beginPath();
        ctx.ellipse(x, groundY, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();
        
        // Draw the projectile (metallic ball)
        const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, 8);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.3, '#ccc');
        gradient.addColorStop(1, '#666');
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add a shine effect
        ctx.beginPath();
        ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fill();
        
        // Show data popup if near landing
        if (y > groundY - 20 && showInfoPopup) {
          // Calculate landing distance
          const distanceFromLauncher = (x - launcherX) / scaleX;
          
          // Draw info popup
          const popupWidth = 80;
          const popupHeight = 40;
          const popupX = x - popupWidth / 2;
          const popupY = y - popupHeight - 15;
          
          // Draw a speech bubble
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.moveTo(popupX, popupY);
          ctx.lineTo(popupX + popupWidth, popupY);
          ctx.lineTo(popupX + popupWidth, popupY + popupHeight);
          ctx.lineTo(x + 10, popupY + popupHeight);
          ctx.lineTo(x, popupY + popupHeight + 10);
          ctx.lineTo(x - 10, popupY + popupHeight);
          ctx.lineTo(popupX, popupY + popupHeight);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Add text
          ctx.fillStyle = '#333';
          ctx.font = 'bold 11px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Distance: ${distanceFromLauncher.toFixed(1)}m`, x, popupY + 16);
          ctx.font = '10px Arial';
          ctx.fillText(`Sample #${simulationData.length + 1}`, x, popupY + 32);
        }
      } else {
        // Start a new animation when active but no position
        startProjectileAnimation();
      }
    } else if (!isActive) {
      // Reset animation when not active
      setProjectilePos(null);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        setAnimationFrame(null);
      }
    }
  }, [dimensions, launcher, launchAngle, simulationData, isActive, projectilePos, animationFrame, showInfoPopup]);
  
  // Calculate scale factor for y-axis (height)
  const scaleY = 4; // Pixels per meter for height (can be different than x-scale)
  
  // Animation function for projectile
  const startProjectileAnimation = () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate trajectory points
    const trajectory = calculateProjectileTrajectory(launcher.velocityMean, launchAngle);
    const launcherX = 30;
    const groundY = dimensions.height - 20;
    
    // Animation variables
    let frame = 0;
    const totalFrames = 60; // Adjust for speed
    const animateProjectile = () => {
      if (frame < totalFrames) {
        // Get position along trajectory based on frame
        const i = Math.min(
          Math.floor((frame / totalFrames) * trajectory.length), 
          trajectory.length - 1
        );
        const point = trajectory[i];
        
        // Calculate screen position
        const x = launcherX + (point.x * (dimensions.width - 60) / 50); // Approximate scaling
        const y = groundY - (point.y * scaleY);
        
        setProjectilePos({ x, y });
        
        // Show popup near landing
        setShowInfoPopup(frame > totalFrames * 0.7);
        
        // Continue animation
        frame++;
        setAnimationFrame(requestAnimationFrame(animateProjectile));
      } else {
        // End animation
        setTimeout(() => {
          setShowInfoPopup(false);
          setProjectilePos(null);
        }, 1000);
      }
    };
    
    // Start animation
    setAnimationFrame(requestAnimationFrame(animateProjectile));
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="absolute top-0 left-0"
      />
      <div className="absolute top-2 left-2 bg-white/90 p-2 rounded text-xs border border-gray-200 shadow-sm">
        <div className="font-semibold">{launcher.name}</div>
        <div>Angle: {launchAngle}° | Sample size: n={sampleSize}</div>
      </div>
      <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded text-xs font-medium border border-gray-200 shadow-sm">
        Gravity: 9.8 m/s²
      </div>
    </div>
  );
};

export default ProjectileCanvas;
