// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import {
  X,
  School,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Building2,
  MapPin,
  Users,
  FileText,
  ShieldCheck,
  ArrowRight,
  Plus,
} from "lucide-react";
import { SchoolAccount } from "../types";
import { getStoredSchools, saveSchools } from "../data/schools";

interface SchoolAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSchoolCode: string;
  onSelectSchool: (school: SchoolAccount) => void;
}

export const SchoolAccessModal: React.FC<SchoolAccessModalProps> = ({
  isOpen,
  onClose,
  activeSchoolCode,
  onSelectSchool,
}) => {
  const [schools, setSchools] = useState<SchoolAccount[]>(() => getStoredSchools());
  const [inputCode, setInputCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // New school registration form state
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolCode, setNewSchoolCode] = useState("");
  const [newCounty, setNewCounty] = useState("Nairobi County");
  const [newMotto, setNewMotto] = useState("");
  const [newPrincipal, setNewPrincipal] = useState("");
  const [newTeacherPin, setNewTeacherPin] = useState("2026");

  const currentSchool =
    schools.find((s) => s.code.toUpperCase() === activeSchoolCode.toUpperCase()) || schools[0];

  const handleApplyCode = (codeToApply?: string) => {
    const targetCode = (codeToApply || inputCode).trim().toUpperCase();
    if (!targetCode) {
      setErrorMsg("Please enter a valid school access code.");
      return;
    }

    const found = schools.find((s) => s.code.toUpperCase() === targetCode);
    if (found) {
      setErrorMsg("");
      onSelectSchool(found);
      onClose();
    } else {
      setErrorMsg(`School code "${targetCode}" not found. You can register it below!`);
    }
  };

  const handleRegisterNewSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim() || !newSchoolCode.trim()) {
      setErrorMsg("Please enter both school name and a unique school code.");
      return;
    }

    const cleanCode = newSchoolCode.trim().toUpperCase().replace(/\s+/g, "-");
    const existing = schools.find((s) => s.code.toUpperCase() === cleanCode);
    if (existing) {
      setErrorMsg(`Code ${cleanCode} is already registered to ${existing.name}.`);
      return;
    }

    const newSchool: SchoolAccount = {
      id: `school-${Date.now()}`,
      code: cleanCode,
      name: newSchoolName.trim(),
      county: newCounty,
      motto: newMotto.trim() || "Striving for CBE Excellence",
      badgeColor: "from-[#002B49] to-[#004A7C]",
      logoEmoji: "🏫",
      principalName: newPrincipal.trim() || "Senior Principal",
      teacherPin: newTeacherPin.trim() || "2026",
      adminPin: "9900",
      cbeStreams: [
        "Lower Primary",
        "Upper Primary",
        "Junior School (G7-9)",
        "Senior School (G10-12)",
      ],
      registeredLearnersCount: 500,
      notesCount: 0,
    };

    const updated = [newSchool, ...schools];
    setSchools(updated);
    saveSchools(updated);
    onSelectSchool(newSchool);
    setIsRegistering(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#002B49] to-[#003d66] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <KeyRound className="w-5 h-5 text-[#F2A900]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">School Access Portal</h2>
              <p className="text-xs text-slate-300">
                Independent institutional access codes & portfolios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active School Badge */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-blue-200 flex items-center justify-center text-2xl shrink-0">
                {currentSchool.logoEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {currentSchool.name}
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-[#002B49] text-white px-2 py-0.5 rounded-md">
                    {currentSchool.code}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{currentSchool.county}</span>
                  </span>
                  <span>·</span>
                  <span>Principal: {currentSchool.principalName}</span>
                </div>
                <div className="text-xs italic text-blue-900 mt-1">"{currentSchool.motto}"</div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 self-start sm:self-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active Portal</span>
            </div>
          </div>

          {!isRegistering ? (
            <>
              {/* Access Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter School Access Code:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => {
                        setInputCode(e.target.value.toUpperCase());
                        setErrorMsg("");
                      }}
                      placeholder="e.g. ALLIANCE-101, KHS-2026, MFA-7701"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-sm uppercase focus:ring-2 focus:ring-[#002B49] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCode()}
                    className="px-5 py-2.5 rounded-xl bg-[#002B49] hover:bg-[#003d66] text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    Switch School
                  </button>
                </div>
                {errorMsg && <p className="text-xs text-rose-600 font-medium pl-1">{errorMsg}</p>}
              </div>

              {/* Quick Preset Schools for Presentations */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Demo Institutions (Click to Switch Instantly):
                  </span>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-xs text-[#002B49] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register New School Code</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {schools.map((school) => {
                    const isSelected = school.code.toUpperCase() === activeSchoolCode.toUpperCase();
                    return (
                      <button
                        key={school.id}
                        onClick={() => handleApplyCode(school.code)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "border-[#002B49] bg-blue-50/80 ring-2 ring-[#002B49] shadow-xs"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
                        }`}
                      >
                        <div className="text-2xl shrink-0 mt-0.5">{school.logoEmoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {school.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {school.code}
                            </span>
                            <span className="text-[10px] text-slate-500">{school.county}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                            "{school.motto}"
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Register New School Form */
            <form onSubmit={handleRegisterNewSchool} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  Register a New School Institutional Code
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">School Name:</label>
                  <input
                    type="text"
                    required
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="e.g. St. Mary's Academy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Access Code (Uppercase):
                  </label>
                  <input
                    type="text"
                    required
                    value={newSchoolCode}
                    onChange={(e) => setNewSchoolCode(e.target.value.toUpperCase())}
                    placeholder="e.g. STMARYS-99"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-[#002B49] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">County:</label>
                  <input
                    type="text"
                    value={newCounty}
                    onChange={(e) => setNewCounty(e.target.value)}
                    placeholder="e.g. Nakuru County"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Principal / Head Teacher:
                  </label>
                  <input
                    type="text"
                    value={newPrincipal}
                    onChange={(e) => setNewPrincipal(e.target.value)}
                    placeholder="e.g. Mwalimu Kamau"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">School Motto:</label>
                <input
                  type="text"
                  value={newMotto}
                  onChange={(e) => setNewMotto(e.target.value)}
                  placeholder="e.g. Integrity, Competence, Innovation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#002B49] focus:outline-none"
                />
              </div>

              {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002B49] text-white text-xs font-bold hover:bg-[#003d66] shadow-sm"
                >
                  Register & Activate School
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
