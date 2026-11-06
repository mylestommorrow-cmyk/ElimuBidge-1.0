// @ts-nocheck -- imported code, original project was not type-checked strictly
import { TeachingLink } from "../types";

export const INITIAL_TEACHING_LINKS: TeachingLink[] = [
  {
    id: "tl-kicd-cloud",
    title: "Kenya Education Cloud (KEC) - Official KICD Curriculum Resources",
    subject: "All",
    gradeLevel: "All Grades",
    cbeStage: "All",
    url: "https://kec.ac.ke",
    type: "curriculum",
    description:
      "Official KICD digital course materials, interactive audio-visual guides, and approved teacher handbook syllabi for CBE Playgroup through Grade 12.",
    addedBy: "Mwalimu Ochieng",
    teacherRole: "Lead CBE Curriculum Facilitator",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Nairobi Central Teachers Resource Center",
    addedAt: "2026-02-14",
    verified: true,
  },
  {
    id: "tl-knec-cbe",
    title: "KNEC CBA Assessment Portal & Scoring Rubrics",
    subject: "Integrated Science",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    url: "https://cba.knec.ac.ke",
    type: "assessment",
    description:
      "Official Kenya National Examinations Council Competence-Based Assessment (CBA) guidelines, performance rubrics, and project assessment templates for JSS Grade 7-9.",
    addedBy: "Mr. Kiprono",
    teacherRole: "Senior STEM & CBA Coordinator",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Alliance Junior School Campus",
    addedAt: "2026-02-16",
    verified: true,
  },
  {
    id: "tl-phet-sims",
    title: "PhET Interactive Simulations - Science & Physics Labs",
    subject: "Integrated Science",
    gradeLevel: "Grade 7",
    cbeStage: "Junior School",
    url: "https://phet.colorado.edu/en/simulations/filter?subjects=physics,biology,chemistry&type=html",
    type: "simulation",
    description:
      "Interactive HTML5 lab models for Ohm's law, energy transformations, cell structure, and chemical states. Perfect for interactive classroom demonstrations without physical lab equipment.",
    addedBy: "Mwalimu Ochieng",
    teacherRole: "Lead CBE Curriculum Facilitator",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Moi Forces Academy Science Faculty",
    addedAt: "2026-02-18",
    verified: true,
  },
  {
    id: "tl-geogebra-cbe",
    title: "GeoGebra Dynamic Geometry & Algebra Toolkit for CBE",
    subject: "Mathematics",
    gradeLevel: "Grade 9",
    cbeStage: "Junior School",
    url: "https://www.geogebra.org/geometry",
    type: "simulation",
    description:
      "Dynamic visual tool for teaching circle theorems, 3D coordinate geometry, transformations, and algebraic functions. Aligns directly with KJSEA Strand 2.",
    addedBy: "Mr. Kiprono",
    teacherRole: "Mathematics Dept Chair",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Kenya High Senior Campus",
    addedAt: "2026-02-20",
    verified: true,
  },
  {
    id: "tl-cemastea-stem",
    title: "CEMASTEA STEM Lesson Plans & Inquiry-Based Activities",
    subject: "Pre-Technical & STEM",
    gradeLevel: "Grade 8",
    cbeStage: "Junior School",
    url: "https://cemastea.ac.ke",
    type: "lesson-plan",
    description:
      "Inquiry-based STEM teaching guides, low-cost improvisation for science experiments, and computational thinking exercises for junior secondary learners.",
    addedBy: "Madam Wanjiku",
    teacherRole: "STEM Pedagogy Specialist",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    school: "CEMASTEA Demonstration Wing",
    addedAt: "2026-02-21",
    verified: true,
  },
  {
    id: "tl-kiswahili-sarufi",
    title: "Idhaa ya Kiswahili: Mwongozo wa Sarufi na Fasihi Simulizi",
    subject: "Kiswahili",
    gradeLevel: "Grade 6",
    cbeStage: "Upper Primary",
    url: "https://swahililanguage.org",
    type: "worksheet",
    description:
      "Jedwali kamilifu la ngeli za majina (A-WA, KI-VI, U-YA), viwakilishi, na sampuli za insha za maelezo zinazotii mtaala wa CBE.",
    addedBy: "Madam Akinyi",
    teacherRole: "Mwalimu wa Kiswahili",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Kisumu Model Primary School",
    addedAt: "2026-02-22",
    verified: true,
  },
  {
    id: "tl-playgroup-sensory",
    title: "Early Childhood Sensory & Environmental Play Activities",
    subject: "Creative Arts & Environmental",
    gradeLevel: "Playgroup",
    cbeStage: "Pre-Primary",
    url: "https://ecde-kenya.org/activities",
    type: "lesson-plan",
    description:
      "Interactive play activities, finger-painting prompts, texture exploration stations, and nursery rhyme sheets for Playgroup, PP1, and PP2 teachers.",
    addedBy: "Madam Akinyi",
    teacherRole: "ECDE Specialist",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Kilimani Pre-Primary Academy",
    addedAt: "2026-02-23",
    verified: true,
  },
  {
    id: "tl-senior-equilibrium",
    title: "Royal Society of Chemistry - Chemical Equilibrium Visualizer",
    subject: "Integrated Science",
    gradeLevel: "Grade 11",
    cbeStage: "Senior School",
    url: "https://edu.rsc.org/resources/chemical-equilibrium",
    type: "simulation",
    description:
      "Interactive models of Le Chatelier's principle, Haber-Bosch process simulations, and calculation worksheets for Senior School Chemistry pathways.",
    addedBy: "Mwalimu Ochieng",
    teacherRole: "Senior STEM Facilitator",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    school: "Kenya High Senior STEM Campus",
    addedAt: "2026-02-24",
    verified: true,
  },
];

export const getStoredTeachingLinks = (): TeachingLink[] => {
  const stored = localStorage.getItem("elimubridge_teaching_links");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return INITIAL_TEACHING_LINKS;
};

export const saveTeachingLinks = (links: TeachingLink[]): void => {
  localStorage.setItem("elimubridge_teaching_links", JSON.stringify(links));
};
