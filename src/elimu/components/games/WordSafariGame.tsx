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
  HelpCircle,
  ArrowRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { LearnerProfile } from "../../types";

interface WordSafariGameProps {
  activeProfile: LearnerProfile;
  onExit: () => void;
  onUpdateScore?: (score: number) => void;
}

interface WordChallenge {
  scrambled: string;
  original: string;
  clue: string;
  language: "Kiswahili" | "English";
  gradeLevel: string;
  category: string;
}

const CBE_WORDS: WordChallenge[] = [
  {
    original: "MAZINGIRA",
    scrambled: "RAZINGIMA",
    clue: "Vitu vyote vinavyomzunguka mwanadamu (Kiswahili)",
    language: "Kiswahili",
    gradeLevel: "Grade 4",
    category: "Kiswahili / Science",
  },
  {
    original: "PHOTOSYNTHESIS",
    scrambled: "THOSISNTEHOPSY",
    clue: "Process by which green plants make food using sunlight",
    language: "English",
    gradeLevel: "Grade 8",
    category: "Integrated Science",
  },
  {
    original: "UTANDAWIZI",
    scrambled: "DAWIZIUTAN",
    clue: "Uhusiano wa kiulimwengu wa kiteknolojia na kiuchumi (Globalization)",
    language: "Kiswahili",
    gradeLevel: "Grade 9",
    category: "Kiswahili",
  },
  {
    original: "AGRICULTURE",
    scrambled: "CULTAGRIURE",
    clue: "Farming and rearing of livestock for national food security",
    language: "English",
    gradeLevel: "Grade 6",
    category: "Agriculture",
  },
  {
    original: "HEMOGLOBIN",
    scrambled: "BLINGOMEOH",
    clue: "Red protein responsible for transporting oxygen in blood",
    language: "English",
    gradeLevel: "Grade 7",
    category: "Health Science",
  },
  {
    original: "DEMOKRASIA",
    scrambled: "SIADAMOKRE",
    clue: "Utawala wa kidemokrasia na uongozi bora kwa wananchi",
    language: "Kiswahili",
    gradeLevel: "Grade 5",
    category: "Social Studies",
  },
  {
    original: "CONSERVATION",
    scrambled: "VATIONSCONER",
    clue: "Careful preservation and protection of wildlife in Kenyan national parks",
    language: "English",
    gradeLevel: "Grade 7",
    category: "Environment",
  },
  {
    original: "TAIFA",
    scrambled: "AIFAT",
    clue: "Kundi la watu wenye asili au nchi moja kama Kenya",
    language: "Kiswahili",
    gradeLevel: "PP2 / Grade 1",
    category: "Kiswahili",
  },
  {
    original: "CIRCUIT",
    scrambled: "RUICCIT",
    clue: "A closed loop that allows electric current to flow through",
    language: "English",
    gradeLevel: "Grade 8",
    category: "Pre-Technical",
  },
  {
    original: "KILIMO",
    scrambled: "MOLIKI",
    clue: "Shughuli ya kukuza mimea na kufuga mifugo shambani",
    language: "Kiswahili",
    gradeLevel: "Grade 2",
    category: "Kilimo",
  },
  {
    original: "RESPIRATION",
    scrambled: "TIONRESPIRA",
    clue: "Biochemical release of energy from glucose in living cells",
    language: "English",
    gradeLevel: "Grade 9",
    category: "Biology",
  },
  {
    original: "UZALENDO",
    scrambled: "LEZONDAU",
    clue: "Upendo mkuu wa dhati kwa nchi yako ya Kenya (Patriotism)",
    language: "Kiswahili",
    gradeLevel: "Grade 6",
    category: "CBE Core Values",
  },
  {
    original: "EQUATOR",
    scrambled: "ROTAEUQ",
    clue: "Imaginary line passing through Nanyuki and dividing earth into hemispheres",
    language: "English",
    gradeLevel: "Grade 5",
    category: "Social Studies",
  },
  {
    original: "MSAMIATI",
    scrambled: "TAMISAMIK",
    clue: "Jumla ya maneno yote katika lugha fulani kama Kiswahili",
    language: "Kiswahili",
    gradeLevel: "Grade 7",
    category: "Kiswahili",
  },
  {
    original: "IRRIGATION",
    scrambled: "GATIONIRRI",
    clue: "Artificial application of water to crops, like at Mwea Rice Scheme",
    language: "English",
    gradeLevel: "Grade 7",
    category: "Agriculture",
  },
];

export const WordSafariGame: React.FC<WordSafariGameProps> = ({
  activeProfile,
  onExit,
  onUpdateScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [revealedLetters, setRevealedLetters] = useState<number[]>([]);
  const [muted, setMuted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentWord = CBE_WORDS[currentIndex % CBE_WORDS.length];

  // Procedural Web Audio Chimes
  const playSound = (type: "correct" | "wrong" | "win") => {
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
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "win") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || gameOver) return;

    const isMatch = userInput.trim().toUpperCase() === currentWord.original.toUpperCase();

    if (isMatch) {
      playSound("correct");
      const points = 100 + (streak + 1) * 20 + timeLeft * 2;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setFeedback("correct");
      setTimeLeft((t) => Math.min(t + 8, 45)); // Reward time bonus

      setTimeout(() => {
        setFeedback(null);
        setUserInput("");
        setRevealedLetters([]);
        if (currentIndex + 1 >= CBE_WORDS.length) {
          setGameOver(true);
          playSound("win");
        } else {
          setCurrentIndex((idx) => idx + 1);
        }
      }, 700);
    } else {
      playSound("wrong");
      setStreak(0);
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
      }, 600);
    }
  };

  const handleRevealHint = () => {
    if (revealedLetters.length >= currentWord.original.length - 2) return;
    // Reveal next unrevealed letter
    for (let i = 0; i < currentWord.original.length; i++) {
      if (!revealedLetters.includes(i)) {
        setRevealedLetters((prev) => [...prev, i]);
        setScore((s) => Math.max(0, s - 25));
        break;
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput("");
    setScore(0);
    setStreak(0);
    setTimeLeft(35);
    setGameOver(false);
    setRevealedLetters([]);
    setFeedback(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-4 sm:p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
            🦁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                Elimu Word Safari
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Kiswahili & English
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Player: <span className="text-emerald-300 font-semibold">{activeProfile.name}</span> (
              {activeProfile.grade})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Exit Game
          </button>
        </div>
      </div>

      {!gameOver ? (
        <div className="mt-6 space-y-6">
          {/* Stats Header */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Left</span>
              </div>
              <div
                className={`text-xl sm:text-2xl font-black mt-0.5 ${timeLeft <= 8 ? "text-rose-400 animate-pulse" : "text-amber-400"}`}
              >
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safari Score</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 tabular-nums">
                {score}
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Streak</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-orange-400 mt-0.5">{streak}x</div>
            </div>
          </div>

          {/* Word Scramble Card */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 text-center relative ${
              feedback === "correct"
                ? "bg-emerald-950/60 border-emerald-500 scale-[1.01]"
                : feedback === "wrong"
                  ? "bg-rose-950/60 border-rose-500 animate-shake"
                  : "bg-slate-800/60 border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-slate-700/70 text-slate-300 font-bold border border-slate-600">
                Word {currentIndex + 1} of {CBE_WORDS.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                {currentWord.category} · {currentWord.gradeLevel}
              </span>
            </div>

            {/* Scrambled Letters Display */}
            <div className="my-6">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
                Unscramble this CBE Vocabulary Term:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {currentWord.scrambled.split("").map((letter, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-slate-600 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-md transform hover:-translate-y-0.5 transition-transform"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Clue Prompt */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto flex items-start gap-2.5 text-left">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">CBE Curriculum Clue: </span>
                <span>{currentWord.clue}</span>
              </div>
            </div>

            {/* Hint Letters (if revealed) */}
            {revealedLetters.length > 0 && (
              <div className="mt-3 text-xs text-emerald-400 font-mono tracking-widest">
                Hint:{" "}
                {currentWord.original
                  .split("")
                  .map((c, i) => (revealedLetters.includes(i) ? c : "_"))
                  .join(" ")}
              </div>
            )}

            {/* Answer Input */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
            >
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="Type the correct word..."
                disabled={feedback === "correct"}
                className="w-full px-5 py-3 rounded-2xl bg-slate-900 border-2 border-slate-700 text-white placeholder-slate-500 font-bold text-center tracking-wider text-base sm:text-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Hint Button */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleRevealHint}
                disabled={revealedLetters.length >= currentWord.original.length - 2}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reveal Letter Hint (-25 pts)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="mt-8 text-center space-y-6 py-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Safari Run Finished!</h3>
            <p className="text-sm text-slate-400">
              Great spelling and vocabulary work,{" "}
              <span className="text-emerald-300 font-semibold">{activeProfile.name}</span>!
            </p>
          </div>

          <div className="max-w-xs mx-auto p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Final Score
            </div>
            <div className="text-4xl font-black text-emerald-400 tabular-nums">{score}</div>
            <div className="text-xs text-slate-400">
              Solved: {currentIndex} / {CBE_WORDS.length} words
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
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
