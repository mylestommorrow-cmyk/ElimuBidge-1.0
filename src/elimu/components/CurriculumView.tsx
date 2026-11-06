// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  Compass,
  Search,
  BookOpen,
  Award,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Layers,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Filter,
  ArrowRight,
} from "lucide-react";
import { OFFICIAL_CBE_STRUCTURE, CURRICULUM_DESIGNS } from "../data/curriculumDesigns";
import { CbeStage, CbeGrade, SeniorSchoolPathway, CurriculumDesignItem } from "../types";

interface CurriculumViewProps {
  onSelectTopic?: (learningArea: string, grade: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onSelectTopic }) => {
  // Navigation drill-down state
  const [selectedStage, setSelectedStage] = useState<CbeStage>("Junior School");
  const [selectedGrade, setSelectedGrade] = useState<CbeGrade>("Grade 8");
  const [selectedPathway, setSelectedPathway] = useState<SeniorSchoolPathway>("STEM");
  const [selectedLearningAreaId, setSelectedLearningAreaId] = useState<string>("js-pretech");
  const [searchQuery, setSearchQuery] = useState("");

  // Active level data
  const currentLevelStructure = useMemo(() => {
    return (
      OFFICIAL_CBE_STRUCTURE.find((l) => l.stage === selectedStage) || OFFICIAL_CBE_STRUCTURE[3]
    );
  }, [selectedStage]);

  // Ensure selected grade belongs to current stage
  const currentGrade = useMemo(() => {
    if (currentLevelStructure.officialGrades.includes(selectedGrade)) {
      return selectedGrade;
    }
    return currentLevelStructure.officialGrades[0];
  }, [currentLevelStructure, selectedGrade]);

  // Learning areas for current stage (and pathway if Senior School)
  const availableLearningAreas = useMemo(() => {
    if (selectedStage === "Senior School") {
      return currentLevelStructure.officialLearningAreas.filter(
        (la) => !la.pathway || la.pathway === selectedPathway,
      );
    }
    return currentLevelStructure.officialLearningAreas;
  }, [currentLevelStructure, selectedStage, selectedPathway]);

  // Currently active learning area
  const activeLearningArea = useMemo(() => {
    const found = availableLearningAreas.find((la) => la.id === selectedLearningAreaId);
    return found || availableLearningAreas[0];
  }, [availableLearningAreas, selectedLearningAreaId]);

  // Find curriculum design specifications (strands, sub-strands, competencies)
  const activeCurriculumDesign = useMemo(() => {
    // Exact grade + learning area match
    let match = CURRICULUM_DESIGNS.find(
      (cd: CurriculumDesignItem) =>
        cd.grade === currentGrade &&
        cd.learningArea.toLowerCase().includes(activeLearningArea.name.toLowerCase().split(" ")[0]),
    );
    if (!match) {
      // Stage level fallback match
      match = CURRICULUM_DESIGNS.find((cd: CurriculumDesignItem) => cd.stage === selectedStage);
    }
    return match;
  }, [currentGrade, activeLearningArea, selectedStage]);

  // Global search across all curriculum designs, strands, outcomes, competencies
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return null;
    const query = searchQuery.toLowerCase().trim();

    const results: {
      item: CurriculumDesignItem;
      matchedStrandTitle: string;
      matchedText: string;
      matchType: "strand" | "competency" | "outcome";
    }[] = [];

    for (const cd of CURRICULUM_DESIGNS) {
      for (const strand of cd.strands) {
        if (strand.title.toLowerCase().includes(query)) {
          results.push({
            item: cd,
            matchedStrandTitle: strand.title,
            matchedText: strand.title,
            matchType: "strand",
          });
          continue;
        }
        const foundOutcome = strand.sampleLearningOutcomes.find((o: string) =>
          o.toLowerCase().includes(query),
        );
        if (foundOutcome) {
          results.push({
            item: cd,
            matchedStrandTitle: strand.title,
            matchedText: foundOutcome,
            matchType: "outcome",
          });
          continue;
        }
        const foundComp = strand.coreCompetencies.find((c: string) =>
          c.toLowerCase().includes(query),
        );
        if (foundComp) {
          results.push({
            item: cd,
            matchedStrandTitle: strand.title,
            matchedText: foundComp,
            matchType: "competency",
          });
        }
      }
    }
    return results;
  }, [searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              Official 2-6-3-3 CBE Structure & Rationalised Curriculum
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              KICD Curriculum Designs & Competency Standards
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Explore the rationalised learning area caps: 5 in Pre-Primary, 7 in Lower Primary, 8
              in Upper Primary, 9 core areas in Junior School (Grades 7–9), and Senior School
              (Grades 10–12 launched Jan 2026) across STEM, Social Sciences, and Arts pathways.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-xs text-blue-200 self-start md:self-auto">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>KICD Designs Verified with KNEC CBA Rubrics</span>
          </div>
        </div>
      </div>

      {/* Global Curriculum Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search curriculum by competency (e.g. 'critical thinking'), strand, outcome, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Results Display (if active) */}
      {searchResults !== null && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              Found {searchResults.length} matching curriculum design standards for "{searchQuery}"
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No matching strands or competencies found. Try searching for "algebra", "soil",
              "micro-organism", "coding", or "constitution".
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {res.item.grade} • {res.item.learningArea}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-medium capitalize">
                      {res.matchType}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    {res.matchedStrandTitle}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs italic">
                    "{res.matchedText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level Navigation Tabs (Pre-Primary, Lower Primary, Upper Primary, Junior School, Senior School, Early Years) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {OFFICIAL_CBE_STRUCTURE.map((lvl) => {
          const isActive = selectedStage === lvl.stage;
          return (
            <button
              key={lvl.stage}
              onClick={() => {
                setSelectedStage(lvl.stage);
                setSelectedGrade(lvl.officialGrades[0]);
                setSelectedLearningAreaId(lvl.officialLearningAreas[0].id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>{lvl.stage}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-blue-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
              >
                {lvl.learningAreaCap} Areas
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage Details Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {currentLevelStructure.years} {currentLevelStructure.years === 1 ? "Year" : "Years"}{" "}
              Cycle • Cap: {currentLevelStructure.learningAreaCap} Learning Areas
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {currentLevelStructure.label}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {currentLevelStructure.description}
            </p>
          </div>

          {/* Grade Selector Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 mr-1">Grade:</span>
            {currentLevelStructure.officialGrades.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  currentGrade === g
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Senior School Pathway Selector (if Senior School active) */}
        {selectedStage === "Senior School" && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Senior School Pathway Selector (Grades 10–12 Live Jan 2026)
                </span>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                  Learners take core subjects + 3 electives (at least 2 in pathway). STEM takes{" "}
                  <strong>Core Mathematics</strong>; others take{" "}
                  <strong>Essential Mathematics</strong>.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
                {(
                  ["STEM", "Social Sciences", "Arts & Sports Science"] as SeniorSchoolPathway[]
                ).map((pw) => (
                  <button
                    key={pw}
                    onClick={() => {
                      setSelectedPathway(pw);
                      const firstPwArea = currentLevelStructure.officialLearningAreas.find(
                        (la) => !la.pathway || la.pathway === pw,
                      );
                      if (firstPwArea) setSelectedLearningAreaId(firstPwArea.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      selectedPathway === pw
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Explorer: Left (Subject List) & Right (Strands & Competencies) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Learning Areas List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rationalised Learning Areas ({availableLearningAreas.length})
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              KICD Design Cap
            </span>
          </div>

          <div className="space-y-1.5">
            {availableLearningAreas.map((la) => {
              const isSelected = activeLearningArea.id === la.id;
              return (
                <button
                  key={la.id}
                  onClick={() => setSelectedLearningAreaId(la.id)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between group text-xs ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-bold shadow-xs"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="line-clamp-1">{la.name}</span>
                      {la.isCore && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                          Core
                        </span>
                      )}
                    </div>
                    {la.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-normal line-clamp-1">
                        {la.notes}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400 translate-x-0.5"
                        : "text-slate-300 dark:text-slate-600 group-hover:text-slate-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Strands, Competencies, and Sample Outcomes */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Area Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {currentGrade}
                  </span>
                  {selectedStage === "Senior School" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      {selectedPathway} Pathway
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                  {activeLearningArea.name}
                </h3>
              </div>

              {onSelectTopic && (
                <button
                  onClick={() => onSelectTopic(activeLearningArea.name, currentGrade)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View Lessons for Subject
                </button>
              )}
            </div>

            {activeLearningArea.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                {activeLearningArea.notes}
              </p>
            )}
          </div>

          {/* Curriculum Design Strands */}
          {activeCurriculumDesign ? (
            <div className="space-y-4">
              {activeCurriculumDesign.strands.map(
                (strand: CurriculumDesignItem["strands"][number], sIdx: number) => (
                  <div
                    key={sIdx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
                  >
                    {/* Strand Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Strand {sIdx + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {strand.title}
                        </h4>
                      </div>

                      {strand.isKicdVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          KICD Verified Design
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Verify with KICD
                        </span>
                      )}
                    </div>

                    {/* Sub-Strands */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Sub-Strands / Scope:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {strand.subStrands.map((sub: string, subIdx: number) => (
                          <span
                            key={subIdx}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                          >
                            • {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Competencies */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Target Core Competencies:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {strand.coreCompetencies.map((comp: string, cIdx: number) => (
                          <span
                            key={cIdx}
                            className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sample Learning Outcomes */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                        Sample Specific Learning Outcomes:
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {strand.sampleLearningOutcomes.map((outcome: string, oIdx: number) => (
                          <li key={oIdx} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>
                              By the end of the sub-strand, the learner should be able to:{" "}
                              <strong>{outcome}</strong>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {strand.verificationNote && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                        Note: {strand.verificationNote}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                KICD Design Specification Active
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Detailed strand breakdown for {activeLearningArea.name} ({currentGrade}) is mapped
                in accordance with the official KICD Competency Based Curriculum guidelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
