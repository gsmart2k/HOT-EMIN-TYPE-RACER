"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useGameStore } from "@/store/gameStore";
import LandingScreen from "@/components/landing/LandingScreen";
import UsernameModal from "@/components/modals/UsernameModal";
import Countdown from "@/components/game/Countdown";
import TypingGame from "@/components/game/TypingGame";
import CompletionScreen from "@/components/game/CompletionScreen";
import type { GameResult } from "@/types";
import {
  submitScore,
  fetchRank,
  fetchTotalPlayers,
} from "@/lib/leaderboardService";

type Phase = "landing" | "username" | "countdown" | "playing" | "complete";

export default function Home() {
  const { phase, username, result, setPhase, setUsername, setResult, reset } =
    useGameStore();

  const handlePlay = useCallback(() => {
    setPhase("username");
  }, [setPhase]);

  const handleUsernameSubmit = useCallback(
    (name: string) => {
      setUsername(name);
      setPhase("countdown");
    },
    [setUsername, setPhase]
  );

  const handleCountdownComplete = useCallback(() => {
    setPhase("playing");
  }, [setPhase]);

  const handleGameComplete = useCallback(
    async (gameResult: GameResult) => {
      setPhase("complete");
      try {
        await submitScore({
          username: gameResult.username,
          completion_time: gameResult.completionTime,
          wpm: gameResult.wpm,
          accuracy: gameResult.accuracy,
        });
        const [rank, total] = await Promise.all([
          fetchRank(gameResult.completionTime),
          fetchTotalPlayers(),
        ]);
        const beatPercent =
          total > 1 ? Math.round(((total - rank) / (total - 1)) * 100) : 100;
        setResult({ ...gameResult, rank, beatPercent });
      } catch {
        toast.error("Could not save score — check Supabase config.");
        setResult(gameResult);
      }
    },
    [setPhase, setResult]
  );

  const handleReplay = useCallback(() => {
    reset();
  }, [reset]);

  const currentPhase = phase as Phase;

  return (
    <>
      {/* Username modal sits over landing */}
      {currentPhase === "username" && (
        <>
          <LandingScreen onPlay={() => {}} />
          <UsernameModal
            onSubmit={handleUsernameSubmit}
            onClose={() => setPhase("landing")}
          />
        </>
      )}

      {/* Countdown */}
      {currentPhase === "countdown" && (
        <>
          <div className="min-h-screen bg-black" />
          <Countdown onComplete={handleCountdownComplete} />
        </>
      )}

      {/* Main phase transitions */}
      <AnimatePresence mode="wait">
        {currentPhase === "landing" && (
          <PageTransition key="landing">
            <LandingScreen onPlay={handlePlay} />
          </PageTransition>
        )}

        {currentPhase === "playing" && (
          <PageTransition key="playing">
            <TypingGame username={username} onComplete={handleGameComplete} />
          </PageTransition>
        )}

        {currentPhase === "complete" && result && (
          <PageTransition key="complete">
            <CompletionScreen result={result} onReplay={handleReplay} />
          </PageTransition>
        )}

        {currentPhase === "complete" && !result && (
          <PageTransition key="complete-loading">
            <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4">
              <motion.div
                className="w-16 h-16 border-2 border-red-700/30 border-t-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span
                className="text-red-500/60 text-xs tracking-widest uppercase"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                Uploading result...
              </span>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>
    </>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
