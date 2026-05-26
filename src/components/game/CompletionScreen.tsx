"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NeonButton from "@/components/ui/NeonButton";
import GlitchText from "@/components/ui/GlitchText";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import Particles from "@/components/ui/Particles";
import Footer from "@/components/ui/Footer";
import type { GameResult } from "@/types";
import { useRouter } from "next/navigation";

interface CompletionScreenProps {
  result: GameResult;
  onReplay: () => void;
}

export default function CompletionScreen({ result, onReplay }: CompletionScreenProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setUploading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const formatTime = (ms: number) => {
    const s = (ms / 1000).toFixed(2);
    return `${s}s`;
  };

  const shareText = encodeURIComponent(
    `I just raced on HOT EMIN RACE 🔥\n\n⏱ ${formatTime(result.completionTime)}\n⌨️ ${result.wpm} WPM\n🎯 ${result.accuracy}% accuracy\n\nCan you beat me?\n#HotEminRace #Avalanche @HotEminSummer`
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundColor: "rgba(255,32,32,0.15)" }}
          animate={{ backgroundColor: "rgba(0,0,0,0)" }}
          transition={{ duration: 2 }}
        />
        <Particles count={50} />
        <ScanlineOverlay />
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center">
          {/* Upload / sync animation */}
          <motion.div
            className="mb-10 flex flex-col items-center gap-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: uploading ? 1 : 0, height: uploading ? "auto" : 0 }}
            transition={{ duration: 0.5 }}
          >
            {uploading && (
              <>
                <div className="relative w-16 h-16 border border-red-700/50 overflow-hidden rounded-sm">
                  <div
                    className="absolute inset-x-0 h-1 bg-red-500/70 upload-scan"
                    style={{ boxShadow: "0 0 10px #ff2020" }}
                  />
                </div>
                <span
                  className="text-red-500/80 text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  Syncing to leaderboard...
                </span>
              </>
            )}
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: uploading ? 2 : 0, duration: 0.8, type: "spring" }}
          >
            <GlitchText
              text="TRANSMISSION"
              as="h1"
              intensity="high"
              className="block text-4xl sm:text-6xl font-black tracking-wider mb-1"
              style={{
                fontFamily: "Orbitron, sans-serif",
                color: "#ff2020",
                textShadow: "0 0 30px #ff2020",
              } as React.CSSProperties}
            />
            <GlitchText
              text="COMPLETE"
              as="h1"
              intensity="medium"
              className="block text-5xl sm:text-7xl font-black tracking-widest"
              style={{
                fontFamily: "Orbitron, sans-serif",
                color: "#ffffff",
                textShadow: "0 0 20px rgba(255,255,255,0.3)",
              } as React.CSSProperties}
            />
          </motion.div>

          {/* Stats panel */}
          <motion.div
            className="glass-panel holo-border rounded-sm p-8 mt-10 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: uploading ? 2.3 : 0.3, duration: 0.7 }}
          >
            <div className="grid grid-cols-3 gap-6">
              <ResultStat
                label="Time"
                value={formatTime(result.completionTime)}
                color="text-red-400"
                glow="rgba(255,32,32,0.3)"
              />
              <ResultStat
                label="WPM"
                value={String(result.wpm)}
                color="text-white"
                glow="rgba(255,255,255,0.2)"
              />
              <ResultStat
                label="Accuracy"
                value={`${result.accuracy}%`}
                color={
                  result.accuracy >= 95
                    ? "text-green-400"
                    : result.accuracy >= 80
                    ? "text-yellow-400"
                    : "text-red-400"
                }
                glow="rgba(0,255,100,0.2)"
              />
            </div>

            {/* Rank info */}
            {result.rank !== undefined && (
              <motion.div
                className="mt-6 pt-6 border-t border-red-900/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: uploading ? 2.8 : 0.8 }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                  <div>
                    <div className="text-gray-500 text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      Leaderboard Rank
                    </div>
                    <div
                      className="text-4xl font-black text-red-400"
                      style={{ fontFamily: "Orbitron, sans-serif", textShadow: "0 0 20px #ff2020" }}
                    >
                      #{result.rank}
                    </div>
                  </div>

                  {result.beatPercent !== undefined && (
                    <div>
                      <div className="text-gray-500 text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                        Faster than
                      </div>
                      <div
                        className="text-4xl font-black text-cyan-400"
                        style={{ fontFamily: "Orbitron, sans-serif" }}
                      >
                        {result.beatPercent}%
                      </div>
                      <div className="text-gray-500 text-xs" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                        of all players
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: uploading ? 2.6 : 0.6 }}
          >
            <NeonButton onClick={onReplay} size="lg" variant="primary">
              ⟳ RACE AGAIN
            </NeonButton>
            <NeonButton
              onClick={() => router.push("/leaderboard")}
              size="lg"
              variant="secondary"
            >
              📊 LEADERBOARD
            </NeonButton>
            <a
              href={`https://x.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NeonButton size="lg" variant="ghost">
                𝕏 SHARE RESULT
              </NeonButton>
            </a>
          </motion.div>

          {/* Username */}
          <motion.p
            className="mt-8 text-gray-600 text-sm tracking-widest"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: uploading ? 3 : 1 }}
          >
            Raced as{" "}
            <span className="text-red-500">{result.username}</span>
          </motion.p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ResultStat({
  label,
  value,
  color,
  glow,
}: {
  label: string;
  value: string;
  color: string;
  glow: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="text-gray-500 text-xs tracking-widest uppercase"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {label}
      </div>
      <div
        className={`text-3xl sm:text-4xl font-black ${color} tabular-nums`}
        style={{
          fontFamily: "Orbitron, sans-serif",
          textShadow: `0 0 20px ${glow}`,
        }}
      >
        {value}
      </div>
    </div>
  );
}
