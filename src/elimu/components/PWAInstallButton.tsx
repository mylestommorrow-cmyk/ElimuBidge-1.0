// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useState } from "react";
import { DownloadCloud, Smartphone, X, CheckCircle } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

export const PWAInstallButton: React.FC<{ variant?: "compact" | "full" }> = ({
  variant = "compact",
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          variant === "full"
            ? "w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-600 transition active:scale-95"
            : "flex items-center gap-1.5 rounded-lg bg-[#F2A900] hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-[#002B49] shadow-xs transition active:scale-95"
        }
        title="Install ElimuBridge as an Offline PWA on your device"
      >
        <DownloadCloud className="w-4 h-4 shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === "full"
              ? "w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 transition"
              : "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-xs font-semibold text-white transition"
          }
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#F2A900]" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button in the bottom Safari navigation bar.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> to use ElimuBridge offline without browser URL bars.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-slate-900 dark:bg-white py-2.5 text-xs font-bold text-white dark:text-slate-900 shadow hover:opacity-90 transition"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback install prompt / info for browsers that don't trigger beforeinstallprompt yet
  return (
    <button
      onClick={() => {
        // Trigger alert or toast explaining offline caching
        alert(
          "ElimuBridge is PWA-enabled with offline service worker caching! You can bookmark or install this app from your browser menu.",
        );
      }}
      className={
        variant === "full"
          ? "w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
          : "flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-white/90 transition"
      }
      title="ElimuBridge is PWA-ready for offline use"
    >
      <DownloadCloud className="w-3.5 h-3.5" />
      <span>PWA Ready</span>
    </button>
  );
};
