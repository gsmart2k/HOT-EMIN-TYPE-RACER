"use client";

export default function ScanlineOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-20 scanlines"
        aria-hidden
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </>
  );
}
