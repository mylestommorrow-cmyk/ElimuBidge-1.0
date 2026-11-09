import { useState } from "react";
import {
  PanelLeft,
  Users,
  Wifi,
  WifiOff,
  Flame,
  Download,
  Bell,
  Gamepad2,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VIEW_LABELS } from "@/lib/app-navigation";
import { PWAInstallButton } from "./PWAInstallButton";
import type { LearnerProfile } from "../types";
import type { AppTabType } from "./MobileBottomNav";

interface NavbarProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  activeProfile: LearnerProfile;
  onOpenProfileModal: () => void;
  activeSchoolCode?: string;
  activeSchoolName?: string;
  onOpenSchoolModal?: () => void;
  dataSaverMode: boolean;
  setDataSaverMode: (value: boolean | ((previous: boolean) => boolean)) => void;
  offlineCount: number;
  studyStreak: number;
  onLaunchGame: () => void;
  onToggleSidebar?: () => void;
  onOpenAccessibilityModal?: () => void;
}
export function Navbar({
  activeTab,
  setActiveTab,
  activeProfile,
  onOpenProfileModal,
  activeSchoolCode,
  activeSchoolName,
  onOpenSchoolModal,
  dataSaverMode,
  setDataSaverMode,
  offlineCount,
  studyStreak,
  onLaunchGame,
  onToggleSidebar,
  onOpenAccessibilityModal,
}: NavbarProps) {
  const [streakOpen, setStreakOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background text-foreground">
      <div className="flex h-12 items-center gap-3 border-b border-border px-4 text-xs sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          title="Toggle data saver"
          onClick={() => setDataSaverMode((previous) => !previous)}
        >
          {dataSaverMode ? <WifiOff /> : <Wifi />}
          <span>{dataSaverMode ? "Data saver on" : "Data saver off"}</span>
        </Button>
        <span className="hidden text-muted-foreground sm:block">{offlineCount} saved lessons</span>
      </div>
      <div className="flex h-20 min-w-0 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
            aria-label="Toggle navigation sidebar"
            onClick={onToggleSidebar}
          >
            <PanelLeft />
          </Button>
          <Button
            variant="ghost"
            className="h-auto min-w-0 justify-start px-0 text-left"
            onClick={() => setActiveTab("dashboard")}
          >
            <img
              src="/elimu-bridge-logo.png"
              alt=""
              className="size-9 shrink-0 object-contain lg:hidden"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold sm:text-lg">
                {VIEW_LABELS[activeTab]}
              </span>
              <span className="hidden text-xs font-normal text-muted-foreground sm:block">
                ElimuBridge · {activeProfile.grade}
              </span>
            </span>
          </Button>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Noticeboard"
            className="hidden xl:inline-flex"
            onClick={() => setActiveTab("announcements")}
          >
            <Bell />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Games arcade"
            className="hidden xl:inline-flex"
            onClick={onLaunchGame}
          >
            <Gamepad2 />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Saved lessons"
            className="hidden xl:inline-flex"
            onClick={() => setActiveTab("offline")}
          >
            <Download />
          </Button>
          <div className="relative hidden sm:block">
            <Button
              variant="ghost"
              title="Study streak"
              onClick={() => setStreakOpen(!streakOpen)}
              aria-expanded={streakOpen}
            >
              <Flame className="text-learning-gold" />
              {studyStreak}
            </Button>
            {streakOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-popover p-4 shadow-md">
                <p className="text-sm font-bold">{studyStreak}-day study streak</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your on-device study attendance.
                </p>
                <Button
                  variant="link"
                  className="mt-2 px-0"
                  onClick={() => {
                    setStreakOpen(false);
                    setActiveTab("progress");
                  }}
                >
                  View progress
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            aria-label="Learners with Disability & Accessibility Support"
            title="Learners with Disability & Accessibility Support"
            className="h-9 px-2.5 gap-1.5 text-purple-700 hover:text-purple-900 border-purple-200 bg-purple-50/70 hover:bg-purple-100 font-bold text-xs"
            onClick={onOpenAccessibilityModal}
          >
            <span className="text-sm">♿</span>
            <span className="hidden sm:inline">Disability Support</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Switch learner profile"
            title="Learner profiles"
            onClick={onOpenProfileModal}
          >
            <Users />
          </Button>
        </div>
      </div>
      <div className="hidden items-center gap-4 border-t border-border px-6 py-2 text-xs lg:flex">
        <Button
          variant="ghost"
          size="sm"
          title={activeSchoolName}
          className="h-7 px-0"
          onClick={onOpenSchoolModal}
        >
          <School />
          {activeSchoolCode}
        </Button>
        <Button
          variant="link"
          size="sm"
          className="h-7 px-0"
          onClick={() => setActiveTab("resources")}
        >
          Teacher resources
        </Button>
        <Button
          variant="link"
          size="sm"
          className="h-7 px-0"
          onClick={() => setActiveTab("progress")}
        >
          {activeProfile.tokensBalance || 0} tokens
        </Button>
        <div className="ml-auto">
          <PWAInstallButton variant="compact" />
        </div>
      </div>
    </header>
  );
}
