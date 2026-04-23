"use client";

import { motion } from "framer-motion";

export default function ProjectCard({ title, desc }: any) {
  return (
    <motion.div
      whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-purple-500/30 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/30 cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </motion.div>
  );
}