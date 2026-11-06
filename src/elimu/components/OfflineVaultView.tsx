// @ts-nocheck -- imported code, original project was not type-checked strictly
import React from "react";
import { StudyTopic } from "../types";
import {
  HardDrive,
  Download,
  Trash2,
  BookOpen,
  WifiOff,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface OfflineVaultViewProps {
  downloadedTopics: StudyTopic[];
  onOpenNotes: (topic: StudyTopic) => void;
  onRemoveOffline: (topicId: string) => void;
  onGoToLibrary: () => void;
  dataSaverMode: boolean;
}

export const OfflineVaultView: React.FC<OfflineVaultViewProps> = ({
  downloadedTopics,
  onOpenNotes,
  onRemoveOffline,
  onGoToLibrary,
  dataSaverMode,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Vault Status Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Zero Data Required for Offline Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Device Offline Learning Vault
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
            All revision notes, diagrams, and formulas in this vault are safely stored in your
            browser's local memory. You can read, solve, and study them even during network downtime
            or without mobile airtime.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center min-w-[200px] shrink-0">
          <div className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
            Device Storage Used
          </div>
          <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
            {downloadedTopics.length > 0
              ? `${(downloadedTopics.length * 1.4).toFixed(1)} MB`
              : "0.0 MB"}
          </div>
          <div className="text-[11px] text-emerald-300 font-semibold mt-1">
            {downloadedTopics.length} Lessons Available Offline
          </div>
        </div>
      </div>

      {/* Downloaded Content Grid */}
      {downloadedTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloadedTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#7C3AED]">{topic.gradeLevel}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{topic.offlineSize} Cached</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{topic.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {topic.subject} · {topic.strand || "General Revision"}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>

                <div className="text-[11px] text-slate-400">
                  Instructor: {topic.instructor.name}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <button
                  onClick={() => onRemoveOffline(topic.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                  title="Remove from offline cache"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <button
                  onClick={() => onOpenNotes(topic)}
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Offline Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto">
            <HardDrive className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Offline Vault is Empty</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Browse our CBE curriculum library lessons (Playgroup to Grade 12) and click "Save
            Offline" on any topic to store notes and formulas right on your device.
          </p>
          <button
            onClick={onGoToLibrary}
            className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm inline-flex items-center gap-2"
          >
            <span>Explore Library Lessons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
