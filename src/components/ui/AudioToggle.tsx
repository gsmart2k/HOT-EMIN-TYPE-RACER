"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { setMuted, getMuted } from "@/lib/audioEngine";

export default function AudioToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(getMuted());
  }, []);

  function toggle() {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-20 right-5 z-50 w-9 h-9 flex items-center justify-center border border-red-900/40 bg-black/60 text-red-500/70 hover:text-red-400 hover:border-red-600/60 transition-all duration-200 rounded-sm"
      title={muted ? "Unmute" : "Mute"}
      style={{ backdropFilter: "blur(8px)" }}
    >
      <span className="text-sm leading-none">{muted ? "🔇" : "🔊"}</span>
    </motion.button>
  );
}
