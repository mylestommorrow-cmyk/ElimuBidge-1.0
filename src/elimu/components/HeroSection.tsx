// @ts-nocheck -- imported code, original project was not type-checked strictly
import React from "react";
import {
  Search,
  Download,
  CheckCircle2,
  Award,
  Gamepad2,
  Flame,
  ArrowRight,
  GraduationCap,
  Bell,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { LearnerProfile } from "../types";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreQuizzes: () => void;
  onOpenAITutor: () => void;
  onLaunchGame: () => void;
  dataSaverMode: boolean;
  activeProfile?: LearnerProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreQuizzes,
  onOpenAITutor,
  onLaunchGame,
  dataSaverMode,
  activeProfile,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#002B49]/5 via-[#F4F6F9] to-[#F4F6F9] border-b border-slate-200">
      {/* Official ELIMU BRIDGE Campus Notice / Bulletin Ticker */}
      <div className="bg-[#002B49] text-white border-b-2 border-[#F2A900]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#F2A900] text-[#002B49] font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Bell className="w-3 h-3" />
              CAMPUS NOTICE
            </span>
            <span className="text-slate-200 font-medium truncate">
              Continuous Assessment Tests (CATs) scheduled for Week 6 · KICD & KNEC aligned syllabus
              units synchronized for offline study.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300 shrink-0 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F2A900]" />
              <span>Spring Term 1, 2026</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-[#F2A900]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ELIMU BRIDGE Portal</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Student Identification Banner Card */}
        {activeProfile && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {activeProfile.avatarUrl ? (
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#F2A900] shadow-xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#002B49] text-[#F2A900] flex items-center justify-center font-black text-lg border-2 border-[#F2A900] shadow-xs shrink-0">
                  {activeProfile.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#002B49]">
                    Welcome, {activeProfile.name}
                  </h2>
                  <span className="bg-[#002B49]/10 text-[#002B49] text-[10px] font-bold px-2 py-0.5 rounded border border-[#002B49]/20">
                    {activeProfile.level} Pathway
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 font-medium">
                  <span className="font-mono text-slate-700 font-bold">
                    Reg No: {activeProfile.regNo || "EB-CBE-2026-0842"}
                  </span>
                  <span>·</span>
                  <span>{activeProfile.grade}</span>
                  <span>·</span>
                  <span className="text-[#002B49] font-semibold">{activeProfile.schoolName}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-[10px] uppercase text-slate-500 block font-bold">
                  Standing
                </span>
                <span className="font-bold text-[#002B49]">
                  {activeProfile.academicStanding || "Dean's List · Good Standing"}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                <span className="text-[10px] uppercase text-amber-700 block font-bold">
                  Cumulative GPA
                </span>
                <span className="font-black font-mono text-[#002B49]">
                  {activeProfile.gpa || "3.88 / 4.00"}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#002B49] text-white">
                <span className="text-[10px] uppercase text-[#F2A900] block font-bold">
                  Portal Attendance
                </span>
                <span className="font-bold flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5 text-[#F2A900] fill-[#F2A900]" />
                  <span>{activeProfile.streakDays} Days</span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline, Search, Value Proof */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#002B49] bg-white px-3.5 py-1.5 rounded-xl shadow-xs border border-slate-200">
              <div className="w-6 h-6 rounded-md bg-white overflow-hidden shrink-0 border border-slate-200">
                <img
                  src="/elimu-bridge-logo.png"
                  alt="ElimuBridge Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-mono font-bold text-slate-700">
                Kenya CBE E-Learning Initiative
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-[#002B49]">Playgroup to Grade 12</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002B49] tracking-tight leading-tight">
              Learn. Build. Succeed.{" "}
              <span className="text-[#004A7C] block mt-1">
                Reliable access to Kenya CBE curriculum materials.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
              Official KICD-aligned study packs, continuous assessment test drills for all 15
              grades, teacher resources, and bilingual Mwalimu AI academic advisory designed to
              ensure continuous learning across all Kenyan counties.
            </p>

            {/* University Course Search Bar */}
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search lessons"
                placeholder="Search topics, subjects, or grades…"
                onKeyDown={(event) => {
                  if (event.key === "Enter")
                    document
                      .getElementById("lesson-results")
                      ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full pl-10 pr-24 py-3 rounded-xl border-2 border-slate-300 bg-white shadow-xs hover:border-[#002B49] focus:outline-none focus:ring-3 focus:ring-[#002B49]/20 focus:border-[#002B49] text-xs sm:text-sm placeholder-slate-400 text-slate-900 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-24 pr-2 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
              <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("lesson-results")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-[#002B49] hover:bg-[#001E33] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick Action Buttons in USIU Styling */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExploreQuizzes}
                className="px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-[#002B49]"
              >
                <Award className="w-4 h-4 text-[#F2A900]" />
                <span>Continuous Assessment (CATs)</span>
              </button>

              <button
                onClick={onOpenAITutor}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#002B49] text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#002B49]" />
                <span>Ask Mwalimu AI Advisor</span>
              </button>

              <button
                onClick={onLaunchGame}
                className="px-4 py-2.5 rounded-xl bg-[#F2A900] hover:bg-[#FFB81C] text-[#002B49] text-xs font-black shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 fill-[#002B49]" />
                <span>ElimuSprint Arcade</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> KICD Syllabus Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#002B49]" /> 1-Click Offline Caching
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" /> Portal Attendance
                Streaks
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual & USIU Coursepack Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-slate-200 p-2.5">
              {!dataSaverMode ? (
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group">
                  <img
                    src="/images/hero_kenyan_students_1792611766911.jpg"
                    alt="Kenyan students studying curriculum units with digital tablet in USIU laboratory"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002B49]/90 via-[#002B49]/30 to-transparent flex items-end p-5">
                    <div className="text-white space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F2A900] bg-[#001E33]/80 px-2.5 py-0.5 rounded border border-[#F2A900]/30 backdrop-blur-xs font-mono">
                        <span>ElimuBridge Digital Learning Hub · Nairobi</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold">
                        Digital Coursepack & Continuous Revision Hub
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="text-[11px] font-black text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F2A900]" />
                    BANDWIDTH SAVER ACTIVE
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    High-Resolution Media Stream Paused
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Media streaming is paused to save your data bundle. All lesson coursepacks,
                    worked exam formulas, and revision drills remain accessible offline.
                  </p>
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 850 KB Data Saved on this session
                  </div>
                </div>
              )}

              {/* ElimuSprint Quick Launcher */}
              <div
                onClick={onLaunchGame}
                className="mt-2.5 p-3 bg-gradient-to-r from-amber-50 to-slate-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs cursor-pointer hover:border-[#F2A900] transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#002B49] text-[#F2A900] flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition-transform">
                    <Gamepad2 className="w-4 h-4 fill-[#F2A900]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#002B49] block flex items-center gap-1">
                      <span>ElimuSprint Savannah Challenge</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#F2A900] fill-[#F2A900]" />
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      60FPS curriculum obstacle drill with token rewards
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#F2A900] text-[#002B49] rounded-lg font-black text-[11px] shadow-xs group-hover:bg-[#FFB81C] flex items-center gap-1">
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Statistics Banner with USIU Institutional Cards */}
        <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-[#002B49] transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#002B49] font-mono tabular-nums">
              10,000+
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              Coursepack Revision Units
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-[#002B49] transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#002B49] font-mono tabular-nums">
              50,000+
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              Enrolled Learners Nationwide
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-[#F2A900] transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#F2A900] font-mono tabular-nums flex items-center gap-1">
              <span>4.8</span>
              <span className="text-lg text-[#F2A900]">★</span>
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              Faculty & Student Course Rating
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-600 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              Offline Local Storage Cache
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
