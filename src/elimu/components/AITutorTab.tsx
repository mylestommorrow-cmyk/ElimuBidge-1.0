// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect, useRef } from "react";
import { LearningMarkdown } from "@/components/LearningMarkdown";
import { LearnerProfile, ChatMessage, ChatbotRole } from "../types";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  RotateCcw,
  Copy,
  Check,
  Zap,
  BookOpen,
  WifiOff,
  Search,
  ShieldCheck,
  Compass,
  ExternalLink,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Brain,
  Award,
} from "lucide-react";
import { saveChatMessageToFirestore } from "@/lib/firestore-sync";
import { toast } from "sonner";

interface AITutorTabProps {
  activeProfile: LearnerProfile;
  prefilledPrompt?: string;
  onClearPrefill?: () => void;
  onOpenAccessibilityModal?: () => void;
}

const CHATBOT_ROLES: Array<{
  id: ChatbotRole;
  label: string;
  shortLabel: string;
  model: "gemini-3.8-flash" | "gemini-4-argon" | "gemini-3.1-flash-lite";
  icon: string;
  description: string;
  badgeColor: string;
}> = [
  {
    id: "general-tutor",
    label: "Mwalimu CBC Formative Tutor",
    shortLabel: "Mwalimu CBC",
    model: "gemini-3.8-flash",
    icon: "🎓",
    description:
      "Pedagogical guidance with Socratic clues, KICD designs, and real Kenyan examples.",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    id: "stem-expert",
    label: "Senior STEM & Math Specialist",
    shortLabel: "Senior STEM",
    model: "gemini-4-argon",
    icon: "🔬",
    description:
      "Advanced mathematical proofs, physics derivations, chemistry equations & algorithms.",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  {
    id: "fast-assistant",
    label: "Express Fast Revision Buddy",
    shortLabel: "Fast Buddy",
    model: "gemini-3.1-flash-lite",
    icon: "⚡",
    description: "Instant definitions, quick memory flashcards, and rapid formula recall.",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    id: "sne-specialist",
    label: "Inclusive SNE & Disability Guide",
    shortLabel: "SNE Inclusive",
    model: "gemini-3.8-flash",
    icon: "♿",
    description: "UDL accommodations, sensory calm, bite-sized steps for learners with disability.",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
  },
  {
    id: "knec-examiner",
    label: "KNEC CBA Assessment Marker",
    shortLabel: "KNEC Examiner",
    model: "gemini-3.8-flash",
    icon: "📝",
    description:
      "Official examiner analysis with EE/ME/AE/BE performance rubric bands & mark breakdown.",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  {
    id: "kiswahili-mwalimu",
    label: "Mwalimu wa Kiswahili Fasaha",
    shortLabel: "Kiswahili",
    model: "gemini-3.8-flash",
    icon: "🇰🇪",
    description: "Uchambuzi wa ngeli, sarufi, vitendawili, fasihi simulizi na insha za KICD.",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
  },
];

export const AITutorTab: React.FC<AITutorTabProps> = ({
  activeProfile,
  prefilledPrompt,
  onClearPrefill,
  onOpenAccessibilityModal,
}) => {
  const initialProfileRole: ChatbotRole =
    activeProfile.disabilityAccommodation && activeProfile.disabilityAccommodation !== "None"
      ? "sne-specialist"
      : "general-tutor";

  const [selectedRole, setSelectedRole] = useState<ChatbotRole>(initialProfileRole);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`elimubridge_chat_${activeProfile.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall through
      }
    }
    return [
      {
        id: "msg-welcome",
        sender: "tutor",
        text: `Jambo **${activeProfile.name}**! Mimi ni **Mwalimu AI**, your digital study mentor on ElimuBridge.
I am aligned with the Kenyan Competency-Based Curriculum (**${activeProfile.grade}**). You can ask me questions in **English** or **Kiswahili**!

*Note: Choose your specialized chatbot role above (General CBC, STEM Specialist, Fast Buddy, SNE Inclusive Guide, or KNEC Examiner). Text-to-Speech audio and voice dictation are ready to support all learners.*`,
        timestamp: "Just now",
        source: "gemini-3.8-flash",
        chatbotRole: "general-tutor",
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [sneModeEnabled, setSneModeEnabled] = useState<boolean>(
    Boolean(
      activeProfile.disabilityAccommodation && activeProfile.disabilityAccommodation !== "None",
    ),
  );
  const [sneAccommodation, setSneAccommodation] = useState<string>(
    activeProfile.disabilityAccommodation || "Low Vision",
  );
  const [sneStageLevel, setSneStageLevel] = useState<
    "Foundation" | "Intermediate" | "Pre-Vocational"
  >("Foundation");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [largeChatFont, setLargeChatFont] = useState<boolean>(
    Boolean(activeProfile.accessibilitySettings?.largeFont),
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentRoleConfig = CHATBOT_ROLES.find((r) => r.id === selectedRole) || CHATBOT_ROLES[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem(`elimubridge_chat_${activeProfile.id}`, JSON.stringify(messages));
  }, [messages, activeProfile.id]);

  useEffect(() => {
    if (prefilledPrompt) {
      setInputPrompt(prefilledPrompt);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledPrompt]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Text to Speech (TTS) Read-Aloud for Learners with Disability
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech audio is not supported in this browser.");
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingMessageId(msgId);

    // Clean markdown characters for pleasant speech output
    const cleanText = text
      .replace(/[#*_`~>[\]]/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\n+/g, ". ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text (STT) Voice Dictation
  const handleToggleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice speech input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "sw" ? "sw-KE" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... speak your revision question now.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        toast.success("Voice transcribed!");
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Microphone did not detect speech. Please try again.");
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      toast.error("Could not access microphone.");
    }
  };

  // Stage-adapted prompt chips tailored by role
  const presetPromptChips = [
    {
      label: "Tens & Ones (Place Value)",
      query:
        "Explain place value with Tens and Ones for primary school learners with an easy everyday Kenyan example",
      lang: "en" as const,
      role: "general-tutor" as const,
    },
    {
      label: "Quadratic Proof & Graph",
      query:
        "Derive the quadratic formula ax^2 + bx + c = 0 step by step and explain how the discriminant b^2 - 4ac shows the nature of roots.",
      lang: "en" as const,
      role: "stem-expert" as const,
    },
    {
      label: "Quick Formula: Photosynthesis",
      query:
        "Give the balanced chemical equation for photosynthesis and quick definitions of light and dark stages.",
      lang: "en" as const,
      role: "fast-assistant" as const,
    },
    {
      label: "SNE: Plant Parts (Bite-sized)",
      query:
        "Show me the 4 main parts of a plant with 1 single idea per step, everyday mango tree example, and clear numbers.",
      lang: "en" as const,
      role: "sne-specialist" as const,
    },
    {
      label: "KNEC: Exceeding Expectations (EE)",
      query:
        "What exact rubric criteria and keywords does a Grade 8 student need to achieve Exceeding Expectations (EE) in Integrated Science?",
      lang: "en" as const,
      role: "knec-examiner" as const,
    },
    {
      label: "Ngeli za Kiswahili (A-WA & KI-VI)",
      query:
        "Nieleze kwa mifano ya sentensi jinsi ya kutumia ngeli za A-WA na KI-VI katika Kiswahili.",
      lang: "sw" as const,
      role: "kiswahili-mwalimu" as const,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    // Persist user prompt to Firestore
    saveChatMessageToFirestore({
      userId: activeProfile.id,
      role: "user",
      content: text,
    }).catch((err) => console.warn("Firestore user message save note:", err));

    try {
      const { auth } = await import("@/lib/firebase");
      const idToken = auth.currentUser
        ? await auth.currentUser.getIdToken().catch(() => null)
        : null;

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },

        body: JSON.stringify({
          prompt: text,
          language,
          learnerGrade: activeProfile.grade,
          pathway: activeProfile.seniorPathway,
          useSearch: useSearchGrounding,
          subject: "Curriculum Revision",
          sneAccommodations:
            sneModeEnabled || selectedRole === "sne-specialist" ? sneAccommodation : undefined,
          sneStageLevel:
            sneModeEnabled || selectedRole === "sne-specialist" ? sneStageLevel : undefined,
          role: selectedRole,
          targetModel: currentRoleConfig.model,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response failed");
      }

      const data = await response.json();

      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: data.text || "Samahani, jaribu kuuliza swali tena kwa ufupi.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source || currentRoleConfig.model,
        sources: data.sources,
        modelTier: data.source || currentRoleConfig.model,
        chatbotRole: selectedRole,
      };

      // Persist model response to Firestore
      saveChatMessageToFirestore({
        userId: activeProfile.id,
        role: "model",
        content: tutorMessage.text,
        groundingSources: data.sources ? JSON.stringify(data.sources) : undefined,
      }).catch((err) => console.warn("Firestore tutor message save note:", err));

      setMessages((prev) => [...prev, tutorMessage]);
    } catch {
      // Local resilient fallback
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: `Samahani! There was a connection hiccup, but here is a quick study tip for **${activeProfile.grade}**:
Always break down formulas into variables, write down given units, and check past CBE assessment questions.

*Curriculum Grounding: All answers strictly align with KICD Grade ${activeProfile.grade} syllabus designs.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "gemini-3.8-flash",
        chatbotRole: selectedRole,
      };
      setMessages((prev) => [...prev, tutorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("Clear chat conversation history for this profile?")) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMessageId(null);
      const resetMsg: ChatMessage = {
        id: "msg-welcome",
        sender: "tutor",
        text: `Habari tena ${activeProfile.name}! Chat history cleared. How can I help you revise today?`,
        timestamp: "Just now",
        source: "gemini-3.8-flash",
        chatbotRole: selectedRole,
      };
      setMessages([resetMsg]);
      localStorage.removeItem(`elimubridge_chat_${activeProfile.id}`);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto flex flex-col h-[82vh] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in ${
        largeChatFont ? "text-base" : "text-sm"
      }`}
    >
      {/* Tutor Header with Role Banner */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#002B49] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-[#F2A900]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Gemini CBE Tutor: Mwalimu AI
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F2A900] text-[#002B49]">
                KICD Grounded
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {currentRoleConfig.model}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grade: <strong>{activeProfile.grade}</strong> · Role:{" "}
              <strong className="text-slate-800">{currentRoleConfig.label}</strong>
            </p>
          </div>
        </div>

        {/* Global Controls & Disability Assist Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Grounding Toggle */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              useSearchGrounding
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Toggle Google Search Grounding"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search:</span>
            <span>{useSearchGrounding ? "ON" : "OFF"}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "sw" : "en")}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#002B49]" />
            <span>{language === "en" ? "EN" : "SW"}</span>
          </button>

          {/* Large Font Magnifier Toggle for Low Vision */}
          <button
            onClick={() => setLargeChatFont(!largeChatFont)}
            className={`px-2 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              largeChatFont
                ? "bg-purple-100 text-purple-900 border-purple-300"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle Large Magnified Font for Low Vision"
          >
            A+
          </button>

          {/* Disability & Inclusive Accommodations Button */}
          <button
            onClick={() => {
              if (onOpenAccessibilityModal) {
                onOpenAccessibilityModal();
              } else {
                setSneModeEnabled(!sneModeEnabled);
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              sneModeEnabled ||
              (activeProfile.disabilityAccommodation &&
                activeProfile.disabilityAccommodation !== "None")
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
            }`}
            title="Open Learners with Disability Accommodations"
          >
            <span>♿</span>
            <span className="hidden md:inline">Disability Options</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chatbot Roles Selector Bar */}
      <div className="px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1 mr-1">
          <Bot className="w-3.5 h-3.5 text-slate-700" />
          <span>Chatbot Role:</span>
        </span>

        {CHATBOT_ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => {
                setSelectedRole(role.id);
                if (role.id === "sne-specialist") {
                  setSneModeEnabled(true);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#002B49] text-white shadow-sm ring-1 ring-[#F2A900]"
                  : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
              title={role.description}
            >
              <span>{role.icon}</span>
              <span>{role.shortLabel}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {role.model.replace("gemini-", "")}
              </span>
            </button>
          );
        })}
      </div>

      {/* SNE Disability Adaptive Bar (when active) */}
      {(sneModeEnabled || selectedRole === "sne-specialist") && (
        <div className="px-5 py-2 bg-purple-50 border-b border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-900 flex items-center gap-1">
              <span>♿</span>
              <span>Disability Accommodation:</span>
            </span>
            <select
              value={sneAccommodation}
              onChange={(e) => setSneAccommodation(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-purple-300 bg-white text-purple-900 font-semibold text-xs"
            >
              <option value="Low Vision">Low Vision / High Contrast</option>
              <option value="Autism Spectrum Disorder">Autism Spectrum Disorder (ASD)</option>
              <option value="ADHD">ADHD / Focus Scaffolding</option>
              <option value="Hearing Impairment">Hearing Impairment (KSL)</option>
              <option value="Dyslexia">Dyslexia / High Legibility</option>
              <option value="Down Syndrome">Down Syndrome / Foundation</option>
              <option value="Physical & Motor">Physical & Motor Accessibility</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-900">SNE Stage:</span>
            <select
              value={sneStageLevel}
              onChange={(e) => setSneStageLevel(e.target.value as any)}
              className="py-1 px-2.5 rounded-lg border border-purple-300 bg-white text-purple-900 font-semibold text-xs"
            >
              <option value="Foundation">Foundation</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pre-Vocational">Pre-Vocational</option>
            </select>
          </div>
        </div>
      )}

      {/* Quick Prompts Chips Bar */}
      <div className="px-5 py-2 bg-blue-50/40 border-b border-blue-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-[#002B49] shrink-0 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-[#002B49]" />
          <span>Quick Prompts:</span>
        </span>
        {presetPromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setLanguage(chip.lang);
              setSelectedRole(chip.role);
              handleSendMessage(chip.query);
            }}
            className="px-3 py-1 bg-white hover:bg-blue-100/80 border border-blue-200 text-[#002B49] text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Multi-Turn Chat Thread Container */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isTutor = msg.sender === "tutor";
          const isCurrentlySpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTutor ? "justify-start" : "justify-end"}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4 text-[#F2A900]" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 leading-relaxed ${
                  isTutor
                    ? "bg-white border border-slate-200/90 text-slate-800 shadow-xs"
                    : "bg-[#002B49] text-white shadow-xs"
                } ${largeChatFont ? "text-base sm:text-lg" : "text-xs sm:text-sm"}`}
              >
                {/* Header Banner on Tutor Message */}
                {isTutor && (
                  <div className="mb-2 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#002B49] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        KICD Aligned
                      </span>
                      {msg.chatbotRole && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                          {msg.chatbotRole}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                        {msg.modelTier || msg.source || "gemini-3.8-flash"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Markdown Message Text */}
                <LearningMarkdown>{msg.text}</LearningMarkdown>

                {/* Search Grounding Sources */}
                {isTutor && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-600" />
                      Google Search Grounded Citations:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span className="max-w-[200px] truncate">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Controls: Audio Read-Aloud & Copy Note */}
                <div
                  className={`mt-2.5 pt-2 flex items-center justify-between text-[11px] ${
                    isTutor
                      ? "text-slate-400 border-t border-slate-100"
                      : "text-slate-300 border-t border-white/20"
                  }`}
                >
                  <span className="tabular-nums">{msg.timestamp}</span>

                  {isTutor && (
                    <div className="flex items-center gap-3">
                      {/* Text to Speech Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                          isCurrentlySpeaking
                            ? "text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md"
                            : "hover:text-purple-700 text-slate-500"
                        }`}
                        title="Read out loud with audio Text-to-Speech (TTS)"
                      >
                        {isCurrentlySpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-purple-700" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen (TTS)</span>
                          </>
                        )}
                      </button>

                      {/* Copy Note Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer text-slate-500"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy note</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isTutor && (
                <div
                  className={`w-8 h-8 rounded-xl ${activeProfile.avatarColor} text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs`}
                >
                  {activeProfile.name.charAt(0)}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#002B49] text-white flex items-center justify-center shrink-0 text-xs shadow-xs animate-pulse">
              <Bot className="w-4 h-4 text-[#F2A900]" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#002B49] animate-spin" />
              <span>
                {currentRoleConfig.shortLabel} is reasoning with {currentRoleConfig.model}...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Voice Speech-to-Text Button */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Microphone Input Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-2xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
            title="Speech-to-Text voice dictation (Hands-free for disability)"
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4 text-purple-700" />
            )}
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={
              isListening
                ? "Listening... speak now..."
                : language === "en"
                  ? `Ask ${currentRoleConfig.shortLabel} about ${activeProfile.grade} topics, formulas, or past exams...`
                  : `Muulize ${currentRoleConfig.shortLabel} maswali kuhusu ${activeProfile.grade}...`
            }
            className={`flex-1 p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49] bg-slate-50 focus:bg-white transition-all disabled:opacity-50 ${
              largeChatFont ? "text-base" : "text-xs sm:text-sm"
            }`}
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-3 bg-[#002B49] hover:bg-[#001E33] disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shrink-0 cursor-pointer disabled:cursor-not-allowed"
            title="Send question"
          >
            <Send className="w-4 h-4 text-[#F2A900]" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>Active Model: {currentRoleConfig.model}</span>
          <span>Audio TTS & Voice STT enabled for all learners</span>
        </div>
      </div>
    </div>
  );
};
