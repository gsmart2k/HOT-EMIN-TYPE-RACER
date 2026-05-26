"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="relative z-50 w-full border-t border-red-900/20"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-px h-4 bg-red-600" />
          <span
            className="text-red-500/80 text-xs tracking-widest uppercase"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            HOT EMIN RACE
          </span>
          <div className="w-px h-4 bg-red-600" />
        </div>

        {/* Credit */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Developed by
          </span>
          <span
            className="text-red-400 text-xs font-semibold tracking-wider"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            Doctor Smart
          </span>
          <span className="text-gray-600 text-xs">·</span>
          <a
            href="https://x.com/i_write_codes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500/80 text-xs tracking-wider hover:text-red-400 transition-colors duration-200"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            @i_write_codes
          </a>
        </div>

        {/* Right — Avalanche badge */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Built on
          </span>
          <span
            className="text-red-400 text-xs font-bold tracking-widest"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            AVALANCHE
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #ff2020 30%, #ff2020 70%, transparent)",
          opacity: 0.3,
        }}
      />
    </motion.footer>
  );
}
