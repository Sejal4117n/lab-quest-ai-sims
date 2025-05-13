
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
    };
  }, []);

  // Draw the field and measurements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw field background
    ctx.fillStyle = '#e6ffe6'; // Light green for field
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Calculate scale based on max possible distance
    // Using v^2 * sin(2θ) / g from the ideal projectile motion formula
    const gravity = 9.8;
    const maxVelocity = launcher.velocityMean + 3 * launcher.velocityStdDev; // To account for variation
    const maxDistance = Math.pow(maxVelocity, 2) * Math.sin(2 * launchAngle * Math.PI / 180) / gravity;
    
    // Scale factor (pixels per meter) - leave some margin
    const scaleX = (dimensions.width - 60) / (maxDistance + 5);
    
    // Draw horizontal distance markers every 5 meters
    ctx.fillStyle = '#555';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    // Y-position for distance markers
    const markerY = dimensions.height - 10;
    
    for (let dist = 0; dist <= maxDistance + 5; dist += 5) {
      const xPos = 30 + (dist * scaleX);
      
      // Draw vertical marker line
      ctx.beginPath();
      ctx.moveTo(xPos, markerY);
      ctx.lineTo(xPos, markerY - 5);
      ctx.stroke();
      
      // Draw distance label
      ctx.fillText(`${dist}m`, xPos, markerY + 9);
    }
    
    // Draw launcher and ground
    const launcherX = 30;
    const groundY = dimensions.height - 20;
    
    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(dimensions.width, groundY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Launcher base
    ctx.fillStyle = '#333';
    ctx.fillRect(launcherX - 10, groundY - 10, 20, 10);
    
    // Launcher barrel
    ctx.beginPath();
    ctx.moveTo(launcherX, groundY - 10);
    const barrelLength = 20;
    const angleInRadians = launchAngle * Math.PI / 180;
    ctx.lineTo(
      launcherX + Math.cos(angleInRadians) * barrelLength, 
      groundY - 10 - Math.sin(angleInRadians) * barrelLength
    );
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw mean indicators on the field for existing data
    if (simulationData && simulationData.length > 0) {
      const meanDistance = simulationData.reduce((a, b) => a + b, 0) / simulationData.length;
      const meanX = 30 + (meanDistance * scaleX);
      
      // Draw the mean marker
      ctx.beginPath();
      ctx.moveTo(meanX, groundY);
      ctx.lineTo(meanX, groundY - 40);
      ctx.strokeStyle = launcher.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw arrow at the top
      ctx.beginPath();
      ctx.moveTo(meanX, groundY - 40);
      ctx.lineTo(meanX - 5, groundY - 35);
      ctx.lineTo(meanX + 5, groundY - 35);
      ctx.closePath();
      ctx.fillStyle = launcher.color;
      ctx.fill();
      
      // Label with mean value
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`μ = ${meanDistance.toFixed(2)}m`, meanX, groundY - 45);
      
      // Draw n value
      ctx.fillStyle = '#555';
      ctx.font = '10px Arial';
      ctx.fillText(`n = ${simulationData.length}`, meanX, groundY - 55);
    }
    
    // Animate a projectile if active
    if (isActive && launcher) {
      // We'll just show a simple illustrative trajectory
      const initialVelocity = launcher.velocityMean;
      const trajectory = calculateProjectileTrajectory(initialVelocity, launchAngle);
      
      // Draw trajectory path
      ctx.beginPath();
      
      trajectory.forEach((point, index) => {
        const x = launcherX + (point.x * scaleX);
        // Flip y-coordinate since canvas y increases downwards
        const y = groundY - (point.y * scaleY);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = launcher.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [dimensions, launcher, launchAngle, simulationData, isActive]);
  
  // Calculate scale factor for y-axis (height)
  const scaleY = 4; // Pixels per meter for height (can be different than x-scale)

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="absolute top-0 left-0"
      />
      <div className="absolute top-2 left-2 bg-background/90 p-2 rounded text-xs">
        Launcher: {launcher.name} | Angle: {launchAngle}°
      </div>
    </div>
  );
};

export default ProjectileCanvas;
