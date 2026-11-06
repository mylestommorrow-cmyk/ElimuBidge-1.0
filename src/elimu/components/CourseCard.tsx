// @ts-nocheck -- imported code, original project was not type-checked strictly
import React from "react";
import { StudyTopic } from "../types";
import { Star, Download, Check, Clock, GraduationCap } from "lucide-react";

interface CourseCardProps {
  topic: StudyTopic;
  onOpenNotes: (topic: StudyTopic) => void;
  onToggleOffline: (topicId: string, e: React.MouseEvent) => void;
  dataSaverMode: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  topic,
  onOpenNotes,
  onToggleOffline,
  dataSaverMode,
}) => {
  return (
    <div
      onClick={() => onOpenNotes(topic)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-[#002B49] shadow-xs hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Cover visual or low-data fallback */}
        {!dataSaverMode ? (
          <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
            <img
              src={topic.coverImage}
              alt={topic.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#002B49]/90 via-[#002B49]/20 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              {topic.courseCode && (
                <span className="bg-[#002B49] text-[#F2A900] px-2.5 py-1 rounded-md text-xs font-mono font-black border border-[#F2A900]/40 shadow-xs">
                  {topic.courseCode}
                </span>
              )}
              {topic.credits && (
                <span className="bg-[#001E33]/90 text-slate-200 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-600">
                  {topic.credits} Units
                </span>
              )}
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
              <span className="bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded text-[11px] font-bold border border-white/15">
                {topic.gradeLevel}
              </span>
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded text-[11px] font-mono border border-white/15">
                <Clock className="w-3 h-3 text-[#F2A900]" />
                <span>{topic.duration.split(" ")[0]} min</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {topic.courseCode && (
                <span className="bg-[#002B49] text-[#F2A900] px-2 py-0.5 rounded text-xs font-mono font-bold">
                  {topic.courseCode}
                </span>
              )}
              <span className="text-xs font-bold text-slate-700">{topic.gradeLevel}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {topic.credits ? `${topic.credits} Units` : topic.category}
            </span>
          </div>
        )}

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Metadata line with zero-pill rule */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-[#002B49]">{topic.category}</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-mono text-slate-600">{topic.level}</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="flex items-center gap-1 text-slate-700 font-semibold ml-auto font-mono text-[11px]">
              <Star className="w-3.5 h-3.5 fill-[#F2A900] text-[#F2A900]" />
              <span>{topic.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({topic.reviewsCount})</span>
            </span>
          </div>

          {/* Course Unit Title */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#002B49] transition-colors leading-snug line-clamp-2">
              {topic.title}
            </h3>
            {topic.strand && (
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
                {topic.strand}
              </p>
            )}
          </div>

          {/* Short Summary */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{topic.summary}</p>

          {/* Instructor & Faculty Designation */}
          <div className="pt-2 border-t border-slate-100 text-xs flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="font-bold text-slate-800 truncate">{topic.instructor.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{topic.instructor.role}</div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
              {topic.term || "Term 1"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Offline badge & Action Button */}
      <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 bg-slate-50/70">
        <button
          onClick={(e) => onToggleOffline(topic.id, e)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            topic.downloaded
              ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
          title={topic.downloaded ? "Saved to offline coursepack" : "Download to offline vault"}
        >
          {topic.downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span className="text-[11px]">Synced ({topic.offlineSize})</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Save ({topic.offlineSize})</span>
            </>
          )}
        </button>

        <span className="text-xs font-bold text-[#002B49] group-hover:text-[#004A7C] transition-all flex items-center gap-1">
          <span>View Unit</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </span>
      </div>
    </div>
  );
};
