// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  Zap,
  Play,
  RotateCcw,
  Star,
  CheckCircle2,
} from "lucide-react";
import { LearnerProfile } from "../types";
import { ElimuGame } from "./ElimuGame";
import { WordSafariGame } from "./games/WordSafariGame";
import { MathsMatrixGame } from "./games/MathsMatrixGame";
import { LabWhizGame } from "./games/LabWhizGame";

interface GameArcadeHubProps {
  activeProfile: LearnerProfile;
  onUpdateScore?: (game: string, score: number) => void;
}

type ActiveGame = "none" | "savannah" | "wordsafari" | "mathsmatrix" | "labwhiz";

export const GameArcadeHub: React.FC<GameArcadeHubProps> = ({ activeProfile, onUpdateScore }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>("none");

  if (activeGame === "savannah") {
    return (
      <ElimuGame
        activeProfile={activeProfile}
        onExitGame={() => setActiveGame("none")}
        onUpdateScore={(s) => onUpdateScore?.("Savannah Runner", s)}
      />
    );
  }

  if (activeGame === "wordsafari") {
    return (
      <WordSafariGame
        activeProfile={activeProfile}
        onExit={() => setActiveGame("none")}
        onUpdateScore={(s) => onUpdateScore?.("Word Safari", s)}
      />
    );
  }

  if (activeGame === "mathsmatrix") {
    return (
      <MathsMatrixGame
        activeProfile={activeProfile}
        onExit={() => setActiveGame("none")}
        onUpdateScore={(s) => onUpdateScore?.("Maths Matrix", s)}
      />
    );
  }

  if (activeGame === "labwhiz") {
    return (
      <LabWhizGame
        activeProfile={activeProfile}
        onExit={() => setActiveGame("none")}
        onUpdateScore={(s) => onUpdateScore?.("Lab Whiz", s)}
      />
    );
  }

  const gamesList = [
    {
      id: "savannah" as ActiveGame,
      title: "ElimuSprint: Savannah Arcade",
      tagline: "Kenyan Wildlife 2D Parkour & Checkpoint Quiz",
      subject: "Environmental & General CBE",
      color: "from-amber-500 to-orange-600",
      badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "🏃💨",
      description:
        "Sprint across Maasai Mara & Mount Kenya, leap over obstacles, grab Shilingi coins, and answer quick CBE quiz checkpoints!",
      grades: "Playgroup to Grade 9",
      features: ["2D Physics Runner", "Checkpoint Qs", "Sound Synth FX"],
    },
    {
      id: "wordsafari" as ActiveGame,
      title: "Elimu Word Safari",
      tagline: "Kiswahili & English Vocabulary Unscrambler",
      subject: "Languages & Literacy",
      color: "from-emerald-500 to-teal-600",
      badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: "🦁🔤",
      description:
        "Race the countdown clock to decode curriculum terms in Kiswahili and English with KICD clues and letter hints.",
      grades: "Grade 1 to Grade 10",
      features: ["Bilingual Drills", "CBE Clues", "Time Streak Multiplier"],
    },
    {
      id: "mathsmatrix" as ActiveGame,
      title: "Maths Matrix Blitz",
      tagline: "Rapid Mental Arithmetic & Financial Literacy",
      subject: "Mathematics & Pre-Technical",
      color: "from-blue-600 to-cyan-500",
      badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
      icon: "⚡🔢",
      description:
        "Fast-paced mental math blitz! Solve Kenyan currency KES change, algebra, fractions, and multiplication tables against the clock.",
      grades: "Upper Primary & Junior School",
      features: ["KES Money Math", "Multiplier Combos", "Speed Timer"],
    },
    {
      id: "labwhiz" as ActiveGame,
      title: "Lab Whiz & Science Match",
      tagline: "Interactive Science Apparatus & Biology Lab",
      subject: "Integrated Science & Health",
      color: "from-teal-600 to-emerald-700",
      badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
      icon: "⚗️🔬",
      description:
        "Test your lab skills! Match apparatus (Bunsen burners, litmus, microscopes) and biology elements with their real CBE experiment functions.",
      grades: "Grade 4 to Grade 12",
      features: ["Lab Apparatus", "Safety Badges", "Memory Match"],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002B49] via-[#003d66] to-[#002B49] p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2A900]/20 border border-[#F2A900]/30 text-[#F2A900] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Interactive Curriculum Mini-Games</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Kenya CBE Learning Arcade
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Reinforce key competency areas through gamified drills. Earn mastery points, level up
            your profile, and test your speed across languages, mathematics, sciences, and
            environmental studies!
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-slate-300">
            <span>
              🎮 Active Player: <strong className="text-[#F2A900]">{activeProfile.name}</strong>
            </span>
            <span>·</span>
            <span>
              🎓 Grade: <strong>{activeProfile.grade}</strong>
            </span>
          </div>
        </div>

        {/* Decorative Graphic Icons */}
        <div className="absolute right-6 -bottom-6 text-8xl sm:text-9xl opacity-20 select-none pointer-events-none">
          🎮
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gamesList.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr text-3xl flex items-center justify-center shadow-md shrink-0">
                  {game.icon}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${game.badgeBg}`}
                  >
                    {game.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{game.grades}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#002B49] transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-medium text-purple-700 mt-0.5">{game.tagline}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{game.description}</p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {game.features.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveGame(game.id)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#002B49] to-[#003d66] hover:from-[#001f35] hover:to-[#002B49] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:translate-x-0.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-[#F2A900]" />
                <span>Launch {game.title.split(":")[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
