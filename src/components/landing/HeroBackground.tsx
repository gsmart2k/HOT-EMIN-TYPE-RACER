"use client";

import { motion } from "framer-motion";
import Particles from "@/components/ui/Particles";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* Hero image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1.02, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1.02, 1.04, 1.02] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hot-emin.jpg"
            alt="Hot Emin Cyberpunk Hero"
            className="w-full h-full object-cover object-top"
            style={{ filter: "saturate(0.7) brightness(0.55) contrast(1.3)" }}
          />
        </motion.div>
      </motion.div>

      {/* Glitch overlay layers */}
      <GlitchOverlay />

      {/* Red pulse from center-bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full z-5"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(255,32,32,0.25) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fog layers */}
      <div
        className="fog absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(5,10,26,0.5) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Eye glow — positioned where eyes would be on the character */}
      <EyeGlow />

      {/* Animated horizontal UI lines */}
      <UILines />

      {/* Particles */}
      <Particles count={70} />

      {/* Dark overlays — top/bottom gradients */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.9) 100%)",
        }}
        aria-hidden
      />

      {/* Scanlines + vignette */}
      <ScanlineOverlay />
    </div>
  );
}

function GlitchOverlay() {
  return (
    <>
      <motion.div
        className="absolute inset-0 z-8 pointer-events-none mix-blend-overlay"
        animate={{ opacity: [0, 0.06, 0, 0.04, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 }}
        style={{ background: "rgba(255,32,32,1)" }}
        aria-hidden
      />
      <motion.div
        className="absolute inset-0 z-8 pointer-events-none"
        animate={{
          clipPath: [
            "inset(100% 0 0 0)",
            "inset(60% 0 30% 0)",
            "inset(100% 0 0 0)",
          ],
          opacity: [0, 0.3, 0],
        }}
        transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 4.2 }}
        style={{ background: "rgba(0,240,255,0.15)" }}
        aria-hidden
      />
    </>
  );
}

function EyeGlow() {
  return (
    <motion.div
      className="absolute z-12 pointer-events-none"
      style={{
        top: "28%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "120px",
        height: "20px",
      }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {/* Left eye */}
      <motion.div
        className="absolute"
        style={{
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "8px",
          borderRadius: "50%",
          background: "#ff2020",
          boxShadow:
            "0 0 10px #ff2020, 0 0 25px #ff2020, 0 0 50px #ff0000, 0 0 80px rgba(255,0,0,0.5)",
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {/* Right eye */}
      <motion.div
        className="absolute"
        style={{
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "8px",
          borderRadius: "50%",
          background: "#ff2020",
          boxShadow:
            "0 0 10px #ff2020, 0 0 25px #ff2020, 0 0 50px #ff0000, 0 0 80px rgba(255,0,0,0.5)",
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.1 }}
      />
      {/* Laser beam between eyes */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: "26px",
          right: "26px",
          height: "2px",
          background: "linear-gradient(90deg, #ff2020, rgba(255,32,32,0.5), #ff2020)",
          boxShadow: "0 0 6px #ff2020",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

function UILines() {
  return (
    <div className="absolute inset-0 z-8 pointer-events-none overflow-hidden" aria-hidden>
      {/* Top holographic lines */}
      {[5, 12, 18].map((pct) => (
        <motion.div
          key={pct}
          className="absolute w-full h-px"
          style={{
            top: `${pct}%`,
            background: "linear-gradient(90deg, transparent, rgba(255,32,32,0.15) 30%, rgba(255,32,32,0.3) 50%, rgba(255,32,32,0.15) 70%, transparent)",
          }}
          animate={{ scaleX: [0.8, 1, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + pct * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Side vertical accent */}
      <motion.div
        className="absolute left-0 w-px"
        style={{
          top: "20%",
          height: "30%",
          background: "linear-gradient(to bottom, transparent, rgba(255,32,32,0.4), transparent)",
        }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 w-px"
        style={{
          top: "20%",
          height: "30%",
          background: "linear-gradient(to bottom, transparent, rgba(255,32,32,0.4), transparent)",
        }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </div>
  );
}
