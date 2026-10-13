"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { loadFromStorage } from "../lib/storage";

const messages = [
  "Bugün harika gidiyorsun! Devam et. 🚀",
  "Biraz yavaşladın, 5 dakika mola vermek ister misin?",
  "Odaklanman mükemmel. Bir görev daha bitir!",
  "Küçük adımlar büyük başarılar getirir.",
  "Pomodoro seanslarını artırarak verimliliğini yükseltebilirsin.",
  "Tamamladığın görevler seni motive etsin!",
];

export default function AICoach() {
  const [message, setMessage] = useState(messages[0]);
  const [stats, setStats] = useState({ completed: 0, sessions: 0 });

  useEffect(() => {
    const tasks = loadFromStorage("focusflow-tasks", []);
    const pomodoro = loadFromStorage("focusflow-pomodoro", { sessions: 0 });
    const completed = tasks.filter((t) => t.completed || t.column === "done").length;
    setStats({ completed, sessions: pomodoro.sessions || 0 });

    let idx = 0;
    if (completed > 5 && pomodoro.sessions > 3) idx = 0;
    else if (pomodoro.sessions === 0 && completed === 0) idx = 3;
    else if (completed < 2) idx = 1;
    else idx = Math.floor(Math.random() * messages.length);
    setMessage(messages[idx]);
  }, []);

  return (
    <div className="glass p-5">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Sparkles size={18} className="text-neon" /> AI Performans Koçu
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">{message}</p>
      <div className="flex gap-4 text-sm text-gray-400">
        <span>✅ {stats.completed} görev</span>
        <span>🍅 {stats.sessions} pomodoro</span>
      </div>
      <p className="text-xs text-gray-500 mt-3">* Mock AI – gelecekte gerçek API entegrasyonuna hazır</p>
    </div>
  );
}
