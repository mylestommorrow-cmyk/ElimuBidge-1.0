// @ts-nocheck -- imported code, original project was not type-checked strictly
import { Announcement } from "../types";

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    authorName: "Madam Wanjiku Njeri",
    authorRole: "Head of CBE Humanities & Languages",
    authorAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    schoolName: "Moi Forces Academy, Nairobi",
    title: "New Grade 8 Kiswahili Sarufi & Ngeli Study Guides Uploaded",
    content:
      "We have updated all revision modules for Grade 8 Kiswahili to include full classification drills for Ngeli za U-YA and A-WA. Please complete the continuous assessment test before Friday afternoon.",
    date: "Today, 08:30 AM",
    pinned: true,
    cbeTargetGrade: "Grade 8",
    category: "curriculum",
    teachingLink: {
      title: "Idhaa ya Kiswahili: Mwongozo wa Sarufi",
      url: "https://swahililanguage.org",
      type: "Worksheet",
    },
  },
  {
    id: "ann-2",
    authorName: "Mwalimu James Ochieng",
    authorRole: "Senior STEM Facilitator & KNEC Examiner",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    schoolName: "Kenya High School Campus",
    title: "Continuous Assessment Tests (CAT 1) Schedule for Week 6",
    content:
      "All Junior and Senior School learners (Grades 7 to 12) are advised to review the offline coursepacks for Integrated Science, Chemistry, and Mathematics. CAT 1 tests will contribute 40% towards the term portfolio score.",
    date: "Yesterday, 04:15 PM",
    pinned: true,
    cbeTargetGrade: "Grade 7 - 12",
    category: "exam",
    teachingLink: {
      title: "KNEC CBA Assessment Guidelines",
      url: "https://cba.knec.ac.ke",
      type: "Assessment Portal",
    },
  },
  {
    id: "ann-3",
    authorName: "Madam Grace Akinyi",
    authorRole: "Early Years & Pre-Primary Coordinator",
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    schoolName: "Kilimani Pre-Primary Demonstration School",
    title: "Sensory Play & Pre-Math Activities for Playgroup, PP1 & PP2",
    content:
      "Teachers and parents with learners in Playgroup, PP1, and PP2 can now download interactive color-matching, counting, and sensory exploration guides designed for low-data devices.",
    date: "2 days ago",
    pinned: false,
    cbeTargetGrade: "Playgroup to PP2",
    category: "resource",
    teachingLink: {
      title: "ECDE Kenya Activity Bank",
      url: "https://ecde-kenya.org/activities",
      type: "Lesson Plan",
    },
  },
  {
    id: "ann-4",
    authorName: "Mr. David Kiprono",
    authorRole: "Mathematics Dept Chair & Tech Coordinator",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    schoolName: "Alliance Model Campus",
    title: "Interactive GeoGebra Geometry Tools Added to Grade 9 Mathematics",
    content:
      "Learners struggling with circle theorems and 3D coordinate geometry can now open interactive geometric simulations directly from the Study Notes modal. Full offline formulas are also downloadable.",
    date: "3 days ago",
    pinned: false,
    cbeTargetGrade: "Grade 9",
    category: "resource",
    teachingLink: {
      title: "GeoGebra Dynamic Geometry Toolkit",
      url: "https://www.geogebra.org/geometry",
      type: "Simulation",
    },
  },
];

export const getStoredAnnouncements = (): Announcement[] => {
  const stored = localStorage.getItem("elimubridge_announcements");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return INITIAL_ANNOUNCEMENTS;
};

export const saveAnnouncements = (announcements: Announcement[]): void => {
  localStorage.setItem("elimubridge_announcements", JSON.stringify(announcements));
};
