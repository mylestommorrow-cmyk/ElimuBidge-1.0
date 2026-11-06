// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Lock,
  Trash2,
  Eye,
  School,
  Calendar,
  Layers,
  CheckSquare,
  Sparkles,
  X,
  FileCheck,
} from "lucide-react";
import { ExamPaper, ExamBankFilters, CbeGrade, SchoolAccount } from "../types";
import {
  getAllExamPapers,
  saveExamPaper,
  deleteExamPaper,
  incrementPaperDownloadCount,
  getPaperBlobForDownload,
} from "../data/examBankStorage";
import { OFFICIAL_CBE_STRUCTURE } from "../data/curriculumDesigns";

interface ExamBankViewProps {
  currentSchool: SchoolAccount | null;
  onOpenSchoolAccess: () => void;
}

const ALL_GRADES: CbeGrade[] = [
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

export const ExamBankView: React.FC<ExamBankViewProps> = ({
  currentSchool,
  onOpenSchoolAccess,
}) => {
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPreviewPaper, setSelectedPreviewPaper] = useState<ExamPaper | null>(null);

  // Filter state
  const [filters, setFilters] = useState<ExamBankFilters>({
    searchQuery: "",
    gradeLevel: "all",
    learningArea: "all",
    term: "all",
    examType: "all",
    year: "all",
    schoolCode: "all",
    visibility: "all",
  });

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSchoolCode, setUploadSchoolCode] = useState(currentSchool?.code || "");
  const [uploadTeacherPin, setUploadTeacherPin] = useState(currentSchool?.teacherPin || "2026");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadGrade, setUploadGrade] = useState<CbeGrade>("Grade 9");
  const [uploadLearningArea, setUploadLearningArea] = useState("Pre-Technical Studies");
  const [uploadTerm, setUploadTerm] = useState<"Term 1" | "Term 2" | "Term 3">("Term 1");
  const [uploadExamType, setUploadExamType] = useState<ExamPaper["examType"]>("Mock");
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear());
  const [uploadVisibility, setUploadVisibility] = useState<"my_school" | "all_schools">(
    "all_schools",
  );
  const [uploadConfirmedRights, setUploadConfirmedRights] = useState(false);
  const [uploadPaperFile, setUploadPaperFile] = useState<File | null>(null);
  const [uploadSchemeFile, setUploadSchemeFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [paperToDelete, setPaperToDelete] = useState<ExamPaper | null>(null);
  const [deletePin, setDeletePin] = useState("2026");
  const [deleteError, setDeleteError] = useState("");

  // Fetch papers on load
  const loadPapers = async () => {
    setIsLoading(true);
    const data = await getAllExamPapers();
    setPapers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPapers();
  }, []);

  // Update upload school code when currentSchool changes
  useEffect(() => {
    if (currentSchool) {
      setUploadSchoolCode(currentSchool.code);
      setUploadTeacherPin(currentSchool.teacherPin || "2026");
    }
  }, [currentSchool]);

  // Distinct subjects for filter dropdown
  const uniqueSubjects = useMemo(() => {
    const list = new Set<string>();
    papers.forEach((p) => list.add(p.learningArea));
    return Array.from(list);
  }, [papers]);

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      // Visibility rule: if paper is "my_school", only students/teachers from that school can view
      if (paper.visibility === "my_school") {
        if (!currentSchool || currentSchool.code.toUpperCase() !== paper.schoolCode.toUpperCase()) {
          return false;
        }
      }

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = paper.title.toLowerCase().includes(query);
        const matchesSubject = paper.learningArea.toLowerCase().includes(query);
        const matchesSchool =
          paper.schoolName.toLowerCase().includes(query) ||
          paper.schoolCode.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject && !matchesSchool) return false;
      }

      if (filters.gradeLevel !== "all" && paper.gradeLevel !== filters.gradeLevel) {
        return false;
      }

      if (filters.learningArea !== "all" && paper.learningArea !== filters.learningArea) {
        return false;
      }

      if (filters.term !== "all" && paper.term !== filters.term) {
        return false;
      }

      if (filters.examType !== "all" && paper.examType !== filters.examType) {
        return false;
      }

      if (filters.year !== "all" && paper.year.toString() !== filters.year) {
        return false;
      }

      return true;
    });
  }, [papers, filters, currentSchool]);

  // Handle Download
  const handleDownload = async (paper: ExamPaper, type: "paper" | "scheme") => {
    const { blob, fileName } = await getPaperBlobForDownload(paper, type);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (type === "paper") {
      const newCount = await incrementPaperDownloadCount(paper.id);
      setPapers((prev) =>
        prev.map((p) => (p.id === paper.id ? { ...p, downloadCount: newCount } : p)),
      );
    }
  };

  // Handle Upload Submission
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");

    if (!uploadTitle.trim()) {
      setUploadError("Please provide an assessment paper title.");
      return;
    }

    if (!uploadSchoolCode.trim()) {
      setUploadError("School Code is required.");
      return;
    }

    if (!uploadTeacherPin.trim()) {
      setUploadError("Teacher verification PIN is required (Default demo PIN is 2026).");
      return;
    }

    // Legacy PINs apply only to the explicit on-device demonstration.
    const isDemo = window.location.pathname === "/demo";
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch("/api/validate-teacher-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionData.session
            ? { Authorization: `Bearer ${sessionData.session.access_token}` }
            : {}),
        },
        body: JSON.stringify({ schoolCode: uploadSchoolCode, pin: uploadTeacherPin }),
      });
      const data = await res.json();
      if (
        !data.valid &&
        !(isDemo && (uploadTeacherPin === "2026" || uploadTeacherPin === "9900"))
      ) {
        setUploadError(
          data.message || "Invalid Teacher PIN. Only verified teachers can upload papers.",
        );
        return;
      }
    } catch {
      // Offline fallback PIN check
      if (!isDemo || (uploadTeacherPin !== "2026" && uploadTeacherPin !== "9900")) {
        setUploadError("Invalid Teacher PIN for offline verification.");
        return;
      }
    }

    if (!uploadConfirmedRights) {
      setUploadError("You must confirm copyright ownership or permission to share this paper.");
      return;
    }

    setIsSubmitting(true);

    const paperId = `paper-${Date.now()}`;
    const newPaper: ExamPaper = {
      id: paperId,
      title: uploadTitle.trim(),
      schoolCode: uploadSchoolCode.trim().toUpperCase(),
      schoolName:
        currentSchool?.code.toUpperCase() === uploadSchoolCode.trim().toUpperCase()
          ? currentSchool.name
          : `School ${uploadSchoolCode.trim().toUpperCase()}`,
      gradeLevel: uploadGrade,
      learningArea: uploadLearningArea,
      term: uploadTerm,
      examType: uploadExamType,
      year: uploadYear,
      fileName: uploadPaperFile ? uploadPaperFile.name : `${uploadTitle.replace(/\s+/g, "_")}.pdf`,
      fileType: uploadPaperFile && uploadPaperFile.type.startsWith("image") ? "image" : "pdf",
      fileSize: uploadPaperFile
        ? `${(uploadPaperFile.size / (1024 * 1024)).toFixed(1)} MB`
        : "1.5 MB",
      fileUrl: "",
      markingSchemeName: uploadSchemeFile ? uploadSchemeFile.name : undefined,
      markingSchemeUrl: "",
      visibility: uploadVisibility,
      teacherConfirmedRights: true,
      uploadedBy: currentSchool
        ? `Teacher @ ${currentSchool.name}`
        : `Mwalimu (${uploadSchoolCode})`,
      uploadedAt: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      previewSnippet: `Authentic Kenya CBE past assessment paper for ${uploadGrade} - ${uploadLearningArea} (${uploadExamType} ${uploadYear}). Verified by registered teacher.`,
    };

    const saved = await saveExamPaper(
      newPaper,
      uploadPaperFile || undefined,
      uploadSchemeFile || undefined,
    );
    if (!saved.success) {
      setIsSubmitting(false);
      setUploadError("This device could not store your paper. Please try again.");
      return;
    }
    await loadPapers();

    setIsSubmitting(false);
    setUploadSuccess("Exam paper successfully uploaded to the repository!");
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess("");
      setUploadTitle("");
      setUploadPaperFile(null);
      setUploadSchemeFile(null);
      setUploadConfirmedRights(false);
    }, 1200);
  };

  // Handle Delete Paper
  const handleDeleteSubmit = async () => {
    if (!paperToDelete) return;
    setDeleteError("");

    const res = await deleteExamPaper(paperToDelete.id, uploadSchoolCode, deletePin);
    if (!res.success) {
      setDeleteError(res.message);
      return;
    }

    await loadPapers();
    setPaperToDelete(null);
    setDeletePin("2026");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Kenyan CBE Exam Bank
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              CBE Past Paper & Marking Scheme Repository
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Access authentic past papers, rehearsal CATs, KPSEA models, and Senior School
              transition assessments from verified Kenyan schools. Teachers can upload and share
              school papers with secure PIN verification.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> IndexedDB Offline Storage
                Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-300" /> Supabase RLS Scoped Storage Ready
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-sky-300" /> {papers.length} Papers Available
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-lg transition transform active:scale-95 text-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Past Paper (Teachers)
            </button>
            {!currentSchool && (
              <button
                onClick={onOpenSchoolAccess}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition"
              >
                <School className="w-4 h-4" />
                Connect School Code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, learning area, school name or code..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Clear */}
          {(filters.searchQuery || filters.gradeLevel !== "all" || filters.examType !== "all") && (
            <button
              onClick={() =>
                setFilters({
                  searchQuery: "",
                  gradeLevel: "all",
                  learningArea: "all",
                  term: "all",
                  examType: "all",
                  year: "all",
                  schoolCode: "all",
                  visibility: "all",
                })
              }
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 self-center"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Multi-Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Grade Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Grade Level
            </label>
            <select
              value={filters.gradeLevel}
              onChange={(e) => setFilters({ ...filters, gradeLevel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Grades (PP1–G12)</option>
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Exam Type
            </label>
            <select
              value={filters.examType}
              onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Exam Types</option>
              <option value="Opener">Opener Examination</option>
              <option value="Mid-term">Mid-Term Assessment</option>
              <option value="End-term">End-Term Summative</option>
              <option value="Mock">Mock / Rehearsal</option>
              <option value="KPSEA">KPSEA (Grade 6)</option>
              <option value="KCSE-style">KCSE / Senior Model</option>
            </select>
          </div>

          {/* Term */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Term
            </label>
            <select
              value={filters.term}
              onChange={(e) => setFilters({ ...filters, term: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Terms</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>

          {/* Learning Area */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Learning Area
            </label>
            <select
              value={filters.learningArea}
              onChange={(e) => setFilters({ ...filters, learningArea: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Academic Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Years</option>
              <option value="2026">2026 (Live Senior Cohort)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3" />
          <p className="text-sm">Loading authentic past papers from repository...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No Past Papers Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search keywords, grade level, or exam type filters to find papers.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload First Paper for this Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => {
            const isMySchoolPaper =
              currentSchool && currentSchool.code.toUpperCase() === paper.schoolCode.toUpperCase();
            return (
              <div
                key={paper.id}
                className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition group"
              >
                {/* Header tags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {paper.gradeLevel}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {paper.examType} • {paper.year}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition text-base line-clamp-2">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {paper.schoolName}
                      </span>
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {paper.learningArea}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {paper.term}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {paper.fileSize}
                    </span>
                    {paper.visibility === "my_school" && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> School Exclusive
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {paper.downloadCount || 0} downloads
                    </span>
                    <button
                      onClick={() => setSelectedPreviewPaper(paper)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleDownload(paper, "paper")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Paper
                    </button>

                    {paper.markingSchemeName && (
                      <button
                        onClick={() => handleDownload(paper, "scheme")}
                        title="Download Verified Marking Scheme"
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                      >
                        Scheme
                      </button>
                    )}

                    {/* Teacher Manage / Delete button */}
                    <button
                      onClick={() => setPaperToDelete(paper)}
                      title="Delete / Manage Paper"
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {selectedPreviewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Past Paper Inspection
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedPreviewPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewPaper(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block">Grade</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPreviewPaper.gradeLevel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Learning Area</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPreviewPaper.learningArea}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Exam Term</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPreviewPaper.term} ({selectedPreviewPaper.year})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">School</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPreviewPaper.schoolCode}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Paper Content Sample & Examination Rubric:
                </h4>
                <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {selectedPreviewPaper.previewSnippet ||
                    "Examination paper content ready for printing and digital revision."}
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Uploaded by {selectedPreviewPaper.uploadedBy} with verified school copyright
                clearance.
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPreviewPaper(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedPreviewPaper, "paper");
                  setSelectedPreviewPaper(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Complete Assessment File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Past Paper Modal (Teachers Only) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Teacher Portal
                </span>
                <h3 className="text-lg font-bold">Upload Verified Past Assessment</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleUploadSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-sm"
            >
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {uploadSuccess}
                </div>
              )}

              {/* Teacher Authentication Gate */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Lock className="w-3.5 h-3.5" />
                  Teacher & School Authentication Gate
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      School Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ALN-9021"
                      value={uploadSchoolCode}
                      onChange={(e) => setUploadSchoolCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Teacher Security PIN * (Demo PIN: 2026)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter 4-digit PIN"
                      value={uploadTeacherPin}
                      onChange={(e) => setUploadTeacherPin(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Paper Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grade 9 Pre-Technical Studies Term 1 Mid-Term 2026"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Grade and Learning Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade Level *
                  </label>
                  <select
                    value={uploadGrade}
                    onChange={(e) => setUploadGrade(e.target.value as CbeGrade)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Area *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics, Integrated Science"
                    value={uploadLearningArea}
                    onChange={(e) => setUploadLearningArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Term, Exam Type, Year */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Term
                  </label>
                  <select
                    value={uploadTerm}
                    onChange={(e) => setUploadTerm(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={uploadExamType}
                    onChange={(e) => setUploadExamType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Opener">Opener</option>
                    <option value="Mid-term">Mid-Term</option>
                    <option value="End-term">End-Term</option>
                    <option value="Mock">Mock</option>
                    <option value="KPSEA">KPSEA</option>
                    <option value="KCSE-style">KCSE-style</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={uploadYear}
                    onChange={(e) => setUploadYear(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Visibility Setting */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Access Visibility *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs ${
                      uploadVisibility === "all_schools"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={uploadVisibility === "all_schools"}
                      onChange={() => setUploadVisibility("all_schools")}
                      className="text-emerald-600"
                    />
                    <div>
                      <span className="font-bold block">All Schools</span>
                      <span className="text-[10px] text-slate-500">Shared national repository</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs ${
                      uploadVisibility === "my_school"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={uploadVisibility === "my_school"}
                      onChange={() => setUploadVisibility("my_school")}
                      className="text-emerald-600"
                    />
                    <div>
                      <span className="font-bold block">My School Only</span>
                      <span className="text-[10px] text-slate-500">Restricted to school code</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Upload Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Past Paper Document (PDF, JPG, PNG - Max 10MB) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setUploadPaperFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-slate-800 dark:file:text-emerald-400"
                  />
                  {uploadPaperFile && (
                    <span className="text-[11px] text-emerald-600 mt-1 block">
                      Selected: {uploadPaperFile.name} (
                      {(uploadPaperFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marking Scheme File (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setUploadSchemeFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300"
                  />
                </div>
              </div>

              {/* Rights Confirmation Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uploadConfirmedRights}
                    onChange={(e) => setUploadConfirmedRights(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    required
                  />
                  <span>
                    I certify that my school owns or holds explicit authorization to share this
                    assessment paper for educational and revision purposes under KICD CBE
                    guidelines.
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isSubmitting ? "Uploading to Repository..." : "Publish to Exam Bank"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {paperToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Exam Paper
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove <strong>"{paperToDelete.title}"</strong>? Only
              teachers from the owning school can delete papers.
            </p>

            {deleteError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Enter Teacher PIN (Default demo: 2026)
              </label>
              <input
                type="password"
                value={deletePin}
                onChange={(e) => setDeletePin(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setPaperToDelete(null);
                  setDeleteError("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
