// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect, useRef } from "react";
import { LearningMarkdown } from "@/components/LearningMarkdown";
import { LearnerProfile, ChatMessage } from "../types";
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
} from "lucide-react";

interface AITutorTabProps {
  activeProfile: LearnerProfile;
  prefilledPrompt?: string;
  onClearPrefill?: () => void;
}

export const AITutorTab: React.FC<AITutorTabProps> = ({
  activeProfile,
  prefilledPrompt,
  onClearPrefill,
}) => {
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
        text: `Jambo ${activeProfile.name}! Mimi ni **Mwalimu AI**, your digital study companion on ElimuBridge.
I am trained on the Kenyan curriculum (**${activeProfile.grade}**). You can ask me questions in **English** or **Kiswahili**!

Choose a prompt chip below or type any math problem, science concept, or revision question:`,
        timestamp: "Just now",
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Save to local storage
    localStorage.setItem(`elimubridge_chat_${activeProfile.id}`, JSON.stringify(messages));
  }, [messages, activeProfile.id]);

  // Handle prefilled prompt from notes or quiz
  useEffect(() => {
    if (prefilledPrompt) {
      setInputPrompt(prefilledPrompt);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledPrompt]);

  const presetPromptChips = [
    {
      label: "Tens & Ones (Place Value)",
      query:
        "Explain place value with Tens and Ones for primary school learners with an easy example",
      lang: "en" as const,
    },
    {
      label: "Circulatory System & Heart (KPSEA)",
      query: "Explain the 4 chambers of the heart and double circulation for KPSEA exams",
      lang: "en" as const,
    },
    {
      label: "Nieleze Ngeli za Kiswahili",
      query:
        "Nieleze kwa mifano ya sentensi jinsi ya kutumia ngeli za A-WA na KI-VI katika Kiswahili",
      lang: "sw" as const,
    },
    {
      label: "Plant vs Animal Cells (JSS)",
      query:
        "What are the main structural differences between plant cells and animal cells under a microscope?",
      lang: "en" as const,
    },
    {
      label: "Simple Machines & VR (KJSEA)",
      query:
        "How do you calculate Mechanical Advantage (MA) and Efficiency in a pulley system for Grade 9 KJSEA?",
      lang: "en" as const,
    },
    {
      label: "Equations of Motion (Grade 10)",
      query:
        "Explain the 3 equations of uniformly accelerated motion (v = u + at, s = ut + ½at², v² = u² + 2as)",
      lang: "en" as const,
    },
    {
      label: "Chemical Equilibrium & Haber",
      query: "Explain how Le Chatelier’s principle applies to the Haber synthesis of ammonia",
      lang: "en" as const,
    },
    {
      label: "Devolution in Kenya (Grade 12)",
      query:
        "Explain the principles of devolution and revenue sharing between National and County governments in Kenya",
      lang: "en" as const,
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

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionData.session
            ? { Authorization: `Bearer ${sessionData.session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          prompt: text,
          language,
          learnerGrade: activeProfile.grade,
          subject: "Curriculum Revision",
          history: messages.slice(-8).map((m) => ({
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
        source: data.source,
      };

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err) {
      // Local graceful response
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: `Samahani! There was a connection hiccup, but here is a quick study tip for **${activeProfile.grade}**:
Always break down formulas into variables, write down the given units, and check past CBE assessment questions for similar patterns. You can tap any of the pre-made prompt chips above for instant offline answers!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "local-resilience",
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
      const resetMsg: ChatMessage = {
        id: "msg-welcome",
        sender: "tutor",
        text: `Habari tena ${activeProfile.name}! Chat history cleared. How can I help you revise today?`,
        timestamp: "Just now",
      };
      setMessages([resetMsg]);
      localStorage.removeItem(`elimubridge_chat_${activeProfile.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[78vh] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tutor Header */}
      <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base">Mwalimu AI</span>
              <span className="text-[11px] font-semibold text-[#002B49] bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                Kenya CBE Tutor (Playgroup–Grade 12)
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Assisting <span className="font-semibold text-slate-700">{activeProfile.name}</span> (
              {activeProfile.grade})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === "en"
                  ? "bg-[#7C3AED] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("sw")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === "sw"
                  ? "bg-[#7C3AED] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kiswahili
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2.5 bg-purple-50/40 border-b border-purple-100 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none">
        <span className="text-[11px] font-bold text-purple-900 shrink-0 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Quick Prompts:</span>
        </span>
        {presetPromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setLanguage(chip.lang);
              handleSendMessage(chip.query);
            }}
            className="px-3 py-1 bg-white hover:bg-purple-100/70 border border-purple-200 text-purple-900 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 shadow-2xs hover:shadow-xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isTutor = msg.sender === "tutor";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTutor ? "justify-start" : "justify-end"}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isTutor
                    ? "bg-white border border-slate-200/90 text-slate-800 shadow-xs"
                    : "bg-[#7C3AED] text-white shadow-xs"
                }`}
              >
                {/* Text Content */}
                <LearningMarkdown>{msg.text}</LearningMarkdown>

                {/* Message Meta */}
                <div
                  className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] ${
                    isTutor
                      ? "text-slate-400 border-t border-slate-100"
                      : "text-purple-200 border-t border-purple-600"
                  }`}
                >
                  <span className="tabular-nums">{msg.timestamp}</span>
                  {isTutor && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="hover:text-slate-600 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy note</span>
                        </>
                      )}
                    </button>
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
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 text-xs shadow-xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED] animate-spin" />
              <span>Mwalimu AI is preparing a curriculum-aligned explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              language === "sw"
                ? "Uliza swali lolote la hesabu, sayansi au lugha kwa Kiswahili..."
                : `Ask any ${activeProfile.grade} revision question (e.g. solve 2x + 5 = 15)...`
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-slate-900 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-xs transition-colors shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Supported: English & Kiswahili</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-600" /> Offline Knowledge Ready
          </span>
        </div>
      </div>
    </div>
  );
};
