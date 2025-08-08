// LeChemin.tech — Application principale avec routage
// Navigation entre accueil et parcours avec effet de glow partagé

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  ArrowLeft,
} from "lucide-react";
import Home from "./pages/Home";
import Parcours from "./pages/Parcours";

export default function App() {
  // Theme (default: dark)
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState<"home" | "parcours">("home");

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  // GPU-friendly global glow: move a gradient circle with transform, no re-render per mousemove
  const glowRef = useRef<HTMLDivElement>(null);
  const accent = "#0052FF"; // electric blue

  // Mouse move handler updates transform only (no React state churn)
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current;
    if (!el) return;
    const size = 300; // px
    const x = e.clientX - size / 2;
    const y = e.clientY - size / 2;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const navigateToParcours = () => setCurrentPage("parcours");
  const navigateToHome = () => setCurrentPage("home");

  return (
    <div className="relative">
      {/* NAVBAR - Fixed across all pages */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-zinc-950/40">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button onClick={navigateToHome} className="group inline-flex items-center gap-2">
            <div className="h-6 w-6 rounded-md" style={{ background: "linear-gradient(135deg, var(--accent), #1E1E1E)" }} />
            <span className="text-sm font-semibold tracking-tight md:text-base">LeChemin.tech</span>
          </button>

          <div className="flex items-center gap-2 md:gap-6">
            {currentPage === "parcours" && (
              <button 
                onClick={navigateToHome}
                className="nav-link flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </button>
            )}
            {currentPage === "home" && (
              <>
                <button onClick={navigateToParcours} className="nav-link">Les Parcours</button>
                <a href="#mission" className="nav-link">Notre Mission</a>
                <a href="#contact" className="nav-link">Contact</a>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark((v) => !v)}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/60 transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
              aria-label="Basculer le thème"
              title="Basculer le thème"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Page Content with smooth transitions */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: currentPage === "parcours" ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: currentPage === "parcours" ? -50 : 50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {currentPage === "home" ? (
          <Home
            isDark={isDark}
            setIsDark={setIsDark}
            onNavigateToParcours={navigateToParcours}
            glowRef={glowRef}
            handleMouseMove={handleMouseMove}
            accent={accent}
          />
        ) : (
          <Parcours
            isDark={isDark}
            setIsDark={setIsDark}
            glowRef={glowRef}
            handleMouseMove={handleMouseMove}
            accent={accent}
            onNavigateHome={navigateToHome}
          />
        )}
      </motion.div>

      {/* Shared styles for nav links */}
      <style>{`
        .nav-link { position: relative; font-size: 0.9rem; opacity: 0.85; transition: all 0.2s ease; }
        .nav-link:hover { opacity: 1; }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: ${accent}; transform: scaleX(0); transform-origin: right; transition: transform .2s ease; }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
      `}</style>
    </div>
  );
}
