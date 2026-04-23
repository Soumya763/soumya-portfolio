"use client";

import { useRef } from "react";

export default function ProjectCard3D({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y / rect.height - 0.5) * 15;
    const rotateY = (x / rect.width - 0.5) * 15;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  };

  const reset = () => {
    const card = ref.current;
    if (!card) return;

    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="group relative p-6 rounded-2xl border border-gray-800 bg-black transition duration-300 hover:border-purple-500 shadow-lg"
    >
      {/* glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 blur-xl transition" />

      <h3 className="text-xl font-semibold mb-2 relative z-10">
        {title}
      </h3>

      <p className="text-gray-400 mb-4 relative z-10">
        {desc}
      </p>

      <span className="text-purple-400 relative z-10">
        View Project →
      </span>
    </div>
  );
}