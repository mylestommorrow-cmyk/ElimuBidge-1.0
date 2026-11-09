// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Filter,
  Search,
  BookOpen,
  Award,
  ChevronRight,
  Send,
  Eye,
  FileCheck,
  Building,
  GraduationCap,
} from "lucide-react";
import {
  LearnerProfile,
  SchoolAccount,
  CourseworkItem,
  CourseworkSubmission,
  CbeGrade,
  SubjectCategory,
} from "../types";
import {
  getStoredCoursework,
  getStoredSubmissions,
  submitCoursework,
} from "../data/courseworkStorage";
import { evaluateCompetency } from "../data/competencyStorage";

interface CourseworkViewProps {
  activeProfile: LearnerProfile;
  activeSchool: SchoolAccount;
  onAskAITutor: (prompt: string, subject: string) => void;
}

export const CourseworkView: React.FC<CourseworkViewProps> = ({
  activeProfile,
  activeSchool,
  onAskAITutor,
}) => {
  const [activeTab, setActiveTab] = useState<"available" | "submissions">("available");
  const [coursework, setCoursework] = useState(getStoredCoursework);
  const [submissions, setSubmissions] = useState(getStoredSubmissions);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  // Selected item modal & Submission modal
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<CourseworkItem | null>(null);
  const [submissionModalItem, setSubmissionModalItem] = useState<CourseworkItem | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState("");

  const filteredCoursework = useMemo(() => {
    return coursework.filter((item) => {
      // School tenancy: Include general items (schoolCode is null/undefined) OR items matching activeSchool
      const isVisible =
        !item.schoolCode || item.schoolCode.toUpperCase() === activeSchool.code.toUpperCase();
      if (!isVisible) return false;

      // Grade match
      if (selectedGrade !== "All" && item.gradeLevel !== selectedGrade) return false;

      // Subject match
      if (selectedSubject !== "All" && item.learningArea !== selectedSubject) return false;

      // Type match
      if (selectedType !== "All" && item.itemType !== selectedType) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.learningArea.toLowerCase().includes(q) ||
          (item.outcomeCode && item.outcomeCode.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [coursework, activeSchool.code, selectedGrade, selectedSubject, selectedType, searchQuery]);

  // My submissions
  const mySubmissions = useMemo(() => {
    return submissions.filter(
      (s) => s.learnerId === activeProfile.id || s.learnerId === "demo-learner-1",
    );
  }, [submissions, activeProfile.id]);

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalItem) return;

    const newSub: CourseworkSubmission = {
      id: `sub-${Date.now()}`,
      courseworkId: submissionModalItem.id,
      courseworkTitle: submissionModalItem.title,
      learnerId: activeProfile.id,
      learnerName: activeProfile.name,
      gradeLevel: activeProfile.grade || submissionModalItem.gradeLevel,
      schoolCode: activeSchool.code,
      submittedAt: new Date().toISOString(),
      textSubmission: submissionText.trim(),
      attachmentName: attachedFileName || undefined,
      attachmentUrl: attachedFileName
        ? "https://example.com/uploads/" + attachedFileName
        : undefined,
      status: "submitted",
    };

    submitCoursework(newSub);

    try {
      evaluateCompetency({
        learnerId: activeProfile.id,
        outcomeCode:
          submissionModalItem.outcomeCode || `CW.${submissionModalItem.id.toUpperCase()}`,
        outcomeTitle: `${submissionModalItem.title} (${submissionModalItem.itemType.toUpperCase()})`,
        learningArea: submissionModalItem.learningArea,
        gradeLevel: activeProfile.grade || submissionModalItem.gradeLevel,
        cbeStage: submissionModalItem.cbeStage || "Junior School",
        status: "practised",
        evidenceNotes: `Coursework submitted: ${submissionModalItem.itemType} on ${
          submissionModalItem.strandTitle || "Curriculum Strand"
        }. Formative record logged.`,
        evaluatedBy: "ElimuBridge Formative Coursework Engine",
        evaluatedAt: new Date().toISOString().slice(0, 10),
        rubricBand: "Meeting Expectations",
      });
    } catch {
      // ignore
    }

    setSubmissions(getStoredSubmissions());
    setSubmissionModalItem(null);
    setSubmissionText("");
    setAttachedFileName("");
    setSubmissionSuccessMsg("Your coursework has been submitted to your teacher!");
    setTimeout(() => setSubmissionSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#002B49] text-white">
              CBE Coursework Management
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              School: {activeSchool.name} ({activeSchool.code})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Coursework, Projects & Practicals
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Access teacher-assigned tasks, lab practicals, and projects aligned with specific KICD
            outcomes.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "available"
                ? "bg-[#002B49] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Available Tasks ({filteredCoursework.length})
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "submissions"
                ? "bg-[#002B49] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Submissions ({mySubmissions.length})
          </button>
        </div>
      </div>

      {submissionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submissionSuccessMsg}</span>
        </div>
      )}

      {/* Available Coursework Tab */}
      {activeTab === "available" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments by topic, outcome code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="All">All Grades (PP1 – G12)</option>
              <option value="PP1">PP1</option>
              <option value="PP2">PP2</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10 (Senior)</option>
              <option value="Grade 11">Grade 11 (Senior)</option>
              <option value="Grade 12">Grade 12 (Senior)</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
            >
              <option value="All">All Types</option>
              <option value="assignment">Homework Assignment</option>
              <option value="project">Project</option>
              <option value="practical">Lab Practical</option>
              <option value="worksheet">Worksheet</option>
            </select>
          </div>

          {/* Coursework Cards Grid */}
          {filteredCoursework.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoursework.map((item) => {
                const isSubmitted = mySubmissions.some((s) => s.courseworkId === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-[#F2A900] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-blue-100 text-[#002B49]">
                          {item.itemType}
                        </span>
                        {item.schoolCode ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {item.schoolCode} Only
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            General Curriculum
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.learningArea} · {item.gradeLevel}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>

                      {item.outcomeCode && (
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                          <span className="font-bold text-[#002B49]">KICD Outcome: </span>
                          <span className="font-mono">{item.outcomeCode}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-amber-700 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Due: {new Date(item.dueDate || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-slate-800">
                          {item.totalMarks ? `${item.totalMarks} Marks` : "CBE Rubric"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedItemForDetails(item)}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setSubmissionModalItem(item)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSubmitted
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-[#002B49] hover:bg-[#001E33] text-white"
                          }`}
                        >
                          {isSubmitted ? (
                            <>
                              <FileCheck className="w-3.5 h-3.5" /> Re-submit
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" /> Submit Work
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No coursework matches your filters
              </h3>
              <p className="text-xs text-slate-500">
                Try selecting "All Grades" or resetting your search keywords.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {mySubmissions.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
              {mySubmissions.map((sub) => (
                <div key={sub.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === "graded"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-[#002B49]"
                          }`}
                        >
                          {sub.status === "graded" ? "Graded & Reviewed" : "Submitted for Review"}
                        </span>
                        <span className="text-xs text-slate-500">
                          Submitted on {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{sub.courseworkTitle}</h3>
                    </div>

                    {sub.score !== undefined && (
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-600">
                          {sub.score} / {sub.totalMarks || 30}
                        </span>
                        <span className="text-[11px] block font-semibold text-slate-500">
                          Band: {sub.rubricBand || "Meeting Expectations"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">Your Written Work:</span>
                    <p className="italic">“{sub.textSubmission}”</p>
                    {sub.attachmentName && (
                      <p className="text-blue-700 font-semibold mt-1">
                        Attachment: {sub.attachmentName}
                      </p>
                    )}
                  </div>

                  {sub.feedbackNotes && (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-emerald-900">
                        Teacher Feedback from {sub.gradedBy}:
                      </span>
                      <p className="text-emerald-800 italic">“{sub.feedbackNotes}”</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                You haven't submitted any coursework yet
              </p>
              <p className="text-xs text-slate-500">
                Choose an assignment from the "Available Tasks" tab to start learning.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submission Modal */}
      {submissionModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Submit Assignment Work</h3>
                <p className="text-xs text-slate-300">{submissionModalItem.title}</p>
              </div>
              <button
                onClick={() => setSubmissionModalItem(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-bold text-[#002B49] block mb-1">Task Instructions:</span>
                <p className="text-slate-700 leading-relaxed">{submissionModalItem.description}</p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Type Your Response / Lab Report / Answers *
                </label>
                <textarea
                  rows={6}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Type your complete solution, observations, and findings here..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Attach Photo / Document (Optional)
                </label>
                <input
                  type="text"
                  value={attachedFileName}
                  onChange={(e) => setAttachedFileName(e.target.value)}
                  placeholder="e.g. My_Biological_Drawing_Scan.jpg or LabReport_G8.pdf"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSubmissionModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002B49] text-white hover:bg-[#001E33] font-bold cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details & Rubric Modal */}
      {selectedItemForDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#F2A900]">
                  {selectedItemForDetails.itemType}
                </span>
                <h3 className="text-base font-bold text-white">{selectedItemForDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Task Overview</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedItemForDetails.description}
                </p>
              </div>

              {selectedItemForDetails.content && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800">Curriculum Content & Practical Guide</h4>
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                    {selectedItemForDetails.content}
                  </div>
                </div>
              )}

              {selectedItemForDetails.rubric && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#F2A900]" />
                    Official Assessment Rubric
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <span className="font-bold text-emerald-800 block">
                        Exceeding Expectations
                      </span>
                      <p className="text-emerald-700 mt-1">
                        {selectedItemForDetails.rubric.exceeding}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <span className="font-bold text-blue-800 block">Meeting Expectations</span>
                      <p className="text-blue-700 mt-1">{selectedItemForDetails.rubric.meeting}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <span className="font-bold text-amber-800 block">
                        Approaching Expectations
                      </span>
                      <p className="text-amber-700 mt-1">
                        {selectedItemForDetails.rubric.approaching}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                      <span className="font-bold text-rose-800 block">Below Expectations</span>
                      <p className="text-rose-700 mt-1">{selectedItemForDetails.rubric.below}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    onAskAITutor(
                      `Please guide me on this assignment: ${selectedItemForDetails.title} in ${selectedItemForDetails.learningArea}`,
                      selectedItemForDetails.learningArea,
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#F2A900] text-[#002B49] font-black cursor-pointer hover:bg-[#D99600]"
                >
                  Ask Mwalimu AI For Help
                </button>
                <button
                  onClick={() => {
                    setSelectedItemForDetails(null);
                    setSubmissionModalItem(selectedItemForDetails);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#002B49] text-white hover:bg-[#001E33] font-bold cursor-pointer"
                >
                  Start Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
