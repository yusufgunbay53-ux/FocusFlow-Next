"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

const TRACKS = [
  { name: "Lo-Fi Chill", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { name: "Yağmur Sesi", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3" },
];

export default function SoundPlayer() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const changeTrack = (idx) => {
    setCurrent(idx);
    setPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-3 mb-3">
        <Music size={18} className="text-neon" />
        <span className="text-sm font-medium">Odaklanma Sesleri</span>
      </div>
      <audio ref={audioRef} src={TRACKS[current].url} loop />
      <div className="flex items-center gap-2 mb-3">
        {TRACKS.map((t, i) => (
          <button
            key={i}
            onClick={() => changeTrack(i)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              current === i ? "bg-neon/20 border-neon text-neon" : "border-white/10 hover:border-neon/50"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={togglePlay} className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => setMuted(!muted)} className="p-2">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 accent-neon"
        />
      </div>
    </div>
  );
}
