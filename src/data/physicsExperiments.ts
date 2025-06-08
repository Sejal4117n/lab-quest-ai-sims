
import { PhysicsExperimentData } from "@/types/experiments";

export const experiments: Record<string, PhysicsExperimentData> = {
  "projectile": {
    title: "Projectile Sampling Distributions",
    description: "Explore statistical distributions of projectile motion with multiple launchers and sample sizes",
    difficulty: "Intermediate",
    duration: "30-40 minutes",
    content: `
      This experiment explores how projectile motion and statistical sampling distributions are connected. 
      By launching projectiles with different launchers and collecting data on their landing positions, 
      you will investigate how sample size affects the distribution of sample means.
      
      The simulation allows you to:
      - Choose from 6 different "mystery launchers" with varying velocities
      - Select different sample sizes (n = 2, 5, 15, 40)
      - Launch projectiles in single or continuous mode
      - View histograms showing the distribution of mean distances
      - Compare how the sampling distribution changes with different sample sizes
      
      This demonstrates the Central Limit Theorem, showing how the distribution of sample means 
      becomes more normal as sample size increases, regardless of the underlying distribution.
    `,
    steps: [
      "Choose a launcher from the dropdown menu (1-6).",
      "Select a sample size (2, 5, 15, or 40 projectiles per launch).",
      "Click 'Launch' to fire the projectiles, or use 'Continuous' mode for automatic launches.",
      "Observe the landing positions and the histogram showing the distribution of mean distances.",
      "Compare the histograms for different sample sizes to observe how larger samples produce narrower, more normal distributions.",
      "Try different bin widths to analyze the histogram data at various resolutions.",
      "Use the 'Reset' button to clear all data and start a new experiment.",
      "Compare results between different launchers to identify their unique characteristics."
    ]
  },
  "refraction": {
    title: "Light Refraction",
    description: "Explore how light bends when passing through different materials",
    difficulty: "Intermediate",
    duration: "25 minutes",
    content: "In this experiment, you will investigate the phenomenon of refraction - the bending of light as it passes from one medium to another. You'll explore Snell's Law, which describes the relationship between the angles of incidence and refraction when light passes through different materials.",
    steps: [
      "Select a light source and adjust its angle of incidence.",
      "Choose different materials from the dropdown menu to observe how they affect light refraction.",
      "Measure the angle of refraction for each material.",
      "Calculate the index of refraction using Snell's Law: n₁sin(θ₁) = n₂sin(θ₂).",
      "Experiment with different angles of incidence and observe the changes in refraction.",
      "Try to find the critical angle where total internal reflection occurs for certain material pairs.",
      "Plot your data and compare your results with known refractive indices."
    ]
  },
  "ohms-law": {
    title: "Ohm's Law",
    description: "Verify the relationship between voltage, current, and resistance",
    difficulty: "Beginner",
    duration: "25 minutes",
    content: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points. In this experiment, you'll verify this fundamental relationship and explore how different resistors affect current flow in a circuit.",
    steps: [
      "Build a simple circuit with the provided components.",
      "Adjust the voltage source to different values.",
      "Measure the current flowing through the circuit for each voltage setting.",
      "Change the resistance value and repeat your measurements.",
      "Plot voltage vs. current for each resistance value.",
      "Calculate the slope of each line and verify that it equals 1/R.",
      "Identify any deviations from Ohm's Law and discuss possible reasons.",
      "Use your data to predict current for new voltage and resistance combinations."
    ]
  },
  "newtons-laws": {
    title: "Newton's Laws of Motion",
    description: "Demonstrate and verify Newton's three laws of motion",
    difficulty: "Intermediate",
    duration: "35 minutes",
    content: "This experiment allows you to explore and verify Sir Isaac Newton's three laws of motion, which form the foundation of classical mechanics. Through interactive simulations, you'll observe how objects behave when forces are applied to them.",
    steps: [
      "First Law (Inertia): Observe how objects maintain their state of motion unless acted upon by a force.",
      "Apply different amounts of friction and observe the changes in motion.",
      "Second Law (F = ma): Apply various forces to objects of different masses.",
      "Measure the resulting acceleration and verify the relationship F = ma.",
      "Third Law (Action-Reaction): Observe how forces always occur in pairs of equal magnitude and opposite direction.",
      "Use the collision simulator to see how momentum is conserved during interactions.",
      "Experiment with different combinations of mass and force to predict motion outcomes.",
      "Record your observations and compare them to Newton's theoretical laws."
    ]
  },
  "wave-interference": {
    title: "Wave Interference",
    description: "Study how waves interact to create interference patterns",
    difficulty: "Advanced",
    duration: "30 minutes",
    content: "This experiment explores the fascinating phenomenon of wave interference, where two or more waves overlap to form a resultant wave. You'll investigate constructive and destructive interference and observe how they create distinctive patterns.",
    steps: [
      "Generate two wave sources with the same frequency and amplitude.",
      "Observe the resulting interference pattern as the waves propagate.",
      "Adjust the distance between the sources and note how the pattern changes.",
      "Change the frequency and wavelength of the waves and observe the effects.",
      "Identify areas of constructive interference (where waves amplify each other).",
      "Identify areas of destructive interference (where waves cancel each other out).",
      "Create a standing wave by adjusting the simulation parameters.",
      "Relate your observations to real-world examples like noise-cancelling headphones or antennae design."
    ]
  }
};
