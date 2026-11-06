// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  Link2,
  Plus,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Sparkles,
  School,
  Globe,
  Share2,
} from "lucide-react";
import { TeachingLink, SubjectCategory, CbeGrade } from "../types";

interface TeacherLinksViewProps {
  links: TeachingLink[];
  onOpenAddModal: () => void;
  selectedSubject?: string;
}

export const TeacherLinksView: React.FC<TeacherLinksViewProps> = ({
  links,
  onOpenAddModal,
  selectedSubject = "All",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>(selectedSubject);
  const [filterGrade, setFilterGrade] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      // Search
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.addedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.school && item.school.toLowerCase().includes(searchQuery.toLowerCase()));

      // Subject
      const matchesSubject =
        filterSubject === "All" || item.subject === "All" || item.subject === filterSubject;

      // Grade
      const matchesGrade =
        filterGrade === "All" ||
        item.gradeLevel === "All Grades" ||
        item.gradeLevel === filterGrade;

      // Type
      const matchesType = filterType === "All" || item.type === filterType;

      return matchesSearch && matchesSubject && matchesGrade && matchesType;
    });
  }, [links, searchQuery, filterSubject, filterGrade, filterType]);

  const subjectsList = [
    "All",
    "Mathematics",
    "Integrated Science",
    "English",
    "Kiswahili",
    "History",
    "Agriculture",
    "Pre-Technical & STEM",
    "Creative Arts & Environmental",
    "Social Studies",
  ];

  const gradesList = [
    "All",
    "Playgroup",
    "PP1",
    "PP2",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const getTypeBadge = (type: TeachingLink["type"]) => {
    switch (type) {
      case "curriculum":
        return { label: "Curriculum Syllabus", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "simulation":
        return {
          label: "Interactive Lab",
          color: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "lesson-plan":
        return {
          label: "Lesson Plan",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "video":
        return { label: "Video Demo", color: "bg-rose-100 text-rose-800 border-rose-200" };
      case "worksheet":
        return {
          label: "Worksheet & Exercises",
          color: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "assessment":
        return { label: "Assessment Rubric", color: "bg-cyan-100 text-cyan-800 border-cyan-200" };
      default:
        return {
          label: "Teaching Resource",
          color: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner with Teacher CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#002B49] via-[#00385F] to-[#004A7C] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-[#F2A900]">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2A900] text-[#002B49] text-xs font-black uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5 stroke-[3]" />
            <span>Teacher Resources & Subject Links Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            CBE Relevant Teaching Links & Pedagogy Repository
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
            Kenya curriculum guides, interactive laboratory simulations, lesson plans, and KNEC
            assessment rubrics contributed and verified by Kenyan teachers.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-[#F2A900] hover:bg-[#FFB81C] text-[#002B49] font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Teaching Link</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource title, teacher name, school, or syllabus concept..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Subjects" : s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            >
              {gradesList.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "All Grades (Playgroup to G12)" : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Resource Type Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">
            Resource Type:
          </span>
          {[
            "All",
            "lesson-plan",
            "simulation",
            "curriculum",
            "assessment",
            "worksheet",
            "video",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === t
                  ? "bg-[#002B49] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "All"
                ? "All Types"
                : t === "lesson-plan"
                  ? "Lesson Plans"
                  : t === "simulation"
                    ? "Simulations"
                    : t === "curriculum"
                      ? "Curriculum"
                      : t === "assessment"
                        ? "Assessments"
                        : t === "worksheet"
                          ? "Worksheets"
                          : "Videos"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Teaching Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLinks.map((link) => {
          const typeBadge = getTypeBadge(link.type);
          return (
            <div
              key={link.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#002B49] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}
                  >
                    {typeBadge.label}
                  </span>
                  <span className="text-[11px] font-mono text-[#002B49] bg-slate-100 px-2 py-0.5 rounded font-bold">
                    {link.gradeLevel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#002B49] transition-colors leading-snug">
                  {link.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {link.description}
                </p>

                {/* Subject Tag */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#F2A900]" />
                  <span>{link.subject}</span>
                </div>
              </div>

              {/* Footer: Teacher info and action button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  {link.avatarUrl ? (
                    <img
                      src={link.avatarUrl}
                      alt={link.addedBy}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#002B49] text-[#F2A900] flex items-center justify-center font-bold text-xs shrink-0">
                      {link.addedBy.charAt(0)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                      <span>{link.addedBy}</span>
                      {link.verified && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {link.school || link.teacherRole || "CBE Educator"}
                    </div>
                  </div>
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#F2A900]" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLinks.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Link2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Teaching Links Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or subject filters, or be the first teacher to submit a
            link for this grade!
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#002B49] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4 text-[#F2A900]" />
            <span>Add Teaching Link</span>
          </button>
        </div>
      )}
    </div>
  );
};
