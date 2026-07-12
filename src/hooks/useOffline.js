import { useState, useEffect, useCallback } from "react";

const QUEUE_KEY = "disasternet.offline_queue.v1";

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const enqueue = useCallback((item) => {
    setQueue((prev) => {
      const next = [{ ...item, queuedAt: Date.now() }, ...prev];
      try { localStorage.setItem(QUEUE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    try { localStorage.removeItem(QUEUE_KEY); } catch {}
  }, []);

  return { isOnline, queue, enqueue, clearQueue };
}
