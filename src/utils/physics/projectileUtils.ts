
// Gravity constant in m/s²
const GRAVITY = 9.8;

/**
 * Calculates the distance a projectile will travel based on initial velocity and launch angle
 * @param initialVelocity - Initial velocity in m/s
 * @param angle - Launch angle in degrees
 * @returns Distance in meters
 */
export const calculateProjectileDistance = (
  initialVelocity: number,
  angle: number
): number => {
  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180;
  
  // Calculate distance using the formula: (v² * sin(2θ)) / g
  const distance = (Math.pow(initialVelocity, 2) * Math.sin(2 * angleRad)) / GRAVITY;
  
  return distance;
};

/**
 * Generates random samples of projectile distances based on launcher parameters
 * @param velocityMean - Mean initial velocity in m/s
 * @param velocityStdDev - Standard deviation of initial velocity
 * @param angle - Launch angle in degrees
 * @param sampleSize - Number of projectiles to simulate
 * @returns Array of distances traveled by each projectile
 */
export const generateSamples = (
  velocityMean: number,
  velocityStdDev: number,
  angle: number,
  sampleSize: number
): number[] => {
  const samples: number[] = [];
  
  for (let i = 0; i < sampleSize; i++) {
    // Generate random velocity using Gaussian distribution
    const velocity = normalRandom(velocityMean, velocityStdDev);
    
    // Calculate distance
    const distance = calculateProjectileDistance(velocity, angle);
    
    samples.push(distance);
  }
  
  return samples;
};

/**
 * Calculates points along a projectile trajectory for visualization
 * @param initialVelocity - Initial velocity in m/s
 * @param angle - Launch angle in degrees
 * @returns Array of {x, y} positions along the trajectory
 */
export const calculateProjectileTrajectory = (
  initialVelocity: number,
  angle: number,
  timeStep: number = 0.1
): { x: number; y: number }[] => {
  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180;
  
  // Initial velocity components
  const vx = initialVelocity * Math.cos(angleRad);
  const vy = initialVelocity * Math.sin(angleRad);
  
  // Time of flight (total time until projectile hits the ground)
  const timeOfFlight = (2 * vy) / GRAVITY;
  
  // Generate trajectory points
  const trajectory: { x: number; y: number }[] = [];
  
  // Start at t=0
  for (let t = 0; t <= timeOfFlight; t += timeStep) {
    const x = vx * t;
    const y = vy * t - (0.5 * GRAVITY * t * t);
    
    // Add point if y >= 0 (above ground)
    if (y >= 0) {
      trajectory.push({ x, y });
    }
  }
  
  // Ensure we add the exact landing point
  const finalX = vx * timeOfFlight;
  trajectory.push({ x: finalX, y: 0 });
  
  return trajectory;
};

/**
 * Generate a normally distributed random number
 * Uses the Box-Muller transform
 * @param mean - Mean value
 * @param stdDev - Standard deviation
 * @returns Random number from normal distribution
 */
const normalRandom = (mean: number, stdDev: number): number => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  
  // Box-Muller transform
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  
  // Transform to desired mean and standard deviation
  return mean + z * stdDev;
};
