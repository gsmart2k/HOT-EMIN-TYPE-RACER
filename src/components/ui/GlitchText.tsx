"use client";

import { useEffect, useRef, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  intensity?: "low" | "medium" | "high";
}

export default function GlitchText({
  text,
  className = "",
  style,
  as: Tag = "div",
  intensity = "medium",
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const intervals = { low: 6000, medium: 3500, high: 1500 };
  const durations = { low: 200, medium: 400, high: 600 };

  useEffect(() => {
    function triggerGlitch() {
      setIsGlitching(true);
      timerRef.current = setTimeout(() => {
        setIsGlitching(false);
        timerRef.current = setTimeout(triggerGlitch, intervals[intensity] + Math.random() * 2000);
      }, durations[intensity]);
    }

    timerRef.current = setTimeout(triggerGlitch, Math.random() * 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [intensity]);

  return (
    <Tag className={`relative inline-block ${className}`} style={style}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span
            aria-hidden
            className="glitch-layer-1 absolute inset-0"
            style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="glitch-layer-2 absolute inset-0"
            style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" }}
          >
            {text}
          </span>
        </>
      )}
    </Tag>
  );
}
