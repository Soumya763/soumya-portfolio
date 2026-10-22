"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const LINKS = [
  { id: "work", label: "Selected work", note: "01 — 02" },
  { id: "lab", label: "AI Lab", note: "Prototype" },
  { id: "about", label: "About", note: "Background" },
  { id: "contact", label: "Contact", note: "Say hello" },
];

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in the middle band of the viewport.
  useEffect(() => {
    if (!onHome) return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    const top = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const current = (id: string) => (onHome ? active === id : id === "work" && pathname.startsWith("/work"));
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className={`nav ${scrolled || open ? "scrolled" : ""}`}>
        <div className="wrap nav-inner">
          <Link className="mark" href="/" aria-label="Soumya Singh — home" onClick={() => setOpen(false)}>
            <b aria-hidden="true">{site.monogram}</b>
            <span>Soumya Singh</span>
          </Link>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.id} className={l.id === "contact" ? "nav-cta" : undefined}>
                  <a href={href(l.id)} aria-current={current(l.id) ? "true" : undefined}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      {open && (
        <nav className="sheet" id="mobile-menu" aria-label="Mobile">
          <ol>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={href(l.id)} onClick={() => setOpen(false)} aria-current={current(l.id) ? "true" : undefined}>
                  {l.label}
                  <small>{l.note}</small>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
