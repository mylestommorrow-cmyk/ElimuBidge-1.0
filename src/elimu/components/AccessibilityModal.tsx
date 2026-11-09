// @ts-nocheck
import React, { useState } from "react";
import { X, Check, Volume2, Eye, Mic, Brain, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { LearnerProfile } from "../types";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeFont: boolean;
  textToSpeech: boolean;
  speechInput: boolean;
  simplifiedLanguage: boolean;
}

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: LearnerProfile;
  onUpdateProfileAccessibility: (accommodation: string, settings: AccessibilitySettings) => void;
}

export const DISABILITY_ACCOMMODATIONS = [
  {
    id: "None",
    name: "Standard Learning Mode",
    description: "Standard CBE curriculum experience with default fonts and interactive feedback.",
    icon: "🎓",
  },
  {
    id: "Low Vision",
    name: "Low Vision & Visual Impairment",
    description:
      "High contrast visuals, magnified typography, bold borders, and audio read-aloud TTS on all quiz questions and tutor messages.",
    icon: "👁️",
  },
  {
    id: "Autism Spectrum Disorder",
    name: "Autism Spectrum Disorder (ASD)",
    description:
      "Predictable routines, literal language (no idioms or sarcasm), step-by-step visual roadmaps, and calm sensory design.",
    icon: "🧩",
  },
  {
    id: "ADHD",
    name: "ADHD & Executive Scaffolding",
    description:
      "Chunked single-step instructions, relaxed timer-free mode, uncluttered layout, and frequent positive encouragement tokens.",
    icon: "⚡",
  },
  {
    id: "Hearing Impairment",
    name: "Hearing Impairment & Deaf (KSL)",
    description:
      "Visual transcriptions, Kenya Sign Language (KSL) terminology support, and visual alerts instead of audio beeps.",
    icon: "🧏",
  },
  {
    id: "Dyslexia",
    name: "Dyslexia & Reading Difficulty",
    description:
      "High-legibility font spacing, syllable breakdowns, speech-to-text voice input, and read-aloud speech audio playback.",
    icon: "📖",
  },
  {
    id: "Physical & Motor",
    name: "Physical & Motor Accessibility",
    description:
      "Extra-large touch targets (64px), keyboard navigation friendliness, and hands-free voice speech recognition.",
    icon: "♿",
  },
  {
    id: "Down Syndrome",
    name: "Down Syndrome & Intellectual Disability",
    description:
      "Foundation stage curriculum pacing, concrete real-object examples (mangoes, coins), and repetitive reinforcement.",
    icon: "🌟",
  },
];

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onUpdateProfileAccessibility,
}) => {
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>(
    activeProfile.disabilityAccommodation || "None",
  );

  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: activeProfile.accessibilitySettings?.highContrast ?? false,
    largeFont: activeProfile.accessibilitySettings?.largeFont ?? false,
    textToSpeech: activeProfile.accessibilitySettings?.textToSpeech ?? true,
    speechInput: activeProfile.accessibilitySettings?.speechInput ?? true,
    simplifiedLanguage: activeProfile.accessibilitySettings?.simplifiedLanguage ?? false,
  });

  const [isTestingAudio, setIsTestingAudio] = useState(false);

  if (!isOpen) return null;

  const handleTestAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech audio is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    setIsTestingAudio(true);
    const utterance = new SpeechSynthesisUtterance(
      `Jambo ${activeProfile.name}! This is the ElimuBridge audio accessibility voice for learners with disabilities. Text to speech is ready to assist you.`,
    );
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsTestingAudio(false);
    utterance.onerror = () => setIsTestingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    onUpdateProfileAccessibility(selectedAccommodation, settings);
    toast.success("Accessibility & disability options saved and synced to your cloud profile!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#002B49] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ♿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Learners with Disability & Accessibility Support
                </h3>
                <span className="text-[10px] font-bold bg-[#F2A900] text-[#002B49] px-2 py-0.5 rounded-full">
                  KICD UDL Aligned
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Personalize accommodations for {activeProfile.name} · Synced to Cloud Profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility modal"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Choose Disability Accommodation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-600" />
                Select Disability & Inclusive Accommodation:
              </label>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Active: {selectedAccommodation}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DISABILITY_ACCOMMODATIONS.map((acc) => {
                const isSelected = selectedAccommodation === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setSelectedAccommodation(acc.id);
                      if (acc.id === "Low Vision") {
                        setSettings((prev) => ({
                          ...prev,
                          highContrast: true,
                          largeFont: true,
                          textToSpeech: true,
                        }));
                      } else if (acc.id === "Dyslexia") {
                        setSettings((prev) => ({
                          ...prev,
                          textToSpeech: true,
                          speechInput: true,
                        }));
                      } else if (acc.id === "Autism Spectrum Disorder" || acc.id === "ADHD") {
                        setSettings((prev) => ({
                          ...prev,
                          simplifiedLanguage: true,
                        }));
                      }
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-purple-600 bg-purple-50/80 ring-2 ring-purple-500 shadow-xs"
                        : "border-slate-200 hover:border-purple-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl shrink-0">{acc.icon}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-purple-700 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight mt-1">
                          {acc.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Universal Design Feature Toggles */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#002B49]" />
              Universal Accessibility Controls:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Text to Speech Read Aloud */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Audio Read-Aloud (TTS)</div>
                    <div className="text-[11px] text-slate-500">Read questions & responses</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.textToSpeech}
                  onChange={(e) => setSettings({ ...settings, textToSpeech: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Large High-Legibility Font */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    A+
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Large Magnified Font</div>
                    <div className="text-[11px] text-slate-500">Enlarge text across views</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.largeFont}
                  onChange={(e) => setSettings({ ...settings, largeFont: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* High Contrast Mode */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    🌓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">High Contrast Visuals</div>
                    <div className="text-[11px] text-slate-500">Deep borders & sharp text</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => setSettings({ ...settings, highContrast: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Speech to Text Input */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Voice Dictation (STT)</div>
                    <div className="text-[11px] text-slate-500">Speak questions into mic</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.speechInput}
                  onChange={(e) => setSettings({ ...settings, speechInput: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Test Audio Button */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-700" />
              <span className="text-xs text-blue-900 font-medium">
                Verify Text-to-Speech audio output on this device:
              </span>
            </div>
            <button
              type="button"
              onClick={handleTestAudio}
              disabled={isTestingAudio}
              className="px-3 py-1.5 bg-[#002B49] text-white rounded-xl text-xs font-bold hover:bg-[#001E33] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isTestingAudio ? "animate-bounce" : ""}`} />
              <span>{isTestingAudio ? "Speaking..." : "Test Audio"}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Persisted to Cloud Firestore</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Accommodations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
