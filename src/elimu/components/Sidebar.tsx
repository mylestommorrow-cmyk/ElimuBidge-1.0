// @ts-nocheck -- imported code, original project was not type-checked strictly
import React from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  Gamepad2,
  Sparkles,
  TrendingUp,
  ArrowDownToLine,
  Flame,
  Coins,
  Wifi,
  WifiOff,
  Users,
  X,
  ShieldCheck,
  ChevronRight,
  School,
  ExternalLink,
  Bell,
  Link2,
  FileText,
  Compass,
} from "lucide-react";
import { LearnerProfile } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";
import { AppTabType } from "./MobileBottomNav";

interface SidebarProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  activeProfile: LearnerProfile;
  onOpenProfileModal: () => void;
  activeSchoolCode?: string;
  activeSchoolName?: string;
  onOpenSchoolModal?: () => void;
  dataSaverMode: boolean;
  setDataSaverMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  offlineCount: number;
  studyStreak: number;
  onLaunchGame: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeProfile,
  onOpenProfileModal,
  activeSchoolCode = "DEMO-CBE",
  activeSchoolName = "National CBE Demonstration Academy",
  onOpenSchoolModal,
  dataSaverMode,
  setDataSaverMode,
  offlineCount,
  studyStreak,
  onLaunchGame,
  isOpen,
  onClose,
}) => {
  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      subtitle: "Your learning overview",
      icon: TrendingUp,
    },
    {
      id: "library" as const,
      label: "CBE Catalog",
      subtitle: "Playgroup to Grade 12",
      icon: BookOpen,
    },
    {
      id: "curriculum" as const,
      label: "KICD Curriculum",
      subtitle: "2-6-3-3 CBE Designs & Strands",
      icon: Compass,
    },
    {
      id: "exambank" as const,
      label: "Exam Bank",
      subtitle: "Verified Past Papers & Schemes",
      icon: FileText,
    },
    {
      id: "quizzes" as const,
      label: "30-Question CATs",
      subtitle: "Official Competency Exams",
      icon: Award,
    },
    {
      id: "portfolio" as const,
      label: "School Portfolio",
      subtitle: `${activeSchoolCode} Notes & Links`,
      icon: School,
    },
    {
      id: "game" as const,
      label: "4x Games Arcade",
      subtitle: "Savannah, Words & Lab",
      icon: Gamepad2,
      isArcade: true,
    },
    {
      id: "announcements" as const,
      label: "Noticeboard",
      subtitle: "Official CBE Notices",
      icon: Bell,
    },
    {
      id: "resources" as const,
      label: "Teacher Links",
      subtitle: "Subject Guides & Labs",
      icon: Link2,
    },
    {
      id: "tutor" as const,
      label: "Mwalimu AI Advisor",
      subtitle: "Interactive Gemini Tutor",
      icon: Sparkles,
    },
    {
      id: "progress" as const,
      label: "Transcript & Goals",
      subtitle: "GPA & Daily Targets",
      icon: TrendingUp,
    },
    {
      id: "offline" as const,
      label: "Offline Vault",
      subtitle: `${offlineCount} Lessons Cached`,
      icon: ArrowDownToLine,
      badge: offlineCount > 0 ? `${offlineCount}` : undefined,
    },
  ];

  const handleItemClick = (id: AppTabType) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#002B49] text-white flex flex-col justify-between border-r-4 border-[#F2A900] shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section: Brand & Student Identity */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-5 scrollbar-thin">
          {/* Header Brandmark: ELIMU BRIDGE with Official Logo Image */}
          <div className="flex items-center justify-between pb-4 border-b border-[#001E33]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 border-2 border-[#F2A900] shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/elimu-bridge-logo.png"
                  alt="ELIMU BRIDGE Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider uppercase text-white font-sans block leading-none">
                  ELIMU BRIDGE
                </span>
                <span className="text-[10px] font-bold text-[#F2A900] uppercase tracking-wider block mt-1">
                  CBE Kenya Portal
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#001E33] transition-colors"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Student Profile Summary Card */}
          <div className="p-3.5 rounded-xl bg-[#001E33] border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeProfile.avatarUrl ? (
                  <img
                    src={activeProfile.avatarUrl}
                    alt={activeProfile.name}
                    className="w-9 h-9 rounded-lg object-cover border border-[#F2A900] shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-[#F2A900] text-[#002B49] flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                    {activeProfile.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="font-bold text-white text-xs truncate">{activeProfile.name}</div>
                  <div className="text-[10px] text-[#F2A900] font-mono tracking-wider truncate font-bold">
                    {activeProfile.regNo || "EB-CBE-2026-0842"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenProfileModal();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="p-1.5 rounded text-slate-400 hover:text-[#F2A900] hover:bg-[#002B49] transition-colors cursor-pointer"
                title="Switch student or teacher profile"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 truncate max-w-[120px]">{activeProfile.grade}</span>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 text-[10px]">
                GPA {activeProfile.gpa?.split(" ")[0] || "3.88"}
              </span>
            </div>
          </div>

          {/* Active School Institutional Access Card */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-[#001E33] to-[#002B49] border border-[#F2A900]/40 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">🏛️</span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Active School Code
                </div>
                <div className="text-xs font-mono font-bold text-[#F2A900] truncate">
                  {activeSchoolCode}
                </div>
              </div>
            </div>
            {onOpenSchoolModal && (
              <button
                onClick={() => {
                  onOpenSchoolModal();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="px-2 py-1 rounded-lg bg-[#F2A900]/20 hover:bg-[#F2A900]/30 text-[#F2A900] text-[10px] font-bold border border-[#F2A900]/40 transition-colors shrink-0 cursor-pointer"
              >
                Switch
              </button>
            )}
          </div>

          {/* Quick Metrics Bar: Streak & Tokens */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div
              onClick={() => handleItemClick("progress")}
              className="p-2.5 rounded-xl bg-[#001E33] border border-slate-700/60 flex items-center gap-2 cursor-pointer hover:border-[#F2A900]/50 transition-colors"
            >
              <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center shrink-0">
                <Flame className="w-3.5 h-3.5 text-[#F2A900] fill-[#F2A900]" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Streak</div>
                <div className="text-xs font-mono font-bold text-white leading-none">
                  {studyStreak} {studyStreak === 1 ? "day" : "days"}
                </div>
              </div>
            </div>

            <div
              onClick={() => handleItemClick("progress")}
              className="p-2.5 rounded-xl bg-[#001E33] border border-slate-700/60 flex items-center gap-2 cursor-pointer hover:border-[#F2A900]/50 transition-colors"
            >
              <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center shrink-0">
                <Coins className="w-3.5 h-3.5 fill-[#F2A900] text-[#F2A900]" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Tokens</div>
                <div className="text-xs font-mono font-bold text-[#F2A900] leading-none">
                  {activeProfile.tokensBalance || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 font-mono">
              Portal Navigation
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              if (item.isArcade) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2A900] to-[#E59E00] hover:from-[#FFB81C] hover:to-[#F2A900] text-[#002B49] font-black text-xs shadow-md transition-all transform hover:scale-[1.02] cursor-pointer mt-2 mb-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <Gamepad2 className="w-4 h-4 fill-[#002B49]" />
                      <div className="text-left">
                        <div className="leading-tight">{item.label}</div>
                        <div className="text-[10px] text-[#002B49]/80 font-bold">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="bg-[#002B49] text-[#F2A900] text-[9px] px-1.5 py-0.5 rounded uppercase font-black">
                      Play
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-white/15 text-white font-bold border-l-4 border-[#F2A900] shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#F2A900]" : "text-slate-400"}`} />
                    <div>
                      <div className="leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.subtitle}</div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="bg-[#F2A900] text-[#002B49] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Bandwidth / Low-Data Mode & Accreditation */}
        <div className="p-4 border-t border-[#001E33] bg-[#00243D] space-y-3">
          {/* Data Saver Mode Toggle Button */}
          <button
            onClick={() => setDataSaverMode((prev) => !prev)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#001E33] hover:bg-[#001524] border border-slate-700/80 text-xs transition-colors cursor-pointer"
            title="Toggle Low-Bandwidth Data Saver mode"
          >
            <div className="flex items-center gap-2">
              {dataSaverMode ? (
                <WifiOff className="w-4 h-4 text-[#F2A900]" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-400" />
              )}
              <div className="text-left">
                <div className="font-bold text-white text-[11px] leading-tight">
                  {dataSaverMode ? "Data Saver Active" : "High Speed Mode"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {dataSaverMode ? "Conserving Mobile Bundles" : "High-Res Media Enabled"}
                </div>
              </div>
            </div>
            <span
              className={`w-3 h-3 rounded-full ${
                dataSaverMode ? "bg-[#F2A900] animate-pulse" : "bg-emerald-400"
              }`}
            />
          </button>

          {/* In-App PWA Install Action */}
          <div className="pt-1">
            <PWAInstallButton variant="full" />
          </div>

          {/* Academic Standard Footer */}
          <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#F2A900]" />
              <span>KICD / KNEC Syllabus</span>
            </span>
            <span className="text-slate-500">v2.6</span>
          </div>
        </div>
      </aside>
    </>
  );
};
