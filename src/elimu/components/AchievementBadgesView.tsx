// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import { AchievementBadge, LearnerProfile } from "../types";
import {
  Award,
  Flame,
  Zap,
  Target,
  BookOpen,
  Sparkles,
  Download,
  Gamepad2,
  Lock,
  CheckCircle2,
  Coins,
  ChevronRight,
  Filter,
} from "lucide-react";

interface AchievementBadgesViewProps {
  badges: AchievementBadge[];
  totalTokens: number;
  unlockedCount: number;
  activeProfile: LearnerProfile;
  onTakeQuiz?: () => void;
  onLaunchGame?: () => void;
}

export const AchievementBadgesView: React.FC<AchievementBadgesViewProps> = ({
  badges,
  totalTokens,
  unlockedCount,
  activeProfile,
  onTakeQuiz,
  onLaunchGame,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "streak" | "quiz" | "mastery" | "offline"
  >("all");
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<AchievementBadge | null>(null);

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-6 h-6 ${unlocked ? "text-white" : "text-slate-400"}` };
    switch (iconName) {
      case "Flame":
        return <Flame {...props} />;
      case "Award":
        return <Award {...props} />;
      case "Zap":
        return <Zap {...props} />;
      case "Target":
        return <Target {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "Sparkles":
        return <Sparkles {...props} />;
      case "Download":
        return <Download {...props} />;
      case "Gamepad2":
        return <Gamepad2 {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === "all") return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Tokens & Badges Summary Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#002B49] border-2 border-[#F2A900] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Background gold ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F2A900]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001E33] text-[#F2A900] text-xs font-bold border border-[#F2A900]/40">
            <Coins className="w-3.5 h-3.5 fill-[#F2A900]" />
            <span>ELIMU BRIDGE Academic Honors & Digital Tokens</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Official Micro-Credentials & Badges
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-normal">
            Earn digital honors and tokens for regular portal attendance streaks, perfect assessment
            quiz scores, and subject mastery.
          </p>
        </div>

        {/* Tokens & Badge Count Widget */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-4 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 text-center min-w-[130px] shrink-0">
            <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Token Balance</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5 tabular-nums">
              🪙 {totalTokens}
            </div>
            <div className="text-[10px] text-amber-100/90 font-medium mt-0.5">Elimu Tokens</div>
          </div>

          <div className="p-4 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 text-center min-w-[130px] shrink-0">
            <div className="text-[10px] font-extrabold text-purple-200 uppercase tracking-wider flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Badges Earned</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 tabular-nums">
              {unlockedCount} / {badges.length}
            </div>
            <div className="text-[10px] text-purple-200/90 font-medium mt-0.5">
              {Math.round((unlockedCount / badges.length) * 100)}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit">
          {[
            { id: "all", label: "All Badges" },
            { id: "streak", label: "🔥 Streaks" },
            { id: "quiz", label: "🎯 Quizzes" },
            { id: "mastery", label: "✨ Mastery" },
            { id: "offline", label: "📥 Offline" },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filteredBadges.length}</span> badges
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.unlocked;
          const pct = Math.min(
            100,
            Math.round((badge.progress.current / badge.progress.max) * 100),
          );

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadgeDetail(badge)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                isUnlocked
                  ? "bg-white border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md"
                  : "bg-slate-50/70 border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Top Row: Icon + Token Tag */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                      isUnlocked
                        ? `bg-gradient-to-tr ${badge.colorScheme.badgeGlow}`
                        : "bg-slate-200"
                    }`}
                  >
                    {isUnlocked ? (
                      getBadgeIcon(badge.iconName, true)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black tabular-nums border ${
                      isUnlocked
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    +{badge.tokenReward} 🪙
                  </span>
                </div>

                {/* Badge Title & Description */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{badge.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Bottom: Progress or Status */}
              <div className="pt-3.5 mt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{isUnlocked ? "Completed" : "Progress"}</span>
                  <span className="font-mono text-[10px] text-slate-700">
                    {badge.progress.current}/{badge.progress.max} {badge.progress.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-purple-500 to-amber-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadgeDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 text-center">
            <div
              className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-md ${
                selectedBadgeDetail.unlocked
                  ? `bg-gradient-to-tr ${selectedBadgeDetail.colorScheme.badgeGlow}`
                  : "bg-slate-200"
              }`}
            >
              {selectedBadgeDetail.unlocked ? (
                getBadgeIcon(selectedBadgeDetail.iconName, true)
              ) : (
                <Lock className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>Award: +{selectedBadgeDetail.tokenReward} Elimu Tokens</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{selectedBadgeDetail.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                {selectedBadgeDetail.description}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-left">
              <div className="font-bold text-slate-800">Unlock Requirement:</div>
              <p className="text-slate-600">{selectedBadgeDetail.criteriaText}</p>
              <div className="flex items-center justify-between pt-1 text-slate-500 font-semibold">
                <span>Current Progress:</span>
                <span className="font-bold text-slate-900">
                  {selectedBadgeDetail.progress.current} / {selectedBadgeDetail.progress.max}{" "}
                  {selectedBadgeDetail.progress.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
              {!selectedBadgeDetail.unlocked && (
                <button
                  onClick={() => {
                    setSelectedBadgeDetail(null);
                    if (selectedBadgeDetail.category === "quiz" && onTakeQuiz) {
                      onTakeQuiz();
                    } else if (onLaunchGame) {
                      onLaunchGame();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-xs"
                >
                  Earn Badge Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
