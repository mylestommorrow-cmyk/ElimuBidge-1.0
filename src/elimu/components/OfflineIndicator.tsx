// @ts-nocheck -- imported code, original project was not type-checked strictly
import React, { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      setTimeout(() => setShowReconnectedToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedToast(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (showReconnectedToast) {
    return (
      <div className="fixed bottom-20 lg:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl animate-bounce">
        <Wifi className="w-4 h-4 text-white" />
        <span>Connection Restored — Synced with CBE Portal</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <WifiOff className="w-4 h-4 text-white" />
      <span>Offline Mode — Using Cached CBE Content & Past Papers</span>
    </div>
  );
};
