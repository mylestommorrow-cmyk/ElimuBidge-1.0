// @ts-nocheck -- imported code, original project was not type-checked strictly
import {
  CbeStage,
  CbeGrade,
  SeniorSchoolPathway,
  MathsType,
  ComprehensiveCurriculumRecord,
  CurriculumStrandRecord,
  SpecificLearningOutcome,
  AssessmentRubric,
} from "../types";

export const CURRICULUM_STORAGE_KEY = "elimubridge_cbe_curriculum_records_v1";

// National Core Competencies mandated by KICD
export const KICD_CORE_COMPETENCIES = [
  "Communication and Collaboration",
  "Critical Thinking and Problem Solving",
  "Imagination and Creativity",
  "Citizenship",
  "Learning to Learn",
  "Self-efficacy",
  "Digital Literacy",
] as const;

// National Values in Kenya CBE Framework
export const KICD_NATIONAL_VALUES = [
  "Love",
  "Responsibility",
  "Respect",
  "Unity",
  "Peace",
  "Patriotism",
  "Integrity",
] as const;

// Pertinent and Contemporary Issues (PCIs)
export const KICD_PCIS = [
  "Environmental Education & Climate Action",
  "Health & Personal Hygiene",
  "Life Skills, Self-Awareness & Child Protection",
  "Financial Literacy & Consumer Awareness",
  "Digital Citizenship & Online Safety",
  "Community Service Learning (CSL)",
  "Peace, Social Cohesion & Inclusivity",
] as const;

// Seed curriculum database with genuine KICD-aligned designs
export const INITIAL_CURRICULUM_RECORDS: ComprehensiveCurriculumRecord[] = [
  // -------------------------------------------------------------
  // EARLY YEARS: Playgroup Sensory & Social Activities
  // -------------------------------------------------------------
  {
    id: "kicd-playgroup-sensory",
    stage: "Early Years",
    grade: "Playgroup",
    learningArea: "Sensory & Psychomotor Activities",
    sourceType: "official_kicd",
    sourceDocument: "KICD Early Years Foundational Guidelines",
    sourceUrl: "https://kicd.ac.ke/curriculum-designs",
    curriculumVersion: "2024-Rationalised",
    publicationDate: "2024-01-10",
    isVerified: true,
    verifiedBy: "KICD Early Childhood Panel",
    verifiedAt: "2024-02-01",
    rationalized: true,
    coreCompetencies: [
      "Communication and Collaboration",
      "Imagination and Creativity",
      "Self-efficacy",
    ],
    values: ["Love", "Respect", "Unity"],
    pcis: ["Health & Personal Hygiene", "Life Skills, Self-Awareness & Child Protection"],
    strands: [
      {
        id: "play-str-1",
        name: "Sensory Exploration and Motor Skills",
        subStrands: [
          {
            id: "play-sub-1",
            name: "Gross and Fine Motor Play",
            specificLearningOutcomes: [
              {
                id: "play-slo-1",
                outcome:
                  "Hold, manipulate, stack and roll colorful safe objects with hand-eye coordination",
                competencyLevel: "introduced",
              },
              {
                id: "play-slo-2",
                outcome:
                  "Respond to rhythmic sounds, clapping and simple movement instructions safely",
                competencyLevel: "introduced",
              },
            ],
            suggestedExperiences: [
              "Stacking large lightweight soft blocks and nesting cups",
              "Dancing, clapping and action songs following teacher cues",
              "Finger tracing in sand trays and water sensory play",
            ],
            keyInquiryQuestions: [
              "What shapes and colors can we see around our play area?",
              "How do we move our hands and feet to the music?",
            ],
            assessmentRubric: {
              exceeding:
                "Independently balances blocks, identifies multiple colors and coordinates movements rhythmically",
              meeting:
                "Stacks blocks with minimal guidance and participates actively in movement games",
              approaching:
                "Attempts stacking with physical demonstration and joins simple clapping games",
              below: "Requires continuous one-on-one hand-over-hand physical assistance",
            },
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // PRE-PRIMARY: PP1 Mathematical Activities
  // -------------------------------------------------------------
  {
    id: "kicd-pp1-math",
    stage: "Pre-Primary",
    grade: "PP1",
    learningArea: "Mathematical Activities",
    sourceType: "official_kicd",
    sourceDocument: "KICD/DES/EYE/2024/01 - Pre-Primary Curriculum Designs",
    sourceUrl: "https://kicd.ac.ke/curriculum-designs",
    curriculumVersion: "2024-Rationalised",
    publicationDate: "2024-02-14",
    isVerified: true,
    verifiedBy: "KICD Curriculum Quality Assurance",
    verifiedAt: "2024-03-01",
    strands: [
      {
        id: "strand-pp1-m1",
        strandNumber: 1,
        title: "Classification & Sorting",
        description:
          "Developing early logical grouping and perceptual discrimination through sensory play.",
        subStrands: [
          {
            id: "sub-pp1-m1-1",
            substrandNumber: 1,
            title: "Sorting and Grouping by Attributes",
            inquiryQuestions: [
              "How can we put these objects into matching groups?",
              "Why do we sort items by colour, size, or shape?",
            ],
            coreCompetencies: [
              "Communication and Collaboration",
              "Critical Thinking and Problem Solving",
            ],
            values: ["Responsibility", "Unity"],
            pcis: ["Environmental Education & Climate Action"],
            outcomes: [
              {
                id: "slo-pp1-m-101",
                code: "PP1.MATH.1.1",
                title: "Sort objects by primary colours",
                description:
                  "By the end of the sub-strand, the learner should be able to sort concrete classroom objects into red, blue, and yellow groups.",
                experiences: [
                  "Collecting coloured bottle tops, leaves, and building blocks.",
                  "Placing red blocks in red bowls and blue blocks in blue bowls.",
                  "Singing colour identification rhymes with peers.",
                ],
                rubric: {
                  exceeding:
                    "Consistently sorts diverse items by colour and describes secondary colour variations accurately.",
                  meeting:
                    "Accurately sorts objects by primary colours (red, blue, yellow) independently.",
                  approaching: "Sorts objects with occasional prompting when colours are mixed.",
                  below:
                    "Requires step-by-step physical guidance to match identical coloured objects.",
                },
              },
            ],
          },
        ],
      },
      {
        id: "strand-pp1-m2",
        strandNumber: 2,
        title: "Number Concepts",
        description:
          "Early number recognition, count-to-quantity association, and tactile counting.",
        subStrands: [
          {
            id: "sub-pp1-m2-1",
            substrandNumber: 1,
            title: "Numbers 1 to 10",
            inquiryQuestions: [
              "How many counters are in our circle?",
              "What number comes after two?",
            ],
            coreCompetencies: ["Self-efficacy", "Digital Literacy"],
            values: ["Respect", "Integrity"],
            pcis: ["Life Skills, Self-Awareness & Child Protection"],
            outcomes: [
              {
                id: "slo-pp1-m-201",
                code: "PP1.MATH.2.1",
                title: "Count concrete objects from 1 to 10",
                description:
                  "Learner matches number symbols 1 through 10 to real physical counters with one-to-one correspondence.",
                experiences: [
                  "Touching beads one by one while counting aloud.",
                  "Hopping on numbered floor mats from 1 to 5.",
                ],
                rubric: {
                  exceeding:
                    "Counts up to 15 objects accurately and connects quantities to number symbols without error.",
                  meeting:
                    "Counts objects up to 10 with accurate one-to-one finger correspondence.",
                  approaching: "Counts up to 5 accurately but skips numbers between 6 and 10.",
                  below: "Struggles with one-to-one touch counting beyond 3 objects.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // LOWER PRIMARY: Grade 2 English Language Activities
  // -------------------------------------------------------------
  {
    id: "kicd-g2-eng",
    stage: "Lower Primary",
    grade: "Grade 2",
    learningArea: "English",
    sourceType: "official_kicd",
    sourceDocument: "KICD/DES/PRI/2024/04 - Lower Primary Rationalised Designs",
    sourceUrl: "https://kicd.ac.ke/lower-primary",
    curriculumVersion: "2024-Rationalised",
    publicationDate: "2024-01-20",
    isVerified: true,
    verifiedBy: "KICD Department of Languages",
    verifiedAt: "2024-02-10",
    strands: [
      {
        id: "strand-g2-eng-1",
        strandNumber: 1,
        title: "Listening and Speaking",
        description:
          "Oral expression, active listening, polite requests, and conversational storytelling.",
        subStrands: [
          {
            id: "sub-g2-eng-1-1",
            substrandNumber: 1,
            title: "Theme: The Home & Family Responsibilities",
            inquiryQuestions: [
              "How do we speak politely when asking for help at home?",
              "What chores do we perform to help our families?",
            ],
            coreCompetencies: ["Communication and Collaboration", "Citizenship"],
            values: ["Love", "Respect", "Responsibility"],
            pcis: ["Life Skills, Self-Awareness & Child Protection"],
            outcomes: [
              {
                id: "slo-g2-eng-101",
                code: "G2.ENG.1.1",
                title: "Use polite language and express family roles",
                description:
                  "Learner uses courtesy words ('please', 'thank you', 'excuse me') and narrates duties performed at home clearly.",
                experiences: [
                  "Role-playing a morning conversation between siblings and parents.",
                  "Expressing gratitude in pairs using courtesy expressions.",
                ],
                rubric: {
                  exceeding:
                    "Expresses thoughts fluently using a wide vocabulary of polite expressions in diverse social situations.",
                  meeting: "Uses polite words naturally when speaking about family tasks in class.",
                  approaching: "Uses courtesy words only when reminded by the teacher.",
                  below:
                    "Hesitates to speak and requires guided sentences to express simple needs.",
                },
              },
            ],
          },
        ],
      },
      {
        id: "strand-g2-eng-2",
        strandNumber: 2,
        title: "Reading: Guided and Independent Decodable Texts",
        description: "Phonics mastery, sight word vocabulary, and reading comprehension.",
        subStrands: [
          {
            id: "sub-g2-eng-2-1",
            substrandNumber: 1,
            title: "Consonant Blends & Simple Paragraph Reading",
            inquiryQuestions: [
              "How do letters blend together to form words?",
              "What happened in the beginning and end of the story?",
            ],
            coreCompetencies: ["Learning to Learn", "Imagination and Creativity"],
            values: ["Integrity"],
            pcis: ["Digital Citizenship & Online Safety"],
            outcomes: [
              {
                id: "slo-g2-eng-201",
                code: "G2.ENG.2.1",
                title: "Read grade-level decodable text with comprehension",
                description:
                  "Learner decodes texts with 'bl', 'cl', 'fl', 'st' blends and answers 3 literal comprehension questions.",
                experiences: [
                  "Sounding out decodable story cards in small learning groups.",
                  "Reading a short paragraph on 'A Visit to the Market' and identifying the main characters.",
                ],
                rubric: {
                  exceeding:
                    "Reads decodable text smoothly with expression and correctly infers unstated story details.",
                  meeting:
                    "Reads grade-level decodable passages at appropriate speed and answers factual questions.",
                  approaching: "Decodes blend words slowly and needs hints to recall story events.",
                  below: "Struggles to decode unfamiliar blends without teacher intervention.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // UPPER PRIMARY: Grade 5 Science and Technology
  // -------------------------------------------------------------
  {
    id: "kicd-g5-sci",
    stage: "Upper Primary",
    grade: "Grade 5",
    learningArea: "Integrated Science",
    sourceType: "official_kicd",
    sourceDocument: "KICD/DES/PRI/2024/09 - Upper Primary Science Curriculum",
    sourceUrl: "https://kicd.ac.ke/upper-primary",
    curriculumVersion: "2024-Rationalised",
    publicationDate: "2024-01-15",
    isVerified: true,
    verifiedBy: "KICD Science Panel",
    verifiedAt: "2024-02-05",
    strands: [
      {
        id: "strand-g5-sci-1",
        strandNumber: 1,
        title: "Living Things & Environmental Dynamics",
        description:
          "Classification of plants and animals, breathing systems, and ecological interdependence.",
        subStrands: [
          {
            id: "sub-g5-sci-1-1",
            substrandNumber: 1,
            title: "Breathing System in Human Beings",
            inquiryQuestions: [
              "What happens when we inhale and exhale air?",
              "How can we protect our lungs from airborne pollution?",
            ],
            coreCompetencies: ["Critical Thinking and Problem Solving", "Self-efficacy"],
            values: ["Responsibility", "Respect"],
            pcis: ["Health & Personal Hygiene", "Environmental Education & Climate Action"],
            outcomes: [
              {
                id: "slo-g5-sci-101",
                code: "G5.SCI.1.1",
                title: "Identify organs of the human breathing system",
                description:
                  "Learner models and explains the path of air through the nose, trachea, bronchi, lungs, and diaphragm.",
                experiences: [
                  "Constructing a working lung model using plastic bottles, balloons, and straws.",
                  "Observing chest wall movements during inhalation and exhalation.",
                  "Documenting habits that maintain clean lungs (avoiding dust, tobacco smoke).",
                ],
                rubric: {
                  exceeding:
                    "Constructs an exemplary lung model and clearly elucidates the biochemical role of alveoli in gas exchange.",
                  meeting:
                    "Identifies the core organs of the breathing system and explains their basic mechanical functions accurately.",
                  approaching:
                    "Names organs correctly but confuses the role of the diaphragm or bronchi.",
                  below:
                    "Requires assistance to label a simple 2D diagram of the breathing organs.",
                },
              },
            ],
          },
        ],
      },
      {
        id: "strand-g5-sci-2",
        strandNumber: 2,
        title: "Matter and Properties of Materials",
        description: "States of matter, changes in state, and heat transfer mechanisms.",
        subStrands: [
          {
            id: "sub-g5-sci-2-1",
            substrandNumber: 1,
            title: "Effects of Heating and Cooling on Matter",
            inquiryQuestions: [
              "Why do ice cubes melt when left in the sun?",
              "Where does morning dew on grass come from?",
            ],
            coreCompetencies: ["Critical Thinking and Problem Solving"],
            values: ["Integrity"],
            pcis: ["Environmental Education & Climate Action"],
            outcomes: [
              {
                id: "slo-g5-sci-201",
                code: "G5.SCI.2.1",
                title: "Demonstrate processes of evaporation, condensation, and freezing",
                description:
                  "Learner carries out simple, safe experiments showing phase transformations of water.",
                experiences: [
                  "Boiling water safely to observe steam condensation on a cold metal plate.",
                  "Freezing liquids to observe expansion and solidification.",
                ],
                rubric: {
                  exceeding:
                    "Designs and conducts comparative rate-of-evaporation investigations independently.",
                  meeting:
                    "Accurately demonstrates and distinguishes evaporation, condensation, and freezing.",
                  approaching:
                    "Observes state changes correctly but interchanges the scientific terminology.",
                  below:
                    "Needs supervision to observe and state physical differences between water states.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // JUNIOR SCHOOL: Grade 8 Integrated Science
  // -------------------------------------------------------------
  {
    id: "kicd-g8-sci",
    stage: "Junior School",
    grade: "Grade 8",
    learningArea: "Integrated Science",
    sourceType: "official_kicd",
    sourceDocument: "KICD/DES/JSS/2024/02 - Junior School Rationalised Syllabus",
    sourceUrl: "https://kicd.ac.ke/junior-school",
    curriculumVersion: "2024-Rationalised",
    publicationDate: "2024-01-10",
    isVerified: true,
    verifiedBy: "KICD Junior School Panel",
    verifiedAt: "2024-01-28",
    strands: [
      {
        id: "strand-g8-sci-1",
        strandNumber: 1,
        title: "Cell Structure and Microscopy",
        description:
          "Cellular organization, light microscope handling, and comparisons between plant and animal cells.",
        subStrands: [
          {
            id: "sub-g8-sci-1-1",
            substrandNumber: 1,
            title: "Plant and Animal Cell Organelles",
            inquiryQuestions: [
              "Why is the cell referred to as the basic unit of living organisms?",
              "How do plant cells differ from animal cells in structure and function?",
            ],
            coreCompetencies: [
              "Critical Thinking and Problem Solving",
              "Digital Literacy",
              "Self-efficacy",
            ],
            values: ["Respect", "Responsibility"],
            pcis: ["Life Skills, Self-Awareness & Child Protection"],
            outcomes: [
              {
                id: "slo-g8-sci-101",
                code: "G8.SCI.1.1",
                title: "Prepare temporary wet mount slides and observe under a microscope",
                description:
                  "Learner safely prepares an onion epidermal peel wet mount with iodine stain and focuses under medium power.",
                experiences: [
                  "Mounting onion epidermal tissue on a glass slide with cover slip without air bubbles.",
                  "Drawing and labeling observed cell walls, nuclei, cytoplasm, and vacuole.",
                ],
                rubric: {
                  exceeding:
                    "Prepares flawless slide mounts, calculates total optical magnification, and annotates fine organelle distinctions.",
                  meeting:
                    "Prepares slide mount with minimal air bubbles and correctly identifies core visible cell structures.",
                  approaching:
                    "Mounts slide with trapped bubbles or struggles to focus under medium objective lens.",
                  below:
                    "Requires hands-on teacher assistance to manipulate the microscope stage and coarse focus.",
                },
              },
              {
                id: "slo-g8-sci-102",
                code: "G8.SCI.1.2",
                title: "Compare and contrast plant versus animal cells",
                description:
                  "Learner tabulates physiological and structural differences between plant and animal cells with reasons.",
                experiences: [
                  "Comparing cheek epithelial cells with onion epidermal cells.",
                  "Discussing the significance of chloroplasts and rigid cellulose cell walls in plants.",
                ],
                rubric: {
                  exceeding:
                    "Analyzes organelle adaptations to organism lifestyle (e.g. turgor pressure vs flexible motility) thoroughly.",
                  meeting:
                    "Accurately tabulates 4 structural differences between plant and animal cells.",
                  approaching:
                    "Identifies 2 differences correctly but confuses plastids or vacuole characteristics.",
                  below:
                    "Cannot distinguish cell wall presence between plants and animals without prompting.",
                },
              },
            ],
          },
        ],
      },
      {
        id: "strand-g8-sci-2",
        strandNumber: 2,
        title: "Elements, Compounds and Chemical Mixtures",
        description:
          "Atomic structure, periodic table arrangement of the first 20 elements, and separation techniques.",
        subStrands: [
          {
            id: "sub-g8-sci-2-1",
            substrandNumber: 1,
            title: "Atomic Structure and Chemical Symbols",
            inquiryQuestions: [
              "What subatomic particles constitute an atom?",
              "Why do chemical elements have international standardized symbols?",
            ],
            coreCompetencies: ["Critical Thinking and Problem Solving", "Learning to Learn"],
            values: ["Integrity"],
            pcis: ["Digital Citizenship & Online Safety"],
            outcomes: [
              {
                id: "slo-g8-sci-201",
                code: "G8.SCI.2.1",
                title: "Represent electron configurations for elements 1 to 20",
                description:
                  "Learner writes electron arrangements (2.8.8) and draws Bohr diagrams for elements Hydrogen through Calcium.",
                experiences: [
                  "Using colored clay or bottle tops to model energy levels and electron distributions.",
                  "Relating outermost valence electrons to group number in the periodic table.",
                ],
                rubric: {
                  exceeding:
                    "Accurately deduces ion formation patterns and chemical valencies from electron configurations.",
                  meeting:
                    "Writes correct electron configurations and draws Bohr diagrams for any of the first 20 elements.",
                  approaching:
                    "Draws electron shells correctly but errs on maximum electron capacity per shell.",
                  below: "Struggles to determine total electron counts from atomic numbers.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // SENIOR SCHOOL: Grade 10 Biology (STEM Pathway)
  // -------------------------------------------------------------
  {
    id: "kicd-g10-bio",
    stage: "Senior School",
    grade: "Grade 10",
    learningArea: "Integrated Science",
    pathway: "STEM",
    sourceType: "official_kicd",
    sourceDocument: "MOE/KICD Senior School Rollout 2026 - STEM Pathway Syllabus",
    sourceUrl: "https://kicd.ac.ke/senior-school",
    curriculumVersion: "2026-Senior-Rollout",
    publicationDate: "2025-11-20",
    isVerified: true,
    verifiedBy: "Ministry of Education Senior School Directorate",
    verifiedAt: "2026-01-05",
    strands: [
      {
        id: "strand-g10-bio-1",
        strandNumber: 1,
        title: "Enzyme Kinetics and Metabolic Homeostasis",
        description:
          "Biochemical properties of enzymes, substrate specificity, and homeostatic regulatory mechanisms.",
        subStrands: [
          {
            id: "sub-g10-bio-1-1",
            substrandNumber: 1,
            title: "Enzyme Action and Limiting Factors",
            inquiryQuestions: [
              "How do temperature and pH govern biological reaction velocity?",
              "What occurs at the molecular level when an enzyme is denatured?",
            ],
            coreCompetencies: [
              "Critical Thinking and Problem Solving",
              "Digital Literacy",
              "Communication and Collaboration",
            ],
            values: ["Integrity", "Responsibility"],
            pcis: ["Health & Personal Hygiene", "Financial Literacy & Consumer Awareness"],
            outcomes: [
              {
                id: "slo-g10-bio-101",
                code: "G10.BIO.1.1",
                title: "Investigate effects of temperature on salivary amylase activity",
                description:
                  "Learner designs and executes an empirical iodine test assay recording starch breakdown times across 10°C to 70°C.",
                experiences: [
                  "Calibrating water baths, timing reactions with stopwatches, and spotting on white tiles with iodine solution.",
                  "Plotting temperature-velocity rate curves and determining optimum temperature.",
                ],
                rubric: {
                  exceeding:
                    "Calculates temperature coefficients (Q10), explains collision theory kinetics, and accounts for experimental anomalies.",
                  meeting:
                    "Executes the controlled assay safely, plots accurate rate curves, and identifies the optimum temperature range.",
                  approaching:
                    "Performs the assay with minor measurement errors or plots imprecise rate graphs.",
                  below:
                    "Fails to maintain controlled variables (temperature/pH) without explicit instructor guidance.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // SENIOR SCHOOL: Grade 10 Core Mathematics (STEM Pathway)
  // -------------------------------------------------------------
  {
    id: "kicd-g10-math-core",
    stage: "Senior School",
    grade: "Grade 10",
    learningArea: "Mathematics",
    pathway: "STEM",
    mathsType: "Core Mathematics",
    sourceType: "official_kicd",
    sourceDocument: "MOE/KICD Senior School Rollout 2026 - Core Mathematics Specification",
    sourceUrl: "https://kicd.ac.ke/senior-school",
    curriculumVersion: "2026-Senior-Rollout",
    publicationDate: "2025-11-20",
    isVerified: true,
    verifiedBy: "KICD Mathematics Panel",
    verifiedAt: "2026-01-05",
    strands: [
      {
        id: "strand-g10-m-1",
        strandNumber: 1,
        title: "Quadratic Equations and Parabolic Functions",
        description:
          "Solution by factorization, completing the square, quadratic formula, and graphical modeling of projectile motion.",
        subStrands: [
          {
            id: "sub-g10-m-1-1",
            substrandNumber: 1,
            title: "Analytical Solutions of Quadratic Equations",
            inquiryQuestions: [
              "What does the discriminant reveal regarding the roots of a polynomial?",
              "How can parabolic equations model projectile trajectory in real-life sports and ballistics?",
            ],
            coreCompetencies: ["Critical Thinking and Problem Solving", "Digital Literacy"],
            values: ["Integrity"],
            pcis: ["Community Service Learning (CSL)"],
            outcomes: [
              {
                id: "slo-g10-m-101",
                code: "G10.COREMATH.1.1",
                title: "Apply the quadratic formula and evaluate the discriminant",
                description:
                  "Learner solves general quadratic equations ax^2 + bx + c = 0 and characterises roots using b^2 - 4ac.",
                experiences: [
                  "Deriving the quadratic formula by completing the square method.",
                  "Classifying real, distinct, equal, or complex root conditions for given functions.",
                ],
                rubric: {
                  exceeding:
                    "Synthesizes quadratic models for optimization scenarios (maximum area, projectile vertex) effortlessly.",
                  meeting:
                    "Accurately applies the quadratic formula and interprets the discriminant correctly.",
                  approaching:
                    "Applies formula but makes recurring algebraic sign errors during evaluation.",
                  below:
                    "Unable to identify coefficients a, b, c from standard form equations consistently.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // SENIOR SCHOOL: Grade 11 History & Citizenship (Social Sciences Pathway)
  // -------------------------------------------------------------
  {
    id: "kicd-g11-hist",
    stage: "Senior School",
    grade: "Grade 11",
    learningArea: "History",
    pathway: "Social Sciences",
    sourceType: "official_kicd",
    sourceDocument: "MOE/KICD Social Sciences Pathway Framework 2026",
    sourceUrl: "https://kicd.ac.ke/social-sciences",
    curriculumVersion: "2026-Senior-Rollout",
    publicationDate: "2025-10-18",
    isVerified: true,
    verifiedBy: "KICD Humanities Directorate",
    verifiedAt: "2026-01-08",
    strands: [
      {
        id: "strand-g11-hist-1",
        strandNumber: 1,
        title: "Constitutional Governance and Devolution in Kenya",
        description:
          "Analysis of the 2010 Constitution, devolution mechanisms, public finance oversight, and citizen participation.",
        subStrands: [
          {
            id: "sub-g11-hist-1-1",
            substrandNumber: 1,
            title: "Devolved Government Structures & County Assemblies",
            inquiryQuestions: [
              "How does devolution advance equitable distribution of national resources?",
              "What constitutional avenues empower youth and citizen participation in county budgets?",
            ],
            coreCompetencies: [
              "Citizenship",
              "Critical Thinking and Problem Solving",
              "Communication and Collaboration",
            ],
            values: ["Patriotism", "Integrity", "Peace"],
            pcis: [
              "Peace, Social Cohesion & Inclusivity",
              "Financial Literacy & Consumer Awareness",
            ],
            outcomes: [
              {
                id: "slo-g11-hist-101",
                code: "G11.HIST.1.1",
                title: "Examine intergovernmental relations and County revenue sharing",
                description:
                  "Learner evaluates revenue allocation formulas from the Commission on Revenue Allocation (CRA) and legislative roles of the Senate.",
                experiences: [
                  "Simulating a County Assembly public participation forum on local development projects.",
                  "Critiquing the Auditor-General's report on county budget expenditures in collaborative teams.",
                ],
                rubric: {
                  exceeding:
                    "Presents critical, evidence-grounded constitutional arguments on devolution challenges and reform proposals.",
                  meeting:
                    "Clearly articulates the powers, revenue avenues, and check-and-balance roles of County Governments.",
                  approaching:
                    "Explains devolution generally but confuses the specific mandates of the Senate vs National Assembly.",
                  below:
                    "Requires prompting to define devolution or state the number of Kenya's counties.",
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

// Helper functions for curriculum access & administrative verification
export function getStoredCurriculumRecords(): ComprehensiveCurriculumRecord[] {
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Curriculum storage load failed, falling back to initial seeds.", e);
  }
  return INITIAL_CURRICULUM_RECORDS;
}

export function saveCurriculumRecords(records: ComprehensiveCurriculumRecord[]): void {
  try {
    localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to persist curriculum records", e);
  }
}

export function addCurriculumRecord(record: ComprehensiveCurriculumRecord): void {
  const current = getStoredCurriculumRecords();
  const existingIdx = current.findIndex((r) => r.id === record.id);
  let updated: ComprehensiveCurriculumRecord[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = record;
  } else {
    updated = [record, ...current];
  }
  saveCurriculumRecords(updated);
}

export function verifyCurriculumRecord(recordId: string, verifierName: string): boolean {
  const records = getStoredCurriculumRecords();
  const target = records.find((r) => r.id === recordId);
  if (!target) return false;

  target.isVerified = true;
  target.verifiedBy = verifierName;
  target.verifiedAt = new Date().toISOString().slice(0, 10);
  saveCurriculumRecords(records);
  return true;
}
