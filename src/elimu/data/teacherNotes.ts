// @ts-nocheck -- imported code, original project was not type-checked strictly
import { TeacherNote } from "../types";

export const INITIAL_TEACHER_NOTES: TeacherNote[] = [
  {
    id: "note-01",
    schoolCode: "DEMO-CBE",
    title: "Grade 8 Integrated Science: Microscopy & Onion Epidermal Cell Prep",
    subject: "Integrated Science",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    strand: "Strand 1: Living Things & Microscopic Techniques",
    content: `## Lab Preparation Guidelines for Onion Epidermis
1. **Equipment Required:** Clean slide, cover slip, iodine solution (1% w/v), mounting needle, and forceps.
2. **Technique:**
   - Peel a thin transparent membrane from the inner concave surface of an onion bulb scale.
   - Place a drop of water on the glass slide and spread the membrane flat with no wrinkles.
   - Add **one single drop of iodine** to stain cell walls and nuclei.
   - Lower the coverslip at a **45° angle** using a mounted needle to prevent air bubble entrapment.
3. **Observation Checklist:** Distinct cell wall, nucleus stained dark amber, cytoplasm, and large central vacuole. Chloroplasts are ABSENT (onion grows underground in the dark).`,
    keyFormulas: [
      "Total Magnification = Eyepiece Lens Magnification × Objective Lens Magnification",
      "Actual Specimen Size = Image Size ÷ Magnification (A = I / M)",
    ],
    homeworkTask:
      "Calculate the actual size of a stomata aperture measured as 18mm under ×400 total magnification.",
    authorName: "Mwalimu James Ochieng",
    authorRole: "Head of JSS Science",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    createdAt: "2026-10-24",
    attachments: [
      { title: "KICD Lab Rubric PDF", url: "https://kec.ac.ke" },
      { title: "PhET Cell Model Simulation", url: "https://phet.colorado.edu" },
    ],
  },
  {
    id: "note-02",
    schoolCode: "DEMO-CBE",
    title: "Grade 9 Mathematics: KJSEA Circle Theorems Proofs & Worked Formulas",
    subject: "Mathematics",
    gradeLevel: "Grade 9",
    cbeStage: "Junior School",
    strand: "Strand 2: Geometric Reasoning & Coordinate Geometry",
    content: `## Essential Circle Theorems for KJSEA Examination
### Theorem 1: Angle at Centre
The angle subtended by an arc at the centre is double the angle subtended by it at any point on the remaining part of the circumference.
$$\\angle AOB = 2 \\times \\angle APB$$

### Theorem 2: Cyclic Quadrilateral
Opposite angles in a cyclic quadrilateral are supplementary:
$$\\angle A + \\angle C = 180^\\circ \\quad \\text{and} \\quad \\angle B + \\angle D = 180^\\circ$$

### Theorem 3: Tangent Radius Theorem
A tangent to a circle is perpendicular to the radius drawn to the point of tangency ($90^\\circ$).`,
    keyFormulas: [
      "Length of Arc = (θ / 360°) × 2πr",
      "Area of Sector = (θ / 360°) × πr²",
      "Area of Segment = Area of Sector - Area of Triangle",
    ],
    homeworkTask:
      "Complete questions 1 to 12 in the KJSEA Model Test Paper on cyclic quadrilaterals.",
    authorName: "Mr. David Kiprono",
    authorRole: "Senior Mathematics Facilitator",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    createdAt: "2026-10-25",
    attachments: [
      { title: "GeoGebra Interactive Circle Theorem", url: "https://www.geogebra.org/geometry" },
    ],
  },
  {
    id: "note-03",
    schoolCode: "KHS-2026",
    title: "Grade 11 Chemistry: Le Chatelier Principle & Industrial Equilibrium",
    subject: "Integrated Science",
    gradeLevel: "Grade 11",
    cbeStage: "Senior School",
    strand: "Strand 3: Chemical Kinetics & Dynamic Equilibrium",
    content: `## Industrial Application: The Haber-Bosch Process
$$\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) \\quad \\Delta H = -92 \\text{ kJ/mol}$$

1. **Pressure Impact:** High pressure (200 atm) shifts equilibrium to the right because the forward reaction produces fewer moles of gas (4 moles $\\rightarrow$ 2 moles).
2. **Temperature Compromise:** The forward reaction is exothermic. Low temperature favors yield, but reduces kinetic reaction rate. Optimum compromised temperature is **450°C**.
3. **Catalyst:** Finely divided iron catalyst increases both forward and reverse rates equally without changing yield or position of equilibrium.`,
    keyFormulas: [
      "Kc = [NH3]² / ([N2] · [H2]³)",
      "Units of Kc depend on relative powers of concentration",
    ],
    homeworkTask:
      "Calculate Kc given equilibrium concentrations: [N2]=0.5M, [H2]=1.2M, [NH3]=0.8M.",
    authorName: "Madam Brenda Karimi",
    authorRole: "Senior STEM Chemistry Lead",
    authorAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    createdAt: "2026-10-26",
    attachments: [
      { title: "Royal Society of Chemistry Equilibrium Lab", url: "https://edu.rsc.org" },
    ],
  },
  {
    id: "note-04",
    schoolCode: "ALLIANCE-101",
    title: "Grade 8 Kiswahili: Ngeli za Majina (Jedwali la U-YA na A-WA)",
    subject: "Kiswahili",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    strand: "Strand 2: Sarufi na Matumizi ya Lugha",
    content: `## Mwongozo wa Ngeli za U-YA na A-WA
1. **Ngeli ya A-WA (Viumbe Hai):**
   - Mtu / Watu (Mtu huyu amefika / Watu hawa wamefika)
   - Ndege / Ndege (Ndege huyu anaimba / Ndege hawa wanaimba)
   - Kipepeo / Viwaa (Kipepeo huyu anaruka / Vipepeo hawa wanaruka)
2. **Ngeli ya U-YA:**
   - Hujumuisha majina yanayoanza na 'U' katika umoja na 'MA' katika wingi.
   - Ugonjwa / Magonjwa (Ugonjwa huu unatibika / Magonjwa haya yanatibika)
   - Ulezi / Malezi (Ulezi bora / Malezi bora)
   - Ufa / Nyufa (Ngeli ya U-ZI: Ufa huu umezibwa / Nyufa hizi zimezibwa)`,
    keyFormulas: [
      "Upatanisho wa Kisintaksia: Kiambishi ngeli cha nomino lazima kilingane na kitenzi na kivumishi.",
    ],
    homeworkTask: "Tunga sentensi tano ukitumia nomino za ngeli ya U-YA katika umoja na wingi.",
    authorName: "Madam Grace Akinyi",
    authorRole: "Mwalimu wa Kiswahili Fasaha",
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    createdAt: "2026-10-26",
  },
];

export const getStoredTeacherNotes = (): TeacherNote[] => {
  const stored = localStorage.getItem("elimubridge_teacher_notes");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return INITIAL_TEACHER_NOTES;
};

export const saveTeacherNotes = (notes: TeacherNote[]): void => {
  localStorage.setItem("elimubridge_teacher_notes", JSON.stringify(notes));
};
