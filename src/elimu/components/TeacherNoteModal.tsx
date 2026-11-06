// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import {
  X,
  FileText,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  School,
  GraduationCap,
} from "lucide-react";
import { TeacherNote, SubjectCategory, CbeGrade } from "../types";

interface TeacherNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSchoolCode: string;
  activeSchoolName: string;
  onAddNote: (note: TeacherNote) => void;
  initialSubject?: string;
  initialGrade?: string;
}

export const TeacherNoteModal: React.FC<TeacherNoteModalProps> = ({
  isOpen,
  onClose,
  activeSchoolCode,
  activeSchoolName,
  onAddNote,
  initialSubject = "Integrated Science",
  initialGrade = "Grade 8",
}) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectCategory>(
    (initialSubject as SubjectCategory) || "Integrated Science",
  );
  const [gradeLevel, setGradeLevel] = useState<CbeGrade>((initialGrade as CbeGrade) || "Grade 8");
  const [strand, setStrand] = useState("Strand 1: Core Competency Analysis");
  const [content, setContent] = useState("");
  const [formulasInput, setFormulasInput] = useState("");
  const [homeworkTask, setHomeworkTask] = useState("");
  const [authorName, setAuthorName] = useState("Mwalimu Wanyama");
  const [authorRole, setAuthorRole] = useState("Senior Subject Facilitator");
  const [attachmentTitle, setAttachmentTitle] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const subjectsList: SubjectCategory[] = [
    "Mathematics",
    "Integrated Science",
    "English",
    "Kiswahili",
    "History",
    "Agriculture",
    "Pre-Technical & STEM",
    "Creative Arts & Environmental",
    "Social Studies",
  ];

  const gradesList: CbeGrade[] = [
    "Playgroup",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let cbeStage: TeacherNote["cbeStage"] = "Junior School";
    if (["Playgroup", "PP1", "PP2"].includes(gradeLevel)) cbeStage = "Pre-Primary";
    else if (["Grade 1", "Grade 2", "Grade 3"].includes(gradeLevel)) cbeStage = "Lower Primary";
    else if (["Grade 4", "Grade 5", "Grade 6"].includes(gradeLevel)) cbeStage = "Upper Primary";
    else if (["Grade 7", "Grade 8", "Grade 9"].includes(gradeLevel)) cbeStage = "Junior School";
    else if (["Grade 10", "Grade 11", "Grade 12"].includes(gradeLevel)) cbeStage = "Senior School";

    const formulas = formulasInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const attachments =
      attachmentTitle.trim() && attachmentUrl.trim()
        ? [{ title: attachmentTitle.trim(), url: attachmentUrl.trim() }]
        : [];

    const newNote: TeacherNote = {
      id: `note-${Date.now()}`,
      schoolCode: activeSchoolCode,
      title: title.trim(),
      subject,
      gradeLevel,
      cbeStage,
      strand: strand.trim() || undefined,
      content: content.trim(),
      keyFormulas: formulas.length > 0 ? formulas : undefined,
      homeworkTask: homeworkTask.trim() || undefined,
      authorName: authorName.trim() || "Senior Facilitator",
      authorRole: authorRole.trim() || "CBE Educator",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      createdAt: new Date().toISOString().split("T")[0],
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    onAddNote(newNote);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#002B49] to-[#003d66] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-[#F2A900]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Add Syllabus Notes to Portfolio</h2>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span>
                  School: <strong>{activeSchoolName}</strong>
                </span>
                <span>·</span>
                <span className="font-mono bg-white/20 px-1.5 py-0.2 rounded">
                  {activeSchoolCode}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Lesson Note / Topic Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grade 9 Chemistry: Periodic Table Trends & Flame Tests"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Subject Category</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#002B49] focus:outline-none"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">CBE Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as CbeGrade)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#002B49] focus:outline-none"
              >
                {gradesList.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              CBE Strand / Sub-Strand (Optional)
            </label>
            <input
              type="text"
              value={strand}
              onChange={(e) => setStrand(e.target.value)}
              placeholder="e.g. Strand 2: Chemical Substances & Reactions"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Revision Notes & Practical Instructions * (Supports Markdown / Bullet points)
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide clear step-by-step revision summary, practical steps, or curriculum explanations for students..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Key Formulas / Rules / Definitions (One per line)
            </label>
            <textarea
              rows={2}
              value={formulasInput}
              onChange={(e) => setFormulasInput(e.target.value)}
              placeholder="e.g. Density = Mass / Volume&#10;Speed = Distance / Time"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Homework Task / CAT Drill Question
            </label>
            <input
              type="text"
              value={homeworkTask}
              onChange={(e) => setHomeworkTask(e.target.value)}
              placeholder="e.g. Complete questions 1 to 5 in the KJSEA Model Test Paper on page 42"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Author Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Attachment Title (Optional)
              </label>
              <input
                type="text"
                value={attachmentTitle}
                onChange={(e) => setAttachmentTitle(e.target.value)}
                placeholder="e.g. KICD Practical Sheet"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Attachment URL (Optional)</label>
              <input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://kec.ac.ke"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#002B49] text-white text-xs font-bold hover:bg-[#003d66] shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Note to {activeSchoolCode}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
