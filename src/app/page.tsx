"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import dynamic from "next/dynamic";

const MagneticButton = dynamic(
  () => import("@/components/MagneticButton"),
  { ssr: false }
);

const CursorGlow = dynamic(() => import("@/components/CursorGlow"), {
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen px-6 md:px-20 py-10 relative overflow-hidden">

      <CursorGlow />

      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-xl font-semibold">Soumya Singh</h1>
        <div className="space-x-6 text-sm text-gray-400">
          <a href="#projects" className="hover:text-white">Projects</a>
          <a href="#skills" className="hover:text-white">Skills</a>
          <a href="#experience" className="hover:text-white">Experience</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </div>
      </div>

      {/* HERO */}
      <motion.section
        className="flex flex-col md:flex-row items-center gap-12 mb-24 relative z-10"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <Image
          src="/profile.jpeg"
          alt="profile"
          width={280}
          height={280}
          className="rounded-2xl border border-purple-500"
        />

        <div>
          <h2 className="text-4xl font-bold mb-4">Soumya Singh</h2>

          <p className="text-purple-400 mb-4">
            Full Stack Developer | Cybersecurity Enthusiast
          </p>

          <p className="text-gray-400 max-w-xl leading-relaxed">
            Building secure, scalable, and intelligent software systems with a strong foundation in data structures, algorithms, and modern development practices.
            Passionate about crafting efficient backend architectures, intuitive user experiences, and solving real-world problems through technology.
            Continuously exploring emerging domains like AI, automation, and cybersecurity to create impactful and future-ready solutions.
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-purple-600 px-5 py-2 rounded-lg hover:scale-105 transition">
              Contact Me
            </button>

            <button className="border border-white px-5 py-2 rounded-lg hover:bg-white hover:text-black transition">
              View Projects
            </button>
          </div>
        </div>
      </motion.section>

      {/* PROJECTS */}
      <motion.section
        id="projects"
        className="mb-32"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ProjectCard
            title="Blockchain Healthcare Security"
            desc="Real-time threat detection using blockchain with secure authentication and decentralized identity."
          />

          <ProjectCard
            title="HR Workflow Automation"
            desc="Smart system for employee tracking, workflow automation and productivity optimization."
          />
        </div>
      </motion.section>

      {/* SKILLS */}
      <motion.section
        id="skills"
        className="mb-32 relative z-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-16">
          Technical Skills
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Languages", data: "Java, C++, JavaScript, Python" },
            { title: "Web Development", data: "HTML, CSS, React, Node.js, Express" },
            { title: "Cybersecurity", data: "Blockchain, Web3, Encryption, PKI, SOC Basics" },
            { title: "Tools", data: "Git, GitHub, VS Code, Figma" },
            { title: "Concepts", data: "DSA, System Design Basics" },
            { title: "AI & Automation", data: "Generative AI, N8N" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-800 bg-white/5 backdrop-blur-md hover:border-purple-500 hover:scale-[1.03] transition duration-300"
            >
              <h3 className="text-purple-400 font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.data}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* EXPERIENCE */}
      <motion.section
        id="experience"
        className="mb-32 relative z-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-16">
          Experience
        </h2>

        <div className="space-y-8 max-w-3xl mx-auto">
          {[
            {
              title: "Quantumease Technology Internship",
              desc: "Worked on cybersecurity tools, threat detection, and network security concepts.",
            },
            {
              title: "PWC Launchpad",
              desc: "Gained enterprise-level exposure and real-world business insights.",
            },
            {
              title: "Hackathons",
              desc: "Built real-world projects and collaborated in fast-paced environments.",
            },
          ].map((exp, i) => (
            <div
              key={i}
              className="relative p-6 rounded-xl border border-gray-800 bg-white/5 backdrop-blur-md hover:border-purple-500 transition"
            >
              <div className="absolute left-0 top-0 h-full w-[3px] bg-purple-500 rounded-full" />

              <h3 className="text-lg font-semibold mb-2 pl-3">
                {exp.title}
              </h3>

              <p className="text-gray-400 pl-3">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        id="contact"
        className="mt-32 text-center relative z-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-6">Contact</h2>

        <p className="text-gray-400 mb-2">
          soumyasingh004@gmail.com
        </p>
        <p className="text-gray-400 mb-6">
          +91 7643062912
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <a href="https://github.com/" target="_blank" className="text-purple-400 hover:text-white">
            GitHub →
          </a>

          <a href="https://linkedin.com/" target="_blank" className="text-purple-400 hover:text-white">
            LinkedIn →
          </a>
        </div>

        <div className="flex justify-center">
          <MagneticButton>Contact Me</MagneticButton>
        </div>
      </motion.section>

    </main>
  );
}