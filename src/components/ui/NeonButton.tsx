"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

const variants = {
  primary:
    "bg-red-900/30 border-red-500 text-red-400 hover:bg-red-800/50 hover:text-white hover:border-red-400",
  secondary:
    "bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800/50 hover:text-white hover:border-gray-400",
  ghost:
    "bg-transparent border-red-900/40 text-red-500/70 hover:bg-red-900/20 hover:text-red-400 hover:border-red-700",
};

const sizes = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-8 py-3 text-sm tracking-widest",
  lg: "px-12 py-4 text-base tracking-[0.3em]",
};

export default function NeonButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: NeonButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        relative border font-orbitron uppercase cursor-pointer
        transition-all duration-300 ease-out overflow-hidden
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${variant === "primary" ? "btn-glow" : ""}
        ${className}
      `}
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Ripple shimmer on hover */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      {/* Corner accents */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500/60" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500/60" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500/60" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/60" />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
