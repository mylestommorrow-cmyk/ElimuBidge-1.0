// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect } from "react";
import {
  Target,
  CheckCircle2,
  Trophy,
  Flame,
  Plus,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { LearnerProfile, DailyStudyGoal } from "../types";

interface DailyStudyGoalCardProps {
  activeProfile: LearnerProfile;
  onExploreCourses?: () => void;
  onTakeQuiz?: () => void;
}

export const DailyStudyGoalCard: React.FC<DailyStudyGoalCardProps> = ({
  activeProfile,
  onExploreCourses,
  onTakeQuiz,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `elimubridge_daily_goal_${activeProfile.id}_${today}`;

  const [goal, setGoal] = useState<DailyStudyGoal>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      profileId: activeProfile.id,
      goalType: "lessons",
      target: 3,
      current: 1,
      date: today,
      isCompleted: false,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState<"lessons" | "quiz_score" | "study_time">(
    goal.goalType,
  );
  const [targetValue, setTargetValue] = useState<number>(goal.target);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sync when profile changes
  useEffect(() => {
    const saved = localStorage.getItem(`elimubridge_daily_goal_${activeProfile.id}_${today}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGoal(parsed);
        setSelectedType(parsed.goalType);
        setTargetValue(parsed.target);
        return;
      } catch {
        // Fallback
      }
    }
    // Default for fresh profile
    const freshGoal: DailyStudyGoal = {
      profileId: activeProfile.id,
      goalType: "lessons",
      target: 3,
      current: 1,
      date: today,
      isCompleted: false,
      lastUpdated: new Date().toLocaleTimeString(),
    };
    setGoal(freshGoal);
    setSelectedType("lessons");
    setTargetValue(3);
  }, [activeProfile.id, today]);

  // Persist goal state
  const updateAndSaveGoal = (updated: DailyStudyGoal) => {
    setGoal(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    if (updated.isCompleted && !goal.isCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  const handleIncrement = () => {
    const nextCurrent =
      goal.goalType === "quiz_score"
        ? Math.min(100, goal.current + 10)
        : goal.goalType === "study_time"
          ? goal.current + 15
          : goal.current + 1;

    const isNowDone = nextCurrent >= goal.target;
    updateAndSaveGoal({
      ...goal,
      current: nextCurrent,
      isCompleted: isNowDone,
      lastUpdated: new Date().toLocaleTimeString(),
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DailyStudyGoal = {
      ...goal,
      goalType: selectedType,
      target: Math.max(1, targetValue),
      isCompleted: goal.current >= targetValue,
      lastUpdated: new Date().toLocaleTimeString(),
    };
    updateAndSaveGoal(updated);
    setIsEditing(false);
  };

  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));

  const getMetricLabel = () => {
    switch (goal.goalType) {
      case "lessons":
        return `${goal.current} of ${goal.target} CBE Lessons Completed`;
      case "quiz_score":
        return `${goal.current}% CAT Score (Target: ${goal.target}%)`;
      case "study_time":
        return `${goal.current} of ${goal.target} Minutes Studied`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-[#002B49]/30 shadow-md p-5 sm:p-6 relative overflow-hidden">
      {/* Top Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002B49] via-[#F2A900] to-emerald-500" />

      {/* Celebration Notification Popup */}
      {showCelebration && (
        <div className="mb-4 p-3 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-200 fill-amber-200" />
            <span className="text-xs sm:text-sm font-black">
              Daily CBE Goal Smashed! +50 Elimu Tokens awarded!
            </span>
          </div>
          <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">
            100% Complete
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002B49] text-[#F2A900] flex items-center justify-center font-black shadow-xs shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#002B49]">Daily Study Goal Tracker</h3>
              {goal.isCompleted ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Goal Reached
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-600" /> In Progress
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Daily habit tracker aligned with your {activeProfile.grade} CBE curriculum
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#002B49]" />
            <span>{isEditing ? "Cancel" : "Set Goal Target"}</span>
          </button>
        </div>
      </div>

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveSettings}
          className="mt-4 p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-3"
        >
          <div className="text-xs font-bold text-slate-800">Customize Your Daily Target:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Goal Metric
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  const val = e.target.value as "lessons" | "quiz_score" | "study_time";
                  setSelectedType(val);
                  if (val === "lessons") setTargetValue(3);
                  if (val === "quiz_score") setTargetValue(85);
                  if (val === "study_time") setTargetValue(45);
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              >
                <option value="lessons">Number of CBE Lessons to Complete</option>
                <option value="quiz_score">Target Continuous Assessment (CAT) Score %</option>
                <option value="study_time">Daily Focused Study Minutes</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Target Value
              </label>
              <input
                type="number"
                min={selectedType === "quiz_score" ? 50 : 1}
                max={selectedType === "quiz_score" ? 100 : 180}
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#002B49] text-white text-xs font-bold hover:bg-[#001E33] shadow-xs"
            >
              Apply Goal
            </button>
          </div>
        </form>
      )}

      {/* Main Visual Progress Display */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-black">
          <span className="text-[#002B49]">{getMetricLabel()}</span>
          <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {percentage}% Achieved
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-4 sm:h-5 p-0.5 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2 text-[10px] font-black text-white ${
              goal.isCompleted
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 animate-pulse"
                : "bg-gradient-to-r from-[#002B49] via-[#004A7C] to-[#F2A900]"
            }`}
            style={{ width: `${Math.max(8, percentage)}%` }}
          >
            {percentage >= 20 && `${percentage}%`}
          </div>
        </div>

        {/* Progress controls & interactive actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Target resets daily at midnight · Progress auto-saved locally</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleIncrement}
              className="px-3 py-1.5 rounded-lg bg-[#F2A900] hover:bg-[#FFB81C] text-[#002B49] font-black text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
              title="Simulate or log completed study activity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>
                {goal.goalType === "lessons"
                  ? "+1 Lesson Completed"
                  : goal.goalType === "quiz_score"
                    ? "+10% Quiz Score"
                    : "+15 Mins Studied"}
              </span>
            </button>

            {onExploreCourses && (
              <button
                onClick={onExploreCourses}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[#002B49] font-bold text-xs flex items-center gap-1 shadow-2xs"
              >
                <span>Study Syllabus</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
