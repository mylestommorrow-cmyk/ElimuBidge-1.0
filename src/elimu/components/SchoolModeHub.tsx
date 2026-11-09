// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  School,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  FileText,
  KeyRound,
  Plus,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  ChevronRight,
  Filter,
  GraduationCap,
  ArrowRight,
  Send,
  Building,
  UserCheck,
  Calendar,
} from "lucide-react";
import {
  LearnerProfile,
  SchoolAccount,
  CourseworkItem,
  CourseworkSubmission,
  AssessmentRubricBand,
} from "../types";
import {
  getStoredCoursework,
  getStoredSubmissions,
  addCourseworkItem,
  gradeSubmission,
} from "../data/courseworkStorage";
import { evaluateCompetency, getLearnerCompetencies } from "../data/competencyStorage";

interface SchoolModeHubProps {
  activeProfile: LearnerProfile;
  activeSchool: SchoolAccount;
  allSchools: SchoolAccount[];
  onSelectSchool: (school: SchoolAccount) => void;
  onOpenSchoolModal: () => void;
  onNavigateToCoursework: () => void;
  onNavigateToCompetencies: () => void;
}

export const SchoolModeHub: React.FC<SchoolModeHubProps> = ({
  activeProfile,
  activeSchool,
  allSchools,
  onSelectSchool,
  onOpenSchoolModal,
  onNavigateToCoursework,
  onNavigateToCompetencies,
}) => {
  // Mode selection & role tabs
  const [activeRoleTab, setActiveRoleTab] = useState<"learner" | "teacher" | "admin">("learner");
  const [teacherPinInput, setTeacherPinInput] = useState("");
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [teacherAuthError, setTeacherAuthError] = useState("");

  // Submissions and coursework
  const [courseworkList, setCourseworkList] = useState(getStoredCoursework);
  const [submissionsList, setSubmissionsList] = useState(getStoredSubmissions);

  // New assignment modal
  const [newAssignmentModalOpen, setNewAssignmentModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Integrated Science");
  const [newGrade, setNewGrade] = useState(activeProfile.grade || "Grade 8");
  const [newItemType, setNewItemType] = useState<CourseworkItem["itemType"]>("assignment");
  const [newDueDate, setNewDueDate] = useState("2026-11-30T17:00");
  const [newTotalMarks, setNewTotalMarks] = useState(30);
  const [newDescription, setNewDescription] = useState("");
  const [newOutcomeCode, setNewOutcomeCode] = useState("G8.SCI.1.1");

  // Grading modal state
  const [gradingModalSub, setGradingModalSub] = useState<CourseworkSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState(25);
  const [gradeRubricBand, setGradeRubricBand] =
    useState<AssessmentRubricBand>("Meeting Expectations");
  const [gradeFeedback, setGradeFeedback] = useState("");

  // Teacher PIN check
  const handleVerifyTeacherPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherPinInput.trim() === activeSchool.teacherPin || teacherPinInput.trim() === "2026") {
      setIsTeacherAuthenticated(true);
      setTeacherAuthError("");
    } else {
      setTeacherAuthError("Incorrect Teacher Security PIN. Default demo PIN is 2026.");
    }
  };

  // Add Assignment handler
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: CourseworkItem = {
      id: `cw-${Date.now()}`,
      schoolCode: activeSchool.code,
      learningArea: newSubject,
      gradeLevel: newGrade,
      cbeStage: "Junior School",
      outcomeCode: newOutcomeCode,
      itemType: newItemType,
      title: newTitle.trim(),
      description: newDescription.trim() || "CBE practical and theoretical assessment.",
      dueDate: newDueDate,
      totalMarks: Number(newTotalMarks),
      authorName: activeProfile.name || "Senior Facilitator",
      authorRole: "Subject Lead Teacher",
      isPublished: true,
      isSchoolOnly: true,
      createdAt: new Date().toISOString().slice(0, 10),
      rubric: {
        exceeding: "Complete mastery with extensive evidence and independent insight.",
        meeting: "Meets all criteria defined in the specific learning outcome.",
        approaching: "Demonstrates partial understanding with minor conceptual gaps.",
        below: "Requires additional teacher guidance and structured remediation.",
      },
    };

    addCourseworkItem(newItem);
    setCourseworkList(getStoredCoursework());
    setNewAssignmentModalOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  // Submit Grade handler
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModalSub) return;

    gradeSubmission(
      gradingModalSub.id,
      Number(gradeScore),
      gradeRubricBand,
      gradeFeedback.trim() || "Good effort. Keep reviewing the curriculum learning outcome.",
      activeProfile.name || "Mwalimu Reviewer",
    );

    // Also update competency evaluation
    evaluateCompetency({
      learnerId: gradingModalSub.learnerId,
      outcomeCode: "G8.SCI.1.1",
      outcomeTitle: gradingModalSub.courseworkTitle,
      learningArea: "Integrated Science",
      gradeLevel: gradingModalSub.gradeLevel,
      cbeStage: "Junior School",
      status:
        gradeRubricBand === "Exceeding Expectations" || gradeRubricBand === "Meeting Expectations"
          ? "demonstrated"
          : gradeRubricBand === "Approaching Expectations"
            ? "practised"
            : "requires_support",
      evidenceNotes: gradeFeedback.trim(),
      evaluatedBy: activeProfile.name || "Teacher",
      evaluatedAt: new Date().toISOString().slice(0, 10),
      rubricBand: gradeRubricBand,
    });

    setSubmissionsList(getStoredSubmissions());
    setGradingModalSub(null);
  };

  // School coursework and submissions
  const schoolCoursework = useMemo(() => {
    return courseworkList.filter(
      (c) => c.schoolCode?.toUpperCase() === activeSchool.code.toUpperCase(),
    );
  }, [courseworkList, activeSchool.code]);

  const schoolSubmissions = useMemo(() => {
    return submissionsList.filter(
      (s) => s.schoolCode?.toUpperCase() === activeSchool.code.toUpperCase(),
    );
  }, [submissionsList, activeSchool.code]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Institutional Banner Header */}
      <div className="bg-gradient-to-r from-[#002B49] via-[#0A3D62] to-[#001E33] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-[#F2A900] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-3xl sm:text-4xl flex items-center justify-center shadow-lg border-2 border-[#F2A900] shrink-0">
              {activeSchool.logoEmoji || "🏫"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F2A900] text-[#002B49] uppercase tracking-wider">
                  CBE Institutional Mode
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-slate-100">
                  Code: {activeSchool.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Verified School
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white">{activeSchool.name}</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 italic">
                “{activeSchool.motto || "Elimu ni Nuru"}” · {activeSchool.county}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSchoolModal}
              className="px-4 py-2.5 rounded-xl bg-white text-[#002B49] hover:bg-slate-100 text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4 text-[#F2A900]" />
              Switch / Join School
            </button>
            <button
              onClick={onNavigateToCoursework}
              className="px-4 py-2.5 rounded-xl bg-[#F2A900] text-[#002B49] hover:bg-[#D99600] text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              All Coursework
            </button>
          </div>
        </div>

        {/* Quick Institutional Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-300 block">Principal / Head</span>
            <span className="font-bold text-white text-sm">{activeSchool.principalName}</span>
          </div>
          <div>
            <span className="text-slate-300 block">CBE Streams</span>
            <span className="font-bold text-white text-sm">
              {activeSchool.cbeStreams?.length || 5} Rationalised Streams
            </span>
          </div>
          <div>
            <span className="text-slate-300 block">Enrolled Learners</span>
            <span className="font-bold text-[#F2A900] text-sm">
              {activeSchool.registeredLearnersCount || 128} Active
            </span>
          </div>
          <div>
            <span className="text-slate-300 block">School Coursework</span>
            <span className="font-bold text-white text-sm">
              {schoolCoursework.length} Assignments & Labs
            </span>
          </div>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveRoleTab("learner")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeRoleTab === "learner"
              ? "bg-[#002B49] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Learner Portal
        </button>
        <button
          onClick={() => setActiveRoleTab("teacher")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeRoleTab === "teacher"
              ? "bg-[#002B49] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Teacher Portal
        </button>
        <button
          onClick={() => setActiveRoleTab("admin")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeRoleTab === "admin"
              ? "bg-[#002B49] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Administration
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. LEARNER VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeRoleTab === "learner" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Assigned School Coursework */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    My School Coursework & Assignments
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verified tasks uploaded by teachers of {activeSchool.name}
                  </p>
                </div>
                <button
                  onClick={onNavigateToCoursework}
                  className="text-xs font-bold text-[#002B49] hover:text-[#F2A900] flex items-center gap-1 cursor-pointer"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {schoolCoursework.length > 0 ? (
                <div className="space-y-3">
                  {schoolCoursework.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#F2A900] transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-[#002B49] uppercase">
                              {item.itemType}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {item.learningArea} · {item.gradeLevel}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                          Due: {new Date(item.dueDate || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Facilitator: <strong>{item.authorName}</strong>
                        </span>
                        <button
                          onClick={onNavigateToCoursework}
                          className="px-3 py-1.5 rounded-lg bg-[#002B49] text-white hover:bg-[#001E33] font-bold cursor-pointer"
                        >
                          Submit Work
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-800">No pending assignments yet</p>
                  <p className="text-xs text-slate-500">
                    Teachers of {activeSchool.name} have not assigned any new tasks today.
                  </p>
                </div>
              )}
            </div>

            {/* Right 1 Col: Learner Summary & Stream Information */}
            <div className="space-y-6">
              {/* Enrolled Stream Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#002B49] flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5 text-[#F2A900]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Enrolled Learner</h3>
                    <p className="text-xs text-slate-500">
                      {activeProfile.name} ({activeProfile.grade})
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Admission / Reg No:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {activeProfile.regNo || "EB-CBE-2026-0842"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Institutional Standing:</span>
                    <span className="font-bold text-emerald-600">
                      {activeProfile.academicStanding || "In Good Standing"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Assigned Stream:</span>
                    <span className="font-bold text-slate-800">Kilimanjaro Stream 8A</span>
                  </div>
                </div>

                <button
                  onClick={onNavigateToCompetencies}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002B49] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#F2A900]" />
                  View Competency Transcript
                </button>
              </div>

              {/* Submissions Feedback Box */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Recent Teacher Feedback
                </h3>
                {schoolSubmissions.length > 0 ? (
                  schoolSubmissions.map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-800">{sub.courseworkTitle}</span>
                        <span className="text-emerald-700 font-extrabold">
                          {sub.score}/{sub.totalMarks}
                        </span>
                      </div>
                      <p className="text-slate-600 italic">“{sub.feedbackNotes}”</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        Graded by {sub.gradedBy} · {sub.rubricBand}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No evaluated submissions yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. TEACHER VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeRoleTab === "teacher" && (
        <div>
          {!isTeacherAuthenticated ? (
            /* Teacher PIN Gate */
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#002B49] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6 text-[#002B49]" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Teacher Security Verification</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your 4-digit School Facilitator PIN to create coursework, evaluate learner
                submissions, and assign rubrics. (Default demo PIN is <strong>2026</strong>).
              </p>
              <form onSubmit={handleVerifyTeacherPin} className="space-y-3 pt-2">
                <input
                  type="password"
                  maxLength={4}
                  value={teacherPinInput}
                  onChange={(e) => setTeacherPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. 2026)"
                  className="w-full text-center text-lg font-mono tracking-widest p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
                {teacherAuthError && (
                  <p className="text-xs text-rose-600 font-semibold">{teacherAuthError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Verify Facilitator Access
                </button>
              </form>
            </div>
          ) : (
            /* Teacher Dashboard */
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Teacher Coursework & Assessment Console
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage assignments, grade submissions against KICD rubrics, and record
                    competencies
                  </p>
                </div>
                <button
                  onClick={() => setNewAssignmentModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#0A3D62] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4 text-[#F2A900]" />
                  Create Assignment / Project
                </button>
              </div>

              {/* Submissions awaiting review */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Student Submissions for Review ({schoolSubmissions.length})
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {schoolSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {sub.learnerName}
                          </span>
                          <span className="text-xs text-slate-500">({sub.gradeLevel})</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.status === "graded"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {sub.status === "graded" ? "Graded" : "Needs Review"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{sub.courseworkTitle}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 italic">
                          “{sub.textSubmission}”
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub.score !== undefined && (
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl">
                            Score: {sub.score}/{sub.totalMarks}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setGradingModalSub(sub);
                            setGradeScore(sub.score || 25);
                            setGradeFeedback(sub.feedbackNotes || "");
                          }}
                          className="px-4 py-2 rounded-xl bg-[#F2A900] text-[#002B49] hover:bg-[#D99600] text-xs font-black cursor-pointer shadow-xs"
                        >
                          {sub.status === "graded" ? "Edit Grade" : "Grade & Feedback"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ADMINISTRATION VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeRoleTab === "admin" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Institutional School Administration
              </h2>
              <p className="text-xs text-slate-500">
                School profile, teacher permissions, class streams, and KICD rollout monitoring
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#002B49] border border-blue-200">
              School Code: {activeSchool.code}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Principal Administrator
              </span>
              <p className="text-base font-bold text-slate-900">{activeSchool.principalName}</p>
              <p className="text-xs text-slate-500">County: {activeSchool.county}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Teacher PIN Management
              </span>
              <p className="text-base font-mono font-bold text-slate-900">
                Current PIN: {activeSchool.teacherPin || "2026"}
              </p>
              <p className="text-xs text-slate-500">
                Used by teachers for syllabus and exam bank uploads
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                CBE Transition Status
              </span>
              <p className="text-base font-bold text-emerald-600">2026 Senior School Ready</p>
              <p className="text-xs text-slate-500">PP1 to Grade 12 pathways configured</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CREATE ASSIGNMENT MODAL */}
      {/* ------------------------------------------------------------- */}
      {newAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F2A900]" />
                <h3 className="text-base font-bold text-white">Create School Coursework / Lab</h3>
              </div>
              <button
                onClick={() => setNewAssignmentModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateAssignment}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Assignment / Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Field Investigation: Microclimate & Soil pH in School Shamba"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Learning Area</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option>Integrated Science</option>
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Kiswahili</option>
                    <option>Agriculture</option>
                    <option>Pre-Technical & STEM</option>
                    <option>History</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Grade Level</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option>PP1</option>
                    <option>PP2</option>
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                    <option>Grade 5</option>
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Coursework Type</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="assignment">Homework Assignment</option>
                    <option value="project">Group / Individual Project</option>
                    <option value="practical">Laboratory Practical</option>
                    <option value="digital_lesson">Digital Lesson Note</option>
                    <option value="worksheet">Printable Worksheet</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Specific Learning Outcome Code
                </label>
                <input
                  type="text"
                  value={newOutcomeCode}
                  onChange={(e) => setNewOutcomeCode(e.target.value)}
                  placeholder="e.g. G8.SCI.1.1 or G10.BIO.1.1"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Instructions & Guidance for Learners
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail step-by-step requirements, safety precautions, and submission criteria..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setNewAssignmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002B49] text-white hover:bg-[#001E33] font-bold cursor-pointer"
                >
                  Publish to School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* GRADING & RUBRIC FEEDBACK MODAL */}
      {/* ------------------------------------------------------------- */}
      {gradingModalSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Grade Student Submission</h3>
              <button
                onClick={() => setGradingModalSub(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Learner:</span>
                <p className="font-bold text-slate-800 text-sm">
                  {gradingModalSub.learnerName} ({gradingModalSub.gradeLevel})
                </p>
                <p className="text-slate-600 font-semibold">{gradingModalSub.courseworkTitle}</p>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700">
                <span className="font-bold text-[#002B49] block mb-1">Student's Submission:</span>
                <p className="italic">“{gradingModalSub.textSubmission}”</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Score (out of {gradingModalSub.totalMarks || 30})
                  </label>
                  <input
                    type="number"
                    max={gradingModalSub.totalMarks || 30}
                    min={0}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    CBE Performance Band
                  </label>
                  <select
                    value={gradeRubricBand}
                    onChange={(e) => setGradeRubricBand(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option>Exceeding Expectations</option>
                    <option>Meeting Expectations</option>
                    <option>Approaching Expectations</option>
                    <option>Below Expectations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Teacher Qualitative Feedback & Observations
                </label>
                <textarea
                  rows={3}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Provide constructive, evidence-based feedback on the competency demonstrated..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setGradingModalSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F2A900] text-[#002B49] hover:bg-[#D99600] font-black cursor-pointer shadow-md"
                >
                  Record Grade & Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
