// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  X,
  Award,
  Sparkles,
  Zap,
  ArrowLeft,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { LearnerProfile } from "../types";

interface ElimuGameProps {
  onExitGame: () => void;
  activeProfile: LearnerProfile;
  onUpdateScore?: (score: number) => void;
}

// Procedural Web Audio Synthesizer (Zero external audio file dependencies)
class SoundSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  jump() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  collect() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  correct() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }

  hit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  victory() {
    if (this.muted || !this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.42);
    });
  }
}

// Quick curriculum checkpoints to encounter in the sprint
const SPRINT_QUESTIONS = [
  {
    q: "3x + 6 = 21. Solve for x:",
    options: ["x = 4", "x = 5", "x = 7"],
    correctLane: 1, // Lane 0, 1, or 2
    subject: "Math",
  },
  {
    q: "Which vessel transports water in plants?",
    options: ["Phloem", "Xylem", "Stomata"],
    correctLane: 1,
    subject: "Biology",
  },
  {
    q: 'Nomino "ndege" imo katika ngeli gani?',
    options: ["A-WA", "KI-VI", "I-ZI"],
    correctLane: 0,
    subject: "Kiswahili",
  },
  {
    q: "Soil conservation throwing soil uphill:",
    options: ["Fanya Chini", "Fanya Juu", "Gully Plug"],
    correctLane: 1,
    subject: "Agriculture",
  },
  {
    q: "Angle in a semicircle equals:",
    options: ["45°", "90°", "180°"],
    correctLane: 1,
    subject: "Math",
  },
];

export const ElimuGame: React.FC<ElimuGameProps> = ({
  onExitGame,
  activeProfile,
  onUpdateScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const soundRef = useRef<SoundSynth>(new SoundSynth());

  // Game UI States
  const [gameState, setGameState] = useState<
    "title" | "playing" | "paused" | "gameover" | "victory"
  >("title");
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("elimubridge_sprint_highscore") || "0", 10);
  });
  const [currentCheckpoint, setCurrentCheckpoint] = useState<(typeof SPRINT_QUESTIONS)[0] | null>(
    null,
  );
  const [checkpointCountdown, setCheckpointCountdown] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1);

  // Mutable Game Loop State
  const gameRef = useRef({
    lane: 1, // 0: Left, 1: Center, 2: Right
    targetLaneX: 0,
    playerX: 0,
    playerY: 0,
    playerVy: 0,
    isJumping: false,
    speed: 400, // pixels per second
    distanceRan: 0,
    totalDistanceGoal: 3500,
    obstacles: [] as {
      x: number;
      y: number;
      lane: number;
      type: "rock" | "pothole";
      hit: boolean;
    }[],
    gems: [] as { x: number; y: number; lane: number; collected: boolean; value: number }[],
    checkpoints: [] as { y: number; question: (typeof SPRINT_QUESTIONS)[0]; passed: boolean }[],
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }[],
    screenShake: 0,
    hitStop: 0,
    lastTime: performance.now(),
    keysHeld: { left: false, right: false, jump: false },
    activeCheckpoint: null as (typeof SPRINT_QUESTIONS)[0] | null,
    score: 0,
  });

  const toggleSound = () => {
    soundRef.current.muted = !soundRef.current.muted;
    setIsMuted(soundRef.current.muted);
  };

  const handleStartGame = () => {
    soundRef.current.init();
    soundRef.current.jump();

    // Reset game data
    const g = gameRef.current;
    g.lane = 1;
    g.playerVy = 0;
    g.isJumping = false;
    g.speed = 380;
    g.distanceRan = 0;
    g.score = 0;
    g.screenShake = 0;
    g.hitStop = 0;
    g.obstacles = [];
    g.gems = [];
    g.checkpoints = [];
    g.particles = [];
    g.activeCheckpoint = null;
    g.lastTime = performance.now();

    // Pre-seed first batch of obstacles, gems, and checkpoints
    let currentY = -400;
    for (let i = 0; i < 25; i++) {
      currentY -= 350 + Math.random() * 200;
      // Add checkpoint question every 5 items
      if (i > 0 && i % 5 === 0) {
        const qIdx = Math.floor(i / 5) % SPRINT_QUESTIONS.length;
        g.checkpoints.push({
          y: currentY,
          question: SPRINT_QUESTIONS[qIdx],
          passed: false,
        });
        currentY -= 300;
      } else {
        const lane = Math.floor(Math.random() * 3);
        if (Math.random() > 0.45) {
          g.obstacles.push({
            x: 0,
            y: currentY,
            lane,
            type: Math.random() > 0.5 ? "rock" : "pothole",
            hit: false,
          });
        }
        // Add Knowledge Gems on other lanes
        const gemLane = (lane + 1 + Math.floor(Math.random() * 2)) % 3;
        g.gems.push({
          x: 0,
          y: currentY,
          lane: gemLane,
          collected: false,
          value: 50,
        });
      }
    }

    setScore(0);
    setDistance(0);
    setComboMultiplier(1);
    setCurrentCheckpoint(null);
    setGameState("playing");
  };

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "title") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (e.code === "Escape") {
        setGameState((prev) =>
          prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev,
        );
        return;
      }

      if (gameState !== "playing") return;

      const g = gameRef.current;
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        if (g.lane > 0) {
          g.lane -= 1;
          soundRef.current.jump();
          spawnDustParticles();
        }
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        if (g.lane < 2) {
          g.lane += 1;
          soundRef.current.jump();
          spawnDustParticles();
        }
      } else if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (!g.isJumping) {
          g.isJumping = true;
          g.playerVy = -580;
          soundRef.current.jump();
          spawnDustParticles();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const spawnDustParticles = () => {
    const g = gameRef.current;
    for (let i = 0; i < 6; i++) {
      g.particles.push({
        x: g.playerX + (Math.random() - 0.5) * 20,
        y: g.playerY + 20,
        vx: (Math.random() - 0.5) * 60,
        vy: -Math.random() * 40 - 20,
        life: 0.3 + Math.random() * 0.2,
        maxLife: 0.5,
        color: "#F59E0B",
        size: 3 + Math.random() * 4,
      });
    }
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;

    const loop = (timestamp: number) => {
      animId = requestAnimationFrame(loop);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle Resize smoothly
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      const g = gameRef.current;
      const rawDt = (timestamp - g.lastTime) / 1000;
      g.lastTime = timestamp;
      const dt = Math.min(rawDt, 0.05);

      // Hit stop logic for crunchy game feel
      if (g.hitStop > 0) {
        g.hitStop -= dt;
        return;
      }

      if (gameState === "playing") {
        // Accelerate speed gradually as distance increases
        g.speed += dt * 8;
        g.distanceRan += g.speed * dt;

        // Lane geometry
        const roadWidth = Math.min(width * 0.75, 480);
        const roadLeft = (width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;
        const targetX = roadLeft + g.lane * laneWidth + laneWidth / 2;
        g.playerX += (targetX - g.playerX) * Math.min(1, dt * 14);

        // Player Jump Physics
        const groundY = height - 160;
        if (g.isJumping) {
          g.playerY += g.playerVy * dt;
          g.playerVy += 1350 * dt; // Gravity
          if (g.playerY >= groundY) {
            g.playerY = groundY;
            g.playerVy = 0;
            g.isJumping = false;
            spawnDustParticles();
          }
        } else {
          g.playerY = groundY;
        }

        // Screen Shake decay
        if (g.screenShake > 0) {
          g.screenShake = Math.max(0, g.screenShake - dt * 25);
        }

        // Checkpoint proximity checks
        let activeCheckpointFound = false;
        for (const cp of g.checkpoints) {
          const screenY = groundY - (cp.y - -g.distanceRan);
          if (screenY > 100 && screenY < height && !cp.passed) {
            activeCheckpointFound = true;
            if (!g.activeCheckpoint) {
              g.activeCheckpoint = cp.question;
              setCurrentCheckpoint(cp.question);
            }

            // Check if player reaches the checkpoint gate
            if (screenY >= groundY - 20) {
              cp.passed = true;
              if (g.lane === cp.question.correctLane) {
                // Correct Lane!
                soundRef.current.correct();
                g.score += 250;
                // Burst celebration particles
                for (let p = 0; p < 25; p++) {
                  g.particles.push({
                    x: g.playerX,
                    y: g.playerY,
                    vx: (Math.random() - 0.5) * 300,
                    vy: -Math.random() * 250 - 50,
                    life: 0.6 + Math.random() * 0.4,
                    maxLife: 1.0,
                    color: Math.random() > 0.5 ? "#10B981" : "#F59E0B",
                    size: 5 + Math.random() * 4,
                  });
                }
              } else {
                // Wrong lane penalty
                soundRef.current.hit();
                g.screenShake = 15;
                g.hitStop = 0.08;
                g.score = Math.max(0, g.score - 100);
              }
              g.activeCheckpoint = null;
              setCurrentCheckpoint(null);
            }
            break;
          }
        }

        if (!activeCheckpointFound && g.activeCheckpoint) {
          g.activeCheckpoint = null;
          setCurrentCheckpoint(null);
        }

        // Collision detection for Obstacles
        for (const obs of g.obstacles) {
          const screenY = groundY - (obs.y - -g.distanceRan);
          const obsX = roadLeft + obs.lane * laneWidth + laneWidth / 2;
          obs.x = obsX;

          if (!obs.hit && screenY > groundY - 40 && screenY < groundY + 30) {
            if (Math.abs(g.playerX - obsX) < laneWidth * 0.42) {
              // If not jumped over a pothole or hit a rock
              if (!g.isJumping || obs.type === "rock") {
                obs.hit = true;
                soundRef.current.hit();
                g.screenShake = 18;
                g.hitStop = 0.08;
                g.speed = Math.max(280, g.speed - 90);
                g.score = Math.max(0, g.score - 75);

                for (let p = 0; p < 12; p++) {
                  g.particles.push({
                    x: obsX,
                    y: screenY,
                    vx: (Math.random() - 0.5) * 160,
                    vy: -Math.random() * 120,
                    life: 0.4,
                    maxLife: 0.4,
                    color: "#EF4444",
                    size: 4,
                  });
                }
              }
            }
          }
        }

        // Collision detection for Knowledge Gems
        for (const gem of g.gems) {
          const screenY = groundY - (gem.y - -g.distanceRan);
          const gemX = roadLeft + gem.lane * laneWidth + laneWidth / 2;
          gem.x = gemX;

          if (!gem.collected && screenY > groundY - 45 && screenY < groundY + 25) {
            if (Math.abs(g.playerX - gemX) < laneWidth * 0.45) {
              gem.collected = true;
              soundRef.current.collect();
              g.score += gem.value;

              for (let p = 0; p < 8; p++) {
                g.particles.push({
                  x: gemX,
                  y: screenY,
                  vx: (Math.random() - 0.5) * 120,
                  vy: -Math.random() * 100 - 30,
                  life: 0.35,
                  maxLife: 0.35,
                  color: "#A855F7",
                  size: 4,
                });
              }
            }
          }
        }

        // Victory check
        if (g.distanceRan >= g.totalDistanceGoal) {
          soundRef.current.victory();
          setGameState("victory");
          if (g.score > highScore) {
            setHighScore(g.score);
            localStorage.setItem("elimubridge_sprint_highscore", String(g.score));
          }
          if (onUpdateScore) onUpdateScore(g.score);
        }

        // State update for UI overlay
        setScore(Math.floor(g.score + g.distanceRan * 0.05));
        setDistance(Math.min(100, Math.round((g.distanceRan / g.totalDistanceGoal) * 100)));
      }

      // ================= DRAW SCENE =================
      ctx.save();

      // Camera screen shake
      if (g.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * g.screenShake;
        const shakeY = (Math.random() - 0.5) * g.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Vibrant Sky & Kenyan Savannah Landscape Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#3B0764"); // Deep Violet
      skyGrad.addColorStop(0.35, "#7C3AED"); // Brand Purple
      skyGrad.addColorStop(0.7, "#F97316"); // Vibrant Amber Sunset
      skyGrad.addColorStop(1, "#FEF08A"); // Warm Horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant rolling hills
      ctx.fillStyle = "#6D28D9";
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      ctx.bezierCurveTo(
        width * 0.25,
        height * 0.58,
        width * 0.5,
        height * 0.68,
        width,
        height * 0.62,
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Foreground Savannah plain
      const plainGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
      plainGrad.addColorStop(0, "#15803D"); // Lush Acacia green
      plainGrad.addColorStop(1, "#166534");
      ctx.fillStyle = plainGrad;
      ctx.fillRect(0, height * 0.65, width, height * 0.35);

      // 2. 3D-perspective Sprint Track (Road)
      const roadWidth = Math.min(width * 0.75, 480);
      const roadLeft = (width - roadWidth) / 2;
      const roadRight = roadLeft + roadWidth;
      const roadTopWidth = roadWidth * 0.35;
      const roadTopLeft = (width - roadTopWidth) / 2;
      const roadTopRight = roadTopLeft + roadTopWidth;
      const horizonY = height * 0.45;

      ctx.fillStyle = "#1E1B4B"; // Deep midnight tarmac
      ctx.beginPath();
      ctx.moveTo(roadLeft, height);
      ctx.lineTo(roadRight, height);
      ctx.lineTo(roadTopRight, horizonY);
      ctx.lineTo(roadTopLeft, horizonY);
      ctx.closePath();
      ctx.fill();

      // Glowing track borders
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(roadLeft, height);
      ctx.lineTo(roadTopLeft, horizonY);
      ctx.moveTo(roadRight, height);
      ctx.lineTo(roadTopRight, horizonY);
      ctx.stroke();

      // Lane dividers (3 Lanes: 0, 1, 2)
      const laneWidth = roadWidth / 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -g.distanceRan * 0.8;

      for (let i = 1; i <= 2; i++) {
        const bottomLaneX = roadLeft + i * laneWidth;
        const topLaneX = roadTopLeft + i * (roadTopWidth / 3);
        ctx.beginPath();
        ctx.moveTo(bottomLaneX, height);
        ctx.lineTo(topLaneX, horizonY);
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset dash

      // 3. Render Upcoming Checkpoint Gates
      for (const cp of g.checkpoints) {
        const screenY = height - 160 - (cp.y - -g.distanceRan);
        if (screenY > horizonY && screenY < height + 80) {
          // Checkpoint overhead banner
          ctx.fillStyle = "rgba(124, 58, 237, 0.85)";
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 3;
          ctx.fillRect(roadLeft - 20, screenY - 45, roadWidth + 40, 45);
          ctx.strokeRect(roadLeft - 20, screenY - 45, roadWidth + 40, 45);

          // Subject banner text
          ctx.fillStyle = "#FFFFFF";
          ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = "center";
          ctx.fillText(`⚡ CBE CHECKPOINT: Choose Correct Lane!`, width / 2, screenY - 26);

          // Lane choice labels (A, B, C)
          cp.question.options.forEach((opt, oIdx) => {
            const laneX = roadLeft + oIdx * laneWidth + laneWidth / 2;
            ctx.fillStyle = "#FEF08A";
            ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(`${String.fromCharCode(65 + oIdx)}: ${opt}`, laneX, screenY - 8);
          });
        }
      }

      // 4. Render Knowledge Gems (Purple glowing crystals)
      for (const gem of g.gems) {
        if (!gem.collected) {
          const screenY = height - 160 - (gem.y - -g.distanceRan);
          if (screenY > horizonY && screenY < height + 40) {
            const gemX = roadLeft + gem.lane * laneWidth + laneWidth / 2;
            ctx.save();
            ctx.translate(gemX, screenY);
            // Floating bounce
            const bounce = Math.sin(timestamp * 0.008 + gem.lane) * 6;
            ctx.translate(0, bounce);

            // Gem glow
            const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
            glow.addColorStop(0, "rgba(168, 85, 247, 0.9)");
            glow.addColorStop(1, "rgba(168, 85, 247, 0)");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();

            // Diamond crystal
            ctx.fillStyle = "#C084FC";
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(8, 0);
            ctx.lineTo(0, 10);
            ctx.lineTo(-8, 0);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 5. Render Obstacles (Savannah Boulders & Potholes)
      for (const obs of g.obstacles) {
        const screenY = height - 160 - (obs.y - -g.distanceRan);
        if (screenY > horizonY && screenY < height + 40) {
          const obsX = roadLeft + obs.lane * laneWidth + laneWidth / 2;
          ctx.save();
          ctx.translate(obsX, screenY);

          if (obs.type === "rock") {
            // Boulder
            ctx.fillStyle = "#78350F";
            ctx.beginPath();
            ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#92400E";
            ctx.beginPath();
            ctx.ellipse(-3, -3, 10, 6, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Pothole (Jumpable hazard)
            ctx.fillStyle = "#0F172A";
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#EAB308";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 6. Render Particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) {
          g.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 7. Render Player Character (Kenyan Student Runner)
      const pX = g.playerX;
      const pY = g.playerY;

      // Drop shadow on ground
      const groundYFixed = height - 160;
      const jumpHeight = groundYFixed - pY;
      const shadowScale = Math.max(0.3, 1 - jumpHeight / 200);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(pX, groundYFixed + 14, 20 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Running animation bob
      const runCycle = Math.sin(timestamp * 0.015);

      // Student Uniform Body (Sweater & Badge)
      ctx.save();
      ctx.translate(pX, pY);

      // Legs / shoes
      ctx.fillStyle = "#0F172A";
      if (g.isJumping) {
        ctx.fillRect(-10, 8, 8, 12);
        ctx.fillRect(2, 6, 8, 12);
      } else {
        ctx.fillRect(-10, 10 + runCycle * 6, 8, 14);
        ctx.fillRect(2, 10 - runCycle * 6, 8, 14);
      }

      // Uniform Sweater (Deep Emerald or Burgundy school uniform)
      ctx.fillStyle = "#047857";
      ctx.beginPath();
      ctx.roundRect(-14, -18, 28, 28, 6);
      ctx.fill();

      // School Tie / Collar
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(4, -8);
      ctx.lineTo(0, -2);
      ctx.lineTo(-4, -8);
      ctx.closePath();
      ctx.fill();

      // Student Backpack
      ctx.fillStyle = "#7C3AED";
      ctx.beginPath();
      ctx.roundRect(-16, -14, 6, 20, 3);
      ctx.fill();

      // Head
      ctx.fillStyle = "#78350F";
      ctx.beginPath();
      ctx.arc(0, -28, 10, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = "#09090B";
      ctx.beginPath();
      ctx.arc(0, -31, 10, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore]);

  // On-screen mobile touch triggers
  const moveLeft = () => {
    if (gameState !== "playing") return;
    const g = gameRef.current;
    if (g.lane > 0) {
      g.lane -= 1;
      soundRef.current.jump();
      spawnDustParticles();
    }
  };

  const moveRight = () => {
    if (gameState !== "playing") return;
    const g = gameRef.current;
    if (g.lane < 2) {
      g.lane += 1;
      soundRef.current.jump();
      spawnDustParticles();
    }
  };

  const triggerJump = () => {
    if (gameState !== "playing") return;
    const g = gameRef.current;
    if (!g.isJumping) {
      g.isJumping = true;
      g.playerVy = -580;
      soundRef.current.jump();
      spawnDustParticles();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none"
    >
      {/* 60fps Game Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* World-Matched Low-Occlusion HUD Overlay (<= 15% viewport obstruction) */}
      <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
        {/* Top Perimeter Status Cluster */}
        <div className="flex items-center justify-between gap-4 pointer-events-auto">
          {/* Exit & Mute Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExitGame}
              className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs border border-white/20 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Return to Study Portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit to Portal</span>
            </button>
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs border border-white/20 transition-all"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>

          {/* Current Score & Distance Readout */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xs border border-amber-400/40 text-right">
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Knowledge Score</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums leading-none mt-0.5">
                {score}
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xs border border-purple-400/40 text-right hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider text-purple-300 font-bold">
                Sprint Progress
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-purple-200 tabular-nums leading-none mt-0.5">
                {distance}%
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Question Prompt Banner on Screen when Checkpoint Gate is Active */}
        {currentCheckpoint && (
          <div className="mx-auto max-w-lg w-full bg-slate-900/90 backdrop-blur-md border-2 border-amber-400 p-4 rounded-3xl shadow-2xl text-center space-y-2 pointer-events-none animate-bounce-short">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentCheckpoint.subject} Revision Gate</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
              {currentCheckpoint.q}
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-1">
              {currentCheckpoint.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-purple-950/80 border border-purple-400/40 text-white"
                >
                  <span className="text-amber-300 mr-1">{String.fromCharCode(65 + idx)}:</span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-amber-300 font-semibold animate-pulse">
              Switch to Lane A (Left), B (Center), or C (Right) to pass!
            </div>
          </div>
        )}

        {/* Mobile On-Screen Action Pad (Touch Responsive) */}
        <div className="flex md:hidden items-center justify-between pointer-events-auto pb-2">
          <div className="flex items-center gap-3">
            <button
              onTouchStart={moveLeft}
              onClick={moveLeft}
              className="w-14 h-14 rounded-2xl bg-white/20 active:bg-white/40 border border-white/30 text-white font-extrabold text-xl flex items-center justify-center backdrop-blur-xs"
            >
              ←
            </button>
            <button
              onTouchStart={moveRight}
              onClick={moveRight}
              className="w-14 h-14 rounded-2xl bg-white/20 active:bg-white/40 border border-white/30 text-white font-extrabold text-xl flex items-center justify-center backdrop-blur-xs"
            >
              →
            </button>
          </div>
          <button
            onTouchStart={triggerJump}
            onClick={triggerJump}
            className="w-20 h-14 rounded-2xl bg-amber-500 active:bg-amber-600 border border-amber-300 text-slate-950 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center shadow-lg"
          >
            JUMP
          </button>
        </div>
      </div>

      {/* Title Screen Overlay */}
      {gameState === "title" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 text-center text-white space-y-6">
          {/* Bespoke inline SVG Title Lockup */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Kenyan Curriculum Revision Game</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-emerald-300">
              ELIMU SPRINT
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
              Sprint through the savannah, jump over obstacles, and steer into correct curriculum
              lanes to score top points for{" "}
              <span className="text-amber-400 font-bold">{activeProfile.name}</span>!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={handleStartGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-base shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>START SPRINT (SPACE)</span>
            </button>
            <button
              onClick={onExitGame}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors"
            >
              Back to Study Notes
            </button>
          </div>

          {/* Flat Single-line Control Hint */}
          <div className="text-xs text-slate-400 pt-4 flex flex-wrap items-center justify-center gap-3 font-mono">
            <span>A / D or ← / → Steer Lanes</span>
            <span>·</span>
            <span>SPACE or W Jump</span>
            <span>·</span>
            <span>ESC Pause</span>
          </div>
        </div>
      )}

      {/* Paused Modal */}
      {gameState === "paused" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md p-6 text-center text-white space-y-6">
          <h2 className="text-3xl font-extrabold">Game Paused</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGameState("playing")}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md"
            >
              Resume
            </button>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm"
            >
              Restart
            </button>
            <button
              onClick={onExitGame}
              className="px-6 py-3 rounded-2xl bg-rose-600/70 hover:bg-rose-600 text-white font-bold text-sm"
            >
              Quit
            </button>
          </div>
        </div>
      )}

      {/* Victory / Finish Modal */}
      {gameState === "victory" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 text-center text-white space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-300">
              Sprint Completed! Hongera!
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              You cleared all curriculum checkpoints and reached the national exam revision podium.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-900/50 border border-purple-400/40 grid grid-cols-2 gap-6 min-w-[280px]">
            <div>
              <div className="text-xs text-purple-300 font-semibold uppercase">Final Score</div>
              <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">{score}</div>
            </div>
            <div>
              <div className="text-xs text-purple-300 font-semibold uppercase">High Score</div>
              <div className="text-3xl font-extrabold text-amber-400 mt-1 tabular-nums">
                {highScore}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sprint Again</span>
            </button>
            <button
              onClick={onExitGame}
              className="px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm"
            >
              Back to Study Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
