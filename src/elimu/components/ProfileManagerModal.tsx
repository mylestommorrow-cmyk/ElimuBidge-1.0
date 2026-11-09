// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import { LearnerProfile } from "../types";
import { X, UserPlus, Check, Users, Sparkles, GraduationCap, School, Camera } from "lucide-react";
import { AVATAR_PRESETS } from "../data/profiles";
import { toast } from "sonner";

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: LearnerProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (
    newProfile: Omit<
      LearnerProfile,
      | "id"
      | "completedTopicsCount"
      | "quizzesTaken"
      | "averageScore"
      | "streakDays"
      | "tokensBalance"
      | "unlockedBadgeIds"
      | "weakAreas"
      | "recentQuizScores"
    >,
  ) => void;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Grade 8");
  const [schoolName, setSchoolName] = useState("");
  const [avatarColor, setAvatarColor] = useState("bg-[#002B49]");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [role, setRole] = useState<"learner" | "teacher">("learner");
  const [disabilityAccommodation, setDisabilityAccommodation] = useState("None");

  const gradeOptions = [
    { label: "Playgroup (Early Childhood)", value: "Playgroup", level: "CBE" as const },
    { label: "PP1 (Pre-Primary 1)", value: "PP1", level: "CBE" as const },
    { label: "PP2 (Pre-Primary 2)", value: "PP2", level: "CBE" as const },
    { label: "Grade 1 (Lower Primary)", value: "Grade 1", level: "CBE" as const },
    { label: "Grade 2 (Lower Primary)", value: "Grade 2", level: "CBE" as const },
    { label: "Grade 3 (Lower Primary)", value: "Grade 3", level: "CBE" as const },
    { label: "Grade 4 (Upper Primary)", value: "Grade 4", level: "CBE" as const },
    { label: "Grade 5 (Upper Primary)", value: "Grade 5", level: "CBE" as const },
    { label: "Grade 6 (Upper Primary - KPSEA)", value: "Grade 6", level: "CBE" as const },
    { label: "Grade 7 (Junior School - JSS)", value: "Grade 7", level: "CBE" as const },
    { label: "Grade 8 (Junior School - JSS)", value: "Grade 8", level: "CBE" as const },
    { label: "Grade 9 (Junior School - KJSEA)", value: "Grade 9", level: "CBE" as const },
    { label: "Grade 10 (Senior School - STEM/Arts)", value: "Grade 10", level: "CBE" as const },
    { label: "Grade 11 (Senior School - Advanced)", value: "Grade 11", level: "CBE" as const },
    { label: "Grade 12 (Senior School Exit/Cert)", value: "Grade 12", level: "CBE" as const },
  ];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProfile({
      name: name.trim(),
      grade,
      level: "CBE",
      schoolName: schoolName.trim() || "Kenya CBE School",
      avatarColor,
      avatarUrl: customAvatarUrl.trim() || selectedAvatarUrl,
      role,
      regNo: `EB-CBE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      academicStanding: "Exemplary Standing · Active CBE Learner",
      gpa: "3.90 / 4.00",
      disabilityAccommodation:
        disabilityAccommodation !== "None" ? disabilityAccommodation : undefined,
    });

    setName("");
    setSchoolName("");
    setCustomAvatarUrl("");
    setIsAdding(false);
  };

  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningInGoogle(true);
    try {
      const { auth, googleAuthProvider, signInWithPopup } = await import("@/lib/firebase");
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      const { syncUserProfileToFirestore, getUserProfileFromFirestore } =
        await import("@/lib/firestore-sync");
      const cloudProfile = await getUserProfileFromFirestore(user.uid);

      onAddProfile({
        name: user.displayName || "Google Learner",
        grade: cloudProfile?.gradeLevel || "Grade 8",
        level: "CBE",
        schoolName: "Kenya CBE Academy",
        avatarColor: "bg-[#002B49]",
        avatarUrl: user.photoURL || undefined,
        role: (cloudProfile?.role as any) || "learner",
        regNo: `EB-GGL-${user.uid.slice(0, 6).toUpperCase()}`,
        academicStanding: "Verified Google Cloud Profile",
        gpa: "3.95 / 4.00",
        disabilityAccommodation: cloudProfile?.disabilityAccommodation,
      });

      await syncUserProfileToFirestore(user.uid, {
        displayName: user.displayName || "Google Learner",
        email: user.email || undefined,
        role: (cloudProfile?.role as any) || "student",
        gradeLevel: cloudProfile?.gradeLevel || "Grade 8",
        photoURL: user.photoURL || undefined,
      });

      toast.success(
        `Signed in with Google as ${user.displayName || user.email}! Cloud profile synchronized.`,
      );
      onClose();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-in could not complete. Please try again.");
      }
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#002B49] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F2A900] text-[#002B49] flex items-center justify-center font-bold">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">User & Learner Profiles</h3>
              <p className="text-[11px] text-slate-300">
                Switch profiles, change real photos, or add teachers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close learner profiles"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-[#001E33] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isAdding ? (
            <>
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Active Account:
                </div>
                <div className="space-y-2.5">
                  {profiles.map((profile) => {
                    const isActive = profile.id === activeProfileId;
                    return (
                      <div
                        key={profile.id}
                        onClick={() => {
                          onSelectProfile(profile.id);
                          onClose();
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isActive
                            ? "border-[#002B49] bg-amber-50/60 shadow-xs ring-2 ring-[#F2A900]"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {profile.avatarUrl ? (
                            <img
                              src={profile.avatarUrl}
                              alt={profile.name}
                              className="w-11 h-11 rounded-xl object-cover border-2 border-[#002B49] shadow-xs shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-11 h-11 rounded-xl ${profile.avatarColor} text-[#F2A900] flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                            >
                              {profile.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>{profile.name}</span>
                              {isActive && (
                                <span className="text-[10px] bg-[#002B49] text-[#F2A900] px-2 py-0.5 rounded-full font-bold">
                                  Current
                                </span>
                              )}
                              {profile.role === "teacher" && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                  Teacher
                                </span>
                              )}
                              {profile.disabilityAccommodation &&
                                profile.disabilityAccommodation !== "None" && (
                                  <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <span>♿</span>
                                    <span>{profile.disabilityAccommodation}</span>
                                  </span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500">
                              {profile.grade} · {profile.schoolName}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-amber-700 tabular-nums">
                            🪙 {profile.tokensBalance || 0}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {profile.averageScore}% Avg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isSigningInGoogle}
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  <span>
                    {isSigningInGoogle
                      ? "Connecting to Google Cloud Profile..."
                      : "Sign in with Google (Firebase Auth)"}
                  </span>
                </button>

                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[#002B49]/40 hover:border-[#002B49] bg-slate-50 hover:bg-amber-50/40 text-[#002B49] text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#F2A900]" />
                  <span>+ Add Another Learner or Teacher Profile</span>
                </button>
              </div>
            </>
          ) : (
            /* Add Profile Form with Real Avatar Selection */
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Role:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("learner")}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      role === "learner"
                        ? "bg-[#002B49] text-white border-[#002B49]"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    Student / Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      role === "teacher"
                        ? "bg-[#002B49] text-white border-[#002B49]"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    Teacher / Facilitator
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kevin Mwangi or Mwalimu Ochieng"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">CBE Grade Level:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49] bg-white font-semibold"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">School Name (Optional):</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Alliance High School or Nakuru Model Primary"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>♿</span>
                  <span>Disability Accommodation (Optional):</span>
                </label>
                <select
                  value={disabilityAccommodation}
                  onChange={(e) => setDisabilityAccommodation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49] bg-white font-semibold"
                >
                  <option value="None">None (Standard Curriculum Experience)</option>
                  <option value="Low Vision">
                    Low Vision & Visual Clarity (High Contrast / Audio)
                  </option>
                  <option value="Autism Spectrum Disorder">
                    Autism Spectrum Disorder (ASD - Calm & Literal)
                  </option>
                  <option value="ADHD">ADHD & Executive Function (Focus Scaffolding)</option>
                  <option value="Hearing Impairment">
                    Hearing Impairment & Deaf (KSL Sign Language)
                  </option>
                  <option value="Dyslexia">
                    Dyslexia & Reading Difficulty (TTS Audio / Speech Dictation)
                  </option>
                  <option value="Physical & Motor">
                    Physical & Motor Accessibility (Large Controls)
                  </option>
                  <option value="Down Syndrome">
                    Down Syndrome & Intellectual Disability (Foundation Stage)
                  </option>
                </select>
              </div>

              {/* Real Profile Image Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-[#002B49] block">
                  Select Real Portrait Profile Image:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => {
                    const isSelected = selectedAvatarUrl === preset.url && !customAvatarUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedAvatarUrl(preset.url);
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

                <div className="pt-1">
                  <input
                    type="text"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="Or paste custom image URL (e.g. https://...)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002B49] hover:bg-[#001E33] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-4 h-4 text-[#F2A900]" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
