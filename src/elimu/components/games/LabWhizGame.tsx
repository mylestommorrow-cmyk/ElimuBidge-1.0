// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  Beaker,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { LearnerProfile } from "../../types";

interface LabWhizGameProps {
  activeProfile: LearnerProfile;
  onExit: () => void;
  onUpdateScore?: (score: number) => void;
}

interface MatchPair {
  id: string;
  name: string;
  category: "Apparatus" | "Chemical" | "Biology" | "Safety";
  icon: string;
  description: string;
  cbeGrade: string;
}

const LAB_ITEMS: MatchPair[] = [
  {
    id: "bunsen",
    name: "Bunsen Burner",
    category: "Apparatus",
    icon: "🔥",
    description: "Used for heating substances using a gas flame with air-hole control",
    cbeGrade: "Grade 7 Pre-Technical",
  },
  {
    id: "beaker",
    name: "Measuring Cylinder",
    category: "Apparatus",
    icon: "🧪",
    description: "Accurately measures liquid volume in cubic centimeters (cm³)",
    cbeGrade: "Grade 6 Science",
  },
  {
    id: "microscope",
    name: "Light Microscope",
    category: "Apparatus",
    icon: "🔬",
    description: "Magnifies microscopic plant and animal cells for observation",
    cbeGrade: "Grade 8 Integrated Science",
  },
  {
    id: "oxygen",
    name: "Oxygen (O₂)",
    category: "Chemical",
    icon: "🫧",
    description: "Gas that relights a glowing splint; essential for aerobic respiration",
    cbeGrade: "Grade 8 Science",
  },
  {
    id: "chlorophyll",
    name: "Chlorophyll",
    category: "Biology",
    icon: "🍃",
    description: "Green pigment in chloroplasts that absorbs sunlight during photosynthesis",
    cbeGrade: "Grade 7 Biology",
  },
  {
    id: "litmus",
    name: "Blue & Red Litmus",
    category: "Apparatus",
    icon: "📄",
    description: "Acid-base indicators: turns red in acids and blue in basic alkaline solutions",
    cbeGrade: "Grade 8 Chemistry",
  },
  {
    id: "goggles",
    name: "Safety Goggles",
    category: "Safety",
    icon: "🥽",
    description: "Essential eye protection against chemical splashes and glass shrapnel",
    cbeGrade: "Grade 7 Lab Safety",
  },
  {
    id: "iodine",
    name: "Iodine Solution",
    category: "Chemical",
    icon: "🧪",
    description: "Turns blue-black in the presence of starch during food testing",
    cbeGrade: "Grade 6 Health",
  },
];

export const LabWhizGame: React.FC<LabWhizGameProps> = ({
  activeProfile,
  onExit,
  onUpdateScore,
}) => {
  const [selectedItem, setSelectedItem] = useState<MatchPair | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shuffledDescriptions, setShuffledDescriptions] = useState<MatchPair[]>([]);

  useEffect(() => {
    // Shuffle descriptions independently from names
    const shuffled = [...LAB_ITEMS].sort(() => Math.random() - 0.5);
    setShuffledDescriptions(shuffled);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  // Audio synthesize
  const playSound = (isCorrect: boolean) => {
    if (muted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (isCorrect) {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.exponentialRampToValueAtTime(784, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {}
  };

  const handleSelectName = (item: MatchPair) => {
    if (matchedIds.includes(item.id)) return;
    setSelectedItem(item);
  };

  const handleSelectDescription = (targetItem: MatchPair) => {
    if (!selectedItem || matchedIds.includes(targetItem.id)) return;

    setAttempts((a) => a + 1);

    if (selectedItem.id === targetItem.id) {
      // Correct Match!
      playSound(true);
      const newMatched = [...matchedIds, targetItem.id];
      setMatchedIds(newMatched);
      setScore((s) => s + 150 + Math.floor(timeLeft * 1.5));
      setSelectedItem(null);

      if (newMatched.length === LAB_ITEMS.length) {
        setGameOver(true);
      }
    } else {
      // Wrong Match
      playSound(false);
      setSelectedItem(null);
    }
  };

  const handleRestart = () => {
    setMatchedIds([]);
    setSelectedItem(null);
    setScore(0);
    setAttempts(0);
    setTimeLeft(60);
    setGameOver(false);
    setShuffledDescriptions([...LAB_ITEMS].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-teal-800/40 p-4 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
            ⚗️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                Lab Whiz & Circuit Match
              </span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                Integrated Science
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Researcher: <span className="text-teal-300 font-semibold">{activeProfile.name}</span>{" "}
              ({activeProfile.grade})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-teal-400" />
            )}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            Exit Game
          </button>
        </div>
      </div>

      {!gameOver ? (
        <div className="mt-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Lab Timer</span>
              </div>
              <div
                className={`text-xl sm:text-2xl font-black mt-0.5 ${timeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-amber-400"}`}
              >
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Lab Points</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-teal-400 mt-0.5 tabular-nums">
                {score}
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                <span>Matched</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {matchedIds.length} / {LAB_ITEMS.length}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-800/60 p-3 rounded-2xl border border-slate-700 text-center">
            👉 <span className="text-teal-300 font-bold">Step 1:</span> Click a Science Term on the
            left. <span className="text-teal-300 font-bold">Step 2:</span> Click its matching CBE
            definition on the right!
          </div>

          {/* Dual Column Matching Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Science Apparatus / Terms */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Lab Apparatus & Elements:
              </div>
              {LAB_ITEMS.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedItem?.id === item.id;

                let cardStyle =
                  "bg-slate-800/80 border-slate-700 hover:border-teal-400 hover:bg-slate-750 text-white";

                if (isMatched) {
                  cardStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 opacity-60";
                } else if (isSelected) {
                  cardStyle =
                    "bg-teal-950/80 border-teal-400 text-white ring-2 ring-teal-400 shadow-md shadow-teal-500/20";
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectName(item)}
                    disabled={isMatched}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-white">{item.name}</div>
                        <div className="text-[10px] text-teal-400">{item.cbeGrade}</div>
                      </div>
                    </div>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Definitions & CBE Functions */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Function / Curriculum Use:
              </div>
              {shuffledDescriptions.map((item) => {
                const isMatched = matchedIds.includes(item.id);

                let cardStyle =
                  "bg-slate-800/80 border-slate-700 hover:border-teal-400 hover:bg-slate-750 text-white";
                if (isMatched) {
                  cardStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 opacity-60";
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectDescription(item)}
                    disabled={isMatched || !selectedItem}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between gap-2.5 transition-all cursor-pointer disabled:opacity-50 ${cardStyle}`}
                  >
                    <div className="text-xs sm:text-sm text-slate-200 leading-snug">
                      {item.description}
                    </div>
                    {isMatched && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Lab Complete Screen */
        <div className="mt-8 text-center space-y-6 py-6">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border-2 border-teal-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Lab Experiment Mastered!
            </h3>
            <p className="text-sm text-slate-400">
              Outstanding science aptitude,{" "}
              <span className="text-teal-300 font-semibold">{activeProfile.name}</span>!
            </p>
          </div>

          <div className="max-w-xs mx-auto p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Total Lab Score
            </div>
            <div className="text-4xl font-black text-teal-400 tabular-nums">{score}</div>
            <div className="text-xs text-slate-400">
              Matched: {matchedIds.length} / {LAB_ITEMS.length} in {attempts} tries
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Lab</span>
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
            >
              Back to Arcade Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
