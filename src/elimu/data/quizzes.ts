// @ts-nocheck -- imported code, original project was not type-checked strictly
import { RevisionQuiz } from "../types";

export const REVISION_QUIZZES: RevisionQuiz[] = [
  // ==========================================
  // PLAYGROUP QUIZ
  // ==========================================
  {
    id: "quiz-cbe-playgroup-01",
    title: "Colors, Shapes & Sounds Explorer",
    subject: "Sensory & Motor Activities",
    category: "Creative Arts & Environmental",
    level: "CBE",
    gradeLevel: "Playgroup",
    estimatedMinutes: 3,
    questions: [
      {
        id: "q-pg-1",
        question: "What color is the bright morning sun in the sky?",
        options: ["Yellow", "Blue", "Black", "Green"],
        correctIndex: 0,
        explanation: "The sun shines with a bright yellow light during the daytime.",
        curriculumRef: "CBE Playgroup Strand 1: Colors & Environment",
      },
      {
        id: "q-pg-2",
        question: "Which shape is round like a football or an orange?",
        options: ["Square", "Circle", "Triangle", "Star"],
        correctIndex: 1,
        explanation: "A circle (mviringo) is round and can roll smoothly across the floor.",
        curriculumRef: "CBE Playgroup Strand 1: Basic Shapes",
      },
      {
        id: "q-pg-3",
        question: "What sound does a friendly dairy cow make in the field?",
        options: ["Meow!", "Mooo!", "Woof!", "Quack!"],
        correctIndex: 1,
        explanation: 'A cow says "Mooo!", while a cat says "Meow!" and a dog says "Woof!"',
        curriculumRef: "CBE Playgroup Strand 1: Animal Sounds",
      },
    ],
  },

  // ==========================================
  // PP1 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-pp1-01",
    title: "Counting 1 to 5 & Polite Words",
    subject: "Mathematical & Language Activities",
    category: "Mathematics",
    level: "CBE",
    gradeLevel: "PP1",
    estimatedMinutes: 4,
    questions: [
      {
        id: "q-pp1-1",
        question: "How many fingers are there on one hand?",
        options: ["2", "3", "4", "5"],
        correctIndex: 3,
        explanation: "Count your fingers on one hand: 1, 2, 3, 4, 5 fingers!",
        curriculumRef: "CBE PP1 Strand 2: Numbers 1-5",
      },
      {
        id: "q-pp1-2",
        question: "What polite word should you say when a friend shares their toy with you?",
        options: ["Go away", "Thank you (Asante)", "Give me more", "No"],
        correctIndex: 1,
        explanation: 'We always say "Thank you" or "Asante" to show gratitude and good manners.',
        curriculumRef: "CBE PP1 Strand 2: Courteous Language",
      },
      {
        id: "q-pp1-3",
        question: "If you have 2 mangoes and teacher gives you 1 more mango, how many do you have?",
        options: ["1", "2", "3", "5"],
        correctIndex: 2,
        explanation: "2 mangoes + 1 mango = 3 mangoes in total.",
        curriculumRef: "CBE PP1 Strand 2: Number Operations",
      },
    ],
  },

  // ==========================================
  // PP2 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-pp2-01",
    title: "Clean Hands & Healthy Habits",
    subject: "Environmental & Health Activities",
    category: "Creative Arts & Environmental",
    level: "CBE",
    gradeLevel: "PP2",
    estimatedMinutes: 4,
    questions: [
      {
        id: "q-pp2-1",
        question: "What two things MUST we use to wash our hands properly and remove germs?",
        options: [
          "Only cold mud",
          "Clean running water and soap",
          "Dry cloth only",
          "Stagnant puddle water",
        ],
        correctIndex: 1,
        explanation:
          "Clean running water and soap work together to remove dirt and destroy disease-causing germs.",
        curriculumRef: "CBE PP2 Strand 3: Personal Hygiene",
      },
      {
        id: "q-pp2-2",
        question: "Why should drinking water from a borehole or river be boiled first?",
        options: [
          "To make it hot",
          "To kill harmful germs that cause stomach aches",
          "To change its color",
          "To make it sweet",
        ],
        correctIndex: 1,
        explanation:
          "Boiling kills microscopic waterborne bacteria and parasites, protecting children from typhoid and diarrhea.",
        curriculumRef: "CBE PP2 Strand 3: Clean Drinking Water",
      },
      {
        id: "q-pp2-3",
        question: "How many times each day should we brush our teeth?",
        options: ["Once a week", "Twice a day (morning and night)", "Only on birthdays", "Never"],
        correctIndex: 1,
        explanation:
          "Brushing twice a day protects teeth from dental cavities and keeps breath fresh.",
        curriculumRef: "CBE PP2 Strand 3: Dental Health",
      },
    ],
  },

  // ==========================================
  // GRADE 1 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g1-01",
    title: "Tens and Ones Place Value Check",
    subject: "Mathematics",
    category: "Mathematics",
    level: "CBE",
    gradeLevel: "Grade 1",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-g1-1",
        question: "How many Tens and Ones are in the number 38?",
        options: [
          "8 Tens and 3 Ones",
          "3 Tens and 8 Ones",
          "30 Tens and 8 Ones",
          "3 Tens and 0 Ones",
        ],
        correctIndex: 1,
        explanation:
          "In 38, the 3 is in the Tens position (30) and 8 is in the Ones position: 3 Tens and 8 Ones.",
        curriculumRef: "CBE Grade 1 Strand 1: Place Value",
      },
      {
        id: "q-g1-2",
        question: "What is 4 Tens and 5 Ones written as a single number?",
        options: ["405", "54", "45", "9"],
        correctIndex: 2,
        explanation: "4 Tens = 40; 5 Ones = 5. Adding them: 40 + 5 = 45.",
        curriculumRef: "CBE Grade 1 Strand 1: Number Representation",
      },
      {
        id: "q-g1-3",
        question: "Which number is 10 more than 25?",
        options: ["15", "26", "35", "45"],
        correctIndex: 2,
        explanation: "Adding one Ten: 25 + 10 = 35.",
        curriculumRef: "CBE Grade 1 Strand 1: Mental Addition",
      },
    ],
  },

  // ==========================================
  // GRADE 2 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g2-01",
    title: "Domestic & Wild Animals Check",
    subject: "Environmental Activities",
    category: "Creative Arts & Environmental",
    level: "CBE",
    gradeLevel: "Grade 2",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-g2-1",
        question: "Which of the following is a domestic animal kept on a Kenyan farm?",
        options: ["Zebra", "Dairy Cow", "Cheetah", "Elephant"],
        correctIndex: 1,
        explanation:
          "A dairy cow is a domestic animal raised by farmers for fresh milk and manure.",
        curriculumRef: "CBE Grade 2 Strand 2: Care of Animals",
      },
      {
        id: "q-g2-2",
        question: "What is the correct shelter for chickens (kuku) on a homestead?",
        options: ["Cowshed (Zizi)", "Chicken Coop (Henter)", "Kennel", "Fish pond"],
        correctIndex: 1,
        explanation:
          "Chickens are kept safely in a well-ventilated chicken coop (henter) to protect them from hawks and predators.",
        curriculumRef: "CBE Grade 2 Strand 2: Animal Shelters",
      },
      {
        id: "q-g2-3",
        question:
          "Where can you visit to see wild animals living freely in protected natural habitats?",
        options: [
          "The local supermarket",
          "Nairobi National Park or Maasai Mara",
          "A classroom",
          "Inside a bus station",
        ],
        correctIndex: 1,
        explanation:
          "National parks and reserves are protected conservation areas managed by Kenya Wildlife Service (KWS).",
        curriculumRef: "CBE Grade 2 Strand 2: Wildlife Conservation",
      },
    ],
  },

  // ==========================================
  // GRADE 3 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g3-01",
    title: "Ufahamu wa Mazingira na Miti",
    subject: "Kiswahili",
    category: "Kiswahili",
    level: "CBE",
    gradeLevel: "Grade 3",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-g3-1",
        question: "Miti husaidia mazingira yetu kwa kufanya nini?",
        options: [
          "Kukausha mito",
          "Kuvuta mvua na kuzalisha hewa safi",
          "Kuongeza vumbi",
          "Kuharibu ardhi",
        ],
        correctIndex: 1,
        explanation:
          "Miti ni muhimu kwa sababu husaidia kuleta mvua, kutoa kivuli, na kutoa hewa safi ya oksijeni.",
        curriculumRef: "CBE Grade 3 Mada 3: Uhifadhi wa Mazingira",
      },
      {
        id: "q-g3-2",
        question: "Sehemu maalum ya kuoteshea na kukuza mbegu za miti inaitwaje?",
        options: ["Zizi", "Kitalu cha miche", "Ghala", "Chumba cha maakuli"],
        correctIndex: 1,
        explanation:
          "Kitalu cha miche (tree nursery) ni mahali mbegu za miti hutunzwa hadi zinapokuwa tayari kupandwa shambani.",
        curriculumRef: "CBE Grade 3 Mada 3: Msamiati wa Mazingira",
      },
      {
        id: "q-g3-3",
        question: 'Umoja wa neno "Miche" ni gani?',
        options: ["Kiche", "Mche", "Wache", "Michezo"],
        correctIndex: 1,
        explanation: "Mche mmoja, miche mingi (Ngeli ya M-MI).",
        curriculumRef: "CBE Grade 3 Mada 3: Sarufi",
      },
    ],
  },

  // ==========================================
  // GRADE 4 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g4-01",
    title: "States of Matter & Phase Changes",
    subject: "Science & Technology",
    category: "Integrated Science",
    level: "CBE",
    gradeLevel: "Grade 4",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-g4-1",
        question:
          "Which state of matter has a definite volume but takes the shape of its container?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        correctIndex: 1,
        explanation:
          "Liquids (like water and milk) have a fixed volume but take the shape of whatever bottle or bowl they are poured into.",
        curriculumRef: "CBE Grade 4 Strand 2: Matter",
      },
      {
        id: "q-g4-2",
        question:
          "What is the change of state called when water vapor cools down into liquid water droplets?",
        options: ["Melting", "Condensation", "Freezing", "Vaporization"],
        correctIndex: 1,
        explanation:
          "Condensation occurs when warm gaseous vapor hits a cold surface and turns back into liquid water droplets.",
        curriculumRef: "CBE Grade 4 Strand 2: Changes of State",
      },
      {
        id: "q-g4-3",
        question: "Why do solids have a definite, rigid shape?",
        options: [
          "Their particles are far apart and fly around",
          "Their particles are tightly packed together in fixed positions",
          "They contain no particles",
          "They always float on water",
        ],
        correctIndex: 1,
        explanation:
          "In solids, strong intermolecular bonds keep particles closely bound in a regular lattice pattern.",
        curriculumRef: "CBE Grade 4 Strand 2: Particle Theory",
      },
    ],
  },

  // ==========================================
  // GRADE 5 QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g5-01",
    title: "Soil Erosion Control & Mulching",
    subject: "Agriculture & Nutrition",
    category: "Agriculture",
    level: "CBE",
    gradeLevel: "Grade 5",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-g5-1",
        question:
          "Which type of soil erosion creates small, shallow channels on bare sloping farm land?",
        options: ["Splash erosion", "Rill erosion", "Gulley erosion", "Wind deposition"],
        correctIndex: 1,
        explanation:
          "Rill erosion is characterized by small finger-like channels formed when surface runoff cuts into bare topsoil.",
        curriculumRef: "CBE Grade 5 Strand 1: Soil Conservation",
      },
      {
        id: "q-g5-2",
        question: "How does organic mulching protect growing vegetables during a dry season?",
        options: [
          "It attracts wild pests",
          "It slows water evaporation from the soil and prevents weed growth",
          "It makes the soil completely rocky",
          "It burns the roots of the crops",
        ],
        correctIndex: 1,
        explanation:
          "Mulch creates an insulating barrier that locks in soil moisture, reduces surface temperature, and suppresses weeds.",
        curriculumRef: "CBE Grade 5 Strand 1: Water Retention Practices",
      },
      {
        id: "q-g5-3",
        question:
          "In an urban kitchen sack garden, why is a vertical column of small stones or gravel placed in the middle?",
        options: [
          "To make the sack too heavy to move",
          "To ensure water drains and distributes evenly to all root layers",
          "To kill earthworms",
          "To look decorative",
        ],
        correctIndex: 1,
        explanation:
          "The porous gravel core allows water poured at the top to filter down evenly to roots growing out of all side pockets.",
        curriculumRef: "CBE Grade 5 Strand 1: Kitchen Gardening",
      },
    ],
  },

  // ==========================================
  // GRADE 6 KPSEA QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g6-01",
    title: "Circulatory System KPSEA Examination Drill",
    subject: "Science & Technology",
    category: "Integrated Science",
    level: "CBE",
    gradeLevel: "Grade 6",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q-g6-1",
        question:
          "Why does the left ventricle have much thicker muscular walls than the right ventricle?",
        options: [
          "It stores all the digestive enzymes",
          "It must pump blood under high pressure across the entire body, whereas the right ventricle only pumps to the lungs",
          "It receives deoxygenated blood from the liver",
          "It acts as the heart’s pacemaker",
        ],
        correctIndex: 1,
        explanation:
          "The left ventricle generates high systolic pressure to circulate oxygenated blood through the aorta to all extremities.",
        curriculumRef: "KPSEA Science Strand 3: The Human Heart",
      },
      {
        id: "q-g6-2",
        question: "Which blood vessel carries deoxygenated blood away from the heart to the lungs?",
        options: ["Aorta", "Pulmonary Artery", "Pulmonary Vein", "Renal Artery"],
        correctIndex: 1,
        explanation:
          "The Pulmonary Artery is the only artery that carries oxygen-poor (deoxygenated) blood from the right ventricle to the lungs.",
        curriculumRef: "KPSEA Science Strand 3: Blood Vessels",
      },
      {
        id: "q-g6-3",
        question: "What is the primary function of one-way valves inside human veins?",
        options: [
          "To speed up blood flow to 100 km/h",
          "To prevent the backflow of blood flowing under low pressure toward the heart",
          "To filter out white blood cells",
          "To absorb oxygen from the air",
        ],
        correctIndex: 1,
        explanation:
          "Veins operate under low pressure and against gravity in legs; cup-shaped valves prevent blood from pooling backwards.",
        curriculumRef: "KPSEA Science Strand 3: Valvular Mechanics",
      },
    ],
  },

  // ==========================================
  // GRADE 7 JSS QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g7-01",
    title: "Microscopy & Cell Biology JSS Drill",
    subject: "Integrated Science",
    category: "Integrated Science",
    level: "CBE",
    gradeLevel: "Grade 7",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-g7-1",
        question:
          "A learner views an onion peel cell using an eyepiece marked ×10 and an objective lens marked ×40. What is the total magnification?",
        options: ["×50", "×400", "×300", "×40"],
        correctIndex: 1,
        explanation:
          "Total Magnification = Eyepiece power (10) × Objective lens power (40) = ×400 magnification.",
        curriculumRef: "CBE Grade 7 Strand 1: Microscopy",
      },
      {
        id: "q-g7-2",
        question:
          "Which two structures are found in typical plant cells but are ABSENT in animal cells?",
        options: [
          "Cell membrane and nucleus",
          "Cellulose cell wall and chloroplasts",
          "Cytoplasm and mitochondria",
          "Ribosomes and nuclear membrane",
        ],
        correctIndex: 1,
        explanation:
          "Plant cells have a rigid cellulose cell wall and photosynthetic chloroplasts, neither of which exist in animal cells.",
        curriculumRef: "CBE Grade 7 Strand 1: Cell Organelles",
      },
      {
        id: "q-g7-3",
        question:
          "When focusing a specimen under the high-power objective lens, which microscope knob must be used to sharpen the focus?",
        options: ["Coarse adjustment knob", "Fine adjustment knob", "Stage clip", "Mirror"],
        correctIndex: 1,
        explanation:
          "Under high power, always use the fine adjustment knob exclusively to prevent breaking the slide or scratching the objective lens.",
        curriculumRef: "CBE Grade 7 Strand 1: Microscope Safety",
      },
    ],
  },

  // ==========================================
  // GRADE 8 JSS QUIZ
  // ==========================================
  {
    id: "quiz-sci-g8-01",
    title: "Human Digestion & Enzymes Practice",
    subject: "Integrated Science",
    category: "Integrated Science",
    level: "CBE",
    gradeLevel: "Grade 8",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-s1",
        question:
          "Which digestive enzyme in the mouth begins the chemical breakdown of cooked starch into maltose?",
        options: ["Pepsin", "Salivary Amylase (Ptyalin)", "Lipase", "Trypsin"],
        correctIndex: 1,
        explanation:
          "Salivary amylase (ptyalin), produced by the salivary glands, breaks down complex starch polysaccharides into maltose at neutral pH.",
        curriculumRef: "CBE Grade 8 Strand 3.1: Digestive Enzymes",
      },
      {
        id: "q-s2",
        question:
          "What is the primary biological function of hydrochloric acid (HCl) produced by the gastric glands?",
        options: [
          "Directly digesting fats and oils",
          "Providing an acidic pH to kill ingested bacteria and activate pepsinogen into pepsin",
          "Reabsorbing water from the food bolus",
          "Producing bile salts for liver transport",
        ],
        correctIndex: 1,
        explanation:
          "Hydrochloric acid creates an acidic medium (pH 1.5–2.0) that destroys harmful microorganisms and activates pepsin.",
        curriculumRef: "CBE Grade 8 Integrated Science: Gastric Digestion",
      },
      {
        id: "q-s3",
        question:
          "How do the microscopic finger-like projections (villi) in the ileum enhance nutrient absorption?",
        options: [
          "By secreting large amounts of mucus",
          "By dramatically increasing the surface area for diffusion and active transport",
          "By moving food back up into the stomach",
          "By cooling down the temperature of digested food",
        ],
        correctIndex: 1,
        explanation:
          "Millions of villi and microvilli expand the intestinal mucosal surface area to over 30 square meters.",
        curriculumRef: "CBE Grade 8 Integrated Science: Nutrient Absorption",
      },
    ],
  },

  // ==========================================
  // GRADE 9 KJSEA QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g9-01",
    title: "Simple Machines & Circuits (KJSEA Capstone)",
    subject: "Pre-Technical Studies",
    category: "Pre-Technical & STEM",
    level: "CBE",
    gradeLevel: "Grade 9",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q-g9-1",
        question:
          "A pulley system with a Velocity Ratio (VR) of 5 lifts a load of 1000 N using an effort of 250 N. What is the Efficiency of the system?",
        options: ["60%", "75%", "80%", "90%"],
        correctIndex: 2,
        explanation:
          "Mechanical Advantage (MA) = Load / Effort = 1000 / 250 = 4. Efficiency = (MA / VR) × 100% = (4 / 5) × 100% = 80%.",
        curriculumRef: "KJSEA Pre-Technical Strand 4: Machines",
      },
      {
        id: "q-g9-2",
        question:
          "In which class of levers is the LOAD positioned between the fulcrum and the effort?",
        options: [
          "Class 1 Lever (e.g. Crowbar)",
          "Class 2 Lever (e.g. Wheelbarrow)",
          "Class 3 Lever (e.g. Tongs)",
          "Class 4 Lever",
        ],
        correctIndex: 1,
        explanation:
          "In Class 2 levers (like wheelbarrows and nutcrackers), the load is placed between the pivot (fulcrum) and the applied effort.",
        curriculumRef: "KJSEA Pre-Technical Strand 4: Levers",
      },
      {
        id: "q-g9-3",
        question:
          "According to Ohm’s Law, if an electric iron of resistance 22 Ω is connected to a 220 V Kenyan mains supply, what current flows through it?",
        options: ["5 A", "10 A", "20 A", "44 A"],
        correctIndex: 1,
        explanation: "Ohm’s Law: V = I × R ⇒ I = V / R = 220 V / 22 Ω = 10 A.",
        curriculumRef: "KJSEA Pre-Technical Strand 4: Electrical Circuits",
      },
    ],
  },

  // ==========================================
  // GRADE 10 SENIOR SCHOOL QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g10-01",
    title: "Kinematics & Newton’s Laws Drill",
    subject: "Mathematics",
    category: "Mathematics",
    level: "CBE",
    gradeLevel: "Grade 10",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q-g10-1",
        question:
          "A vehicle starts from rest and accelerates uniformly at 3 m/s² for 6 seconds. What is the displacement covered during this interval?",
        options: ["18 m", "36 m", "54 m", "108 m"],
        correctIndex: 2,
        explanation: "Using s = ut + ½at²: Since u = 0, s = ½ × 3 × (6)² = ½ × 3 × 36 = 54 meters.",
        curriculumRef: "CBE Grade 10 STEM: Equations of Motion",
      },
      {
        id: "q-g10-2",
        question: "What does the gradient (slope) of a velocity-time graph represent?",
        options: ["Total displacement", "Acceleration", "Kinetic energy", "Speed squared"],
        correctIndex: 1,
        explanation: "Gradient = Δv / Δt, which by definition equals acceleration (in m/s²).",
        curriculumRef: "CBE Grade 10 STEM: Graphical Kinematics",
      },
      {
        id: "q-g10-3",
        question:
          "A resultant force of 600 N acts on a cart of mass 150 kg. What acceleration is produced?",
        options: ["2 m/s²", "4 m/s²", "6 m/s²", "8 m/s²"],
        correctIndex: 1,
        explanation: "By Newton’s 2nd Law: F = m × a ⇒ a = F / m = 600 N / 150 kg = 4 m/s².",
        curriculumRef: "CBE Grade 10 STEM: Dynamics",
      },
    ],
  },

  // ==========================================
  // GRADE 11 SENIOR SCHOOL QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g11-01",
    title: "Chemical Equilibrium & Le Chatelier Drill",
    subject: "Integrated Science",
    category: "Integrated Science",
    level: "CBE",
    gradeLevel: "Grade 11",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q-g11-1",
        question:
          "In the Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) [Exothermic], how does increasing the reaction pressure affect ammonia production?",
        options: [
          "Decreases ammonia yield",
          "Increases ammonia yield because equilibrium shifts toward fewer gas molecules (2 vs 4)",
          "Has no effect on yield",
          "Causes all nitrogen to decompose",
        ],
        correctIndex: 1,
        explanation:
          "Increasing pressure shifts equilibrium toward the side with fewer gas moles (right side has 2 moles, left has 4 moles), increasing NH₃ yield.",
        curriculumRef: "CBE Grade 11 STEM Chemistry: Equilibrium",
      },
      {
        id: "q-g11-2",
        question:
          "What is the specific effect of adding a finely divided iron catalyst to the Haber reaction chamber?",
        options: [
          "Shifts the position of equilibrium to produce 100% ammonia",
          "Increases the rates of both forward and reverse reactions equally, reaching equilibrium faster without changing yield",
          "Raises the equilibrium constant Kc",
          "Decreases reaction pressure",
        ],
        correctIndex: 1,
        explanation:
          "A catalyst lowers activation energy equally for both forward and reverse reactions, accelerating equilibrium attainment without altering yield.",
        curriculumRef: "CBE Grade 11 STEM Chemistry: Catalysis",
      },
    ],
  },

  // ==========================================
  // GRADE 12 SENIOR CAPSTONE QUIZ
  // ==========================================
  {
    id: "quiz-cbe-g12-01",
    title: "Devolution & Public Finance Capstone",
    subject: "History & Governance",
    category: "Social Studies",
    level: "CBE",
    gradeLevel: "Grade 12",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q-g12-1",
        question:
          "Under Article 203 of the Constitution of Kenya (2010), what is the minimum percentage of nationally raised revenue constitutionally allocated as equitable share to county governments?",
        options: ["5%", "10%", "15%", "35%"],
        correctIndex: 2,
        explanation:
          "Article 203(2) mandates that equitable share allocated to county governments shall not be less than fifteen percent (15%) of all revenue collected by national government.",
        curriculumRef: "CBE Grade 12 Social Sciences: Devolution & Public Finance",
      },
      {
        id: "q-g12-2",
        question:
          "Which independent commission makes recommendations to Parliament concerning the equitable sharing of revenue between national and county governments?",
        options: [
          "Kenya Revenue Authority (KRA)",
          "Commission on Revenue Allocation (CRA)",
          "Salaries and Remuneration Commission (SRC)",
          "Judicial Service Commission (JSC)",
        ],
        correctIndex: 1,
        explanation:
          "The Commission on Revenue Allocation (CRA) is mandated under Article 216 to formulate the revenue-sharing formula and advise Parliament.",
        curriculumRef: "CBE Grade 12 Social Sciences: Independent Commissions",
      },
      {
        id: "q-g12-3",
        question: "What is the role of the Controller of Budget (COB) in public expenditure?",
        options: [
          "Approves all withdrawals from public funds before money is spent, ensuring budgetary compliance",
          "Audits financial records after the fiscal year ends",
          "Collects customs duty at the Port of Mombasa",
          "Decides tax rates on fuel",
        ],
        correctIndex: 0,
        explanation:
          "The Controller of Budget exercises ex-ante control, authorizing withdrawals from national and county revenue funds only when lawful budget provisions exist.",
        curriculumRef: "CBE Grade 12 Social Sciences: Chapter 12 Public Finance",
      },
    ],
  },

  // ==========================================
  // TRANSITIONAL QUIZZES
  // ==========================================
  {
    id: "quiz-math-f3-01",
    title: "Circle Theorems & Linear Equations Drill",
    subject: "Mathematics",
    category: "Mathematics",
    level: "CBE",
    gradeLevel: "Grade 11",
    estimatedMinutes: 6,
    questions: [
      {
        id: "q-m1",
        question:
          "In a circle with centre O, chord PQ subtends an angle of 74° at the circumference in the major segment. What is the measure of the angle POQ subtended at the centre?",
        options: ["37°", "74°", "148°", "106°"],
        correctIndex: 2,
        explanation:
          "According to the Angle at Centre Theorem, the angle subtended by an arc or chord at the center is double the angle subtended at the circumference: ∠POQ = 2 × 74° = 148°.",
        curriculumRef: "CBE Senior Math: Geometry",
      },
      {
        id: "q-m2",
        question:
          "ABCD is a cyclic quadrilateral. If angle B = (2x + 15)° and angle D = (x + 45)°, what is the value of x?",
        options: ["40°", "35°", "45°", "50°"],
        correctIndex: 0,
        explanation:
          "Opposite interior angles of a cyclic quadrilateral sum to 180°. Therefore: (2x + 15) + (x + 45) = 180° ⇒ 3x + 60 = 180° ⇒ 3x = 120° ⇒ x = 40°.",
        curriculumRef: "CBE Senior Math: Cyclic Quadrilaterals",
      },
    ],
  },
  {
    id: "quiz-kis-g7-01",
    title: "Jaribio la Sarufi: Ngeli za Nomino",
    subject: "Kiswahili",
    category: "Kiswahili",
    level: "CBE",
    gradeLevel: "Grade 7",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q-k1",
        question: 'Nomino "Kijana" na "Kipepeo" ziko katika ngeli gani ya Kiswahili?',
        options: ["Ngeli ya KI-VI", "Ngeli ya A-WA", "Ngeli ya I-ZI", "Ngeli ya LI-YA"],
        correctIndex: 1,
        explanation:
          "Viumbe wote wenye uhai (binadamu, wadudu, wanyama) huchukua upatanisho wa ngeli ya A-WA!",
        curriculumRef: "CBE Grade 7 Sarufi: Ngeli za Viumbe Hai",
      },
      {
        id: "q-k2",
        question:
          'Upatanisho sahihi wa sentensi: "Mtoto huyu anasoma kitabu kizuri" katika wingi ni upi?',
        options: [
          "Watoto hawa wanasoma vitabu vizuri",
          "Watoto huyu wanasoma vitabu nzuri",
          "Mitoto hii inasoma vitabu vizuri",
          "Watoto hawa wanasoma mashule mazuri",
        ],
        correctIndex: 0,
        explanation:
          "Mtoto huyu anasoma kitabu kizuri → Watoto hawa wanasoma vitabu vizuri (Upatanisho kamili wa A-WA na KI-VI).",
        curriculumRef: "CBE Grade 7 Sarufi: Upatanisho",
      },
    ],
  },
];
