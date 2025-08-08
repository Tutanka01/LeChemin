// LeChemin.tech — Homepage (DevOps focus)
// Single-file React component with TailwindCSS + framer-motion + lucide-react
// Dark mode by default (toggle in navbar). Global mouse-follow glow (GPU-friendly, behind content).

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ServerCog,
  ChevronRight,
  Compass,
  BookOpenCheck,
  ExternalLink,
  Moon,
  Sun,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function HomeLeCheminTech() {
  // Theme (default: dark)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  // GPU-friendly global glow: move a gradient circle with transform, no re-render per mousemove
  const glowRef = useRef(null);
  const accent = "#0052FF"; // electric blue

  // v1: only DevOps
  const paths = [
    {
      title: "DevOps",
      desc: "Automatisez, orchestrez, livrez en continu.",
      icon: ServerCog,
    },
  ];

  /**
   * Step card
   * @param {{ n:number, title:string, desc:string, Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }} props
   */
  const Step = ({ n, title, desc, Icon }) => (
    <motion.div
      data-testid={`step-${n}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex items-start gap-4 rounded-2xl border border-zinc-200/10 bg-white/5 p-6 backdrop-blur dark:bg-zinc-900/60 dark:border-white/10"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, ${accent}, ${accent}33 60%, transparent 60%)`,
          boxShadow: `0 6px 24px ${accent}55`,
        }}
      >
        <span className="font-semibold">{n}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 opacity-80" />
          <h4 className="text-lg font-semibold tracking-tight">{title}</h4>
        </div>
        <p className="text-sm leading-relaxed opacity-80">{desc}</p>
      </div>
    </motion.div>
  );

  // Mouse move handler updates transform only (no React state churn)
  const handleMouseMove = (e) => {
    const el = glowRef.current;
    if (!el) return;
    const size = 800; // px
    const x = e.clientX - size / 2;
    const y = e.clientY - size / 2;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <div
      style={{ ["--accent"]: accent }}
      className="relative min-h-screen text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle static background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent) 0%, transparent 60%)", opacity: 0.12 }}
        />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* GPU-friendly mouse-follow glow (behind everything) */}
      <div
        ref={glowRef}
        data-testid="global-glow"
        aria-hidden
        className="pointer-events-none fixed -z-10 h-[800px] w-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          left: 0,
          top: 0,
          background: "radial-gradient(closest-side, var(--accent), transparent 60%)",
          transform: "translate3d(-1000px, -1000px, 0)",
          willChange: "transform",
        }}
      />

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-zinc-950/40">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#" className="group inline-flex items-center gap-2">
            <div className="h-6 w-6 rounded-md" style={{ background: "linear-gradient(135deg, var(--accent), #1E1E1E)" }} />
            <span className="text-sm font-semibold tracking-tight md:text-base">LeChemin.tech</span>
          </a>

          <div className="flex items-center gap-2 md:gap-6">
            <a href="#devops" className="nav-link">Les Chemins</a>
            <a href="#mission" className="nav-link">Notre Mission</a>
            <a href="#contact" className="nav-link">Contact</a>

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

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 md:px-6">
          <motion.h1
            data-testid="hero-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-4xl font-black leading-tight tracking-tight md:text-6xl"
          >
            La boussole moderne pour les métiers tech
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-4 max-w-2xl text-pretty text-base leading-relaxed opacity-80 md:text-lg"
          >
            Des feuilles de route claires, des ressources sélectionnées et un guidage concret. Commencez dès maintenant par le parcours DevOps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#devops"
              className="group inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ background: `linear-gradient(180deg, var(--accent), #1746D1)`, boxShadow: `0 10px 30px ${accent}55`, color: "white" }}
            >
              Commencer le parcours DevOps
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>

            <a
              href="#mission"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/50 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/70 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
            >
              Notre mission
            </a>
          </motion.div>
        </div>
      </section>

      {/* CHEMINS (DevOps) */}
      <section id="chemins" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-16 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Parcours DevOps</h2>
            <span className="text-xs opacity-60">D'autres roadmaps arrivent</span>
          </div>

          <p className="-mt-4 mb-8 text-sm opacity-70">À venir : Cybersécurité, Frontend, Backend, Data Scientist, IA/ML.</p>
          <div id="devops" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map(({ title, desc, icon: Icon }, i) => (
              <motion.a
                key={title}
                href={`#${title.toLowerCase().replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-5 shadow-sm transition hover:shadow-xl dark:bg-zinc-900/60"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(120deg, transparent 0%, transparent 30%, var(--accent) 50%, transparent 70%, transparent 100%)",
                    maskImage: "linear-gradient(#000, #000)",
                    WebkitMaskImage: "linear-gradient(#000, #000)",
                    filter: "blur(12px)",
                  }}
                />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 shadow-sm dark:bg-zinc-950/60" style={{ boxShadow: `inset 0 0 0 1px ${accent}22` }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-sm opacity-80">{desc}</p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-medium opacity-80">
                  Explorer
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>

                <div aria-hidden className="absolute -bottom-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl opacity-0 transition group-hover:opacity-40" style={{ background: `radial-gradient(closest-side, var(--accent), transparent)` }} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="mission" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-16 md:px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Comment ça marche ?</h2>
            <p className="mt-2 max-w-2xl text-sm opacity-80">
              Nos "chemins" sont des feuilles de route visuelles et pragmatiques. Choisissez un métier,
              suivez les étapes, accédez à des ressources de qualité et avancez à votre rythme.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Step n={1} title="Choisir" desc="Sélectionnez le métier qui vous attire." Icon={Compass} />
            <Step n={2} title="Suivre" desc="Progressez étape par étape, sans flou." Icon={BookOpenCheck} />
            <Step n={3} title="Accéder aux ressources" desc="Guides, outils, communautés et opportunités." Icon={ExternalLink} />
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/50 p-6 dark:bg-zinc-900/60">
            <p className="text-pretty text-sm leading-relaxed opacity-90">
              <span className="font-semibold">Notre mission.</span> Rendre l’orientation et l’apprentissage tech simples, accessibles et fiables.
              Nous croyons aux parcours clairs, aux ressources vérifiées, et à l’exigence bienveillante : pour que chacun puisse trouver <em>son</em>
              chemin et construire une carrière qui a du sens.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contact" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-16 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--accent)] via-[var(--accent)]/70 to-zinc-900 p-8 text-white shadow-xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Une question ? Une collaboration ?</h3>
              <p className="mt-2 max-w-2xl text-sm/relaxed opacity-90">
                Écrivez-nous et rejoignez une communauté qui se construit autour d’un objectif simple : partager des chemins clairs pour apprendre la tech, ensemble.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:contact@lechemin.tech" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">Nous écrire</a>
                <a href="#chemins" className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">Voir les chemins</a>
              </div>
            </div>
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, white, transparent)" }} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md" style={{ background: "linear-gradient(135deg, var(--accent), #1E1E1E)" }} />
            <span className="text-sm font-semibold">LeChemin.tech</span>
          </div>
          <p className="text-center text-xs opacity-70 md:text-left">© 2024 LeChemin.tech — Une initiative pour rendre la connaissance accessible.</p>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition hover:bg-white/10" aria-label="LinkedIn" title="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition hover:bg-white/10" aria-label="Twitter" title="Twitter/X">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* tiny utility styles for nav links (keep in-file) */}
      <style>{`
        .nav-link { position: relative; font-size: 0.9rem; opacity: 0.85; }
        .nav-link:hover { opacity: 1; }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: right; transition: transform .2s ease; }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
      `}</style>

      {/**
       * Lightweight "tests" (smoke checks) — run in the browser console
       * These verify key elements exist and expected initial states.
       * Do not modify existing tests. New tests appended below.
       */}
      <script suppressHydrationWarning>{
        `
        (function runSmokeTests(){
          try {
            if (typeof document === 'undefined') return;
            const results = [];
            results.push(['hero-title-exists', !!document.querySelector('[data-testid=hero-title]')]);
            results.push(['steps-count-3', document.querySelectorAll('[data-testid^=step-]').length === 3]);
            results.push(['devops-anchor-exists', !!document.querySelector('#devops')]);
            results.push(['nav-links', ['#devops','#mission','#contact'].every(function(sel){ return !!document.querySelector('a[href="' + sel + '"]'); })]);
            results.push(['theme-toggle-exists', !!document.querySelector('button[aria-label="Basculer le thème"]')]);
            results.push(['cta-text-correct', (document.querySelector('a[href="#devops"]')||{}).textContent?.toLowerCase().includes('devops') === true]);
            // New tests
            results.push(['glow-exists', !!document.querySelector('[data-testid=global-glow]')]);
            results.push(['no-v1-chip', !/\bv1\b/i.test(document.body.textContent || '')]);
            results.push(['howitworks-exists', !!document.querySelector('#mission h2') && /Comment ça marche/i.test(document.querySelector('#mission h2').textContent||'') ]);

            const failed = results.filter(function(r){ return !r[1]; }).map(function(r){ return r[0]; });
            const ok = failed.length === 0;
            console[ ok ? 'log' : 'warn' ]('[LeChemin.tech smoke tests]', Object.fromEntries(results));
          } catch (e) {
            console.warn('[LeChemin.tech smoke tests] error', e);
          }
        })();
        `
      }</script>
    </div>
  );
}
