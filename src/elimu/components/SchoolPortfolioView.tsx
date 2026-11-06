// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  School,
  FileText,
  Link2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Sparkles,
  Users,
  MapPin,
  Share2,
  GraduationCap,
  Copy,
  ChevronDown,
  ChevronUp,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { TeacherNote, TeachingLink, SchoolAccount } from "../types";

interface SchoolPortfolioViewProps {
  activeSchool: SchoolAccount;
  allSchools: SchoolAccount[];
  notes: TeacherNote[];
  links: TeachingLink[];
  onOpenAddNoteModal: () => void;
  onOpenAddLinkModal: () => void;
  onOpenSchoolSwitchModal: () => void;
  onAskAITutor: (prompt: string, subject: string) => void;
}

export const SchoolPortfolioView: React.FC<SchoolPortfolioViewProps> = ({
  activeSchool,
  allSchools,
  notes,
  links,
  onOpenAddNoteModal,
  onOpenAddLinkModal,
  onOpenSchoolSwitchModal,
  onAskAITutor,
}) => {
  const [activeTab, setActiveTab] = useState<"notes" | "links">("notes");
  const [filterSchoolOnly, setFilterSchoolOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("All");
  const [filterGrade, setFilterGrade] = useState<string>("All");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // School Code filter
      if (filterSchoolOnly && n.schoolCode.toUpperCase() !== activeSchool.code.toUpperCase()) {
        return false;
      }
      // Search
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.strand && n.strand.toLowerCase().includes(searchQuery.toLowerCase()));

      // Subject
      const matchesSubject = filterSubject === "All" || n.subject === filterSubject;

      // Grade
      const matchesGrade = filterGrade === "All" || n.gradeLevel === filterGrade;

      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [notes, activeSchool.code, filterSchoolOnly, searchQuery, filterSubject, filterGrade]);

  // Filter links
  const filteredLinks = useMemo(() => {
    return links.filter((l) => {
      // School Code filter
      if (
        filterSchoolOnly &&
        l.schoolCode &&
        l.schoolCode.toUpperCase() !== activeSchool.code.toUpperCase()
      ) {
        return false;
      }
      // Search
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.addedBy.toLowerCase().includes(searchQuery.toLowerCase());

      // Subject
      const matchesSubject =
        filterSubject === "All" || l.subject === "All" || l.subject === filterSubject;

      // Grade
      const matchesGrade =
        filterGrade === "All" || l.gradeLevel === "All Grades" || l.gradeLevel === filterGrade;

      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [links, activeSchool.code, filterSchoolOnly, searchQuery, filterSubject, filterGrade]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(activeSchool.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const subjectsList = [
    "All",
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

  const gradesList = [
    "All",
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

  const schoolNotesCount = notes.filter(
    (n) => n.schoolCode.toUpperCase() === activeSchool.code.toUpperCase(),
  ).length;
  const schoolLinksCount = links.filter(
    (l) => l.schoolCode?.toUpperCase() === activeSchool.code.toUpperCase(),
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* School Portfolio Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#002B49] via-[#003d66] to-[#002B49] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {activeSchool.logoEmoji}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-white">
                  {activeSchool.name}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F2A900] text-slate-950 flex items-center gap-1.5 shadow-xs hover:bg-[#e09b00] transition-colors cursor-pointer"
                  title="Click to copy access code"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Code: {activeSchool.code}</span>
                  {copiedCode ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F2A900]" />
                  <span>{activeSchool.county}</span>
                </span>
                <span>·</span>
                <span>Head: {activeSchool.principalName}</span>
                <span>·</span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified CBE Institution</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 italic pt-1">
                "{activeSchool.motto}"
              </p>
            </div>
          </div>

          {/* Quick Actions & Switcher */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenSchoolSwitchModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <School className="w-4 h-4 text-[#F2A900]" />
              <span>Switch School Code</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={onOpenAddNoteModal}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#F2A900] hover:bg-[#e09b00] text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Note</span>
              </button>
              <button
                onClick={onOpenAddLinkModal}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Institution Stats Pill */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Teacher Notes
            </div>
            <div className="text-lg font-black text-[#F2A900] mt-0.5">
              {schoolNotesCount} Published
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Curated Links
            </div>
            <div className="text-lg font-black text-cyan-300 mt-0.5">{schoolLinksCount} Active</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Active Streams
            </div>
            <div className="text-lg font-black text-white mt-0.5">
              {activeSchool.cbeStreams.length} CBE Tiers
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Learners Enrolled
            </div>
            <div className="text-lg font-black text-emerald-300 mt-0.5">
              {activeSchool.registeredLearnersCount}+
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Main Portfolio Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "notes"
                  ? "bg-[#002B49] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4 text-[#F2A900]" />
              <span>Teacher Notes & Formulations ({filteredNotes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("links")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "links"
                  ? "bg-[#002B49] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Link2 className="w-4 h-4 text-[#F2A900]" />
              <span>Teaching Links & Syllabi ({filteredLinks.length})</span>
            </button>
          </div>

          {/* School Scope Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Scope:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setFilterSchoolOnly(true)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  filterSchoolOnly
                    ? "bg-white text-[#002B49] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeSchool.code} Only
              </button>
              <button
                onClick={() => setFilterSchoolOnly(false)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  !filterSchoolOnly
                    ? "bg-white text-[#002B49] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Partner Schools
              </button>
            </div>
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic title, teacher name, formulas, or homework..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Subjects" : s}
                </option>
              ))}
            </select>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#002B49] focus:outline-none"
            >
              {gradesList.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "All Grades" : g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "notes" ? (
        /* Teacher Notes List */
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Teacher Notes Found for {filterSchoolOnly ? activeSchool.name : "this filter"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Teachers from {activeSchool.name} can add scheme notes, key formulas, and practical
                tasks directly to this portfolio.
              </p>
              <button
                onClick={onOpenAddNoteModal}
                className="px-5 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#003d66] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Teacher Note</span>
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isExpanded = expandedNoteId === note.id;
              return (
                <div
                  key={note.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Note Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#002B49] text-white">
                          {note.schoolCode}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                          {note.subject}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                          {note.gradeLevel}
                        </span>
                        {note.strand && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {note.strand}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{note.createdAt}</span>
                      </div>
                    </div>

                    {/* Note Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {note.title}
                      </h3>
                    </div>

                    {/* Content preview or full */}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      {isExpanded ? note.content : `${note.content.slice(0, 280)}...`}
                    </div>

                    {/* Key Formulas Section */}
                    {note.keyFormulas && note.keyFormulas.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                        <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Essential Formulas & Core Concepts:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-800 font-mono">
                          {note.keyFormulas.map((formula, fIdx) => (
                            <li key={fIdx} className="leading-snug">
                              {formula}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Homework Task */}
                    {note.homeworkTask && (
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-[#002B49] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Homework / Practice Assignment: </span>
                          <span>{note.homeworkTask}</span>
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {note.attachments.map((att, aIdx) => (
                          <a
                            key={aIdx}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                            <span>{att.title}</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Author & Footer actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            note.authorAvatar ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
                          }
                          alt={note.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{note.authorName}</div>
                          <div className="text-[10px] text-slate-500">{note.authorRole}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onAskAITutor(
                              `Explain this teacher note on "${note.title}" for ${note.gradeLevel} ${note.subject}. Help me understand the core concepts and test questions related to it.`,
                              note.subject,
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1.5 border border-purple-200 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Explain with Mwalimu AI</span>
                        </button>

                        <button
                          onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? "Collapse Note" : "Read Full Note"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Teaching Links List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLinks.length === 0 ? (
            <div className="col-span-2 bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#002B49] flex items-center justify-center mx-auto">
                <Link2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Teaching Links Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Teachers from {activeSchool.name} can add vetted Kenya CBE curriculum links, PhET
                simulations, and past CAT papers.
              </p>
              <button
                onClick={onOpenAddLinkModal}
                className="px-5 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#003d66] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Teaching Link</span>
              </button>
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#002B49] text-white">
                      {link.schoolCode || activeSchool.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {link.subject} · {link.gradeLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{link.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    By: <span className="font-semibold text-slate-800">{link.addedBy}</span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#002B49] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Visit Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
