// @ts-nocheck -- imported code, original project was not type-checked strictly
import { CurriculumDesignItem, SeniorSchoolPathway, MathsType, CbeStage, CbeGrade } from "../types";

export interface OfficialLevelStructure {
  stage: CbeStage;
  label: string;
  years: number;
  officialGrades: CbeGrade[];
  learningAreaCap: number;
  description: string;
  officialLearningAreas: {
    id: string;
    name: string;
    isCore: boolean;
    category: string;
    notes?: string;
    pathway?: SeniorSchoolPathway;
    mathsType?: MathsType;
  }[];
}

export const OFFICIAL_CBE_STRUCTURE: OfficialLevelStructure[] = [
  {
    stage: "Early Years",
    label: "Early Years (Non-KICD Optional Foundation)",
    years: 1,
    officialGrades: ["Playgroup"],
    learningAreaCap: 4,
    description:
      "Foundational play, motor development, and social-emotional exploration before formal Pre-Primary.",
    officialLearningAreas: [
      {
        id: "ey-play",
        name: "Sensory Play & Motor Coordination",
        isCore: true,
        category: "Creative Arts & Environmental",
      },
      {
        id: "ey-lang",
        name: "Foundational Communication & Rhymes",
        isCore: true,
        category: "English",
      },
      { id: "ey-num", name: "Early Number Sense & Shapes", isCore: true, category: "Mathematics" },
      {
        id: "ey-social",
        name: "Self-Care & Social Interaction",
        isCore: true,
        category: "Creative Arts & Environmental",
      },
    ],
  },
  {
    stage: "Pre-Primary",
    label: "Pre-Primary Education (PP1 – PP2)",
    years: 2,
    officialGrades: ["PP1", "PP2"],
    learningAreaCap: 5,
    description:
      "Two years of mandatory pre-primary schooling rationalised to exactly 5 core learning areas (+ PPI).",
    officialLearningAreas: [
      {
        id: "pp-lang",
        name: "Language Activities",
        isCore: true,
        category: "English",
        notes: "Listening, speaking, pre-reading and emergent writing",
      },
      {
        id: "pp-math",
        name: "Mathematical Activities",
        isCore: true,
        category: "Mathematics",
        notes: "Classification, number concepts, measurement and patterns",
      },
      {
        id: "pp-creat",
        name: "Creative Activities",
        isCore: true,
        category: "Creative Arts & Environmental",
        notes: "Art, craft, music and psychomotor movements",
      },
      {
        id: "pp-env",
        name: "Environmental Activities",
        isCore: true,
        category: "Creative Arts & Environmental",
        notes: "Local environment, health practices and weather",
      },
      {
        id: "pp-rel",
        name: "Religious Activities (CRE / IRE / HRE)",
        isCore: true,
        category: "Social Studies",
        notes: "Includes Pastoral Programme of Instruction (PPI)",
      },
    ],
  },
  {
    stage: "Lower Primary",
    label: "Lower Primary (Grades 1 – 3)",
    years: 3,
    officialGrades: ["Grade 1", "Grade 2", "Grade 3"],
    learningAreaCap: 7,
    description:
      "Three years of foundational primary education rationalised to exactly 7 core learning areas (+ PPI).",
    officialLearningAreas: [
      {
        id: "lp-indig",
        name: "Indigenous Language Activities",
        isCore: true,
        category: "Kiswahili",
        notes: "Mother tongue / language of the catchment area",
      },
      {
        id: "lp-kisw",
        name: "Kiswahili Language Activities / Kenya Sign Language",
        isCore: true,
        category: "Kiswahili",
        notes: "Kusikiliza, kuzungumza, kusoma na kuandika",
      },
      {
        id: "lp-eng",
        name: "English Language Activities",
        isCore: true,
        category: "English",
        notes: "Oral skills, reading comprehension and basic grammar",
      },
      {
        id: "lp-math",
        name: "Mathematical Activities",
        isCore: true,
        category: "Mathematics",
        notes: "Number operations, geometry, measurement and data handling",
      },
      {
        id: "lp-rel",
        name: "Religious Education (CRE / IRE / HRE)",
        isCore: true,
        category: "Social Studies",
        notes: "Moral values, spiritual growth and PPI",
      },
      {
        id: "lp-env",
        name: "Environmental Activities",
        isCore: true,
        category: "Integrated Science",
        notes: "Living and non-living things, hygiene and hygiene practices",
      },
      {
        id: "lp-creat",
        name: "Creative Activities",
        isCore: true,
        category: "Creative Arts & Environmental",
        notes: "Music, physical education and visual arts",
      },
    ],
  },
  {
    stage: "Upper Primary",
    label: "Upper Primary (Grades 4 – 6)",
    years: 3,
    officialGrades: ["Grade 4", "Grade 5", "Grade 6"],
    learningAreaCap: 8,
    description:
      "Three years leading to the Kenya Primary School Education Assessment (KPSEA) rationalised to 8 learning areas.",
    officialLearningAreas: [
      {
        id: "up-eng",
        name: "English",
        isCore: true,
        category: "English",
        notes: "Grammar, vocabulary, intensive reading and guided writing",
      },
      {
        id: "up-kisw",
        name: "Kiswahili / Kenya Sign Language",
        isCore: true,
        category: "Kiswahili",
        notes: "Sarufi, insha na ufahamu",
      },
      {
        id: "up-math",
        name: "Mathematics",
        isCore: true,
        category: "Mathematics",
        notes: "Fractions, decimals, percentages, perimeter, area and volume",
      },
      {
        id: "up-sci",
        name: "Integrated Science",
        isCore: true,
        category: "Integrated Science",
        notes: "Human systems, matter, energy, light and forces",
      },
      {
        id: "up-agri",
        name: "Agriculture & Nutrition",
        isCore: true,
        category: "Agriculture",
        notes: "Crop production, kitchen gardening and food preservation",
      },
      {
        id: "up-social",
        name: "Social Studies",
        isCore: true,
        category: "Social Studies",
        notes: "Kenyan physical environment, citizenship, history and governance",
      },
      {
        id: "up-arts",
        name: "Creative Arts",
        isCore: true,
        category: "Creative Arts & Environmental",
        notes: "Visual art, indigenous music, dance and physical education",
      },
      {
        id: "up-rel",
        name: "Religious Education (CRE / IRE / HRE)",
        isCore: true,
        category: "Social Studies",
        notes: "Faith, integrity, human dignity and PPI",
      },
    ],
  },
  {
    stage: "Junior School",
    label: "Junior School (Grades 7 – 9)",
    years: 3,
    officialGrades: ["Grade 7", "Grade 8", "Grade 9"],
    learningAreaCap: 9,
    description:
      "Confirmed by KICD: Grade 9 remains in Junior School. Exactly 9 core areas taken by ALL learners leading to KJSEA.",
    officialLearningAreas: [
      {
        id: "js-eng",
        name: "English",
        isCore: true,
        category: "English",
        notes: "Critical literacy, summary writing and literary appreciation",
      },
      {
        id: "js-kisw",
        name: "Kiswahili / Kenya Sign Language",
        isCore: true,
        category: "Kiswahili",
        notes: "Sarufi miundo, fasihi simulizi na utungaji",
      },
      {
        id: "js-math",
        name: "Mathematics",
        isCore: true,
        category: "Mathematics",
        notes: "Algebra, indices, coordinate geometry, probability and statistics",
      },
      {
        id: "js-sci",
        name: "Integrated Science (includes Health Education)",
        isCore: true,
        category: "Integrated Science",
        notes: "Microscopy, human systems, elements, energy transformations and adolescent health",
      },
      {
        id: "js-social",
        name: "Social Studies",
        isCore: true,
        category: "Social Studies",
        notes:
          "Eastern African geography, Kenyan constitution, historical sites and peace building",
      },
      {
        id: "js-rel",
        name: "Religious Education (CRE / IRE / HRE)",
        isCore: true,
        category: "Social Studies",
        notes: "Biblical/Islamic/Hindu ethics, social justice and stewardship",
      },
      {
        id: "js-agri",
        name: "Agriculture & Nutrition",
        isCore: true,
        category: "Agriculture",
        notes: "Soil conservation, poultry rearing, food safety and balanced meal preparation",
      },
      {
        id: "js-pretech",
        name: "Pre-Technical Studies (includes Business & Computer Studies)",
        isCore: true,
        category: "Pre-Technical & STEM",
        notes:
          "Workshop tools, technical drawing, coding basics, entrepreneurship and financial literacy",
      },
      {
        id: "js-arts",
        name: "Creative Arts & Sports",
        isCore: true,
        category: "Creative Arts & Environmental",
        notes: "Performing arts, multi-media visual expressions and track/field sports",
      },
    ],
  },
  {
    stage: "Senior School",
    label: "Senior School (Grades 10 – 12)",
    years: 3,
    officialGrades: ["Grade 10", "Grade 11", "Grade 12"],
    learningAreaCap: 7,
    description:
      "Senior School live as of Jan 2026. 4 Core areas + 1 Maths Track + 3 Electives (at least 2 from the chosen pathway).",
    officialLearningAreas: [
      // Core Areas for ALL Senior School Learners
      {
        id: "ss-core-eng",
        name: "English",
        isCore: true,
        category: "English",
        notes: "Compulsory core for all pathways",
      },
      {
        id: "ss-core-kisw",
        name: "Kiswahili / Kenya Sign Language",
        isCore: true,
        category: "Kiswahili",
        notes: "Compulsory core for all pathways",
      },
      {
        id: "ss-core-csl",
        name: "Community Service Learning (CSL)",
        isCore: true,
        category: "Social Studies",
        notes: "Compulsory experiential community project across G10-12",
      },
      {
        id: "ss-core-pe",
        name: "Physical Education",
        isCore: true,
        category: "Creative Arts & Environmental",
        notes: "Compulsory health & fitness core",
      },

      // Mathematics Tracks based on Pathway
      {
        id: "ss-math-core",
        name: "Core Mathematics",
        isCore: true,
        category: "Mathematics",
        mathsType: "Core Mathematics",
        pathway: "STEM",
        notes: "Mandatory for STEM pathway learners (calculus, trigonometry, advanced vectors)",
      },
      {
        id: "ss-math-ess",
        name: "Essential Mathematics",
        isCore: true,
        category: "Mathematics",
        mathsType: "Essential Mathematics",
        pathway: "Social Sciences",
        notes:
          "For Social Sciences and Arts & Sports pathways (applied statistics, commercial math)",
      },

      // STEM Pathway Electives
      {
        id: "ss-stem-bio",
        name: "Biology",
        isCore: false,
        category: "Integrated Science",
        pathway: "STEM",
        notes: "STEM Elective: Genetics, ecology, biochemistry and physiology",
      },
      {
        id: "ss-stem-chem",
        name: "Chemistry",
        isCore: false,
        category: "Integrated Science",
        pathway: "STEM",
        notes: "STEM Elective: Stoichiometry, organic chemistry, equilibria and electrochemistry",
      },
      {
        id: "ss-stem-phys",
        name: "Physics",
        isCore: false,
        category: "Integrated Science",
        pathway: "STEM",
        notes: "STEM Elective: Mechanics, wave theory, electromagnetism and electronics",
      },
      {
        id: "ss-stem-cs",
        name: "Computer Science & Software Eng.",
        isCore: false,
        category: "Pre-Technical & STEM",
        pathway: "STEM",
        notes: "STEM Elective: Data structures, algorithms and database management",
      },
      {
        id: "ss-stem-tech",
        name: "Pre-Engineering & Applied Tech",
        isCore: false,
        category: "Pre-Technical & STEM",
        pathway: "STEM",
        notes: "STEM Elective: Engineering design, circuitry and CAD",
      },
      {
        id: "ss-stem-agri",
        name: "Advanced Agricultural Sciences",
        isCore: false,
        category: "Agriculture",
        pathway: "STEM",
        notes: "STEM Elective: Agribusiness, agronomy and soil science",
      },

      // Social Sciences Pathway Electives
      {
        id: "ss-soc-hist",
        name: "History & Citizenship",
        isCore: false,
        category: "History",
        pathway: "Social Sciences",
        notes: "Social Sciences Elective: African governance, world history and diplomacy",
      },
      {
        id: "ss-soc-geog",
        name: "Geography & Geospatial Studies",
        isCore: false,
        category: "Social Studies",
        pathway: "Social Sciences",
        notes: "Social Sciences Elective: Physical geography, GIS and demographic planning",
      },
      {
        id: "ss-soc-econ",
        name: "Business & Economic Studies",
        isCore: false,
        category: "Pre-Technical & STEM",
        pathway: "Social Sciences",
        notes: "Social Sciences Elective: Macroeconomics, commerce and accountancy",
      },
      {
        id: "ss-soc-rel",
        name: "Religious Studies (CRE/IRE/HRE)",
        isCore: false,
        category: "Social Studies",
        pathway: "Social Sciences",
        notes: "Social Sciences Elective: Comparative ethics and philosophical theology",
      },

      // Arts & Sports Science Pathway Electives
      {
        id: "ss-art-music",
        name: "Music & Audio Technology",
        isCore: false,
        category: "Creative Arts & Environmental",
        pathway: "Arts & Sports Science",
        notes: "Arts Elective: Music theory, composition and music production",
      },
      {
        id: "ss-art-fine",
        name: "Fine Art & Graphic Design",
        isCore: false,
        category: "Creative Arts & Environmental",
        pathway: "Arts & Sports Science",
        notes: "Arts Elective: Studio painting, digital design and animation",
      },
      {
        id: "ss-art-theatre",
        name: "Theatre, Film & Media Arts",
        isCore: false,
        category: "Creative Arts & Environmental",
        pathway: "Arts & Sports Science",
        notes: "Arts Elective: Scriptwriting, directing and cinematography",
      },
      {
        id: "ss-sport-sci",
        name: "Sports Science & Kinesiology",
        isCore: false,
        category: "Creative Arts & Environmental",
        pathway: "Arts & Sports Science",
        notes: "Sports Elective: Human biomechanics, athletic conditioning and sports management",
      },
    ],
  },
];

// Official KICD Curriculum Designs Grounding (verified against KICD syllabus documents)
export const KICD_CURRICULUM_DESIGNS: CurriculumDesignItem[] = [
  // --- PRE-PRIMARY ---
  {
    id: "cd-pp1-math",
    stage: "Pre-Primary",
    grade: "PP1",
    learningArea: "Mathematical Activities",
    strands: [
      {
        title: "Classification & Sorting",
        subStrands: ["Sorting by colour", "Sorting by size", "Grouping by texture"],
        coreCompetencies: [
          "Communication and collaboration",
          "Critical thinking and problem solving",
        ],
        sampleLearningOutcomes: [
          "Learner sorts 5 classroom objects according to primary colors (red, blue, yellow)",
        ],
        isKicdVerified: true,
      },
      {
        title: "Number Concepts (1 – 10)",
        subStrands: ["Rote counting 1–10", "Number recognition 1–5", "Object to number matching"],
        coreCompetencies: ["Self-efficacy", "Digital literacy"],
        sampleLearningOutcomes: [
          "Learner counts concrete objects up to 10 in a playful learning corner",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-pp2-lang",
    stage: "Pre-Primary",
    grade: "PP2",
    learningArea: "Language Activities",
    strands: [
      {
        title: "Listening and Speaking",
        subStrands: [
          "Auditory discrimination",
          "Active listening to stories",
          "Polite greetings and requests",
        ],
        coreCompetencies: ["Communication and collaboration", "Citizenship"],
        sampleLearningOutcomes: [
          "Learner introduces themselves politely and narrates a 3-sentence family story",
        ],
        isKicdVerified: true,
      },
      {
        title: "Pre-Reading & Letter Sound Association",
        subStrands: [
          "Phonemic awareness",
          "Letter sound recognition (a – m)",
          "Left-to-right eye tracking",
        ],
        coreCompetencies: ["Learning to learn"],
        sampleLearningOutcomes: [
          "Learner identifies sounds of letters a, b, c, d, e with picture flashcards",
        ],
        isKicdVerified: true,
      },
    ],
  },

  // --- LOWER PRIMARY ---
  {
    id: "cd-g1-math",
    stage: "Lower Primary",
    grade: "Grade 1",
    learningArea: "Mathematical Activities",
    strands: [
      {
        title: "Numbers and Operations",
        subStrands: [
          "Place value (Tens and Ones)",
          "Addition of single digits",
          "Subtraction within 20",
        ],
        coreCompetencies: ["Critical thinking", "Creativity and imagination"],
        sampleLearningOutcomes: [
          "Learner groups bundles of ten sticks and units to represent 2-digit numbers",
        ],
        isKicdVerified: true,
      },
      {
        title: "Measurement & Currency",
        subStrands: [
          "Kenyan coins & KES 50 note",
          "Length comparison using footsteps and arm spans",
        ],
        coreCompetencies: ["Financial literacy", "Self-efficacy"],
        sampleLearningOutcomes: [
          "Learner role-plays simple market transactions using KES 10, 20 and 50 coins",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g3-env",
    stage: "Lower Primary",
    grade: "Grade 3",
    learningArea: "Environmental Activities",
    strands: [
      {
        title: "Weather and Natural Environment",
        subStrands: [
          "Local weather patterns in Kenya",
          "Water sources & conservation",
          "Soil types (Clay, Loam, Sand)",
        ],
        coreCompetencies: ["Citizenship", "Critical thinking and problem solving"],
        sampleLearningOutcomes: [
          "Learner records daily weather using simple symbols over a 5-day school week",
        ],
        isKicdVerified: true,
      },
      {
        title: "Sanitation and Waste Management",
        subStrands: [
          "Safe drinking water purification",
          "Proper waste disposal in bins",
          "Personal hygiene",
        ],
        coreCompetencies: ["Self-efficacy", "Collaboration"],
        sampleLearningOutcomes: [
          "Demonstrate boiling and filtration techniques for household drinking water",
        ],
        isKicdVerified: true,
      },
    ],
  },

  // --- UPPER PRIMARY ---
  {
    id: "cd-g5-sci",
    stage: "Upper Primary",
    grade: "Grade 5",
    learningArea: "Integrated Science",
    strands: [
      {
        title: "Living Things: Human Body Systems",
        subStrands: [
          "Digestive system organs and functions",
          "Respiratory system and lungs",
          "Circulatory pulse",
        ],
        coreCompetencies: ["Learning to learn", "Digital literacy"],
        sampleLearningOutcomes: [
          "Trace path of food from mouth, stomach, small intestine to assimilation",
        ],
        isKicdVerified: true,
      },
      {
        title: "Matter and States of Change",
        subStrands: [
          "Solids, liquids, gases",
          "Evaporation and condensation",
          "Water cycle in Kenya",
        ],
        coreCompetencies: ["Critical thinking"],
        sampleLearningOutcomes: [
          "Explain condensation and cloud formation with an experimental beaker setup",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g6-agri",
    stage: "Upper Primary",
    grade: "Grade 6",
    learningArea: "Agriculture & Nutrition",
    strands: [
      {
        title: "Conservation of Soil & Water",
        subStrands: [
          "Soil erosion control (terracing, mulching)",
          "Kitchen garden bag farming",
          "Organic composting",
        ],
        coreCompetencies: ["Citizenship", "Creativity and innovation"],
        sampleLearningOutcomes: [
          "Construct a multi-storey kitchen garden sack to cultivate kale (sukuma wiki)",
        ],
        isKicdVerified: true,
      },
      {
        title: "Food Safety and Balanced Diets (KPSEA Preparation)",
        subStrands: [
          "Nutritional deficiency diseases (Kwashiorkor, Marasmus)",
          "Food hygiene and preservation",
        ],
        coreCompetencies: ["Critical thinking", "Self-efficacy"],
        sampleLearningOutcomes: [
          "Plan a 3-course balanced meal utilizing indigenous Kenyan foods (e.g. millet, beans, greens)",
        ],
        isKicdVerified: true,
      },
    ],
  },

  // --- JUNIOR SCHOOL (GRADES 7 – 9) ---
  {
    id: "cd-g7-pretech",
    stage: "Junior School",
    grade: "Grade 7",
    learningArea: "Pre-Technical Studies",
    strands: [
      {
        title: "Workshop Safety & Mechanical Tools",
        subStrands: [
          "Hand tools (hammers, saws, calipers)",
          "Safety rules in school makerspaces",
          "First Aid for burns & cuts",
        ],
        coreCompetencies: ["Self-efficacy", "Critical thinking"],
        sampleLearningOutcomes: [
          "Identify 10 woodworking tools and demonstrate safe handling of a tenon saw",
        ],
        isKicdVerified: true,
      },
      {
        title: "Fundamentals of Computing & Algorithm Thinking",
        subStrands: ["Input/output hardware", "Data representation", "Block-based coding loops"],
        coreCompetencies: ["Digital literacy", "Problem solving"],
        sampleLearningOutcomes: [
          "Write a pseudo-code algorithm to calculate arithmetic mean of 5 student marks",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g8-sci",
    stage: "Junior School",
    grade: "Grade 8",
    learningArea: "Integrated Science (includes Health Education)",
    strands: [
      {
        title: "Cell Biology & Microscopic Exploration",
        subStrands: [
          "Light microscope parts and magnification",
          "Plant vs Animal cell organelles",
          "Staining techniques with iodine",
        ],
        coreCompetencies: ["Critical thinking", "Learning to learn"],
        sampleLearningOutcomes: [
          "Prepare a temporary wet mount of onion epidermal cells and calculate total magnification",
        ],
        isKicdVerified: true,
      },
      {
        title: "Acids, Bases and Indicators",
        subStrands: [
          "pH scale 0-14",
          "Litmus, methyl orange and phenolphthalein",
          "Neutralization reactions in daily life",
        ],
        coreCompetencies: ["Problem solving", "Collaboration"],
        sampleLearningOutcomes: [
          "Determine pH of lemon juice, wood ash solution and vinegar using litmus paper",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g9-math",
    stage: "Junior School",
    grade: "Grade 9",
    learningArea: "Mathematics",
    strands: [
      {
        title: "Algebraic Expressions & Linear Inequalities",
        subStrands: [
          "Factorization of quadratic expressions",
          "Simultaneous linear equations",
          "Graphical representation of inequalities",
        ],
        coreCompetencies: ["Critical thinking and problem solving"],
        sampleLearningOutcomes: [
          "Solve pairs of simultaneous linear equations using elimination and substitution methods",
        ],
        isKicdVerified: true,
      },
      {
        title: "Circle Geometry & Theorems (KJSEA Milestone)",
        subStrands: [
          "Angle at center theorem",
          "Angles in the same segment",
          "Cyclic quadrilaterals supplementary angles",
        ],
        coreCompetencies: ["Analytical reasoning", "Digital literacy"],
        sampleLearningOutcomes: [
          "Prove that the angle subtended by an arc at the center is double the angle on the circumference",
        ],
        isKicdVerified: true,
      },
    ],
  },

  // --- SENIOR SCHOOL (GRADES 10 – 12) ---
  {
    id: "cd-g10-stem-math",
    stage: "Senior School",
    grade: "Grade 10",
    learningArea: "Core Mathematics",
    pathway: "STEM",
    mathsType: "Core Mathematics",
    strands: [
      {
        title: "Quadratic Equations & Remainder Theorem",
        subStrands: [
          "Completing the square formula",
          "Discriminant and nature of roots",
          "Polynomial division and Remainder Theorem",
        ],
        coreCompetencies: ["Critical thinking", "Abstract mathematical reasoning"],
        sampleLearningOutcomes: [
          "Derive and apply the quadratic formula to solve real-world projectile trajectories",
        ],
        isKicdVerified: true,
      },
      {
        title: "Trigonometry & Circular Functions",
        subStrands: [
          "Sine, Cosine and Tangent of acute and obtuse angles",
          "Sine and Cosine rules for scalene triangles",
        ],
        coreCompetencies: ["Problem solving", "Communication"],
        sampleLearningOutcomes: [
          "Calculate unknown bearings and distances between Kenyan GPS points using the Cosine Rule",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g10-ess-math",
    stage: "Senior School",
    grade: "Grade 10",
    learningArea: "Essential Mathematics",
    pathway: "Social Sciences",
    mathsType: "Essential Mathematics",
    strands: [
      {
        title: "Commercial Mathematics & Taxation",
        subStrands: [
          "Income tax calculations (PAYE brackets)",
          "Simple and compound interest",
          "Inflation and exchange rates",
        ],
        coreCompetencies: ["Financial literacy", "Citizenship"],
        sampleLearningOutcomes: [
          "Compute taxable income, relief and PAYE deductions from a Kenyan monthly salary slip",
        ],
        isKicdVerified: true,
      },
      {
        title: "Descriptive Statistics & Data Interpretation",
        subStrands: [
          "Measures of central tendency (Mean, Median, Mode)",
          "Histograms and cumulative frequency ogives",
        ],
        coreCompetencies: ["Data analysis", "Critical thinking"],
        sampleLearningOutcomes: [
          "Construct a cumulative frequency curve to estimate median and quartiles of economic survey data",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g10-stem-chem",
    stage: "Senior School",
    grade: "Grade 10",
    learningArea: "Chemistry (STEM Elective)",
    pathway: "STEM",
    strands: [
      {
        title: "The Mole Concept & Stoichiometry",
        subStrands: [
          "Avogadro constant and molar mass",
          "Empirical and molecular formulas",
          "Volumetric analysis (titration)",
        ],
        coreCompetencies: ["Laboratory precision", "Analytical deduction"],
        sampleLearningOutcomes: [
          "Perform standard acid-base titration to determine unknown concentration of sodium hydroxide",
        ],
        isKicdVerified: true,
      },
      {
        title: "Periodic Table Trends & Chemical Bonding",
        subStrands: [
          "Atomic radius and ionization energy",
          "Ionic, covalent and metallic bonds",
          "Intermolecular hydrogen bonding",
        ],
        coreCompetencies: ["Critical thinking"],
        sampleLearningOutcomes: [
          "Explain anomalous physical properties of water in terms of hydrogen bonding vs group 16 hydrides",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g11-soc-hist",
    stage: "Senior School",
    grade: "Grade 11",
    learningArea: "History & Citizenship (Social Sciences Elective)",
    pathway: "Social Sciences",
    strands: [
      {
        title: "Devolution and Democratic Governance in Kenya",
        subStrands: [
          "Structure of County Governments",
          "Intergovernmental relations and CRA revenue allocation",
          "Citizen participation in policy",
        ],
        coreCompetencies: ["Citizenship", "Social justice and ethics"],
        sampleLearningOutcomes: [
          "Analyze the separation of powers between the Senate and the National Assembly under the 2010 Constitution",
        ],
        isKicdVerified: true,
      },
      {
        title: "Pan-Africanism and Regional Integration",
        subStrands: [
          "East African Community (EAC) integration pillars",
          "African Union (AU) peace architectures",
        ],
        coreCompetencies: ["Global citizenship"],
        sampleLearningOutcomes: [
          "Evaluate the economic benefits and trade barriers within the EAC Common Market Protocol",
        ],
        isKicdVerified: true,
      },
    ],
  },
  {
    id: "cd-g11-art-theatre",
    stage: "Senior School",
    grade: "Grade 11",
    learningArea: "Theatre, Film & Media Arts (Arts Elective)",
    pathway: "Arts & Sports Science",
    strands: [
      {
        title: "Dramatic Scriptwriting & Production",
        subStrands: [
          "Character development and conflict",
          "Directing Kenyan stage drama",
          "Stage lighting, acoustics and costuming",
        ],
        coreCompetencies: ["Creativity and imagination", "Communication"],
        sampleLearningOutcomes: [
          "Write a 15-minute one-act dramatic script addressing contemporary social issues in Kenya",
        ],
        isKicdVerified: true,
      },
      {
        title: "Digital Film Technology & Cinematography",
        subStrands: [
          "Camera angles and shot composition",
          "Non-linear video editing",
          "Audio design and Foley recording",
        ],
        coreCompetencies: ["Digital literacy", "Innovation"],
        sampleLearningOutcomes: [
          "Produce and edit a 3-minute public awareness documentary film using mobile cameras",
        ],
        isKicdVerified: true,
        verificationNote: "Senior School Media Electives verified against KICD 2024 designs",
      },
    ],
  },
];

export const CURRICULUM_DESIGNS = KICD_CURRICULUM_DESIGNS;
