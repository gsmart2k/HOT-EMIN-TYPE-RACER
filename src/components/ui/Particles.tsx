"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function Particles({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawnParticle(): Particle {
      const canvas = canvasRef.current!;
      const maxLife = 120 + Math.random() * 200;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        opacity: 0,
        life: 0,
        maxLife,
      };
    }

    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: count }, spawnParticle).map(
      (p) => ({ ...p, life: Math.random() * p.maxLife })
    );

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.map((p) => {
        p.life += 1;
        if (p.life > p.maxLife) return { ...spawnParticle(), life: 0 };

        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;

        p.x += p.vx;
        p.y += p.vy;

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.8;
        ctx.fillStyle = "#ff2020";
        ctx.shadowColor = "#ff2020";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden
    />
  );
}
