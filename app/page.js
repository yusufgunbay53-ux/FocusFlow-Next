"use client";

import { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import PomodoroTimer from "../components/PomodoroTimer";
import SoundPlayer from "../components/SoundPlayer";
import AICoach from "../components/AICoach";
import { Target, Zap } from "lucide-react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon to-cyan-400 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
          <Zap size={36} className="text-neon" /> FocusFlow
        </h1>
        <p className="text-gray-400 mt-2">AI Destekli Görev ve Odaklanma Asistanı</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Kanban */}
        <div className="lg:col-span-2">
          <KanbanBoard key={refreshKey} />
        </div>

        {/* Right: Tools */}
        <div className="space-y-6">
          <PomodoroTimer onSessionComplete={() => setRefreshKey((k) => k + 1)} />
          <SoundPlayer />
          <AICoach key={refreshKey} />
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-gray-500">
        FocusFlow • Verileriniz localStorage'da güvende • Gelecekte Supabase hazır
      </footer>
    </main>
  );
}
