// @ts-nocheck -- imported code, original project was not type-checked strictly
import { LearnerProfile } from "../types";

export const AVATAR_PRESETS = [
  {
    name: "Amina (Student - JSS)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Student",
  },
  {
    name: "Kevin (Student - Primary)",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Student",
  },
  {
    name: "Brenda (Student - Senior STEM)",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Student",
  },
  {
    name: "Brian (Student - Junior Tech)",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Student",
  },
  {
    name: "Mwalimu Ochieng (Teacher - STEM)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Teacher",
  },
  {
    name: "Madam Wanjiku (Teacher - English/Arts)",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Teacher",
  },
  {
    name: "Mr. Kiprono (Teacher - Math & Tech)",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Teacher",
  },
  {
    name: "Madam Akinyi (Teacher - Pre-Primary)",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    role: "Teacher",
  },
];

export const INITIAL_PROFILES: LearnerProfile[] = [
  {
    id: "profile-amina",
    regNo: "EB-CBE-2026-0842",
    academicStanding: "Dean's List · Exemplary Standing",
    gpa: "3.92 / 4.00",
    name: "Amina Cherono",
    grade: "Grade 8",
    level: "CBE",
    schoolName: "Moi Forces Junior School Academy, Nairobi",
    avatarColor: "bg-[#002B49]",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    role: "learner",
    completedTopicsCount: 16,
    quizzesTaken: 21,
    averageScore: 92,
    streakDays: 5,
    tokensBalance: 450,
    unlockedBadgeIds: [
      "badge-streak-3",
      "badge-quiz-ace",
      "badge-quiz-veteran",
      "badge-high-accuracy",
    ],
    weakAreas: ["Microscopy Magnifications", "Ngeli za U-YA", "Series Circuits"],
    recentQuizScores: [
      { quizTitle: "Human Digestion & Enzymes", score: 4, total: 4, date: "Yesterday" },
      { quizTitle: "Jaribio la Sarufi: Ngeli", score: 2, total: 2, date: "2 days ago" },
      { quizTitle: "Simple Machines & Circuits", score: 3, total: 3, date: "4 days ago" },
    ],
  },
  {
    id: "profile-kevin",
    regNo: "EB-CBE-2026-1402",
    academicStanding: "Exceeding Expectations · KPSEA Track",
    gpa: "3.85 / 4.00",
    name: "Kevin Mwangi",
    grade: "Grade 4",
    level: "CBE",
    schoolName: "Nyeri Hill Model Demonstration Primary",
    avatarColor: "bg-[#004A7C]",
    avatarUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&h=300&q=80",
    role: "learner",
    completedTopicsCount: 12,
    quizzesTaken: 15,
    averageScore: 89,
    streakDays: 7,
    tokensBalance: 380,
    unlockedBadgeIds: ["badge-streak-3", "badge-streak-7", "badge-quiz-ace"],
    weakAreas: ["Condensation Experiments", "Fractions on Number Line"],
    recentQuizScores: [
      { quizTitle: "States of Matter & Phase Changes", score: 3, total: 3, date: "Today" },
      { quizTitle: "Ufahamu wa Mazingira na Miti", score: 3, total: 3, date: "2 days ago" },
      { quizTitle: "Domestic & Wild Animals", score: 3, total: 3, date: "5 days ago" },
    ],
  },
  {
    id: "profile-brenda",
    regNo: "EB-CBE-2026-3108",
    academicStanding: "Senior School Honors · STEM Pathway",
    gpa: "3.96 / 4.00",
    name: "Brenda Akinyi",
    grade: "Grade 11",
    level: "CBE",
    schoolName: "Kenya High School Senior STEM Campus",
    avatarColor: "bg-[#B87B00]",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80",
    role: "learner",
    completedTopicsCount: 24,
    quizzesTaken: 34,
    averageScore: 94,
    streakDays: 12,
    tokensBalance: 720,
    unlockedBadgeIds: [
      "badge-streak-3",
      "badge-streak-7",
      "badge-quiz-ace",
      "badge-quiz-veteran",
      "badge-high-accuracy",
    ],
    weakAreas: ["Chemical Equilibrium Kc Expressions", "Kinematics Equations Proofs"],
    recentQuizScores: [
      { quizTitle: "Chemical Equilibrium & Le Chatelier", score: 2, total: 2, date: "Today" },
      { quizTitle: "Kinematics & Newton’s Laws", score: 3, total: 3, date: "Yesterday" },
      { quizTitle: "Circle Theorems & Geometry", score: 2, total: 2, date: "3 days ago" },
    ],
  },
];
