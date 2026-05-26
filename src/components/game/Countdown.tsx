"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCountdownBeep } from "@/lib/audioEngine";

interface CountdownProps {
  onComplete: () => void;
}

const STEPS = [3, 2, 1, "GO"] as const;
type Step = (typeof STEPS)[number];

export default function Countdown({ onComplete }: CountdownProps) {
  const [index, setIndex] = useState(0);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (index >= STEPS.length) {
      onComplete();
      return;
    }

    playCountdownBeep(current === "GO");
    setShake(true);
    const shakeTimer = setTimeout(() => setShake(false), 400);
    const nextTimer = setTimeout(() => setIndex((i) => i + 1), 900);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(nextTimer);
    };
  }, [index, onComplete]);

  const current: Step | undefined = STEPS[index];
  const isGo = current === "GO";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Background pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: isGo ? "rgba(255,32,32,0.08)" : "transparent" }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence mode="wait">
        {current !== undefined && (
          <motion.div
            key={String(current)}
            className="relative flex items-center justify-center"
            initial={{ scale: 2.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Shockwave ring */}
            {shake && (
              <motion.div
                className="absolute rounded-full border-2 border-red-500/60"
                initial={{ width: 120, height: 120, opacity: 0.8 }}
                animate={{ width: 400, height: 400, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}

            <div
              className={`
                text-[8rem] sm:text-[12rem] md:text-[18rem] font-black leading-none select-none
                ${shake ? "shake" : ""}
              `}
              style={{
                fontFamily: "Orbitron, sans-serif",
                color: isGo ? "#ff2020" : "#ffffff",
                textShadow: isGo
                  ? "0 0 20px #ff2020, 0 0 50px #ff2020, 0 0 100px #ff0000"
                  : "0 0 20px rgba(255,255,255,0.5)",
              }}
            >
              {current}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" aria-hidden />
    </div>
  );
}
