"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import HeroBackground from "./HeroBackground";
import GlitchText from "@/components/ui/GlitchText";
import NeonButton from "@/components/ui/NeonButton";
import Footer from "@/components/ui/Footer";
import AudioToggle from "@/components/ui/AudioToggle";
import { startAmbient } from "@/lib/audioEngine";
import { useRouter } from "next/navigation";

interface LandingScreenProps {
  onPlay: () => void;
}

export default function LandingScreen({ onPlay }: LandingScreenProps) {
  const router = useRouter();

  useEffect(() => {
    startAmbient();
  }, []);

  function handlePlay() {
    startAmbient();
    onPlay();
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <HeroBackground />
      <AudioToggle />

      {/* Main content */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-px w-12 bg-red-500/60" />
          <span
            className="text-red-500/80 text-xs tracking-[0.4em] uppercase data-flicker"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Avalanche Network
          </span>
          <div className="h-px w-12 bg-red-500/60" />
        </motion.div>

        {/* Main logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 1, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <GlitchText
            text="HOT EMIN"
            as="h1"
            intensity="medium"
            className="block text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black leading-none neon-text"
            style={{
              fontFamily: "Orbitron, sans-serif",
              color: "#ff2020",
              letterSpacing: "-0.02em",
            } as React.CSSProperties}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="h-0.5 w-full mt-2"
            style={{
              background:
                "linear-gradient(90deg, transparent, #ff2020, transparent)",
            }}
          />
          <GlitchText
            text="RACE"
            as="span"
            intensity="low"
            className="block text-[2rem] sm:text-[3rem] md:text-[4rem] font-bold tracking-[0.5em] mt-2"
            style={{
              fontFamily: "Orbitron, sans-serif",
              color: "rgba(255,255,255,0.85)",
              textShadow: "0 0 20px rgba(255,255,255,0.2)",
            } as React.CSSProperties}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-center text-gray-400 text-sm sm:text-base md:text-lg tracking-widest uppercase mb-3"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          The Fastest Fingers on Avalanche
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="text-center text-red-400/90 text-base sm:text-xl md:text-2xl font-bold tracking-[0.2em] uppercase mb-14"
          style={{ fontFamily: "Exo 2, sans-serif" }}
        >
          &#34;HUMAN SPEED IS THE NEW ALPHA&#34;
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <NeonButton onClick={handlePlay} size="lg" variant="primary">
            ⚡ PLAY GAME
          </NeonButton>
          <NeonButton
            onClick={() => router.push("/leaderboard")}
            size="lg"
            variant="secondary"
          >
            📊 VIEW LEADERBOARD
          </NeonButton>
        </motion.div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="mt-12 flex items-center gap-2"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span
            className="text-gray-500 text-xs tracking-widest uppercase"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Live Leaderboard Active
          </span>
        </motion.div>

        {/* Corner HUD decorations */}
        <HUDCorners />
      </div>

      <Footer />
    </div>
  );
}

function HUDCorners() {
  return (
    <>
      {/* Top-left */}
      <div className="fixed top-6 left-6 z-40 pointer-events-none" aria-hidden>
        <div className="w-8 h-8 border-t-2 border-l-2 border-red-600/60" />
        <div className="mt-1 text-red-600/40 text-[9px] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
          SYS.ONLINE
        </div>
      </div>
      {/* Top-right */}
      <div className="fixed top-6 right-6 z-40 pointer-events-none text-right" aria-hidden>
        <div className="w-8 h-8 border-t-2 border-r-2 border-red-600/60 ml-auto" />
        <div className="mt-1 text-red-600/40 text-[9px] tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
          NET.AVAX
        </div>
      </div>
      {/* Bottom-left */}
      <div className="fixed bottom-20 left-6 z-40 pointer-events-none" aria-hidden>
        <div className="w-8 h-8 border-b-2 border-l-2 border-red-600/40" />
      </div>
      {/* Bottom-right */}
      <div className="fixed bottom-20 right-6 z-40 pointer-events-none" aria-hidden>
        <div className="w-8 h-8 border-b-2 border-r-2 border-red-600/40 ml-auto" />
      </div>
    </>
  );
}
