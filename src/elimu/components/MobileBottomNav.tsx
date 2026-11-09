// @ts-nocheck -- imported code, original project was not type-checked strictly
import React from "react";
import { Home, Compass, Award, FileText, Sparkles, Menu } from "lucide-react";

export type AppTabType =
  | "dashboard"
  | "library"
  | "curriculum"
  | "coursework"
  | "competencies"
  | "school"
  | "exambank"
  | "quizzes"
  | "game"
  | "tutor"
  | "progress"
  | "offline"
  | "announcements"
  | "resources"
  | "portfolio"
  | "admin";

interface MobileBottomNavProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu,
}) => {
  const tabs = [
    { id: "dashboard" as const, label: "Home", icon: Home },
    { id: "curriculum" as const, label: "Learn", icon: Compass },
    { id: "quizzes" as const, label: "Quiz", icon: Award },
    { id: "exambank" as const, label: "Exam Bank", icon: FileText },
    { id: "tutor" as const, label: "Mwalimu AI", icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#002B49] text-white border-t border-[#F2A900]/50 shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive ? "text-[#F2A900] font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition ${
                  isActive ? "bg-white/10 ring-1 ring-[#F2A900]/50" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#F2A900]" : "text-slate-400"}`} />
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-full leading-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 6th Slot: More / Slide-in Drawer button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
        >
          <div className="p-1 rounded-lg hover:bg-white/10">
            <Menu className="w-5 h-5 text-slate-300" />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5">More</span>
        </button>
      </div>
    </nav>
  );
};
