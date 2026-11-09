// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  BookOpen,
  Filter,
  FileText,
  Search,
  ExternalLink,
  Award,
  Compass,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { ComprehensiveCurriculumRecord, CbeGrade, CbeStage } from "../types";
import {
  getStoredCurriculumRecords,
  addCurriculumRecord,
  verifyCurriculumRecord,
} from "../data/curriculumEngine";

interface AdminCurriculumViewProps {
  onAskAITutor?: (prompt: string, subject: string) => void;
}

export const AdminCurriculumView: React.FC<AdminCurriculumViewProps> = () => {
  const [curriculumList, setCurriculumList] = useState(getStoredCurriculumRecords);
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [verificationFilter, setVerificationFilter] = useState<"All" | "verified" | "pending">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Verification modal
  const [targetVerifyRecord, setTargetVerifyRecord] =
    useState<ComprehensiveCurriculumRecord | null>(null);
  const [verifierName, setVerifierName] = useState("KICD Lead Curriculum Auditor");

  // New curriculum unit modal
  const [newUnitModalOpen, setNewUnitModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("Integrated Science");
  const [newGrade, setNewGrade] = useState<CbeGrade>("Grade 8");
  const [newStage, setNewStage] = useState<CbeStage>("Junior School");
  const [newStrandTitle, setNewStrandTitle] = useState("");
  const [newSubStrandTitle, setNewSubStrandTitle] = useState("");
  const [newSloTitle, setNewSloTitle] = useState("");
  const [newOutcomeCode, setNewOutcomeCode] = useState("");
  const [newSourceDoc, setNewSourceDoc] = useState("KICD/DES/JSS/2024/02");
  const [newSourceType, setNewSourceType] = useState<"official_kicd" | "teacher_created">(
    "official_kicd",
  );

  const filteredRecords = useMemo(() => {
    return curriculumList.filter((r) => {
      if (selectedStage !== "All" && r.stage !== selectedStage) return false;
      if (verificationFilter === "verified" && !r.isVerified) return false;
      if (verificationFilter === "pending" && r.isVerified) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.learningArea.toLowerCase().includes(q) ||
          r.sourceDocument.toLowerCase().includes(q) ||
          r.grade.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [curriculumList, selectedStage, verificationFilter, searchQuery]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVerifyRecord) return;

    verifyCurriculumRecord(targetVerifyRecord.id, verifierName.trim() || "KICD Quality Assurance");
    setCurriculumList(getStoredCurriculumRecords());
    setTargetVerifyRecord(null);
  };

  const handleAddNewUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrandTitle.trim() || !newSloTitle.trim()) return;

    const newRecord: ComprehensiveCurriculumRecord = {
      id: `cd-${Date.now()}`,
      stage: newStage,
      grade: newGrade,
      learningArea: newSubject,
      sourceType: newSourceType,
      sourceDocument: newSourceDoc.trim() || "KICD Official Syllabus 2024",
      sourceUrl: "https://kicd.ac.ke",
      curriculumVersion: "2024-Rationalised",
      publicationDate: new Date().toISOString().slice(0, 10),
      isVerified: newSourceType === "official_kicd",
      verifiedBy:
        newSourceType === "official_kicd" ? "KICD Curriculum Quality Assurance" : undefined,
      verifiedAt:
        newSourceType === "official_kicd" ? new Date().toISOString().slice(0, 10) : undefined,
      strands: [
        {
          id: `strand-${Date.now()}`,
          strandNumber: 1,
          title: newStrandTitle.trim(),
          subStrands: [
            {
              id: `sub-${Date.now()}`,
              substrandNumber: 1,
              title: newSubStrandTitle.trim() || "Core Competency Focus",
              inquiryQuestions: ["How does this competency apply in daily Kenyan life?"],
              coreCompetencies: ["Critical Thinking and Problem Solving", "Self-efficacy"],
              values: ["Responsibility", "Integrity"],
              pcis: ["Life Skills, Self-Awareness & Child Protection"],
              outcomes: [
                {
                  id: `slo-${Date.now()}`,
                  code:
                    newOutcomeCode.trim() ||
                    `${newGrade.toUpperCase()}.${newSubject.slice(0, 3).toUpperCase()}.1.1`,
                  title: newSloTitle.trim(),
                  description: newSloTitle.trim(),
                  experiences: ["Classroom demonstration and collaborative project work."],
                  rubric: {
                    exceeding: "Exemplary performance exceeding benchmark standards.",
                    meeting: "Meets all learning outcome requirements as scheduled.",
                    approaching: "Developing understanding with minor guidance needed.",
                    below: "Requires remedial support and peer coaching.",
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    addCurriculumRecord(newRecord);
    setCurriculumList(getStoredCurriculumRecords());
    setNewUnitModalOpen(false);
    setNewStrandTitle("");
    setNewSloTitle("");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002B49] via-[#0A3D62] to-[#001E33] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-[#F2A900] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F2A900] text-[#002B49] uppercase tracking-wider">
              Quality Assurance & KICD Compliance
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-slate-100">
              CBE 2-6-3-3 Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Curriculum Engine & Publishing Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            Review, verify, and publish official KICD curriculum matrices from PP1 through Grade 12.
            Every record tracks official source documents, verification status, and rubrics.
          </p>
        </div>

        <button
          onClick={() => setNewUnitModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#F2A900] hover:bg-[#D99600] text-[#002B49] text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Import / Add Curriculum Unit
        </button>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 block font-bold">Total Curriculum Records</span>
          <p className="text-2xl font-black text-slate-900">{curriculumList.length}</p>
          <span className="text-emerald-700 font-bold block pt-1">PP1 – Grade 12 coverage</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 block font-bold">Verified KICD Standards</span>
          <p className="text-2xl font-black text-emerald-600">
            {curriculumList.filter((r) => r.isVerified).length}
          </p>
          <span className="text-slate-500 font-medium block pt-1">Strict syllabus fidelity</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 block font-bold">Pending Quality Review</span>
          <p className="text-2xl font-black text-amber-600">
            {curriculumList.filter((r) => !r.isVerified).length}
          </p>
          <span className="text-slate-500 font-medium block pt-1">Teacher-created submissions</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 block font-bold">Curriculum Framework</span>
          <p className="text-sm font-black text-[#002B49]">2024 Rationalised + 2026 Senior</p>
          <span className="text-slate-500 font-medium block pt-1">STEM, Social, Arts & Sports</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search learning area, source document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white"
          >
            <option value="All">All Stages (Early Years – Senior)</option>
            <option value="Pre-Primary">Pre-Primary (PP1 – PP2)</option>
            <option value="Lower Primary">Lower Primary (G1 – G3)</option>
            <option value="Upper Primary">Upper Primary (G4 – G6)</option>
            <option value="Junior School">Junior School (G7 – G9)</option>
            <option value="Senior School">Senior School (G10 – G12)</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value as any)}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white"
          >
            <option value="All">All Verification Statuses</option>
            <option value="verified">Verified Official KICD</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Curriculum Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-[#F2A900] transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#002B49] text-white">
                    {record.stage}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                    {record.grade}
                  </span>
                  {record.pathway && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                      {record.pathway} Pathway
                    </span>
                  )}
                  {record.isVerified ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified KICD Syllabus
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Pending Quality Audit
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{record.learningArea}</h3>
                <p className="text-xs text-slate-500">
                  Source: <strong>{record.sourceDocument}</strong> · Version:{" "}
                  {record.curriculumVersion}
                </p>
              </div>

              {!record.isVerified && (
                <button
                  onClick={() => setTargetVerifyRecord(record)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" /> Verify & Publish
                </button>
              )}
            </div>

            {/* Strands and Outcomes Breakdown */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              {record.strands.map((strand) => (
                <div
                  key={strand.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                >
                  <span className="font-bold text-[#002B49] block">
                    Strand {strand.strandNumber}: {strand.title}
                  </span>
                  {strand.subStrands.map((sub) => (
                    <div key={sub.id} className="pl-3 border-l-2 border-[#F2A900] space-y-2">
                      <span className="font-semibold text-slate-800 block">
                        Sub-strand: {sub.title}
                      </span>
                      {sub.inquiryQuestions?.length > 0 && (
                        <p className="text-[11px] text-slate-500 italic">
                          Key Inquiry: “{sub.inquiryQuestions[0]}”
                        </p>
                      )}
                      {sub.outcomes.map((slo) => (
                        <div
                          key={slo.id}
                          className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                              {slo.code}
                            </span>
                            <span className="font-bold text-slate-900">{slo.title}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {slo.description}
                          </p>
                          {slo.rubric && (
                            <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 grid grid-cols-2 gap-2">
                              <div>
                                <span className="font-bold text-emerald-700">Meeting:</span>{" "}
                                {slo.rubric.meeting}
                              </div>
                              <div>
                                <span className="font-bold text-amber-700">Approaching:</span>{" "}
                                {slo.rubric.approaching}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {record.verifiedBy && (
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Verified by: {record.verifiedBy}</span>
                <span>Date: {record.verifiedAt}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verify Modal */}
      {targetVerifyRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Verify Curriculum Unit</h3>
            <p className="text-slate-600">
              Confirming this unit verifies that all strands, outcomes, and assessment rubrics match
              official Kenya Institute of Curriculum Development (KICD) specifications.
            </p>
            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Verifier Name / QA Stamp
                </label>
                <input
                  type="text"
                  required
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetVerifyRecord(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer hover:bg-emerald-700 shadow-xs"
                >
                  Confirm Verification & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Unit Modal */}
      {newUnitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Import / Add Official KICD Design</h3>
              <button
                onClick={() => setNewUnitModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewUnit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Education Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Pre-Primary">Pre-Primary (PP1 – PP2)</option>
                    <option value="Lower Primary">Lower Primary (G1 – G3)</option>
                    <option value="Upper Primary">Upper Primary (G4 – G6)</option>
                    <option value="Junior School">Junior School (G7 – G9)</option>
                    <option value="Senior School">Senior School (G10 – G12)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
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
                  <label className="font-bold text-slate-800 block mb-1">Learning Area</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Outcome Code</label>
                  <input
                    type="text"
                    required
                    value={newOutcomeCode}
                    onChange={(e) => setNewOutcomeCode(e.target.value)}
                    placeholder="e.g. G8.SCI.3.1"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Strand Title *</label>
                <input
                  type="text"
                  required
                  value={newStrandTitle}
                  onChange={(e) => setNewStrandTitle(e.target.value)}
                  placeholder="e.g. Electricity, Circuits and Green Energy"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Sub-strand Title *</label>
                <input
                  type="text"
                  required
                  value={newSubStrandTitle}
                  onChange={(e) => setNewSubStrandTitle(e.target.value)}
                  placeholder="e.g. Simple Parallel and Series Circuits"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Specific Learning Outcome (SLO) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSloTitle}
                  onChange={(e) => setNewSloTitle(e.target.value)}
                  placeholder="By the end of the sub-strand, the learner should be able to construct and compare..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Official KICD Source Document
                  </label>
                  <input
                    type="text"
                    value={newSourceDoc}
                    onChange={(e) => setNewSourceDoc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Source Type</label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="official_kicd">Official KICD Syllabus</option>
                    <option value="teacher_created">Teacher-Created Unit (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setNewUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002B49] text-white font-bold cursor-pointer hover:bg-[#001E33]"
                >
                  Save Curriculum Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
