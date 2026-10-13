"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";
import { loadFromStorage, saveToStorage } from "../lib/storage";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroTimer({ onSessionComplete }) {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = loadFromStorage("focusflow-pomodoro", { sessions: 0 });
    setSessions(saved.sessions || 0);
  }, []);

  useEffect(() => {
    saveToStorage("focusflow-pomodoro", { sessions });
  }, [sessions]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    if (Notification.permission === "granted") {
      new Notification(isBreak ? "Mola bitti! Çalışmaya dön." : "Pomodoro tamamlandı! 5 dk mola.", {
        body: isBreak ? "Odaklanmaya devam et." : "Harika iş çıkardın.",
        icon: "/favicon.ico",
      });
    }
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    if (!isBreak) {
      setSessions((s) => s + 1);
      onSessionComplete?.();
    }
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? WORK_TIME : BREAK_TIME);
    setIsRunning(false);
  };

  const requestNotification = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const toggle = () => {
    requestNotification();
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = ((isBreak ? BREAK_TIME : WORK_TIME) - timeLeft) / (isBreak ? BREAK_TIME : WORK_TIME) * 100;

  return (
    <div className="glass p-6 text-center">
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" preload="auto" />
      <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
        <Bell size={20} className="text-neon" /> Pomodoro
      </h3>
      <div className="text-5xl font-bold font-mono mb-2 text-neon">{formatTime(timeLeft)}</div>
      <div className="text-sm text-gray-400 mb-4">{isBreak ? "Mola Zamanı" : "Çalışma Zamanı"} • {sessions} seans</div>
      
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div className="bg-neon h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={toggle} className="p-3 rounded-full bg-neon/20 hover:bg-neon/30 text-neon transition-all hover:neon-glow">
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={reset} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all">
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
