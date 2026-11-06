// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useMemo } from "react";
import { LearnerProfile } from "../types";
import { evaluateStudentBadges } from "../data/badges";
import { AchievementBadgesView } from "./AchievementBadgesView";
import {
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Coins,
  GraduationCap,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { DailyStudyGoalCard } from "./DailyStudyGoalCard";

interface ProgressTrackerViewProps {
  activeProfile: LearnerProfile;
  onOpenProfileModal: () => void;
  onTakeQuiz: (quizId?: string) => void;
  onAskAITutor: (prompt: string, subject: string) => void;
  offlineCount: number;
  studyStreak?: number;
  onLaunchGame?: () => void;
  onExploreCourses?: () => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  activeProfile,
  onOpenProfileModal,
  onTakeQuiz,
  onAskAITutor,
  offlineCount,
  studyStreak = 1,
  onLaunchGame,
  onExploreCourses,
}) => {
  // Dynamically evaluate badges and tokens for this learner
  const badgeEvaluation = useMemo(() => {
    return evaluateStudentBadges(activeProfile, offlineCount, studyStreak);
  }, [activeProfile, offlineCount, studyStreak]);

  // Convert percentage to university letter grade
  const getLetterGrade = (score: number) => {
    if (score >= 90)
      return {
        grade: "A",
        gpa: "4.00",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      };
    if (score >= 80)
      return {
        grade: "A-",
        gpa: "3.70",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      };
    if (score >= 75)
      return { grade: "B+", gpa: "3.30", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (score >= 70)
      return { grade: "B", gpa: "3.00", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (score >= 60)
      return { grade: "C+", gpa: "2.30", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { grade: "C", gpa: "2.00", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  const studentGpa = activeProfile.gpa || "3.88 / 4.00";
  const studentStanding = activeProfile.academicStanding || "Dean's List · Good Standing";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Official ELIMU BRIDGE Student Transcript & Record Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#002B49] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Navy & gold decorative header strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002B49] via-[#004A7C] to-[#F2A900]" />

        <div className="flex items-center gap-4 relative z-10 pt-1">
          {activeProfile.avatarUrl ? (
            <img
              src={activeProfile.avatarUrl}
              alt={activeProfile.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-[#F2A900] shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#002B49] text-[#F2A900] flex items-center justify-center font-black text-2xl border-2 border-[#F2A900] shadow-md shrink-0">
              {activeProfile.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#002B49]">
                {activeProfile.name}
              </h2>
              <span className="bg-[#002B49] text-[#F2A900] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-[#F2A900]/40">
                {activeProfile.regNo || "EB-CBE-2026-0842"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {activeProfile.grade} · {activeProfile.schoolName}
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {studentStanding}
              </span>
              <span>·</span>
              <span className="font-mono text-slate-600">CBE Academic Year 2026 Term 1</span>
            </div>
          </div>
        </div>

        {/* Official ElimuBridge Seal & Switch Button */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
              <img
                src="/elimu-bridge-logo.png"
                alt="ElimuBridge Seal"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left text-[10px] leading-tight">
              <div className="font-bold text-[#002B49]">ElimuBridge Seal</div>
              <div className="text-slate-500 font-mono">CBE Certified</div>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-2 shadow-2xs">
            <Coins className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-800">Elimu Tokens</div>
              <div className="text-sm font-black font-mono leading-none">
                🪙 {badgeEvaluation.totalTokens}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenProfileModal}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#002B49] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Switch Student Account
          </button>
        </div>
      </div>

      {/* Interactive Daily Study Goal Tracker Feature */}
      <DailyStudyGoalCard
        activeProfile={activeProfile}
        onExploreCourses={onExploreCourses}
        onTakeQuiz={() => onTakeQuiz()}
      />

      {/* 4 Summary Academic Matrix Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Completed Course Units
            </span>
            <BookOpen className="w-4 h-4 text-[#002B49]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#002B49] font-mono tabular-nums">
            {activeProfile.completedTopicsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Out of 32 syllabus modules</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cumulative GPA
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
            {studentGpa.split(" ")[0]}
          </div>
          <div className="text-[11px] text-slate-500 font-medium font-mono">
            Mean Score: {activeProfile.averageScore}% ({activeProfile.quizzesTaken} CATs)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Portal Attendance Streak
            </span>
            <Flame className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#002B49] font-mono tabular-nums flex items-center gap-1">
            <span>{studyStreak ?? activeProfile.streakDays}</span>
            <span className="text-sm font-semibold text-slate-500">days</span>
          </div>
          <div className="text-[11px] text-amber-700 font-bold">Continuous Daily Log</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Academic Honors
            </span>
            <Award className="w-4 h-4 text-[#F2A900]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F2A900] font-mono tabular-nums">
            {badgeEvaluation.unlockedCount} / {badgeEvaluation.badges.length}
          </div>
          <div className="text-[11px] text-[#002B49] font-bold">Micro-Credentials Earned</div>
        </div>
      </div>

      {/* Achievement Badges & Digital Tokens Section */}
      <AchievementBadgesView
        badges={badgeEvaluation.badges}
        totalTokens={badgeEvaluation.totalTokens}
        unlockedCount={badgeEvaluation.unlockedCount}
        activeProfile={activeProfile}
        onTakeQuiz={onTakeQuiz}
        onLaunchGame={onLaunchGame}
      />

      {/* Two Column Layout: Academic Intervention & Official Assessment Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Weak Areas & Recommended Focus */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#002B49] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Academic Advisory: Priority Revision Focus</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Competencies tagged for reinforcement based on continuous assessment test
                performance
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {activeProfile.weakAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{area}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Recommended: Step-by-step formula analysis & worked examples
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      onAskAITutor(
                        `Explain "${area}" with simple analogies and worked examples for ${activeProfile.grade}`,
                        "Revision",
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[#002B49] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#002B49]" />
                    <span>Ask Advisor</span>
                  </button>
                  <button
                    onClick={() => onTakeQuiz()}
                    className="px-3 py-1.5 rounded-lg bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Practice Drill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#002B49]">ElimuBridge Academic Advisory Tip:</span>{" "}
              Scoring 100% on any CAT unlocks the{" "}
              <span className="font-bold">KNEC Sharpshooter</span> credential and deposits +100
              Elimu Tokens to your student account.
            </div>
          </div>
        </div>

        {/* Right Column: Official Assessment Score Transcript */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002B49] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#002B49]" />
              <span>Assessment Transcript</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Official CX Record</span>
          </div>

          <div className="space-y-2.5">
            {activeProfile.recentQuizScores.map((item, idx) => {
              const pct = Math.round((item.score / item.total) * 100);
              const lg = getLetterGrade(pct);
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="pr-2">
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.quizTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {item.date} · Continuous Assessment Test
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-slate-900">
                        {item.score} / {item.total}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{pct}%</div>
                    </div>
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 rounded border ${lg.color}`}
                    >
                      {lg.grade}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onTakeQuiz()}
            className="w-full py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-[#F2A900]" />
            <span>Attempt Next Continuous Assessment Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
