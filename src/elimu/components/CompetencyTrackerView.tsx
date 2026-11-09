// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  Plus,
  BookOpen,
  Compass,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  LearnerProfile,
  CompetencyLevel,
  AssessmentRubricBand,
  LearnerCompetencyEvaluation,
} from "../types";
import {
  getLearnerCompetencies,
  getCompetencySummary,
  evaluateCompetency,
} from "../data/competencyStorage";

interface CompetencyTrackerViewProps {
  activeProfile: LearnerProfile;
  onAskAITutor: (prompt: string, subject: string) => void;
}

export const CompetencyTrackerView: React.FC<CompetencyTrackerViewProps> = ({
  activeProfile,
  onAskAITutor,
}) => {
  const [competencies, setCompetencies] = useState(() =>
    getLearnerCompetencies(activeProfile.id || "demo-learner-1"),
  );

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  // Evaluation modal (for teachers or self-assessment reflection)
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalOutcomeCode, setEvalOutcomeCode] = useState("G8.SCI.1.1");
  const [evalOutcomeTitle, setEvalOutcomeTitle] = useState(
    "Prepare temporary wet mount slides and observe under a microscope",
  );
  const [evalSubject, setEvalSubject] = useState("Integrated Science");
  const [evalStatus, setEvalStatus] = useState<CompetencyLevel>("demonstrated");
  const [evalEvidence, setEvalEvidence] = useState("");
  const [evalRubricBand, setGradeRubricBand] =
    useState<AssessmentRubricBand>("Meeting Expectations");

  const summary = useMemo(() => {
    const total = competencies.length;
    const demonstrated = competencies.filter((c) => c.status === "demonstrated").length;
    const practised = competencies.filter((c) => c.status === "practised").length;
    const introduced = competencies.filter((c) => c.status === "introduced").length;
    const requiresSupport = competencies.filter((c) => c.status === "requires_support").length;

    return {
      total,
      demonstrated,
      practised,
      introduced,
      requiresSupport,
      pctDemonstrated: total > 0 ? Math.round((demonstrated / total) * 100) : 0,
    };
  }, [competencies]);

  const filteredCompetencies = useMemo(() => {
    return competencies.filter((item) => {
      if (selectedStatus !== "All" && item.status !== selectedStatus) return false;
      if (selectedSubject !== "All" && item.learningArea !== selectedSubject) return false;
      return true;
    });
  }, [competencies, selectedStatus, selectedSubject]);

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    evaluateCompetency({
      learnerId: activeProfile.id || "demo-learner-1",
      outcomeCode: evalOutcomeCode,
      outcomeTitle: evalOutcomeTitle,
      learningArea: evalSubject,
      gradeLevel: activeProfile.grade || "Grade 8",
      cbeStage: "Junior School",
      status: evalStatus,
      evidenceNotes: evalEvidence.trim() || "Competency evaluated in classroom session.",
      evaluatedBy: "Senior Subject Facilitator",
      evaluatedAt: new Date().toISOString().slice(0, 10),
      rubricBand: evalRubricBand,
    });

    setCompetencies(getLearnerCompetencies(activeProfile.id || "demo-learner-1"));
    setEvalModalOpen(false);
    setEvalEvidence("");
  };

  const getStatusBadge = (status: CompetencyLevel) => {
    switch (status) {
      case "demonstrated":
        return {
          label: "Demonstrated (Mastery)",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
        };
      case "practised":
        return {
          label: "Practised (Developing)",
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          icon: TrendingUp,
        };
      case "introduced":
        return {
          label: "Introduced (Foundational)",
          bg: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Clock,
        };
      case "requires_support":
        return {
          label: "Requires Support (Remedial)",
          bg: "bg-rose-100 text-rose-800 border-rose-200",
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#002B49] text-white">
              CBE Competency-Based Assessment
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Learner: {activeProfile.name} ({activeProfile.grade})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Competency Progression Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time tracking across KICD Specific Learning Outcomes (SLOs) — moving beyond simple
            percentages to evidence-based mastery.
          </p>
        </div>

        <button
          onClick={() => setEvalModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#F2A900]" />
          Record Observation / Evaluation
        </button>
      </div>

      {/* 4 CBE Mastery Progression Pillars Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Demonstrated */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase">3. Demonstrated</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900">{summary.demonstrated}</p>
          <p className="text-[11px] text-emerald-700 font-medium">
            Meeting / Exceeding KICD outcomes independently.
          </p>
        </div>

        {/* Practised */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase">2. Practised</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-900">{summary.practised}</p>
          <p className="text-[11px] text-blue-700 font-medium">
            Developing skills through structured exercises.
          </p>
        </div>

        {/* Introduced */}
        <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 uppercase">1. Introduced</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-900">{summary.introduced}</p>
          <p className="text-[11px] text-purple-700 font-medium">
            Concept newly covered in syllabus.
          </p>
        </div>

        {/* Requires Support */}
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase">4. Needs Support</span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-900">{summary.requiresSupport}</p>
          <p className="text-[11px] text-rose-700 font-medium">
            Targeted for teacher remedial assistance.
          </p>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Overall Competency Demonstration Rate</span>
          <span className="text-emerald-700 font-black">
            {summary.pctDemonstrated}% Demonstrated
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(summary.demonstrated / (summary.total || 1)) * 100}%` }}
            className="bg-emerald-500 h-full"
            title="Demonstrated"
          />
          <div
            style={{ width: `${(summary.practised / (summary.total || 1)) * 100}%` }}
            className="bg-blue-500 h-full"
            title="Practised"
          />
          <div
            style={{ width: `${(summary.introduced / (summary.total || 1)) * 100}%` }}
            className="bg-purple-400 h-full"
            title="Introduced"
          />
          <div
            style={{ width: `${(summary.requiresSupport / (summary.total || 1)) * 100}%` }}
            className="bg-rose-400 h-full"
            title="Needs Support"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Demonstrated
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Practised
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Introduced
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Needs Support
          </span>
        </div>
      </div>

      {/* 7 KICD Core Competencies Radar & Rubric Bands (EE, ME, AE, BE) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#002B49]" />7 KICD Core Competencies & Rubric
              Progress Radar
            </h2>
            <p className="text-xs text-slate-500">
              Assessed against national standards: EE (Exceeding), ME (Meeting), AE (Approaching),
              BE (Below Expectations)
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              EE: Exceeding
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">ME: Meeting</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              AE: Approaching
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">BE: Below</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              name: "Critical Thinking & Problem Solving",
              icon: "🧠",
              band: "EE",
              score: 92,
              strand: "Scientific Inquiry & Algebra",
            },
            {
              name: "Communication & Collaboration",
              icon: "🗣️",
              band: "ME",
              score: 78,
              strand: "Functional Writing & Group Tasks",
            },
            {
              name: "Digital Literacy",
              icon: "💻",
              band: "EE",
              score: 88,
              strand: "Computer Science & Virtual Labs",
            },
            {
              name: "Self-Efficacy",
              icon: "⭐",
              band: "ME",
              score: 75,
              strand: "Independent Study & Homework",
            },
            {
              name: "Creativity & Imagination",
              icon: "🎨",
              band: "ME",
              score: 82,
              strand: "Visual Arts & Model Design",
            },
            {
              name: "Citizenship & National Values",
              icon: "🇰🇪",
              band: "EE",
              score: 90,
              strand: "Social Studies & Community Service",
            },
            {
              name: "Learning to Learn",
              icon: "📚",
              band: "ME",
              score: 80,
              strand: "Revision Quizzes & Meta-cognition",
            },
          ].map((comp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:shadow-xs transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{comp.icon}</span>
                  <span className="truncate max-w-[180px]">{comp.name}</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    comp.band === "EE"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : comp.band === "ME"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : comp.band === "AE"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {comp.band}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${comp.score >= 80 ? "bg-emerald-500" : "bg-blue-500"}`}
                  style={{ width: `${comp.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{comp.strand}</span>
                <span className="font-bold text-slate-700">{comp.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competencies List & Filter Bar */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700">Filter Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="All">All Mastery Levels</option>
              <option value="demonstrated">Demonstrated</option>
              <option value="practised">Practised</option>
              <option value="introduced">Introduced</option>
              <option value="requires_support">Needs Support</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700">Learning Area:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="All">All Learning Areas</option>
              <option value="Integrated Science">Integrated Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Kiswahili">Kiswahili</option>
              <option value="Agriculture">Agriculture</option>
            </select>
          </div>
        </div>

        {/* Competency Outcome Cards */}
        {filteredCompetencies.length > 0 ? (
          <div className="space-y-3">
            {filteredCompetencies.map((comp) => {
              const statusInfo = getStatusBadge(comp.status);
              const IconComp = statusInfo.icon;
              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#F2A900] transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-800">
                          {comp.outcomeCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {comp.learningArea} · {comp.gradeLevel}
                        </span>
                        {comp.rubricBand && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#002B49] text-white">
                            {comp.rubricBand}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{comp.outcomeTitle}</h3>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 shrink-0 ${statusInfo.bg}`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                  </div>

                  {comp.evidenceNotes && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Teacher Evidence Note:</span>
                      <p className="italic leading-relaxed">“{comp.evidenceNotes}”</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        Evaluated by {comp.evaluatedBy} on {comp.evaluatedAt}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() =>
                        onAskAITutor(
                          `Explain and give practice questions for learning outcome: ${comp.outcomeCode} - ${comp.outcomeTitle}`,
                          comp.learningArea,
                        )
                      }
                      className="text-xs font-bold text-[#002B49] hover:text-[#F2A900] flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                      Practice with Mwalimu AI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-xs text-slate-500">
            No competency evaluations matching selected filters.
          </div>
        )}
      </div>

      {/* Record Observation Modal */}
      {evalModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Record Competency Observation</h3>
              <button
                onClick={() => setEvalModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Outcome Code</label>
                  <input
                    type="text"
                    required
                    value={evalOutcomeCode}
                    onChange={(e) => setEvalOutcomeCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Learning Area</label>
                  <select
                    value={evalSubject}
                    onChange={(e) => setEvalSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option>Integrated Science</option>
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Kiswahili</option>
                    <option>Agriculture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Specific Learning Outcome Description
                </label>
                <input
                  type="text"
                  required
                  value={evalOutcomeTitle}
                  onChange={(e) => setEvalOutcomeTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Competency Level</label>
                  <select
                    value={evalStatus}
                    onChange={(e) => setEvalStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="demonstrated">Demonstrated (Mastery)</option>
                    <option value="practised">Practised (Developing)</option>
                    <option value="introduced">Introduced (Foundational)</option>
                    <option value="requires_support">Requires Support</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Performance Band</label>
                  <select
                    value={evalRubricBand}
                    onChange={(e) => setGradeRubricBand(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option>Exceeding Expectations</option>
                    <option>Meeting Expectations</option>
                    <option>Approaching Expectations</option>
                    <option>Below Expectations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Qualitative Evidence / Teacher Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={evalEvidence}
                  onChange={(e) => setEvalEvidence(e.target.value)}
                  placeholder="Note specific observed behaviours, experiment outcomes, or problem-solving approaches..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEvalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002B49] text-white hover:bg-[#001E33] font-bold cursor-pointer"
                >
                  Save Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
