// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import { LearningMarkdown } from "@/components/LearningMarkdown";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
  Share2,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DetailedQuizResult, LearnerProfile } from "../types";

interface QuizResultsViewProps {
  result: DetailedQuizResult;
  activeProfile: LearnerProfile;
  schoolName: string;
  onRetakeQuiz: () => void;
  onSelectAnotherQuiz: () => void;
  onAskAITutor: (prompt: string, subject: string) => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  result,
  activeProfile,
  schoolName,
  onRetakeQuiz,
  onSelectAnotherQuiz,
  onAskAITutor,
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "incorrect" | "correct">("all");
  const [copied, setCopied] = useState(false);

  const filteredQuestions = result.breakdown.filter((item) => {
    if (filterMode === "incorrect") return !item.isCorrect;
    if (filterMode === "correct") return item.isCorrect;
    return true;
  });

  const handleShareReport = () => {
    const text = `🏆 ElimuBridge Certified CBE CAT Results:\nStudent: ${result.learnerName} (${result.gradeLevel})\nSchool: ${schoolName} (Code: ${result.schoolCode})\nSubject: ${result.subject}\nScore: ${result.score} / ${result.totalQuestions} (${result.percentage}% - ${result.letterGrade})\nPerformance: ${result.performanceBand}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBandBadge = (band: DetailedQuizResult["performanceBand"]) => {
    switch (band) {
      case "Exceeding Expectations":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "Meeting Expectations":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Approaching Expectations":
        return "bg-amber-100 text-amber-900 border-amber-300";
      default:
        return "bg-rose-100 text-rose-900 border-rose-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Official Assessment Results Transcript Card */}
      <div className="bg-white rounded-3xl border-2 border-[#002B49] p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#002B49] via-[#F2A900] to-emerald-500" />

        {/* Header with School & Student Credentials */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#002B49] text-[#F2A900] flex items-center justify-center font-black text-xl border-2 border-[#F2A900] shadow-md shrink-0">
              <Award className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#002B49] text-[#F2A900]">
                  School Code: {result.schoolCode}
                </span>
                <span className="text-xs text-slate-500 font-medium">{schoolName}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#002B49] mt-1">
                Continuous Assessment Test (CAT) Scorecard
              </h1>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                <span className="font-bold text-slate-900">{result.learnerName}</span>
                <span>·</span>
                <span>{result.gradeLevel}</span>
                <span>·</span>
                <span className="text-[#002B49] font-semibold">{result.subject}</span>
                <span>·</span>
                <span className="font-mono text-slate-400">{result.date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShareReport}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#002B49]" />
              <span>{copied ? "Report Copied!" : "Share Transcript"}</span>
            </button>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Score (Question 1-30)
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#002B49] font-mono tabular-nums">
              {result.score} / {result.totalQuestions}
            </div>
            <div className="text-[10px] text-slate-500">Completed 30 Questions</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              CBE Percentage
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 font-mono tabular-nums">
              {result.percentage}%
            </div>
            <div className="text-[10px] font-bold text-amber-700 font-mono">
              Grade {result.letterGrade}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Accuracy Rating
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
              {result.percentage}%
            </div>
            <div className="text-[10px] text-emerald-800">
              {result.score} correct · {result.totalQuestions - result.score} to review
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-center space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              Time Elapsed
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#002B49] font-mono tabular-nums">
              {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
            </div>
            <div className="text-[10px] text-blue-800">Timed CAT Session</div>
          </div>
        </div>

        {/* KICD CBE Assessment Performance Rubric Band */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/40 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                Official KNEC Competency Level:
              </div>
              <div className="text-[11px] text-slate-500">
                Competence evaluation criteria aligned with CBC/CBE standards
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black border ${getBandBadge(result.performanceBand)}`}
          >
            {result.performanceBand}
          </span>
        </div>

        {/* Gemini AI Pedagogical Assessment Analysis */}
        {result.aiFeedback && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#002B49]">
              <Sparkles className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
              <span>Mwalimu study evaluation:</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-6">
              <LearningMarkdown>{result.aiFeedback}</LearningMarkdown>
            </div>
          </div>
        )}

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onRetakeQuiz}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#002B49] text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake 30-Question Drill</span>
            </button>

            <button
              onClick={onSelectAnotherQuiz}
              className="px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F2A900]" />
              <span>Select Another CBE Subject</span>
            </button>
          </div>

          <button
            onClick={() =>
              onAskAITutor(
                `Hello Mwalimu! I just finished the 30-question CAT on "${result.quizTitle}" scoring ${result.score}/30. Can you guide me through my missed areas?`,
                result.subject,
              )
            }
            className="px-4 py-2.5 rounded-xl bg-[#F2A900] hover:bg-[#FFB81C] text-[#002B49] text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#002B49]" />
            <span>Consult Mwalimu AI on Missed Questions</span>
          </button>
        </div>
      </div>

      {/* Item-by-Item 30 Questions Review Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-[#002B49] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#002B49]" />
              <span>Comprehensive 30 Questions Item Analysis</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review correct options, worked rationales, and curriculum references for each question
              from 1 to 30
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-[#002B49] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All 30 ({result.breakdown.length})
            </button>
            <button
              onClick={() => setFilterMode("incorrect")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === "incorrect"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Needs Review ({result.breakdown.filter((q) => !q.isCorrect).length})</span>
            </button>
            <button
              onClick={() => setFilterMode("correct")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === "correct"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Correct ({result.breakdown.filter((q) => q.isCorrect).length})</span>
            </button>
          </div>
        </div>

        {/* Question Review Accordion list */}
        <div className="space-y-3">
          {filteredQuestions.map((item) => {
            const isExpanded = expandedQuestion === item.questionNumber;
            return (
              <div
                key={item.questionNumber}
                className={`rounded-2xl border transition-all ${
                  item.isCorrect
                    ? "border-emerald-200 bg-white hover:border-emerald-300"
                    : "border-rose-200 bg-rose-50/30 hover:border-rose-300"
                }`}
              >
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : item.questionNumber)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 ${
                        item.isCorrect
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.questionNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                      {item.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.isCorrect ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Correct
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 border border-rose-200">
                        <XCircle className="w-3 h-3" /> Incorrect
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-2.5 text-xs animate-fade-in">
                    <div className="text-[11px] font-mono text-purple-700 font-semibold">
                      {item.curriculumRef}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Your choice:</span>
                        <span
                          className={`font-bold ${
                            item.isCorrect ? "text-emerald-700" : "text-rose-700 line-through"
                          }`}
                        >
                          Option {String.fromCharCode(65 + item.selectedOption)}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Correct answer:</span>
                          <span className="font-bold text-emerald-700">
                            Option {String.fromCharCode(65 + item.correctOption)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                      <div className="font-bold text-amber-900 mb-0.5">Syllabus Rationale:</div>
                      <p className="leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
