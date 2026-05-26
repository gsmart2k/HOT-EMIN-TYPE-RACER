"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButton from "@/components/ui/NeonButton";

interface UsernameModalProps {
  onSubmit: (username: string) => void;
  onClose: () => void;
}

export default function UsernameModal({ onSubmit, onClose }: UsernameModalProps) {
  const [value, setValue] = useState("@");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function validate(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "@") return "Username cannot be empty";
    if (!trimmed.startsWith("@")) return "Username must start with @";
    if (trimmed.length < 2) return "Username is too short";
    if (!/^@[a-zA-Z0-9_]{1,50}$/.test(trimmed))
      return "Only letters, numbers, and underscores allowed";
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (!v.startsWith("@")) v = "@" + v.replace(/^@*/, "");
    setValue(v);
    if (error) setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(value);
    if (err) { setError(err); return; }
    onSubmit(value.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
          style={{ backdropFilter: "blur(8px)" }}
        />

        {/* Modal */}
        <motion.div
          className="relative glass-panel holo-border w-full max-w-md rounded-sm"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Top accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  className="text-red-500/60 text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  Identity Protocol
                </div>
                <h2
                  className="text-2xl font-bold text-white mb-2 tracking-widest"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  ENTER THE RACE
                </h2>
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  Your handle will be immortalized on the leaderboard
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label
                  htmlFor="username"
                  className="block text-red-400/80 text-xs tracking-widest uppercase mb-2"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  Twitter / X Handle
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="username"
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="@yourhandle"
                    maxLength={52}
                    className="terminal-input w-full px-4 py-3 rounded-sm text-base tracking-wider"
                    style={{ fontFamily: "Rajdhani, sans-serif" }}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {/* Cursor blink indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 cursor-blink" />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-red-500 text-xs tracking-wide"
                      style={{ fontFamily: "Rajdhani, sans-serif" }}
                    >
                      ⚠ {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <NeonButton type="submit" size="md" variant="primary" className="flex-1">
                  ENTER THE RACE
                </NeonButton>
                <NeonButton
                  type="button"
                  onClick={onClose}
                  size="md"
                  variant="secondary"
                >
                  ABORT
                </NeonButton>
              </motion.div>
            </form>

            {/* Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-gray-600 text-xs"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              All users type identical text · Ranked by fastest completion time
            </motion.p>
          </div>

          {/* Bottom accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-900/60 to-transparent" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
