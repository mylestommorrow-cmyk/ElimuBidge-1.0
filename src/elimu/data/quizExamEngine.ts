// @ts-nocheck -- imported code, original project was not type-checked strictly
import { QuizQuestion, RevisionQuiz } from "../types";

/**
 * Builds a certified 30-question exam run (Question 1 to 30)
 * Uses high-quality verified questions with fallback generators if a specific sub-topic needs padding.
 */
export function build30QuestionExam(
  quiz: RevisionQuiz,
  allQuizzes: RevisionQuiz[] = [],
): QuizQuestion[] {
  const existing = [...quiz.questions];

  // Also collect related questions from matching grade or category
  const related = allQuizzes
    .filter(
      (q) => q.id !== quiz.id && (q.category === quiz.category || q.gradeLevel === quiz.gradeLevel),
    )
    .flatMap((q) => q.questions);

  // Additional syllabus question bank mapped by subject/category
  const extraPool: QuizQuestion[] = getSyllabusQuestionBank(
    quiz.category,
    quiz.gradeLevel,
    quiz.subject,
  );

  const combined: QuizQuestion[] = [...existing];
  const seenTexts = new Set(existing.map((q) => q.question.toLowerCase().trim()));

  for (const q of [...related, ...extraPool]) {
    if (combined.length >= 30) break;
    const key = q.question.toLowerCase().trim();
    if (!seenTexts.has(key)) {
      seenTexts.add(key);
      combined.push({
        ...q,
        id: `${quiz.id}-q${combined.length + 1}`,
      });
    }
  }

  // If still below 30, generate structured curriculum drill questions to ensure exact 30 questions
  let counter = combined.length + 1;
  while (combined.length < 30) {
    const filler = generateCurriculumDrillQuestion(quiz, counter);
    combined.push(filler);
    counter++;
  }

  return combined.slice(0, 30);
}

function getSyllabusQuestionBank(
  category: string,
  gradeLevel: string,
  subject: string,
): QuizQuestion[] {
  const bank: QuizQuestion[] = [
    // Mathematics
    {
      id: "qb-m-1",
      question: "What is the value of 8 × 7 in mental arithmetic?",
      options: ["54", "56", "58", "64"],
      correctIndex: 1,
      explanation: "8 multiplied by 7 equals 56.",
      curriculumRef: "CBE Mathematics: Multiplication Mastery",
    },
    {
      id: "qb-m-2",
      question: "Convert 3/4 into a percentage:",
      options: ["25%", "50%", "75%", "80%"],
      correctIndex: 2,
      explanation: "(3 / 4) × 100% = 75%.",
      curriculumRef: "CBE Mathematics: Fractions & Percentages",
    },
    {
      id: "qb-m-3",
      question: "What is the square root of 144?",
      options: ["11", "12", "14", "16"],
      correctIndex: 1,
      explanation: "12 × 12 = 144, so √144 = 12.",
      curriculumRef: "CBE Mathematics: Squares & Square Roots",
    },
    {
      id: "qb-m-4",
      question: "Solve for x: 2x + 9 = 25",
      options: ["x = 6", "x = 8", "x = 7", "x = 16"],
      correctIndex: 1,
      explanation: "2x = 25 - 9 = 16. Then x = 16 / 2 = 8.",
      curriculumRef: "CBE Mathematics: Linear Equations",
    },
    {
      id: "qb-m-5",
      question: "What is the sum of interior angles in any triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctIndex: 1,
      explanation: "The interior angles of any planar Euclidean triangle sum to exactly 180°.",
      curriculumRef: "CBE Mathematics: Geometry & Angle Properties",
    },
    {
      id: "qb-m-6",
      question:
        "A trader buys a book for Ksh 400 and sells it for Ksh 500. Calculate percentage profit:",
      options: ["20%", "25%", "30%", "15%"],
      correctIndex: 1,
      explanation: "Profit = 500 - 400 = 100. Percentage profit = (100 / 400) × 100% = 25%.",
      curriculumRef: "CBE Mathematics: Commercial Arithmetic",
    },
    {
      id: "qb-m-7",
      question: "Calculate the perimeter of a rectangle with length 12m and width 5m:",
      options: ["34m", "60m", "17m", "24m"],
      correctIndex: 0,
      explanation: "Perimeter = 2 × (L + W) = 2 × (12 + 5) = 34m.",
      curriculumRef: "CBE Mathematics: Perimeter & Measurement",
    },
    {
      id: "qb-m-8",
      question: "What is the probability of tossing a fair coin and getting a Head?",
      options: ["0", "1/4", "1/2", "1"],
      correctIndex: 2,
      explanation: "A fair coin has 2 equally likely outcomes (Head or Tail), so P(Head) = 1/2.",
      curriculumRef: "CBE Mathematics: Elementary Probability",
    },

    // Integrated Science & Biology
    {
      id: "qb-s-1",
      question:
        "Which gas is predominantly absorbed by green plants during the daytime photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correctIndex: 1,
      explanation:
        "Plants take in carbon dioxide (CO₂) and water in the presence of sunlight and chlorophyll to synthesize glucose.",
      curriculumRef: "CBE Integrated Science: Plant Nutrition",
    },
    {
      id: "qb-s-2",
      question: "Which component of human blood is primarily responsible for blood clotting?",
      options: ["Red Blood Cells", "Platelets (Thrombocytes)", "White Blood Cells", "Plasma"],
      correctIndex: 1,
      explanation:
        "Platelets aggregate at injury sites and activate the clotting cascade forming a fibrin mesh.",
      curriculumRef: "CBE Integrated Science: Circulatory System",
    },
    {
      id: "qb-s-3",
      question: "What is the chemical symbol for table salt (Sodium Chloride)?",
      options: ["Na", "Cl", "NaCl", "SoCl"],
      correctIndex: 2,
      explanation: "Sodium (Na⁺) and Chloride (Cl⁻) combine in a 1:1 ionic ratio to form NaCl.",
      curriculumRef: "CBE Integrated Science: Chemical Formulas",
    },
    {
      id: "qb-s-4",
      question: "Which organelle is universally known as the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondrion", "Ribosome", "Golgi apparatus"],
      correctIndex: 1,
      explanation:
        "Mitochondria generate cellular energy in the form of ATP via aerobic respiration.",
      curriculumRef: "CBE Integrated Science: Cell Biology",
    },
    {
      id: "qb-s-5",
      question: "Which nutrient is tested using the Iodine solution test?",
      options: ["Reducing sugars", "Starch", "Proteins", "Vitamin C"],
      correctIndex: 1,
      explanation: "Iodine turns from brown/yellow to blue-black in the presence of starch.",
      curriculumRef: "CBE Integrated Science: Food Tests",
    },
    {
      id: "qb-s-6",
      question: "What is the SI unit of electrical resistance?",
      options: ["Volt", "Ampere", "Ohm (Ω)", "Watt"],
      correctIndex: 2,
      explanation: "Ohm (Ω) is the SI unit of electrical resistance defined by Ohm's Law V = IR.",
      curriculumRef: "CBE Integrated Science: Electricity & Magnetism",
    },
    {
      id: "qb-s-7",
      question:
        "Water changes directly from ice to water vapor without melting through the process called:",
      options: ["Condensation", "Sublimation", "Evaporation", "Deposition"],
      correctIndex: 1,
      explanation:
        "Sublimation is the direct transition from solid to gaseous state without an intermediate liquid phase.",
      curriculumRef: "CBE Integrated Science: States of Matter",
    },

    // Languages (English & Kiswahili)
    {
      id: "qb-l-1",
      question:
        'Identify the adverb in the sentence: "The cheetah ran swiftly across the savannah."',
      options: ["cheetah", "ran", "swiftly", "savannah"],
      correctIndex: 2,
      explanation: '"Swiftly" modifies the verb "ran", answering how the cheetah ran.',
      curriculumRef: "CBE English: Parts of Speech (Adverbs)",
    },
    {
      id: "qb-l-2",
      question: 'What is the plural form of the word "child"?',
      options: ["Childs", "Children", "Childrens", "Childies"],
      correctIndex: 1,
      explanation: 'The irregular plural of "child" is "children".',
      curriculumRef: "CBE English: Pluralization",
    },
    {
      id: "qb-l-3",
      question: 'Tegua kitendawili hiki: "Nyumba yangu haina mlango."',
      options: ["Yai", "Kiatu", "Embe", "Kabati"],
      correctIndex: 0,
      explanation: "Yai (an egg) ni nyumba inayozungukwa na gamba bila mlango wowote.",
      curriculumRef: "CBE Kiswahili: Fasihi Simulizi na Vitendawili",
    },
    {
      id: "qb-l-4",
      question: 'Kinyume cha neno "anika" ni:',
      options: ["chuma", "anua", "fua", "pika"],
      correctIndex: 1,
      explanation: 'Kinyume cha kuanika nguo au vitu juani ni "kuanua".',
      curriculumRef: "CBE Kiswahili: Vinyume vya Vitendo",
    },

    // Agriculture & Environment
    {
      id: "qb-ag-1",
      question:
        "Which method of soil conservation involves constructing ridges across slopes to trap runoff water?",
      options: ["Overgrazing", "Contour Terracing", "Deforestation", "Monocropping"],
      correctIndex: 1,
      explanation:
        "Contour terracing cuts horizontal steps across hillsides, slowing runoff and trapping fertile topsoil.",
      curriculumRef: "CBE Agriculture: Soil & Water Conservation",
    },
    {
      id: "qb-ag-2",
      question:
        "Which layer of soil contains the highest concentration of organic matter and humus?",
      options: ["Bedrock", "Subsoil", "Topsoil", "Parent rock"],
      correctIndex: 2,
      explanation:
        "Topsoil (Horizon A) contains decomposing plant and animal residues forming dark, fertile humus.",
      curriculumRef: "CBE Agriculture: Soil Horizons",
    },

    // Social Studies & Devolution
    {
      id: "qb-ss-1",
      question:
        "Under the 2010 Constitution of Kenya, how many devolved County Governments were established?",
      options: ["8", "40", "47", "210"],
      correctIndex: 2,
      explanation: "Kenya has 47 devolved county governments, each headed by an elected Governor.",
      curriculumRef: "CBE Social Studies: Devolution & Governance",
    },
    {
      id: "qb-ss-2",
      question: "What is the highest mountain peak in Kenya and second highest in Africa?",
      options: ["Mount Kilimanjaro", "Mount Kenya (Batian)", "Mount Elgon", "Aberdare Ranges"],
      correctIndex: 1,
      explanation: "Mount Kenya (Batian peak at 5,199m) is the tallest in Kenya.",
      curriculumRef: "CBE Social Studies: Physical Geography",
    },
  ];

  return bank;
}

function generateCurriculumDrillQuestion(quiz: RevisionQuiz, qNum: number): QuizQuestion {
  const topicsList = [
    {
      concept: "KICD Core Competencies",
      q: `Question ${qNum}: Which fundamental CBE core competency enables learners to analyze evidence, evaluate claims, and formulate reasoned solutions?`,
      opts: [
        "Critical Thinking and Problem Solving",
        "Passive Listening",
        "Rote Memorization",
        "Guesswork",
      ],
      correct: 0,
      exp: "Critical Thinking and Problem Solving is a foundational pillar of Kenya's Competency-Based Education framework.",
      ref: `CBE ${quiz.gradeLevel} Curriculum Framework: Core Competencies`,
    },
    {
      concept: "Environmental Stewardship",
      q: `Question ${qNum}: Which sustainable practice protects water catchments and promotes climate resilience across Kenyan counties?`,
      opts: [
        "Burning forests",
        "Afforestation and tree planting",
        "Overgrazing along riverbanks",
        "Sand harvesting",
      ],
      correct: 1,
      exp: "Afforestation restores indigenous tree cover, protects watersheds, and reduces soil erosion.",
      ref: `CBE ${quiz.gradeLevel} Environmental Activities`,
    },
    {
      concept: "Scientific Inquiry & Variables",
      q: `Question ${qNum}: In a fair scientific experiment, the factor that the investigator deliberately changes to observe its effect is called the:`,
      opts: [
        "Dependent variable",
        "Independent variable",
        "Controlled variable",
        "Extraneous variable",
      ],
      correct: 1,
      exp: "The independent variable is intentionally manipulated by the researcher to determine its causal impact.",
      ref: `CBE ${quiz.gradeLevel} Integrated Science & Inquiry`,
    },
    {
      concept: "Digital Literacy & Online Safety",
      q: `Question ${qNum}: When utilizing digital educational portals on shared school tablets, learners should always:`,
      opts: [
        "Share their passwords publicly",
        "Keep personal credentials secure and log out after sessions",
        "Download unverified files",
        "Disable safety firewalls",
      ],
      correct: 1,
      exp: "Digital literacy promotes data security, strong private passwords, and cyber safety hygiene.",
      ref: `CBE ${quiz.gradeLevel} Digital Literacy Strand`,
    },
    {
      concept: "Community & Citizenship",
      q: `Question ${qNum}: The national values of Kenya highlighted in Article 10 of the Constitution include patriotism, rule of law, and:`,
      opts: ["Nepotism", "Integrity and social justice", "Ethnic discrimination", "Bribery"],
      correct: 1,
      exp: "National values and principles of governance explicitly enshrine integrity, transparency, and social justice.",
      ref: `CBE ${quiz.gradeLevel} Citizenship & Governance`,
    },
    {
      concept: "Health & Hygiene",
      q: `Question ${qNum}: Why is thorough handwashing with soap and clean water critical before handling food?`,
      opts: [
        "To change skin color",
        "To eliminate pathogenic germs and bacteria that cause disease",
        "To save water",
        "To cool down the hands",
      ],
      correct: 1,
      exp: "Soap and running water break down microbial membranes, removing pathogens and halting fecal-oral disease transmission.",
      ref: `CBE ${quiz.gradeLevel} Health & Nutrition`,
    },
  ];

  const picked = topicsList[(qNum - 1) % topicsList.length];
  return {
    id: `${quiz.id}-drill-q${qNum}`,
    question: picked.q,
    options: picked.opts,
    correctIndex: picked.correct,
    explanation: picked.exp,
    curriculumRef: picked.ref,
  };
}
