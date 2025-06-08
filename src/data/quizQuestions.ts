
export interface QuizQuestion {
  id: string;
  subject: 'biology' | 'chemistry' | 'physics';
  experiment: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  // Biology Questions (10)
  {
    id: 'bio_1',
    subject: 'biology',
    experiment: 'Photosynthesis in Aquatic Plants',
    question: 'What gas is primarily produced during photosynthesis that can be observed as bubbles in aquatic plants?',
    options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 1,
    explanation: 'During photosynthesis, plants convert CO₂ and water into glucose and oxygen. The oxygen is released as bubbles in aquatic plants.',
    difficulty: 'easy'
  },
  {
    id: 'bio_2',
    subject: 'biology',
    experiment: 'Photosynthesis in Aquatic Plants',
    question: 'How does light intensity affect the rate of photosynthesis?',
    options: ['No effect', 'Higher intensity decreases rate', 'Higher intensity increases rate up to a point', 'Always decreases rate'],
    correctAnswer: 2,
    explanation: 'Light intensity increases photosynthesis rate until a saturation point, after which other factors become limiting.',
    difficulty: 'medium'
  },
  {
    id: 'bio_3',
    subject: 'biology',
    experiment: 'Osmosis in Potato',
    question: 'When potato slices are placed in salt water, what happens to the cells?',
    options: ['They swell up', 'They shrink', 'No change occurs', 'They multiply'],
    correctAnswer: 1,
    explanation: 'In hypertonic salt solution, water leaves the potato cells through osmosis, causing them to shrink (plasmolysis).',
    difficulty: 'medium'
  },
  {
    id: 'bio_4',
    subject: 'biology',
    experiment: 'Osmosis in Potato',
    question: 'What type of membrane allows water to pass but restricts larger molecules?',
    options: ['Permeable', 'Impermeable', 'Semi-permeable', 'Non-selective'],
    correctAnswer: 2,
    explanation: 'Semi-permeable membranes allow selective passage of molecules, typically allowing water but blocking larger solutes.',
    difficulty: 'easy'
  },
  {
    id: 'bio_5',
    subject: 'biology',
    experiment: 'Catalase Activity',
    question: 'What happens to enzyme activity when temperature is increased beyond the optimal range?',
    options: ['Activity increases indefinitely', 'Activity remains constant', 'Enzyme denatures and activity decreases', 'Enzyme becomes more stable'],
    correctAnswer: 2,
    explanation: 'High temperatures cause enzyme denaturation, breaking the protein structure and reducing or eliminating activity.',
    difficulty: 'medium'
  },
  {
    id: 'bio_6',
    subject: 'biology',
    experiment: 'Catalase Activity',
    question: 'What is the substrate for the catalase enzyme?',
    options: ['Oxygen', 'Water', 'Hydrogen peroxide', 'Carbon dioxide'],
    correctAnswer: 2,
    explanation: 'Catalase breaks down hydrogen peroxide (H₂O₂) into water and oxygen, protecting cells from oxidative damage.',
    difficulty: 'easy'
  },
  {
    id: 'bio_7',
    subject: 'biology',
    experiment: 'Pollen Germination',
    question: 'Where does pollen germination typically occur in flowering plants?',
    options: ['On the anther', 'On the stigma', 'In the ovary', 'On the petals'],
    correctAnswer: 1,
    explanation: 'Pollen grains germinate on the stigma, growing a pollen tube down through the style to reach the ovule.',
    difficulty: 'easy'
  },
  {
    id: 'bio_8',
    subject: 'biology',
    experiment: 'Pollen Germination',
    question: 'What structure grows from a germinating pollen grain to reach the ovule?',
    options: ['Pollen sac', 'Pollen tube', 'Filament', 'Sepal'],
    correctAnswer: 1,
    explanation: 'The pollen tube grows from the germinating pollen grain, carrying sperm cells to fertilize the ovule.',
    difficulty: 'medium'
  },
  {
    id: 'bio_9',
    subject: 'biology',
    experiment: 'Blood Group Identification',
    question: 'Which blood type is considered the universal donor for red blood cells?',
    options: ['Type A', 'Type B', 'Type AB', 'Type O'],
    correctAnswer: 3,
    explanation: 'Type O blood has no A or B antigens, so it can be given to recipients of any ABO blood type.',
    difficulty: 'easy'
  },
  {
    id: 'bio_10',
    subject: 'biology',
    experiment: 'Blood Group Identification',
    question: 'What causes agglutination in blood typing tests?',
    options: ['Antibodies binding to antigens', 'Blood clotting', 'Cell division', 'Osmotic pressure'],
    correctAnswer: 0,
    explanation: 'Agglutination occurs when antibodies in the testing serum bind to corresponding antigens on red blood cells.',
    difficulty: 'medium'
  },

  // Chemistry Questions (10)
  {
    id: 'chem_1',
    subject: 'chemistry',
    experiment: 'Electrolysis of Water',
    question: 'In the electrolysis of water, which gas is produced at the cathode (negative electrode)?',
    options: ['Oxygen', 'Hydrogen', 'Carbon dioxide', 'Nitrogen'],
    correctAnswer: 1,
    explanation: 'At the cathode, water molecules gain electrons (reduction) to form hydrogen gas: 2H₂O + 2e⁻ → H₂ + 2OH⁻',
    difficulty: 'medium'
  },
  {
    id: 'chem_2',
    subject: 'chemistry',
    experiment: 'Electrolysis of Water',
    question: 'What is the overall chemical equation for the electrolysis of water?',
    options: ['H₂O → H₂ + O', '2H₂O → 2H₂ + O₂', 'H₂O → H + OH', '4H₂O → 4H + 4OH'],
    correctAnswer: 1,
    explanation: 'The complete electrolysis reaction splits two water molecules into two hydrogen molecules and one oxygen molecule.',
    difficulty: 'medium'
  },
  {
    id: 'chem_3',
    subject: 'chemistry',
    experiment: 'Catalyst Reaction',
    question: 'How does a catalyst affect the activation energy of a reaction?',
    options: ['Increases it', 'Decreases it', 'No effect', 'Eliminates it completely'],
    correctAnswer: 1,
    explanation: 'Catalysts provide an alternative reaction pathway with lower activation energy, making reactions proceed faster.',
    difficulty: 'medium'
  },
  {
    id: 'chem_4',
    subject: 'chemistry',
    experiment: 'Catalyst Reaction',
    question: 'What happens to the catalyst during a chemical reaction?',
    options: ['It is consumed', 'It is regenerated unchanged', 'It becomes a product', 'It decomposes'],
    correctAnswer: 1,
    explanation: 'Catalysts are regenerated unchanged at the end of the reaction cycle, allowing them to catalyze multiple reactions.',
    difficulty: 'easy'
  },
  {
    id: 'chem_5',
    subject: 'chemistry',
    experiment: 'Acid-Base Titration',
    question: 'At the equivalence point of an acid-base titration, what is true?',
    options: ['pH is always 7', 'Moles of acid equal moles of base', 'All acid is neutralized', 'Both B and C are correct'],
    correctAnswer: 3,
    explanation: 'At equivalence point, moles of acid equal moles of base and all acid is neutralized, but pH may not be 7 for weak acids/bases.',
    difficulty: 'hard'
  },
  {
    id: 'chem_6',
    subject: 'chemistry',
    experiment: 'Acid-Base Titration',
    question: 'What is molarity a measure of?',
    options: ['Mass per volume', 'Moles per liter', 'Volume per mass', 'Particles per mole'],
    correctAnswer: 1,
    explanation: 'Molarity (M) is defined as the number of moles of solute per liter of solution.',
    difficulty: 'easy'
  },
  {
    id: 'chem_7',
    subject: 'chemistry',
    experiment: 'Flame Test',
    question: 'Why do different metal ions produce different colored flames?',
    options: ['Different atomic masses', 'Different electron transitions', 'Different melting points', 'Different densities'],
    correctAnswer: 1,
    explanation: 'Each metal has unique electron energy levels. When electrons return from excited states, they emit specific wavelengths of light.',
    difficulty: 'medium'
  },
  {
    id: 'chem_8',
    subject: 'chemistry',
    experiment: 'Flame Test',
    question: 'Which metal ion typically produces a bright yellow flame?',
    options: ['Copper', 'Sodium', 'Potassium', 'Calcium'],
    correctAnswer: 1,
    explanation: 'Sodium ions produce a characteristic bright yellow flame due to the specific energy gap in sodium\'s electron structure.',
    difficulty: 'easy'
  },
  {
    id: 'chem_9',
    subject: 'chemistry',
    experiment: 'Molarity Simulation',
    question: 'If you double the number of moles of solute while keeping volume constant, what happens to molarity?',
    options: ['Halves', 'Doubles', 'Stays the same', 'Quadruples'],
    correctAnswer: 1,
    explanation: 'Molarity = moles/volume. If moles double and volume stays constant, molarity doubles proportionally.',
    difficulty: 'easy'
  },
  {
    id: 'chem_10',
    subject: 'chemistry',
    experiment: 'Molarity Simulation',
    question: 'What happens to the color intensity of a solution as concentration increases?',
    options: ['Becomes lighter', 'Becomes darker', 'No change', 'Becomes transparent'],
    correctAnswer: 1,
    explanation: 'Higher concentration means more solute particles per unit volume, resulting in more intense absorption of light and darker color.',
    difficulty: 'easy'
  },

  // Physics Questions (10)
  {
    id: 'phys_1',
    subject: 'physics',
    experiment: 'Projectile Sampling Distributions',
    question: 'According to the Central Limit Theorem, as sample size increases, the distribution of sample means becomes:',
    options: ['More skewed', 'More normal', 'More uniform', 'More bimodal'],
    correctAnswer: 1,
    explanation: 'The Central Limit Theorem states that sample means approach a normal distribution as sample size increases, regardless of population distribution.',
    difficulty: 'medium'
  },
  {
    id: 'phys_2',
    subject: 'physics',
    experiment: 'Projectile Sampling Distributions',
    question: 'What happens to the range of a projectile when the launch angle is increased from 30° to 60°?',
    options: ['Range increases', 'Range decreases', 'Range stays the same', 'Range doubles'],
    correctAnswer: 2,
    explanation: 'Projectiles launched at complementary angles (30° and 60°) have the same range in the absence of air resistance.',
    difficulty: 'hard'
  },
  {
    id: 'phys_3',
    subject: 'physics',
    experiment: 'Light Refraction',
    question: 'Snell\'s Law relates the angles of incidence and refraction to the:',
    options: ['Wavelength', 'Frequency', 'Refractive indices', 'Amplitude'],
    correctAnswer: 2,
    explanation: 'Snell\'s Law: n₁sin(θ₁) = n₂sin(θ₂), where n₁ and n₂ are the refractive indices of the two media.',
    difficulty: 'medium'
  },
  {
    id: 'phys_4',
    subject: 'physics',
    experiment: 'Light Refraction',
    question: 'When light travels from air into water, it:',
    options: ['Speeds up and bends away from normal', 'Slows down and bends toward normal', 'Maintains speed but changes direction', 'Stops completely'],
    correctAnswer: 1,
    explanation: 'Light slows down in denser media and bends toward the normal when entering a medium with higher refractive index.',
    difficulty: 'medium'
  },
  {
    id: 'phys_5',
    subject: 'physics',
    experiment: 'Ohm\'s Law',
    question: 'According to Ohm\'s Law, if voltage doubles and resistance remains constant, current will:',
    options: ['Halve', 'Double', 'Quadruple', 'Remain the same'],
    correctAnswer: 1,
    explanation: 'Ohm\'s Law: V = IR. If V doubles and R is constant, then I must double to maintain the relationship.',
    difficulty: 'easy'
  },
  {
    id: 'phys_6',
    subject: 'physics',
    experiment: 'Ohm\'s Law',
    question: 'The unit of electrical resistance is:',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    correctAnswer: 2,
    explanation: 'The ohm (Ω) is the SI unit of electrical resistance, named after Georg Ohm who formulated Ohm\'s Law.',
    difficulty: 'easy'
  },
  {
    id: 'phys_7',
    subject: 'physics',
    experiment: 'Newton\'s Laws',
    question: 'Newton\'s First Law is also known as the law of:',
    options: ['Action-reaction', 'Acceleration', 'Inertia', 'Gravity'],
    correctAnswer: 2,
    explanation: 'Newton\'s First Law states that objects at rest stay at rest and objects in motion stay in motion unless acted upon by a force (inertia).',
    difficulty: 'easy'
  },
  {
    id: 'phys_8',
    subject: 'physics',
    experiment: 'Newton\'s Laws',
    question: 'If the net force on an object is zero, the object will:',
    options: ['Accelerate', 'Decelerate', 'Move at constant velocity', 'Stop immediately'],
    correctAnswer: 2,
    explanation: 'When net force is zero, there is no acceleration, so the object maintains constant velocity (which could be zero).',
    difficulty: 'medium'
  },
  {
    id: 'phys_9',
    subject: 'physics',
    experiment: 'Wave Interference',
    question: 'Constructive interference occurs when:',
    options: ['Waves are out of phase', 'Wave crests align with troughs', 'Wave crests align with crests', 'Waves have different frequencies'],
    correctAnswer: 2,
    explanation: 'Constructive interference happens when waves are in phase, with crests aligning with crests, resulting in larger amplitude.',
    difficulty: 'medium'
  },
  {
    id: 'phys_10',
    subject: 'physics',
    experiment: 'Wave Interference',
    question: 'What determines the wavelength of a wave?',
    options: ['Frequency and speed', 'Amplitude and frequency', 'Speed and amplitude', 'Phase and frequency'],
    correctAnswer: 0,
    explanation: 'Wavelength λ = speed/frequency. The wavelength is determined by how fast the wave travels divided by how often it oscillates.',
    difficulty: 'medium'
  }
];

export interface QuizResult {
  userId?: string;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  subject: 'biology' | 'chemistry' | 'physics' | 'mixed';
  timeSpent: number; // in seconds
  badge?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  color: string;
}

export const badges: Badge[] = [
  {
    id: 'perfect_score',
    name: 'Science Whiz',
    description: 'Perfect score on any quiz!',
    icon: '🏆',
    requirement: '10/10 correct answers',
    color: 'gold'
  },
  {
    id: 'biology_master',
    name: 'Biology Master',
    description: 'Excellent performance in Biology',
    icon: '🔬',
    requirement: '8+ correct in Biology',
    color: 'green'
  },
  {
    id: 'chemistry_expert',
    name: 'Chemistry Expert',
    description: 'Outstanding Chemistry knowledge',
    icon: '⚗️',
    requirement: '8+ correct in Chemistry',
    color: 'blue'
  },
  {
    id: 'physics_genius',
    name: 'Physics Genius',
    description: 'Exceptional Physics understanding',
    icon: '⚛️',
    requirement: '8+ correct in Physics',
    color: 'purple'
  },
  {
    id: 'well_rounded',
    name: 'Well-Rounded Scientist',
    description: 'Good performance across all subjects',
    icon: '🌟',
    requirement: '24+ total correct answers',
    color: 'rainbow'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed quiz in under 10 minutes',
    icon: '⚡',
    requirement: 'Finish in < 10 minutes',
    color: 'yellow'
  }
];
