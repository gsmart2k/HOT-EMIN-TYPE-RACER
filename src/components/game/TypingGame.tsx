"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RACE_WORDS } from "@/lib/gameText";
import type { GameResult } from "@/types";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import Particles from "@/components/ui/Particles";
import Footer from "@/components/ui/Footer";
import AudioToggle from "@/components/ui/AudioToggle";
import { playClick, playError, playComplete } from "@/lib/audioEngine";

interface TypingGameProps {
  username: string;
  onComplete: (result: GameResult) => void;
}

type CharState = "pending" | "correct" | "incorrect";

export default function TypingGame({ username, onComplete }: TypingGameProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [charStates, setCharStates] = useState<CharState[][]>(
    () => RACE_WORDS.map((w) => Array(w.length).fill("pending"))
  );
  const [currentInput, setCurrentInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Timer
  useEffect(() => {
    const id = setInterval(() => {
      const secs = (Date.now() - startTime) / 1000;
      setElapsed(secs);
      const mins = secs / 60;
      if (wordIndex > 0 && mins > 0) {
        setWpm(Math.round(wordIndex / mins));
      }
    }, 200);
    return () => clearInterval(id);
  }, [startTime, wordIndex]);

  // Auto-scroll active word into view
  useEffect(() => {
    activeWordRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [wordIndex]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const accuracy = totalKeystrokes > 0
    ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)
    : 100;

  const progress = Math.round((wordIndex / RACE_WORDS.length) * 100);

  const confirmWord = useCallback(
    (typed: string) => {
      const currentWord = RACE_WORDS[wordIndex];
      if (typed === currentWord) {
        playClick();
        setWordIndex((wi) => {
          const next = wi + 1;
          if (next >= RACE_WORDS.length) {
            const completionMs = Date.now() - startTime;
            const mins = completionMs / 1000 / 60;
            const finalWpm = Math.round(RACE_WORDS.length / mins);
            const finalAccuracy = totalKeystrokes > 0
              ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)
              : 100;
            playComplete();
            setTimeout(() => {
              onComplete({
                username,
                completionTime: completionMs,
                wpm: finalWpm,
                accuracy: Math.max(0, Math.min(100, finalAccuracy)),
              });
            }, 0);
          }
          return next;
        });
        setCurrentInput("");
        setCharIndex(0);
        setInputError(false);
        setStreak((s) => s + 1);
      } else {
        triggerError();
      }
    },
    [wordIndex, startTime, totalKeystrokes, errors, username, onComplete]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === " " || e.key === "Tab") {
        e.preventDefault();
        confirmWord(currentInput);
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setCurrentInput((prev) => {
          const next = prev.slice(0, -1);
          setCharIndex(next.length);
          return next;
        });
        setInputError(false);
        return;
      }
    },
    [currentInput, confirmWord]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const hasSpace = val.includes(" ");
      const clean = val.replace(/\s/g, "");
      const currentWord = RACE_WORDS[wordIndex];
      if (!currentWord) return;

      // Mobile: space came through onChange — treat as word confirm
      if (hasSpace) {
        setTotalKeystrokes((k) => k + 1);
        confirmWord(clean);
        return;
      }

      setTotalKeystrokes((k) => k + 1);

      const newCharStates = charStates.map((ws) => [...ws]);
      const typedLen = clean.length;

      for (let i = 0; i < currentWord.length; i++) {
        if (i < typedLen) {
          newCharStates[wordIndex][i] =
            clean[i] === currentWord[i] ? "correct" : "incorrect";
        } else {
          newCharStates[wordIndex][i] = "pending";
        }
      }

      const hasError = clean
        .slice(0, Math.min(typedLen, currentWord.length))
        .split("")
        .some((c, i) => c !== currentWord[i]);

      if (hasError) {
        setErrors((err) => err + 1);
        setInputError(true);
        triggerError();
      } else {
        setInputError(false);
      }

      setCharStates(newCharStates);
      setCurrentInput(clean);
      setCharIndex(clean.length);
    },
    [charStates, wordIndex, confirmWord]
  );

  function triggerError() {
    playError();
    setShakeScreen(true);
    setStreak(0);
    setTimeout(() => setShakeScreen(false), 300);
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return m > 0 ? `${m}:${rem.toString().padStart(2, "0")}` : `${rem}s`;
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col bg-black overflow-hidden ${shakeScreen ? "shake" : ""}`}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255,32,32,0.08) 0%, transparent 60%)",
          }}
          className="absolute inset-0"
        />
        <Particles count={30} />
        <ScanlineOverlay />
      </div>

      {/* HUD Header */}
      <div className="relative z-20 border-b border-red-900/30 px-4 sm:px-8 py-3"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Username */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-red-500" />
            <span className="text-red-400/80 text-xs tracking-widest uppercase" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {username}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <Stat label="WPM" value={wpm} color="text-white" />
            <Stat label="ACC" value={`${accuracy}%`} color={accuracy > 90 ? "text-green-400" : accuracy > 70 ? "text-yellow-400" : "text-red-400"} />
            <Stat label="TIME" value={formatTime(elapsed * 1000)} color="text-red-400" />
            <Stat label="STREAK" value={streak} color="text-cyan-400" />
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {wordIndex}/{RACE_WORDS.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-2">
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full progress-shimmer rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Terminal panel */}
          <motion.div
            className="glass-panel holo-border rounded-sm p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-900/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="text-gray-600 text-xs tracking-widest ml-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                TERMINAL — HOT_EMIN_RACE.exe
              </span>
            </div>

            {/* Words display */}
            <div
              ref={containerRef}
              className="relative font-mono text-lg sm:text-xl md:text-2xl leading-relaxed max-h-48 overflow-y-auto select-none"
              style={{ fontFamily: "Rajdhani, sans-serif", wordBreak: "break-word" }}
            >
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {RACE_WORDS.map((word, wi) => {
                  const isPast = wi < wordIndex;
                  const isActive = wi === wordIndex;
                  const isFuture = wi > wordIndex;

                  return (
                    <span
                      key={wi}
                      ref={isActive ? activeWordRef : undefined}
                      className={`relative inline-block transition-all duration-100 px-0.5 rounded-sm ${
                        isActive
                          ? "bg-red-950/30 ring-1 ring-red-700/40"
                          : ""
                      }`}
                    >
                      {word.split("").map((char, ci) => {
                        const state = isPast
                          ? "correct"
                          : isActive
                          ? charStates[wi][ci]
                          : "pending";

                        return (
                          <span
                            key={ci}
                            className={`transition-colors duration-75 ${
                              state === "correct"
                                ? "text-white"
                                : state === "incorrect"
                                ? "text-red-500 bg-red-900/30"
                                : isFuture
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {char}
                          </span>
                        );
                      })}

                      {/* Cursor */}
                      {isActive && (
                        <span
                          className="inline-block w-0.5 h-5 bg-red-500 cursor-blink align-middle ml-px"
                          style={{
                            marginLeft: charIndex > 0 ? "0" : "0px",
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Input area */}
          <motion.div
            className="flex gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative flex-1">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/60 text-sm select-none pointer-events-none"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`terminal-input w-full pl-8 pr-4 py-4 rounded-sm text-base sm:text-lg tracking-wide transition-all duration-150 ${
                  inputError ? "border-red-500 bg-red-950/20" : ""
                }`}
                style={{ fontFamily: "Rajdhani, sans-serif" }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={`Type: "${RACE_WORDS[wordIndex]}"  —  press SPACE to confirm`}
              />
            </div>

            {/* Error flash indicator */}
            <AnimatePresence>
              {inputError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-2xl select-none"
                >
                  ✗
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Help text */}
          <p
            className="mt-3 text-center text-gray-700 text-xs tracking-widest"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            SPACE = confirm word · BACKSPACE = correct · ESC to quit
          </p>
        </div>
      </div>

      <AudioToggle />
      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="text-gray-600 text-[9px] tracking-widest uppercase" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {label}
      </div>
      <div className={`${color} text-sm font-bold tabular-nums`} style={{ fontFamily: "Orbitron, sans-serif" }}>
        {value}
      </div>
    </div>
  );
}
