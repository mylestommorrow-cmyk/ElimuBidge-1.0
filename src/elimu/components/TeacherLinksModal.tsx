// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import { X, Link2, Plus, Sparkles, Check, Globe, BookOpen } from "lucide-react";
import { TeachingLink, SubjectCategory, CbeGrade } from "../types";
import { AVATAR_PRESETS } from "../data/profiles";

interface TeacherLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (link: TeachingLink) => void;
  initialSubject?: string;
  initialGrade?: string;
  activeSchoolCode?: string;
  activeSchoolName?: string;
}

export const TeacherLinksModal: React.FC<TeacherLinksModalProps> = ({
  isOpen,
  onClose,
  onAddLink,
  initialSubject = "Integrated Science",
  initialGrade = "Grade 8",
  activeSchoolCode = "DEMO-CBE",
  activeSchoolName = "National CBE Demonstration Academy",
}) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState<SubjectCategory>(
    (initialSubject as SubjectCategory) || "Integrated Science",
  );
  const [gradeLevel, setGradeLevel] = useState<CbeGrade>((initialGrade as CbeGrade) || "Grade 8");
  const [type, setType] = useState<TeachingLink["type"]>("lesson-plan");
  const [description, setDescription] = useState("");
  const [addedBy, setAddedBy] = useState("Mwalimu Ochieng");
  const [teacherRole, setTeacherRole] = useState("Senior CBE Subject Facilitator");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
  );
  const [school, setSchool] = useState(activeSchoolName);
  const [customAvatarInput, setCustomAvatarInput] = useState("");

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
    "All",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    const newLink: TeachingLink = {
      id: `tl-${Date.now()}`,
      title: title.trim(),
      url: finalUrl,
      subject,
      gradeLevel: gradeLevel === "All" ? "All Grades" : gradeLevel,
      type,
      description:
        description.trim() || "Verified CBE teaching resource aligned with KICD standards.",
      addedBy: addedBy.trim() || "CBE Teacher",
      teacherRole: teacherRole.trim(),
      avatarUrl: customAvatarInput.trim() || selectedAvatarUrl,
      school: school.trim(),
      schoolCode: activeSchoolCode,
      addedAt: new Date().toISOString().slice(0, 10),
      verified: true,
    };

    onAddLink(newLink);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#002B49] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F2A900] text-[#002B49] flex items-center justify-center font-bold">
              <Link2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add Relevant Teaching Link</h3>
              <p className="text-xs text-slate-300">
                Share KICD lesson plans, simulations, or curriculum resources
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-[#001E33] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. KICD Photosynthesis & Leaf Structure Interactive Lab"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Resource Web URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://kec.ac.ke or https://phet.colorado.edu/..."
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">CBE Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as CbeGrade)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              >
                {gradesList.map((g) => (
                  <option key={g} value={g}>
                    {g === "All" ? "All CBE Grades" : g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TeachingLink["type"])}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              >
                <option value="lesson-plan">Lesson Plan</option>
                <option value="curriculum">Curriculum Syllabus</option>
                <option value="simulation">Interactive Simulation / Lab</option>
                <option value="video">Video Tutorial</option>
                <option value="worksheet">Practice Worksheet</option>
                <option value="assessment">Assessment Rubric</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Description / Pedagogical Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how this link supports teachers or learners in this CBE topic..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            />
          </div>

          {/* Teacher Credentials and Avatar Selection */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="text-xs font-bold text-[#002B49]">
              Teacher Profile & School Attribution
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={addedBy}
                  onChange={(e) => setAddedBy(e.target.value)}
                  placeholder="e.g. Mwalimu Ochieng"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  School / Institution
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Alliance High School"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Profile Avatar Selection */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Select Real Teacher Avatar Photo
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_PRESETS.map((preset, idx) => {
                  const isSelected = selectedAvatarUrl === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarUrl(preset.url);
                        setCustomAvatarInput("");
                      }}
                      className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#002B49] ring-2 ring-[#F2A900] scale-105"
                          : "border-slate-300 opacity-70 hover:opacity-100"
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#002B49]/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F2A900]" />
              <span>Publish Teaching Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
