// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Calculator,
  ChevronRight,
} from "lucide-react";
import { LearnerProfile } from "../../types";

interface MathsMatrixGameProps {
  activeProfile: LearnerProfile;
  onExit: () => void;
  onUpdateScore?: (score: number) => void;
}

interface MathProblem {
  question: string;
  options: number[];
  answer: number;
  gradeTier: string;
  context: string;
}

const GENERATE_MATH_PROBLEMS = (): MathProblem[] => [
  {
    question: "What is 15 × 8?",
    options: [110, 120, 125, 130],
    answer: 120,
    gradeTier: "Upper Primary",
    context: "Multiplication",
  },
  {
    question: "A book costs KES 450. You pay KES 1,000 note. What is the change?",
    options: [450, 500, 550, 650],
    answer: 550,
    gradeTier: "Grade 5 Financial Literacy",
    context: "Currency & Subtraction",
  },
  {
    question: "Solve for x: 3x + 12 = 36",
    options: [6, 8, 9, 12],
    answer: 8,
    gradeTier: "Junior School (Grade 8)",
    context: "Linear Equations",
  },
  {
    question: "What is 25% of 640kg of maize harvest?",
    options: [140, 160, 180, 200],
    answer: 160,
    gradeTier: "Upper Primary (Grade 6)",
    context: "Percentages & Weights",
  },
  {
    question: "What is the square root of 289?",
    options: [13, 17, 19, 21],
    answer: 17,
    gradeTier: "Junior School",
    context: "Roots & Indices",
  },
  {
    question: "A rectangular shamba measures 24m by 15m. What is its area in m²?",
    options: [320, 360, 390, 420],
    answer: 360,
    gradeTier: "Grade 6 Measurement",
    context: "Geometry & Area",
  },
  {
    question: "What is 7 × 9 + 18?",
    options: [71, 79, 81, 85],
    answer: 81,
    gradeTier: "Grade 4 Order of Ops",
    context: "Mental Arithmetic",
  },
  {
    question: "If 4 exercise books cost KES 200, what will 9 exercise books cost?",
    options: [400, 450, 500, 550],
    answer: 450,
    gradeTier: "Grade 7 Pre-Technical",
    context: "Unitary Method",
  },
  {
    question: "Find the perimeter of an equilateral triangle with sides 14cm:",
    options: [28, 42, 56, 196],
    answer: 42,
    gradeTier: "Grade 5 Geometry",
    context: "Perimeter",
  },
  {
    question: "Solve: 5² + 12²",
    options: [144, 169, 175, 196],
    answer: 169,
    gradeTier: "Junior School (Grade 8)",
    context: "Pythagoras Relation",
  },
  {
    question: "Convert 3.5 liters into milliliters (ml):",
    options: [35, 350, 3500, 35000],
    answer: 3500,
    gradeTier: "Upper Primary",
    context: "Volume & Capacity",
  },
  {
    question: "What is 84 ÷ 7?",
    options: [11, 12, 13, 14],
    answer: 12,
    gradeTier: "Lower Primary / Grade 4",
    context: "Division",
  },
  {
    question:
      "A bus traveled from Nairobi to Nakuru (160 km) in 2 hours. What was its average speed in km/h?",
    options: [60, 70, 80, 90],
    answer: 80,
    gradeTier: "Junior School",
    context: "Speed & Distance",
  },
  {
    question: "Simplify: 2/5 + 3/10",
    options: [1 / 2, 7 / 10, 5 / 15, 4 / 5],
    answer: 7 / 10,
    gradeTier: "Grade 6 Fractions",
    context: "Fractions (7/10 = 0.7)",
  },
  {
    question: "What is 18 × 15?",
    options: [250, 270, 280, 290],
    answer: 270,
    gradeTier: "Upper Primary",
    context: "Fast Mental Math",
  },
];

export const MathsMatrixGame: React.FC<MathsMatrixGameProps> = ({
  activeProfile,
  onExit,
  onUpdateScore,
}) => {
  const [problems] = useState<MathProblem[]>(() => GENERATE_MATH_PROBLEMS());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [muted, setMuted] = useState(false);

  const currentProblem = problems[currentIdx % problems.length];

  // Procedural Sound Effects
  const playSound = (type: "correct" | "wrong" | "combo") => {
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

      if (type === "correct") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "combo") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.exponentialRampToValueAtTime(1174, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // AudioContext unavailable
    }
  };

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

  const handleSelectOption = (opt: number) => {
    if (selectedOption !== null || gameOver) return;
    setSelectedOption(opt);

    const isCorrect = opt === currentProblem.answer;

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const nextCombo = nextStreak >= 3 ? 2 : nextStreak >= 5 ? 3 : 1;
      setCombo(nextCombo);

      if (nextCombo > 1) {
        playSound("combo");
      } else {
        playSound("correct");
      }

      const pointsEarned = 100 * nextCombo + Math.floor(timeLeft / 2);
      setScore((s) => s + pointsEarned);
      setFeedback("correct");
      setTimeLeft((t) => Math.min(t + 4, 50)); // Time bonus for speed

      setTimeout(() => {
        setSelectedOption(null);
        setFeedback(null);
        if (currentIdx + 1 >= problems.length) {
          setGameOver(true);
        } else {
          setCurrentIdx((idx) => idx + 1);
        }
      }, 500);
    } else {
      playSound("wrong");
      setStreak(0);
      setCombo(1);
      setFeedback("wrong");

      setTimeout(() => {
        setSelectedOption(null);
        setFeedback(null);
        setCurrentIdx((idx) => (idx + 1) % problems.length);
      }, 800);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setCombo(1);
    setTimeLeft(40);
    setGameOver(false);
    setSelectedOption(null);
    setFeedback(null);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-blue-900/40 p-4 sm:p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background Matrix Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                Maths Matrix Blitz
              </span>
              <span className="text-[10px] bg-blue-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                Speed Drill
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Pilot: <span className="text-cyan-300 font-semibold">{activeProfile.name}</span> (
              {activeProfile.grade})
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
              <Volume2 className="w-4 h-4 text-cyan-400" />
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
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Timer</span>
              </div>
              <div
                className={`text-lg sm:text-xl font-black mt-0.5 ${timeLeft <= 8 ? "text-rose-400 animate-ping" : "text-amber-400"}`}
              >
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-cyan-400" />
                <span>Score</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5 tabular-nums">
                {score}
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>Streak</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-orange-400 mt-0.5">{streak}</div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Multiplier</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-yellow-400 mt-0.5">{combo}x</div>
            </div>
          </div>

          {/* Matrix Problem Canvas */}
          <div
            className={`rounded-3xl p-6 sm:p-10 border transition-all text-center ${
              feedback === "correct"
                ? "bg-blue-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20"
                : feedback === "wrong"
                  ? "bg-rose-950/70 border-rose-500 animate-shake"
                  : "bg-slate-900/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700">
                Problem {currentIdx + 1} of {problems.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">
                {currentProblem.gradeTier} · {currentProblem.context}
              </span>
            </div>

            {/* Problem Text */}
            <div className="my-6">
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-wide leading-snug">
                {currentProblem.question}
              </h3>
            </div>

            {/* Multiple Choice Grid */}
            <div className="grid grid-cols-2 gap-3.5 mt-8 max-w-lg mx-auto">
              {currentProblem.options.map((opt, optIdx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentProblem.answer;

                let btnStyles =
                  "bg-slate-800/90 border-slate-700 hover:border-cyan-400 hover:bg-slate-750 text-white";

                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyles =
                      "bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-400";
                  } else if (isSelected && !isCorrect) {
                    btnStyles =
                      "bg-rose-600 border-rose-400 text-white font-bold ring-2 ring-rose-400";
                  } else {
                    btnStyles = "bg-slate-800/40 border-slate-800 text-slate-500 opacity-40";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={selectedOption !== null}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-xl sm:text-2xl font-black transition-all transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 ${btnStyles}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                    {selectedOption !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Blitz Complete Screen */
        <div className="mt-8 text-center space-y-6 py-6">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border-2 border-cyan-500/30">
            <Calculator className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Maths Matrix Completed!
            </h3>
            <p className="text-sm text-slate-400">
              Outstanding mental computation,{" "}
              <span className="text-cyan-300 font-semibold">{activeProfile.name}</span>!
            </p>
          </div>

          <div className="max-w-xs mx-auto p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Total Blitz Score
            </div>
            <div className="text-4xl font-black text-cyan-400 tabular-nums">{score}</div>
            <div className="text-xs text-slate-400">
              Problems Completed: {Math.min(currentIdx + 1, problems.length)} / {problems.length}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Blitz</span>
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
