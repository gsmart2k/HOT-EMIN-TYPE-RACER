"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLeaderboard } from "@/lib/leaderboardService";
import { supabase } from "@/lib/supabase";
import type { LeaderboardEntry } from "@/types";
import GlitchText from "@/components/ui/GlitchText";

const RANK_LABELS = ["", "🥇", "🥈", "🥉"];
const RANK_CLASSES = [
  "",
  "rank-gold border border-yellow-600/40",
  "rank-silver border border-gray-400/40",
  "rank-red border border-red-600/50",
];

function formatTime(ms: number) {
  const s = (ms / 1000).toFixed(2);
  return `${s}s`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export default function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchLeaderboard(100);
      setEntries(data);
    } catch {
      setError("Failed to load leaderboard. Check your Supabase config.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    // Realtime subscription
    const channel = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leaderboard" },
        (payload) => {
          const newEntry = payload.new as LeaderboardEntry;
          setNewEntryId(newEntry.id ?? null);
          setEntries((prev) => {
            const updated = [newEntry, ...prev];
            return updated
              .sort((a, b) => {
                if (a.completion_time !== b.completion_time)
                  return a.completion_time - b.completion_time;
                return b.wpm - a.wpm;
              })
              .slice(0, 100);
          });
          setTimeout(() => setNewEntryId(null), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (entries.length === 0) return <EmptyState />;

  return (
    <div className="w-full">
      {/* Column headers */}
      <div
        className="grid gap-4 px-6 py-3 mb-2 text-gray-600 text-xs tracking-widest uppercase border-b border-red-900/20"
        style={{
          fontFamily: "Orbitron, sans-serif",
          gridTemplateColumns: "3rem 1fr 8rem 6rem 7rem 6rem",
        }}
      >
        <span>#</span>
        <span>Player</span>
        <span className="text-right">Time</span>
        <span className="text-right">WPM</span>
        <span className="text-right">Accuracy</span>
        <span className="text-right hidden sm:block">Date</span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry, i) => {
            const rank = i + 1;
            const isNew = entry.id === newEntryId;
            const isTop3 = rank <= 3;

            return (
              <motion.div
                key={entry.id ?? `${entry.username}-${i}`}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.5) }}
                className={`
                  relative grid gap-4 px-6 py-4 rounded-sm
                  transition-all duration-300 cursor-default
                  ${isTop3 ? RANK_CLASSES[rank] : "bg-gray-950/60 border border-gray-900/40"}
                  ${isNew ? "ring-1 ring-red-500 bg-red-950/20" : ""}
                `}
                style={{
                  gridTemplateColumns: "3rem 1fr 8rem 6rem 7rem 6rem",
                  background: isTop3
                    ? undefined
                    : "rgba(5,10,26,0.5)",
                }}
              >
                {/* Rank */}
                <div className="flex items-center">
                  {isTop3 ? (
                    <span
                      className="text-xl crown-float"
                      title={`Rank ${rank}`}
                    >
                      {RANK_LABELS[rank]}
                    </span>
                  ) : (
                    <span
                      className="text-gray-500 text-sm font-bold"
                      style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                      {rank}
                    </span>
                  )}
                </div>

                {/* Username */}
                <div className="flex items-center min-w-0">
                  {isNew ? (
                    <GlitchText
                      text={entry.username}
                      intensity="high"
                      className="text-red-400 font-bold text-sm sm:text-base truncate"
                      style={{ fontFamily: "Rajdhani, sans-serif" } as React.CSSProperties}
                    />
                  ) : (
                    <span
                      className={`font-bold text-sm sm:text-base truncate ${
                        isTop3 ? "text-white" : "text-gray-300"
                      }`}
                      style={{ fontFamily: "Rajdhani, sans-serif" }}
                    >
                      {entry.username}
                    </span>
                  )}
                  {isNew && (
                    <motion.span
                      className="ml-2 text-red-500 text-[9px] tracking-widest uppercase px-1.5 py-0.5 border border-red-700/50 rounded-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: 5 }}
                      style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                      NEW
                    </motion.span>
                  )}
                </div>

                {/* Time */}
                <div className="flex items-center justify-end">
                  <span
                    className={`font-bold text-sm tabular-nums ${
                      rank === 1 ? "text-yellow-400" : isTop3 ? "text-red-400" : "text-gray-300"
                    }`}
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {formatTime(entry.completion_time)}
                  </span>
                </div>

                {/* WPM */}
                <div className="flex items-center justify-end">
                  <span
                    className="text-white/80 text-sm tabular-nums"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {entry.wpm}
                  </span>
                </div>

                {/* Accuracy */}
                <div className="flex items-center justify-end">
                  <span
                    className={`text-sm tabular-nums ${
                      entry.accuracy >= 95
                        ? "text-green-400"
                        : entry.accuracy >= 80
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {entry.accuracy}%
                  </span>
                </div>

                {/* Date */}
                <div className="items-center justify-end hidden sm:flex">
                  <span
                    className="text-gray-600 text-xs"
                    style={{ fontFamily: "Rajdhani, sans-serif" }}
                  >
                    {formatDate(entry.created_at)}
                  </span>
                </div>

                {/* Top-3 accent bar */}
                {isTop3 && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-sm"
                    style={{
                      background:
                        rank === 1
                          ? "linear-gradient(to bottom, #ffd700, #b8860b)"
                          : rank === 2
                          ? "linear-gradient(to bottom, #c0c0c0, #808080)"
                          : "linear-gradient(to bottom, #ff2020, #8b0000)",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        className="w-12 h-12 border-2 border-red-700/30 border-t-red-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span
        className="text-red-500/60 text-xs tracking-widest uppercase"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        Loading rankings...
      </span>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
      <div className="text-red-500 text-4xl">⚠</div>
      <p
        className="text-red-400 text-sm"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {message}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <GlitchText
        text="NO DATA YET"
        intensity="low"
        className="text-gray-600 text-xl"
        style={{ fontFamily: "Orbitron, sans-serif" } as React.CSSProperties}
      />
      <p
        className="text-gray-700 text-sm"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Be the first to race and claim the #1 spot.
      </p>
    </div>
  );
}
