// LeChemin.tech — Application principale avec routage
// Navigation entre accueil et parcours avec effet de glow partagé

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  ArrowLeft,
  Menu,
  X
} from "lucide-react";
import Home from "./pages/Home";
import Parcours from "./pages/Parcours";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function App() {
  // Theme (default: dark)
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState<"home" | "parcours">("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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

  const navigateToParcours = () => { setCurrentPage("parcours"); setMobileOpen(false); };
  const navigateToHome = () => { setCurrentPage("home"); setMobileOpen(false); };

  return (
    <HelmetProvider>
      <div className="relative" style={{ ['--accent' as string]: accent }}>
        <Helmet>
          <title>{currentPage === 'parcours' ? 'Parcours DevOps - LeChemin.tech' : 'LeChemin.tech - Roadmaps DevOps & Cloud en Français'}</title>
          <meta name="description" content={currentPage === 'parcours' ? 'Parcours DevOps complet: Linux, Git, Scripting, Docker, Kubernetes, Cloud, CI/CD, Sécurité & Observabilité.' : 'Apprendre le DevOps & Cloud en français: roadmaps structurées, ressources sélectionnées, guides pratiques.'} />
          <link rel="canonical" href={currentPage === 'parcours' ? 'https://lechemin.tech/parcours' : 'https://lechemin.tech/'} />
          <meta property="og:title" content={currentPage === 'parcours' ? 'Parcours DevOps - LeChemin.tech' : 'LeChemin.tech - Roadmaps DevOps & Cloud'} />
          <meta property="og:description" content={currentPage === 'parcours' ? 'Roadmap DevOps structurée avec étapes: Linux, Git, Scripting, Docker, Kubernetes, Cloud, CI/CD, Sécurité.' : 'Apprenez le DevOps, Kubernetes, Docker, Terraform, CI/CD, Cloud en français.'} />
          <meta property="og:url" content={currentPage === 'parcours' ? 'https://lechemin.tech/parcours' : 'https://lechemin.tech/'} />
          <meta property="og:image" content="https://lechemin.tech/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={currentPage === 'parcours' ? 'Parcours DevOps - LeChemin.tech' : 'LeChemin.tech - Roadmaps DevOps & Cloud'} />
          <meta name="twitter:description" content={currentPage === 'parcours' ? 'Roadmap DevOps complète en français.' : 'Apprendre le DevOps & Cloud en français.'} />
          <meta name="twitter:image" content="https://lechemin.tech/og-image.jpg" />
        </Helmet>
        {/* NAVBAR - Fixed across all pages */}
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
          <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:py-4 md:px-6">
            <button onClick={navigateToHome} className="group inline-flex items-center gap-2" aria-label="Aller à l'accueil">
              <div className="h-7 w-7 rounded-lg" style={{ background: "linear-gradient(135deg, var(--accent), #1E1E1E)" }} />
              <span className="text-base font-semibold tracking-tight">LeChemin.tech</span>
            </button>

            {/* Zone de droite */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Links desktop */}
              <div className="hidden items-center gap-6 md:flex">
                {currentPage === "parcours" && (
                  <button 
                    onClick={navigateToHome}
                    className="nav-link flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Accueil
                  </button>
                )}
                {currentPage === "home" && (
                  <>
                    <button onClick={navigateToParcours} className="nav-link">Parcours</button>
                    <a href="#mission" className="nav-link">Mission</a>
                    <a href="#contact" className="nav-link">Contact</a>
                  </>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDark((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/70 text-zinc-800 transition hover:bg-white dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Basculer le thème"
                title="Basculer le thème"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Hamburger bouton (mobile) */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/70 text-zinc-800 transition hover:bg-white dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-900 md:hidden"
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {/* Overlay + panneau mobile */}
          <motion.div
            id="mobile-menu"
            initial={false}
            animate={mobileOpen ? "open" : "closed"}
            variants={{
              open: { opacity: 1, pointerEvents: 'auto' },
              closed: { opacity: 0, pointerEvents: 'none' }
            }}
            className="md:hidden fixed inset-0 z-[80] flex flex-col h-[100dvh] bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-2xl dark:from-zinc-950/95 dark:to-zinc-900/85"
            style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
          >
            {/* Barre supérieure dans l'overlay (au-dessus du header) */}
            <div className="flex items-center justify-between px-5 pb-3">
              <button onClick={navigateToHome} className="flex items-center gap-2" aria-label="Accueil">
                <div className="h-8 w-8 rounded-lg" style={{ background: `linear-gradient(135deg, var(--accent), #1E1E1E)` }} />
                <span className="font-semibold text-sm">LeChemin.tech</span>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-zinc-800 shadow-sm transition hover:bg-white dark:bg-zinc-800/70 dark:text-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-10">
              <div className="mx-auto w-full max-w-sm flex flex-col gap-5">
                {currentPage === 'home' && (
                  <button
                    onClick={navigateToParcours}
                    className="group w-full rounded-2xl bg-[var(--accent)] px-6 py-4 text-base font-semibold text-white shadow-md transition hover:shadow-lg"
                  >
                    Parcours DevOps
                  </button>
                )}
                {currentPage === 'parcours' && (
                  <button
                    onClick={navigateToHome}
                    className="group w-full rounded-2xl bg-white/70 px-6 py-4 text-base font-medium shadow-sm transition hover:bg-white dark:bg-zinc-800/70 dark:hover:bg-zinc-800"
                  >
                    ← Retour à l'accueil
                  </button>
                )}
                {currentPage === 'home' && (
                  <>
                    <a
                      href="#mission"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full rounded-2xl bg-white/70 px-6 py-4 text-base font-medium shadow-sm transition hover:bg-white dark:bg-zinc-800/70 dark:hover:bg-zinc-800"
                    >Mission</a>
                    <a
                      href="#contact"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full rounded-2xl bg-white/70 px-6 py-4 text-base font-medium shadow-sm transition hover:bg-white dark:bg-zinc-800/70 dark:hover:bg-zinc-800"
                    >Contact</a>
                  </>
                )}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setIsDark(v => !v)}
                    className="flex-1 rounded-2xl bg-zinc-900 text-white py-4 text-sm font-medium dark:bg-white dark:text-zinc-900 transition"
                  >
                    {isDark ? 'Mode clair' : 'Mode sombre'}
                  </button>
                </div>
                <div className="pt-10 text-[10px] uppercase tracking-[0.15em] text-center opacity-40">MENU</div>
              </div>
            </div>
          </motion.div>
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
          @media (max-width: 767px){ html { overscroll-behavior-y: contain; } }
        `}</style>
      </div>
    </HelmetProvider>
  );
}
