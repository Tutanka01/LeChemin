// LeChemin.tech — Page d'accueil (MPA)
// Homepage avec navigation vers les parcours

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ServerCog, ChevronRight, Compass, BookOpenCheck, ExternalLink, Bell } from "lucide-react";
import { addToWaitlist } from '../api/waitlist';

export default function Home() {
  const { user } = useAuth();
  const accent = '#0052FF';
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
      // Sections spécifiques à la page (le fond + header/footer sont dans Layout)
      <>
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
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 sm:max-w-2xl md:text-lg dark:text-zinc-300"
          >
            Des feuilles de route claires, des ressources sélectionnées et un guidage concret. Commencez dès maintenant par le parcours DevOps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Link
              to="/parcours"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)] sm:w-auto"
              style={{ background: `linear-gradient(180deg, var(--accent), #1746D1)`, boxShadow: `0 10px 30px ${accent}55`, color: "white" }}
            >
              Commencer le parcours DevOps
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>

            <a
              href="#mission"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/70 bg-white px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 sm:w-auto"
            >
              Notre mission
            </a>
          </motion.div>

          {!user && (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              <Link
                to="/auth"
                className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Créer un compte gratuit
              </Link>
              <span className="mx-1">·</span>
              <Link
                to="/auth"
                className="hover:underline underline-offset-4"
              >
                Se connecter
              </Link>
              <span className="ml-2 opacity-75">pour sauvegarder vos progrès</span>
            </div>
          )}

          {/* Le CTA waitlist est déplacé sous la section Parcours (ci-dessous) */}
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
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative min-w-[240px] snap-start overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-50 shadow-sm ring-1 ring-zinc-200/70 dark:bg-zinc-950/60 dark:ring-0" style={{ boxShadow: `inset 0 0 0 1px ${accent}22` }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed opacity-80">{desc}</p>
                  </div>
                </div>
                <Link to="/parcours" className="relative z-10 mt-5 inline-flex items-center gap-2 text-xs font-medium opacity-80">
                  Explorer <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            ))}
            {/* Carte waitlist (mobile) */}
            <WaitlistCard variant="mobile" />
          </div>

          {/* Desktop / tablet grid */}
          <div className="hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-3">
            {paths.map(({ title, desc, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-5 text-left shadow-sm transition hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-50 shadow-sm ring-1 ring-zinc-200/70 dark:bg-zinc-950/60 dark:ring-0" style={{ boxShadow: `inset 0 0 0 1px ${accent}22` }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-sm opacity-80">{desc}</p>
                  </div>
                </div>
                <Link to="/parcours" className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-medium opacity-80">
                  Explorer le parcours <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            ))}
            {/* Carte waitlist (desktop/tablette) */}
            <WaitlistCard variant="desktop" />
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

          <div className="mt-12 rounded-3xl border border-zinc-200/70 bg-white p-6 dark:border-white/10 dark:bg-zinc-900/60">
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
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-gradient-to-br from-[var(--accent)] via-[var(--accent)]/80 to-zinc-700 p-8 text-white shadow-xl dark:border-white/10 dark:to-zinc-900">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Une question ? Une collaboration ?</h3>
              <p className="mt-2 max-w-2xl text-sm/relaxed opacity-90">
                Écrivez-nous et rejoignez une communauté qui se construit autour d'un objectif simple : partager des chemins clairs pour apprendre la tech, ensemble.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:mohamad@makhal.fr" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">Nous écrire</a>
        <Link to="/parcours" className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">Voir les parcours</Link>
              </div>
            </div>
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, white, transparent)" }} />
          </div>
        </div>
      </section>
    </>
  );
}

// --- Components ---
function WaitlistCard({ variant }: { variant: 'mobile' | 'desktop' }) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [hp, setHp] = React.useState(''); // honeypot

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return;
    setStatus('loading');
    try {
      await addToWaitlist(email, 'cyber');
      setStatus('ok');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
    }
  };

  const isMobile = variant === 'mobile';
  const outerCls = isMobile
    ? 'group relative min-w-[240px] snap-start overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-4 text-left shadow-sm transition hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60'
    : 'group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-5 text-left shadow-sm transition hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: 0.06 }}
      className={outerCls}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-200 dark:bg-blue-600/15 dark:text-blue-300 dark:ring-blue-500/25">
          <Bell className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">Cybersécurité</h3>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200 dark:bg-white/10 dark:text-white/80 dark:ring-white/20">Bientôt</span>
          </div>
          <p className="mt-1 text-sm opacity-80">Recevez une notification à l'ouverture du parcours.</p>
          {!open && status !== 'ok' && (
            <button type="button" onClick={() => setOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-200 dark:hover:bg-blue-600/20">
              Prévenez-moi
            </button>
          )}
          {(open || status === 'ok') && (
            <form onSubmit={onSubmit} className="mt-3 space-y-2">
              {/* Honeypot */}
              <input type="text" value={hp} onChange={e=>setHp(e.target.value)} className="hidden" tabIndex={-1} aria-hidden="true" />
              <label htmlFor={`wl-${variant}`} className="sr-only">Email</label>
              <input
                id={`wl-${variant}`}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="votre@email.com"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-zinc-950/60"
              />
              <div className="flex items-center gap-2">
                <button disabled={status==='loading'} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">{status==='loading' ? 'Envoi…' : 'S’inscrire'}</button>
                {status==='ok' && <span className="text-xs text-green-300">C’est noté !</span>}
                {status==='error' && <span className="text-xs text-yellow-300">Vérifiez votre email.</span>}
              </div>
              <div className="text-[10px] opacity-60">Email utilisé uniquement pour cette alerte. Aucune pub.</div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
