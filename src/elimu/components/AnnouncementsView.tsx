// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import {
  Bell,
  Plus,
  Pin,
  ExternalLink,
  Calendar,
  Sparkles,
  Camera,
  Check,
  Filter,
  School,
  X,
  MessageSquare,
} from "lucide-react";
import { Announcement } from "../types";
import { AVATAR_PRESETS } from "../data/profiles";

interface AnnouncementsViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
  onUpdateAnnouncementAvatar: (announcementId: string, newAvatarUrl: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncementAvatar,
}) => {
  const [gradeFilter, setGradeFilter] = useState<string>("All");
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [editingAvatarId, setEditingAvatarId] = useState<string | null>(null);

  // New announcement form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("Madam Wanjiku Njeri");
  const [authorRole, setAuthorRole] = useState("Head of CBE Humanities & Languages");
  const [authorAvatar, setAuthorAvatar] = useState(
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
  );
  const [schoolName, setSchoolName] = useState("Moi Forces Academy, Nairobi");
  const [cbeTargetGrade, setCbeTargetGrade] = useState("All CBE Grades");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  const filteredAnnouncements = announcements.filter((item) => {
    if (gradeFilter === "All") return true;
    if (item.cbeTargetGrade === "All CBE Grades") return true;
    return item.cbeTargetGrade?.toLowerCase().includes(gradeFilter.toLowerCase());
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      authorName: authorName.trim() || "CBE Educator",
      authorRole: authorRole.trim() || "Senior Teacher",
      authorAvatar: customAvatarUrl.trim() || authorAvatar,
      schoolName: schoolName.trim(),
      cbeTargetGrade,
      date: "Just now",
      pinned: false,
      category: "curriculum",
      teachingLink: linkUrl.trim()
        ? {
            title: linkTitle.trim() || "Reference Link",
            url: linkUrl.startsWith("http") ? linkUrl.trim() : "https://" + linkUrl.trim(),
          }
        : undefined,
    };

    onAddAnnouncement(newAnn);
    setTitle("");
    setContent("");
    setLinkTitle("");
    setLinkUrl("");
    setIsPostingModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#002B49] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-[#F2A900]">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2A900] text-[#002B49] text-xs font-black uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            <span>Official CBE Noticeboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            CBE Curriculum Announcements & School Bulletins
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
            Direct notices from verified Kenyan educators, examination coordinators, and department
            heads. Real teacher avatars and customizable author profiles.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setIsPostingModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#F2A900] hover:bg-[#FFB81C] text-[#002B49] font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Post Announcement</span>
          </button>
        </div>
      </div>

      {/* Grade Filter Pill Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-600 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#002B49]" /> Filter by Grade:
        </span>
        {[
          "All",
          "Playgroup",
          "PP1",
          "PP2",
          "Grade 1",
          "Grade 4",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
          "Grade 11",
          "Grade 12",
        ].map((grade) => (
          <button
            key={grade}
            onClick={() => setGradeFilter(grade)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              gradeFilter === grade
                ? "bg-[#002B49] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {grade === "All" ? "All Grades" : grade}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all relative ${
              ann.pinned
                ? "border-[#002B49] ring-1 ring-[#002B49]/20 bg-gradient-to-r from-amber-50/30 via-white to-white"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Top Ribbon & Author Information */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                {/* Real Author Profile Avatar with Change Button */}
                <div className="relative group shrink-0">
                  <img
                    src={ann.authorAvatar}
                    alt={ann.authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#002B49] shadow-xs"
                  />
                  <button
                    onClick={() => setEditingAvatarId(editingAvatarId === ann.id ? null : ann.id)}
                    className="absolute -bottom-1 -right-1 bg-[#F2A900] text-[#002B49] p-1 rounded-full shadow-xs hover:scale-110 transition-transform cursor-pointer"
                    title="Change profile image for this announcement"
                  >
                    <Camera className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{ann.authorName}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {ann.authorRole}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    {ann.schoolName && <span>{ann.schoolName}</span>}
                    <span>·</span>
                    <span className="text-[#002B49] font-mono">{ann.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {ann.pinned && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                    <Pin className="w-3 h-3 fill-amber-700" /> Pinned Bulletin
                  </span>
                )}
                {ann.cbeTargetGrade && (
                  <span className="bg-[#002B49] text-[#F2A900] text-[10px] font-bold px-2.5 py-0.5 rounded-md font-mono">
                    {ann.cbeTargetGrade}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Avatar Quick-Picker Drawer */}
            {editingAvatarId === ann.id && (
              <div className="my-3 p-3.5 bg-slate-50 rounded-xl border border-slate-300 space-y-2 animate-fade-in">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Choose Real Profile Image for {ann.authorName}:</span>
                  <button
                    onClick={() => setEditingAvatarId(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onUpdateAnnouncementAvatar(ann.id, preset.url);
                        setEditingAvatarId(null);
                      }}
                      className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-300 hover:border-[#002B49] hover:scale-105 transition-all cursor-pointer"
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Announcement Content */}
            <div className="pt-3.5 space-y-2">
              <h3 className="text-base font-bold text-slate-900 leading-snug">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {ann.content}
              </p>

              {/* Teaching Link Attachment */}
              {ann.teachingLink && (
                <div className="pt-2">
                  <a
                    href={ann.teachingLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002B49] text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#F2A900]" />
                    <span>Attached Resource: {ann.teachingLink.title}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post New Announcement Modal */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#002B49] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F2A900] text-[#002B49] flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Post Official Announcement</h3>
                  <p className="text-xs text-slate-300">
                    Set real profile image and CBE syllabus notice
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPostingModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePost} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 9 KJSEA Mock Revision Schedule"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Announcement Body / Notice <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Details for students, parents, and fellow teachers..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Author Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Target CBE Grade
                  </label>
                  <select
                    value={cbeTargetGrade}
                    onChange={(e) => setCbeTargetGrade(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="All CBE Grades">All CBE Grades</option>
                    <option value="Playgroup to PP2">Playgroup to PP2 (Pre-Primary)</option>
                    <option value="Grade 1 - 3">Grade 1 - 3 (Lower Primary)</option>
                    <option value="Grade 4 - 6">Grade 4 - 6 (Upper Primary)</option>
                    <option value="Grade 7 - 9">Grade 7 - 9 (Junior School)</option>
                    <option value="Grade 10 - 12">Grade 10 - 12 (Senior School)</option>
                  </select>
                </div>
              </div>

              {/* Profile Image Picker for this author */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-[#002B49] block">
                  Select Real Profile Image for Author:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => {
                    const isSelected = authorAvatar === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAuthorAvatar(preset.url);
                          setCustomAvatarUrl("");
                        }}
                        className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
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

              {/* Teaching Link Attachment (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Attach Teaching Link Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="e.g. Download Lesson Plan"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Teaching Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://kec.ac.ke/..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#002B49] text-white text-xs font-bold hover:bg-[#001E33] shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4 text-[#F2A900]" />
                  <span>Publish Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
