"use client";

import { useRef } from "react";

export default function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current!.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = `translate(0px, 0px)`;
    }
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative px-6 py-3 rounded-xl font-semibold 
      bg-purple-600 overflow-hidden transition duration-300
      hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
    >
      {/* Glow layer */}
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-20 blur-xl transition" />

      {/* Text */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}