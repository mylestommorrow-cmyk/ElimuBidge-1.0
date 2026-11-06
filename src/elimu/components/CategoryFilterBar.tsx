// @ts-nocheck -- imported code, original project was not type-checked strictly
import React from "react";
import { SubjectCategory, CbeStage, CbeGrade } from "../types";
import { Filter, Check, ArrowDownToLine, GraduationCap, Sparkles } from "lucide-react";

interface CategoryFilterBarProps {
  selectedCategory: SubjectCategory;
  onSelectCategory: (category: SubjectCategory) => void;
  selectedStage: CbeStage;
  onSelectStage: (stage: CbeStage) => void;
  selectedGrade: CbeGrade;
  onSelectGrade: (grade: CbeGrade) => void;
  onlyOffline: boolean;
  onToggleOnlyOffline: () => void;
  totalCoursesCount: number;
  selectedPathway?: "All" | "STEM" | "Social Sciences" | "Arts & Sports Science";
  onSelectPathway?: (pathway: "All" | "STEM" | "Social Sciences" | "Arts & Sports Science") => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStage,
  onSelectStage,
  selectedGrade,
  onSelectGrade,
  onlyOffline,
  onToggleOnlyOffline,
  totalCoursesCount,
  selectedPathway = "All",
  onSelectPathway,
}) => {
  const categories: SubjectCategory[] = [
    "All",
    "Mathematics",
    "Integrated Science",
    "English",
    "Kiswahili",
    "Agriculture",
    "Pre-Technical & STEM",
    "Creative Arts & Environmental",
    "Social Studies",
  ];

  const stages: { id: CbeStage; label: string; badge: string }[] = [
    { id: "All", label: "All Stages", badge: "PP1–G12" },
    { id: "Pre-Primary", label: "Pre-Primary", badge: "PP1, PP2 (5 Areas)" },
    { id: "Lower Primary", label: "Lower Primary", badge: "Grades 1–3 (7 Areas)" },
    { id: "Upper Primary", label: "Upper Primary", badge: "Grades 4–6 (8 Areas)" },
    { id: "Junior School", label: "Junior School", badge: "Grades 7–9 (9 Areas)" },
    { id: "Senior School", label: "Senior School", badge: "Grades 10–12 (Live 2026)" },
    { id: "Early Years", label: "Early Years (Non-KICD)", badge: "Playgroup" },
  ];

  const allGrades: CbeGrade[] = [
    "All",
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
    "Playgroup",
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Tier 1: CBE Curriculum Stage Selector & Offline vault toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#002B49] mr-1 shrink-0 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#F2A900]" />
              <span>CBE Stage:</span>
            </div>
            {stages.map((stg) => {
              const active = selectedStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    onSelectStage(stg.id);
                    // Reset grade if switching stage
                    if (stg.id !== "All" && selectedGrade !== "All") {
                      onSelectGrade("All");
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-[#002B49] text-white shadow-xs border border-[#002B49]"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-transparent"
                  }`}
                >
                  <span>{stg.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      active ? "bg-white/20 text-[#F2A900]" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {stg.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Offline only toggle + Result count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0">
            <button
              onClick={onToggleOnlyOffline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                onlyOffline
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600" />
              <span>Offline Ready</span>
              {onlyOffline && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-900 tabular-nums">{totalCoursesCount}</span> CBE
              units
            </span>
          </div>
        </div>

        {/* Tier 2: Granular Grade Level Selector (Playgroup to Grade 12) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar bg-slate-50 p-2 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 mr-1 shrink-0 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Select Grade:</span>
          </div>
          {allGrades.map((grd) => {
            const isSelected = selectedGrade === grd;
            return (
              <button
                key={grd}
                onClick={() => {
                  onSelectGrade(grd);
                  // Reset stage to All if user picked specific grade from different stage
                  if (grd !== "All") {
                    onSelectStage("All");
                  }
                }}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 font-medium cursor-pointer ${
                  isSelected
                    ? "bg-[#F2A900] text-[#002B49] font-bold shadow-xs border border-amber-500"
                    : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {grd}
              </button>
            );
          })}
        </div>

        {/* Tier 2B: Senior School Pathway Selector (shown for Senior School or G10-G12) */}
        {(selectedStage === "Senior School" ||
          ["Grade 10", "Grade 11", "Grade 12"].includes(selectedGrade)) &&
          onSelectPathway && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar bg-indigo-50/70 p-2 rounded-xl border border-indigo-200/60">
              <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-900 mr-1 shrink-0 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Senior Pathway (Jan 2026 Live):</span>
              </div>
              {(["All", "STEM", "Social Sciences", "Arts & Sports Science"] as const).map((pw) => {
                const isSelected = selectedPathway === pw;
                return (
                  <button
                    key={pw}
                    onClick={() => onSelectPathway(pw)}
                    className={`px-3 py-1 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 font-bold cursor-pointer ${
                      isSelected
                        ? "bg-indigo-700 text-white shadow-xs"
                        : "bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200"
                    }`}
                  >
                    {pw}
                  </button>
                );
              })}
              <span className="text-[10px] text-indigo-700 italic hidden sm:inline ml-auto">
                STEM: Core Maths • Social/Arts: Essential Maths
              </span>
            </div>
          )}

        {/* Tier 3: Subject Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Learning Area:</span>
          </div>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#002B49] text-white shadow-xs border-b-2 border-[#F2A900] font-bold"
                    : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
