"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-full 
      w-[120px] h-[120px] 
      bg-purple-500 opacity-20 blur-3xl 
      transition-transform duration-150 ease-out"
      style={{
        transform: `translate(${pos.x - 60}px, ${pos.y - 60}px)`
      }}
    />
  );
}