// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import { StudyTopic } from "../types";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Check,
  Award,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  Share2,
  CheckCircle2,
  Radio,
  Link2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { getStoredTeachingLinks } from "../data/teachingLinks";

interface StudyNotesModalProps {
  topic: StudyTopic | null;
  onClose: () => void;
  onTakeQuiz: (quizId: string) => void;
  onAskAITutor: (topicTitle: string, subject: string) => void;
  onToggleOffline: (topicId: string) => void;
  dataSaverMode: boolean;
  onOpenTeacherLinksModal?: (subject: string, grade: string) => void;
}

export const StudyNotesModal: React.FC<StudyNotesModalProps> = ({
  topic,
  onClose,
  onTakeQuiz,
  onAskAITutor,
  onToggleOffline,
  dataSaverMode,
  onOpenTeacherLinksModal,
}) => {
  // Lecture simulator state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(25);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [audioOnlyMode, setAudioOnlyMode] = useState(dataSaverMode);
  const [activeTabSection, setActiveTabSection] = useState<
    "notes" | "terms" | "mistakes" | "links"
  >("notes");
  const [isCopied, setIsCopied] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleShareOrCopy = () => {
    navigator.clipboard?.writeText(
      `ElimuBridge Revision Note: ${topic.title} (${topic.gradeLevel}) - Free access to Kenya CBE curriculum materials.`,
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!topic) return null;

  const teachingLinks = getStoredTeachingLinks().filter(
    (l) =>
      l.subject === "All" ||
      l.subject === topic.subject ||
      l.gradeLevel === "All Grades" ||
      l.gradeLevel === topic.gradeLevel,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-xs">
              {topic.level}
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-[#7C3AED]">{topic.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{topic.gradeLevel}</span>
                {topic.strand && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="hidden sm:inline">{topic.strand}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {topic.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleOffline(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                topic.downloaded
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
              title="Download for offline access"
            >
              {topic.downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Offline Ready</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Save Offline ({topic.offlineSize})</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Close study notes modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Lecture Media Player & Audio Transcript Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white overflow-hidden shadow-inner">
            {/* Player Visual Area */}
            {!audioOnlyMode ? (
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={topic.coverImage}
                  alt={topic.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-40 blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 mb-2"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </button>
                  <div className="text-xs font-semibold text-purple-200">
                    {isPlaying
                      ? "Playing Offline Audio Lesson"
                      : "Tap to Listen to Recorded Lesson"}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Delivered by {topic.instructor.name} · {topic.duration}
                  </div>
                </div>
              </div>
            ) : (
              /* Low-Bandwidth Audio-Only Mode */
              <div className="p-4 bg-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-11 h-11 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>Low-Bandwidth Audio Stream (Saves 95% Data)</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Instructor: {topic.instructor.name}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md">
                  Audio-Only Data: ~150 KB
                </div>
              </div>
            )}

            {/* Audio Controls Bar */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="font-mono text-[11px] text-slate-400">
                  {isPlaying ? "08:42" : "00:00"}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playbackProgress}
                  onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                  className="w-full sm:w-60 accent-[#7C3AED] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-[11px] text-slate-400">32:00</span>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {/* Speed Toggle */}
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setAudioSpeed(speed)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        audioSpeed === speed
                          ? "bg-[#7C3AED] text-white font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Audio vs Video Mode Switcher */}
                <button
                  onClick={() => setAudioOnlyMode(!audioOnlyMode)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {audioOnlyMode ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Audio Mode</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch to Audio-Only</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section Selector: Notes vs Terms vs Mistakes vs Teacher Links */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTabSection("notes")}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTabSection === "notes"
                  ? "bg-[#002B49] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Revision Notes & Formulas
            </button>
            <button
              onClick={() => setActiveTabSection("terms")}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTabSection === "terms"
                  ? "bg-[#002B49] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Key Terms ({topic.keyTerms.length})
            </button>
            <button
              onClick={() => setActiveTabSection("mistakes")}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTabSection === "mistakes"
                  ? "bg-[#002B49] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Assessment Errors
            </button>
            <button
              onClick={() => setActiveTabSection("links")}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabSection === "links"
                  ? "bg-[#F2A900] text-[#002B49] font-black"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Teacher Links ({teachingLinks.length})</span>
            </button>
          </div>

          {/* TAB 1: Main Revision Notes */}
          {activeTabSection === "notes" && (
            <div className="space-y-6">
              {/* KICD Approved Competencies */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>KICD Curriculum Competencies & Exam Objectives</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {topic.kicdCompetencies.map((comp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#7C3AED] font-bold mt-0.5">•</span>
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Sections */}
              {topic.contentSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                >
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {sec.heading}
                  </h3>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sec.body.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Diagram Key Points callout if present */}
                  {sec.diagramLabel && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>{sec.diagramLabel} Key Observations:</span>
                      </div>
                      <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                        {sec.diagramKeyPoints?.map((kp, kIdx) => (
                          <li key={kIdx}>{kp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Worked Example Box */}
                  {sec.workedExample && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-3">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-700" />
                        <span>CBE & KNEC Worked Assessment Example:</span>
                      </div>
                      <p className="font-medium text-slate-900 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                        {sec.workedExample.problem}
                      </p>
                      <div className="space-y-1.5 text-emerald-950">
                        <div className="font-semibold text-[11px] uppercase tracking-wider text-emerald-800">
                          Step-by-Step Solution:
                        </div>
                        {sec.workedExample.steps.map((st, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2">
                            <span className="font-bold text-emerald-700">{sIdx + 1}.</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-emerald-200/80 font-bold text-emerald-800 flex items-center justify-between">
                        <span>Final Answer:</span>
                        <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs">
                          {sec.workedExample.answer}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Key Terms Glossary */}
          {activeTabSection === "terms" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topic.keyTerms.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="font-bold text-[#002B49] text-sm">{item.term}</div>
                  <p className="text-slate-700 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Common Assessment Errors */}
          {activeTabSection === "mistakes" && (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>Frequently Penalized CBE Examination & Assessment Errors</span>
              </h4>
              <ul className="space-y-2 text-xs text-amber-950">
                {topic.commonMistakes.map((mistake, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-amber-200/60"
                  >
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 4: Subject-Specific Teacher Links & Labs */}
          {activeTabSection === "links" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#002B49]/5 via-amber-50/50 to-white border border-[#002B49]/20 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#002B49]">
                    Teacher Resources for {topic.subject} ({topic.gradeLevel})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Curriculum links, simulations, and lesson plans for this subject
                  </p>
                </div>
                {onOpenTeacherLinksModal && (
                  <button
                    onClick={() => onOpenTeacherLinksModal(topic.subject, topic.gradeLevel)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#F2A900]" />
                    <span>+ Add Teaching Link</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {teachingLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#002B49] transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                          {link.type}
                        </span>
                        <span className="text-[#002B49] font-mono">{link.gradeLevel}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-2">
                        {link.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{link.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium truncate max-w-[150px]">
                        By {link.addedBy}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#002B49] text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#001E33]"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3 text-[#F2A900]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {teachingLinks.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <Link2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600">
                    No teaching links yet for this specific unit.
                  </p>
                  {onOpenTeacherLinksModal && (
                    <button
                      onClick={() => onOpenTeacherLinksModal(topic.subject, topic.gradeLevel)}
                      className="px-3 py-1.5 rounded-lg bg-[#002B49] text-white text-xs font-bold"
                    >
                      + Add First Teaching Link
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Bar (Take Quiz, Ask Mwalimu AI, Share) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareOrCopy}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? "Link Copied!" : "Share Lesson"}</span>
            </button>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">
              Offline Storage:{" "}
              <span className="font-semibold text-slate-700">{topic.offlineSize}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onAskAITutor(topic.title, topic.subject);
              }}
              className="px-4 py-2.5 rounded-xl border border-purple-300 bg-white hover:bg-purple-50 text-[#7C3AED] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Mwalimu AI</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTakeQuiz(topic.quizId);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Take Revision Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
