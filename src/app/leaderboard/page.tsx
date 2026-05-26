"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import GlitchText from "@/components/ui/GlitchText";
import NeonButton from "@/components/ui/NeonButton";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import Particles from "@/components/ui/Particles";
import Footer from "@/components/ui/Footer";

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,32,32,0.07) 0%, transparent 60%)",
          }}
        />
        <Particles count={40} />
        <ScanlineOverlay />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-20 border-b border-red-900/30 px-6 py-5"
        style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Title */}
          <div>
            <div
              className="text-red-500/60 text-[10px] tracking-[0.4em] uppercase mb-1"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Elite Rankings
            </div>
            <GlitchText
              text="LEADERBOARD"
              as="h1"
              intensity="low"
              className="text-2xl sm:text-3xl font-black tracking-widest text-white"
              style={{ fontFamily: "Orbitron, sans-serif" } as React.CSSProperties}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <NeonButton onClick={() => router.push("/")} size="sm" variant="secondary">
              ← HOME
            </NeonButton>
            <NeonButton onClick={() => router.push("/")} size="sm" variant="primary">
              ⚡ RACE NOW
            </NeonButton>
          </div>
        </div>
      </motion.div>

      {/* Live badge */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto w-full px-6 pt-5 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span
            className="text-gray-500 text-xs tracking-widest uppercase"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Live · Updates in real-time
          </span>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="relative z-20 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <LeaderboardTable />
      </motion.div>

      <Footer />
    </div>
  );
}
