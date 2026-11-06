// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect, useRef } from "react";
import { RevisionQuiz, QuizQuestion, LearnerProfile, DetailedQuizResult } from "../types";
import { REVISION_QUIZZES } from "../data/quizzes";
import { build30QuestionExam } from "../data/quizExamEngine";
import { QuizResultsView } from "./QuizResultsView";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface QuizPlayerProps {
  initialQuizId?: string;
  activeProfile: LearnerProfile;
  activeSchoolCode?: string;
  activeSchoolName?: string;
  onUpdateProfileScore: (quizTitle: string, score: number, total: number) => void;
  onAskAITutor: (prompt: string, subject: string) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  initialQuizId,
  activeProfile,
  activeSchoolCode = "DEMO-CBE",
  activeSchoolName = "National CBE Demonstration Academy",
  onUpdateProfileScore,
  onAskAITutor,
}) => {
  // Currently active quiz base
  const [selectedQuiz, setSelectedQuiz] = useState<RevisionQuiz>(() => {
    if (initialQuizId) {
      const found = REVISION_QUIZZES.find((q) => q.id === initialQuizId);
      if (found) return found;
    }
    return REVISION_QUIZZES[0];
  });

  // 30-Question active exam run
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>(() => {
    return build30QuestionExam(selectedQuiz, REVISION_QUIZZES);
  });

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [answersLog, setAnswersLog] = useState<
    {
      questionId: string;
      questionNumber: number;
      question: string;
      selected: number;
      correct: number;
      isCorrect: boolean;
      explanation: string;
      curriculumRef: string;
    }[]
  >([]);

  // Timer state
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Detailed Result record
  const [quizResult, setQuizResult] = useState<DetailedQuizResult | null>(null);
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState<boolean>(false);

  // Filter stage state for quiz selector
  const [filterStage, setFilterStage] = useState<string>("All");

  // Start timer on quiz start
  useEffect(() => {
    if (!quizFinished) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizFinished]);

  // Update selected quiz if initialQuizId changes
  useEffect(() => {
    if (initialQuizId) {
      const found = REVISION_QUIZZES.find((q) => q.id === initialQuizId);
      if (found && found.id !== selectedQuiz.id) {
        startQuiz(found);
      }
    }
  }, [initialQuizId]);

  const startQuiz = (quiz: RevisionQuiz) => {
    setSelectedQuiz(quiz);
    const thirtyQs = build30QuestionExam(quiz, REVISION_QUIZZES);
    setExamQuestions(thirtyQs);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setScore(0);
    setQuizFinished(false);
    setAnswersLog([]);
    setQuizResult(null);
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  const currentQ: QuizQuestion = examQuestions[currentQuestionIdx] || examQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return; // Prevent changing after submission
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmittedAnswer) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        questionNumber: currentQuestionIdx + 1,
        question: currentQ.question,
        selected: selectedOption,
        correct: currentQ.correctIndex,
        isCorrect,
        explanation: currentQ.explanation,
        curriculumRef: currentQ.curriculumRef,
      },
    ]);

    setHasSubmittedAnswer(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIdx + 1 < examQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      // Completed all 30 questions!
      await finalizeQuiz();
    }
  };

  const finalizeQuiz = async () => {
    setQuizFinished(true);
    const totalQuestions = examQuestions.length; // 30 questions
    // Count exact correct from answersLog
    const correctCount = answersLog.filter((a) => a.isCorrect).length;
    const finalScore = correctCount;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    onUpdateProfileScore(selectedQuiz.title, finalScore, totalQuestions);

    let letterGrade = "D";
    if (percentage >= 80) letterGrade = "A";
    else if (percentage >= 70) letterGrade = "B";
    else if (percentage >= 50) letterGrade = "C";

    let performanceBand: DetailedQuizResult["performanceBand"] = "Below Expectations";
    if (percentage >= 80) performanceBand = "Exceeding Expectations";
    else if (percentage >= 65) performanceBand = "Meeting Expectations";
    else if (percentage >= 50) performanceBand = "Approaching Expectations";

    const missed = answersLog.filter((a) => !a.isCorrect);

    const initialResult: DetailedQuizResult = {
      id: `result-${Date.now()}`,
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      subject: selectedQuiz.subject,
      gradeLevel: selectedQuiz.gradeLevel,
      learnerId: activeProfile.id,
      learnerName: activeProfile.name,
      schoolCode: activeSchoolCode,
      date: new Date().toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      score: finalScore,
      totalQuestions,
      percentage,
      timeSpentSeconds: elapsedSeconds,
      letterGrade,
      performanceBand,
      breakdown: answersLog.map((a) => ({
        questionId: a.questionId,
        questionNumber: a.questionNumber,
        question: a.question,
        selectedOption: a.selected,
        correctOption: a.correct,
        isCorrect: a.isCorrect,
        explanation: a.explanation,
        curriculumRef: a.curriculumRef,
      })),
    };

    setQuizResult(initialResult);

    // Call server Gemini API for personalized evaluation
    try {
      setIsGeneratingAiReport(true);
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch("/api/quiz-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionData.session
            ? { Authorization: `Bearer ${sessionData.session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          score: finalScore,
          total: totalQuestions,
          quizTitle: selectedQuiz.title,
          subject: selectedQuiz.subject,
          gradeLevel: selectedQuiz.gradeLevel,
          missedQuestions: missed.map((m) => m.question),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          setQuizResult((prev) => (prev ? { ...prev, aiFeedback: data.analysis } : null));
        }
      }
    } catch (e) {
      console.warn("AI quiz analysis fetch failed:", e);
    } finally {
      setIsGeneratingAiReport(false);
    }
  };

  const handleRetakeQuiz = () => {
    startQuiz(selectedQuiz);
  };

  const stageOptions = [
    { id: "All", label: "All CBE Drills" },
    { id: "Pre-Primary", label: "Pre-Primary (PG–PP2)" },
    { id: "Lower Primary", label: "Lower Primary (G1–3)" },
    { id: "Upper Primary", label: "Upper Primary (G4–6)" },
    { id: "Junior School", label: "Junior School (G7–9)" },
    { id: "Senior School", label: "Senior School (G10–12)" },
  ];

  const displayedQuizzes = REVISION_QUIZZES.filter((quiz) => {
    if (filterStage === "All") return true;
    if (filterStage === "Pre-Primary") return ["Playgroup", "PP1", "PP2"].includes(quiz.gradeLevel);
    if (filterStage === "Lower Primary")
      return ["Grade 1", "Grade 2", "Grade 3"].includes(quiz.gradeLevel);
    if (filterStage === "Upper Primary")
      return ["Grade 4", "Grade 5", "Grade 6"].includes(quiz.gradeLevel);
    if (filterStage === "Junior School")
      return ["Grade 7", "Grade 8", "Grade 9"].includes(quiz.gradeLevel);
    if (filterStage === "Senior School")
      return ["Grade 10", "Grade 11", "Grade 12"].includes(quiz.gradeLevel);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Selector Chips */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F2A900]" />
            <span>Kenya CBE Practice Drills (Playgroup to Grade 12):</span>
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{displayedQuizzes.length}</span>{" "}
            drills
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {stageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterStage(opt.id)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                filterStage === opt.id
                  ? "bg-[#002B49] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {displayedQuizzes.map((quiz) => {
            const isCurrent = quiz.id === selectedQuiz.id;
            return (
              <button
                key={quiz.id}
                onClick={() => startQuiz(quiz)}
                className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? "border-[#002B49] bg-blue-50/70 text-slate-900 shadow-xs ring-2 ring-[#002B49]"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mb-1">
                    <span className="font-bold px-1.5 py-0.5 rounded bg-amber-100 text-[#002B49] border border-amber-200">
                      {quiz.gradeLevel}
                    </span>
                    <span>
                      {quiz.questions.length} Qs · {quiz.estimatedMinutes}m
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 line-clamp-1 mt-1">{quiz.title}</div>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-medium">{quiz.subject}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Card */}
      {!quizFinished ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Header & Progress */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="font-bold text-[#7C3AED]">{selectedQuiz.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedQuiz.gradeLevel}</span>
                <span aria-hidden="true">·</span>
                <span>Active Learner: {activeProfile.name}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {selectedQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 tabular-nums bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                Question {currentQuestionIdx + 1} of {examQuestions.length}
              </span>
              <span className="text-xs font-bold text-emerald-700 tabular-nums bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                Score: {answersLog.filter((a) => a.isCorrect).length} / {examQuestions.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-purple-100/60 h-2">
            <div
              className="bg-gradient-to-r from-[#7C3AED] via-pink-500 to-[#F59E0B] h-2 transition-all duration-300 rounded-r-full"
              style={{
                width: `${((currentQuestionIdx + (hasSubmittedAnswer ? 1 : 0)) / examQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                {currentQ.curriculumRef}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let optionStyles =
                  "border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-800";

                if (hasSubmittedAnswer) {
                  if (isCorrect) {
                    optionStyles =
                      "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-500";
                  } else if (isSelected && !isCorrect) {
                    optionStyles = "border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400";
                  } else {
                    optionStyles = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyles =
                    "border-[#7C3AED] bg-purple-50/80 text-slate-900 font-semibold ring-2 ring-[#7C3AED]";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasSubmittedAnswer}
                    className={`w-full p-4 min-h-[48px] rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 touch-manipulation cursor-pointer active:scale-[0.99] ${optionStyles}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        hasSubmittedAnswer && isCorrect
                          ? "bg-emerald-600 text-white"
                          : hasSubmittedAnswer && isSelected && !isCorrect
                            ? "bg-rose-600 text-white"
                            : isSelected
                              ? "bg-[#7C3AED] text-white"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <div className="flex-1 mt-0.5 leading-normal">{optionText}</div>
                    {hasSubmittedAnswer && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {hasSubmittedAnswer && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Worked Step-by-Step Explanation Banner */}
            {hasSubmittedAnswer && (
              <div
                className={`p-5 rounded-2xl border space-y-2.5 animate-fade-in ${
                  selectedOption === currentQ.correctIndex
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-rose-50/80 border-rose-300 text-rose-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Sahihi! (Correct Answer)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>
                          Si Sahihi (Incorrect - Option{" "}
                          {String.fromCharCode(65 + currentQ.correctIndex)} is correct)
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      onAskAITutor(
                        `Explain this question from ${selectedQuiz.subject}: "${currentQ.question}" and why the answer is "${currentQ.options[currentQ.correctIndex]}"`,
                        selectedQuiz.subject,
                      )
                    }
                    className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explain deeper with Mwalimu AI</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed pl-7">
                  <div className="font-semibold text-slate-800 mb-1">Worked Rationale:</div>
                  <p>{currentQ.explanation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleRetakeQuiz}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Drill</span>
            </button>

            {!hasSubmittedAnswer ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 min-h-[44px] rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all active:scale-95 touch-manipulation cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>
                  {currentQuestionIdx + 1 < examQuestions.length
                    ? "Next Question"
                    : "Complete 30-Question Drill & View Results"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : quizResult ? (
        /* Detailed 30-Question Results View with KNEC Band and Gemini AI Rationale */
        <QuizResultsView
          result={quizResult}
          activeProfile={activeProfile}
          schoolName={activeSchoolName}
          onRetakeQuiz={handleRetakeQuiz}
          onSelectAnotherQuiz={() => {
            const nextQuiz =
              REVISION_QUIZZES.find((q) => q.id !== selectedQuiz.id) || REVISION_QUIZZES[0];
            startQuiz(nextQuiz);
          }}
          onAskAITutor={onAskAITutor}
        />
      ) : (
        /* Loading or fallback results card */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Finalizing 30-Question Assessment...</h2>
          <p className="text-xs text-slate-500">
            Calculating KNEC CBE Competency Band and generating AI remarks...
          </p>
        </div>
      )}
    </div>
  );
};
