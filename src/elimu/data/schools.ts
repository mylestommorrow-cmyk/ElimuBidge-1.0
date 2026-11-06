// @ts-nocheck -- imported code, original project was not type-checked strictly
import { SchoolAccount } from "../types";

export const INITIAL_SCHOOLS: SchoolAccount[] = [
  {
    id: "school-demo",
    code: "DEMO-CBE",
    name: "National CBE Demonstration Academy",
    county: "Nairobi County",
    motto: "Elimumwanga · Competence for Future Innovation",
    badgeColor: "from-[#002B49] to-[#004A7C]",
    logoEmoji: "🇰🇪",
    principalName: "Dr. Margaret Muthoni",
    teacherPin: "2026",
    adminPin: "9900",
    cbeStreams: ["Pre-Primary", "Lower Primary", "Upper Primary", "Junior School", "Senior School"],
    registeredLearnersCount: 1240,
    notesCount: 28,
  },
  {
    id: "school-alliance",
    code: "ALLIANCE-101",
    name: "Alliance Model Senior & Junior Campus",
    county: "Kiambu County",
    motto: "Strong to Serve · Exceeding Expectations",
    badgeColor: "from-[#004A7C] to-[#1E3A8A]",
    logoEmoji: "🏛️",
    principalName: "Mr. David Kiprono",
    teacherPin: "2026",
    adminPin: "9900",
    cbeStreams: ["Junior School (G7-9)", "Senior School STEM (G10-12)"],
    registeredLearnersCount: 1680,
    notesCount: 34,
  },
  {
    id: "school-kenyahigh",
    code: "KHS-2026",
    name: "Kenya High School Senior STEM Wing",
    county: "Nairobi County",
    motto: "Servire Est Regnare · Women in STEM & Tech",
    badgeColor: "from-[#B87B00] to-[#D97706]",
    logoEmoji: "⭐",
    principalName: "Madam Brenda Karimi",
    teacherPin: "2026",
    adminPin: "9900",
    cbeStreams: ["Senior School Pure Sciences", "Senior Applied Tech & Arts"],
    registeredLearnersCount: 1420,
    notesCount: 42,
  },
  {
    id: "school-moi",
    code: "MFA-7701",
    name: "Moi Forces Junior School Academy",
    county: "Nairobi County",
    motto: "Duty, Discipline & Academic Excellence",
    badgeColor: "from-[#065F46] to-[#047857]",
    logoEmoji: "🛡️",
    principalName: "Mwalimu James Ochieng",
    teacherPin: "2026",
    adminPin: "9900",
    cbeStreams: ["Upper Primary (G4-6)", "Junior Secondary (G7-9)"],
    registeredLearnersCount: 980,
    notesCount: 25,
  },
  {
    id: "school-kisumu",
    code: "LAKESIDE-42",
    name: "Kisumu Central Model CBE Demonstration School",
    county: "Kisumu County",
    motto: "Rise and Shine by the Lake · Tech First",
    badgeColor: "from-[#0E7490] to-[#0891B2]",
    logoEmoji: "🌊",
    principalName: "Madam Grace Akinyi",
    teacherPin: "2026",
    adminPin: "9900",
    cbeStreams: ["PP1-2", "Lower Primary (G1-3)", "Upper Primary (G4-6)"],
    registeredLearnersCount: 860,
    notesCount: 19,
  },
  {
    id: "school-nyeri",
    code: "NYERI-HILL-08",
    name: "Nyeri Hill Model Demonstration Primary & JSS",
    county: "Nyeri County",
    motto: "Cultivating Inquisitive Minds",
    badgeColor: "from-[#7C3AED] to-[#6D28D9]",
    logoEmoji: "🏔️",
    principalName: "Mr. Patrick Mwangi",
    teacherPin: "2026",
    adminPin: "9900",
    cbeStreams: ["Lower Primary (G1-3)", "Upper Primary (G4-6)", "Junior School (G7-8)"],
    registeredLearnersCount: 740,
    notesCount: 16,
  },
];

export const getStoredSchools = (): SchoolAccount[] => {
  const stored = localStorage.getItem("elimubridge_schools");
  if (stored) {
    try {
      const parsed: SchoolAccount[] = JSON.parse(stored);
      // Migrate missing teacherPin
      return parsed.map((s) => ({
        ...s,
        teacherPin: s.teacherPin || "2026",
      }));
    } catch {
      // Fallback
    }
  }
  return INITIAL_SCHOOLS;
};

export const saveSchools = (schools: SchoolAccount[]): void => {
  localStorage.setItem("elimubridge_schools", JSON.stringify(schools));
};

export const getActiveSchoolCode = (): string => {
  return localStorage.getItem("elimubridge_active_school_code") || "DEMO-CBE";
};

export const setActiveSchoolCode = (code: string): void => {
  localStorage.setItem("elimubridge_active_school_code", code.toUpperCase().trim());
};

export const findSchoolByCode = (
  code: string,
  schools: SchoolAccount[] = INITIAL_SCHOOLS,
): SchoolAccount | undefined => {
  const sanitized = code.toUpperCase().trim();
  return schools.find((s) => s.code.toUpperCase() === sanitized);
};
