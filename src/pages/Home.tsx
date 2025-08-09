// LeChemin.tech — Page d'accueil
// Homepage avec navigation vers les parcours

import React from "react";
import { motion } from "framer-motion";
import {
  ServerCog,
  ChevronRight,
  Compass,
  BookOpenCheck,
  ExternalLink,
  Linkedin,
  Twitter,
} from "lucide-react";

interface HomeProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onNavigateToParcours: () => void;
  glowRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  accent: string;
}

export default function Home({ onNavigateToParcours, glowRef, handleMouseMove, accent }: HomeProps) {
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
   */
  const Step = ({ n, title, desc, Icon }: { n: number; title: string; desc: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) => (
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

  return (
    <div
      style={{ ["--accent" as string]: accent }}
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
        className="pointer-events-none fixed z-0 h-[300px] w-[300px] rounded-full opacity-50 blur-2xl"
        style={{
          left: 0,
          top: 0,
          background: "radial-gradient(closest-side, var(--accent), transparent 70%)",
          transform: "translate3d(-150px, -150px, 0)",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />

      {/* HERO */}
      <section className="relative pt-20">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-24 md:px-6">
          <motion.h1
            data-testid="hero-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl md:text-6xl"
          >
            La boussole moderne pour les métiers tech
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed opacity-80 sm:max-w-2xl md:text-lg"
          >
            Des feuilles de route claires, des ressources sélectionnées et un guidage concret. Commencez dès maintenant par le parcours DevOps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <button
              onClick={onNavigateToParcours}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)] sm:w-auto"
              style={{ background: `linear-gradient(180deg, var(--accent), #1746D1)`, boxShadow: `0 10px 30px ${accent}55`, color: "white" }}
            >
              Commencer le parcours DevOps
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <a
              href="#mission"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/60 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 sm:w-auto"
            >
              Notre mission
            </a>
          </motion.div>
        </div>
      </section>

      {/* CHEMINS (DevOps) */}
      <section id="chemins" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-16 md:px-6">
          <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Parcours disponibles</h2>
            <span className="text-xs opacity-60">D'autres roadmaps arrivent</span>
          </div>

            <p className="-mt-2 mb-6 text-xs opacity-70 sm:text-sm">À venir : Cybersécurité, Frontend, Backend, Data Scientist, IA/ML.</p>

          {/* Mobile horizontal scroll */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:hidden px-4">
            {paths.map(({ title, desc, icon: Icon }, i) => (
              <motion.button
                key={title}
                onClick={onNavigateToParcours}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative min-w-[240px] snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/70 p-4 text-left shadow-sm transition hover:shadow-xl dark:bg-zinc-900/60"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 shadow-sm dark:bg-zinc-950/60" style={{ boxShadow: `inset 0 0 0 1px ${accent}22` }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed opacity-80">{desc}</p>
                  </div>
                </div>
                <div className="relative z-10 mt-5 flex items-center gap-2 text-xs font-medium opacity-80">
                  Explorer
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Desktop / tablet grid */}
          <div className="hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-3">
            {paths.map(({ title, desc, icon: Icon }, i) => (
              <motion.button
                key={title}
                onClick={onNavigateToParcours}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-5 text-left shadow-sm transition hover:shadow-xl dark:bg-zinc-900/60"
              >
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
                  Explorer le parcours
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </motion.button>
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
              <span className="font-semibold">Notre mission.</span> Rendre l'orientation et l'apprentissage tech simples, accessibles et fiables.
              Nous croyons aux parcours clairs, aux ressources vérifiées, et à l'exigence bienveillante : pour que chacun puisse trouver <em>son</em>
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
                Écrivez-nous et rejoignez une communauté qui se construit autour d'un objectif simple : partager des chemins clairs pour apprendre la tech, ensemble.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:mohamad@makhal.fr" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">Nous écrire</a>
                <button onClick={onNavigateToParcours} className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">Voir les parcours</button>
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
          <p className="text-center text-xs opacity-70 md:text-left">© 2025 LeChemin.tech — Une initiative pour rendre la connaissance accessible.</p>
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
    </div>
  );
}
