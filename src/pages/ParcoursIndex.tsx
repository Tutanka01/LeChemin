import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Shield, ServerCog, Zap, Mail, ArrowRight, Hourglass, Sparkles } from 'lucide-react';
import { addToWaitlist } from '../api/waitlist';

type TrackStatus = 'available' | 'waitlist' | 'coming-soon';

interface TrackCard {
  id: string;
  name: string;
  description: string;
  status: TrackStatus;
  color: string; // hex for accents
  accentFrom: string; // gradient start
  accentTo: string; // gradient end
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string; // when available
  tag?: string; // small badge
}

export default function ParcoursIndex() {
  const navigate = useNavigate();
  // Simple modal state for waitlist
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Backward-compat: if someone hits /parcours#step, redirect to devops with hash preserved
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && /#[a-z0-9-]+$/i.test(hash)) {
      // Known ids are in devops for now; redirect there
      navigate(`/parcours/devops${hash}`, { replace: true });
    }
  }, [navigate]);

  const tracks = useMemo<TrackCard[]>(() => ([
    {
      id: 'devops',
      name: 'DevOps',
      description: "Un parcours structuré pour maîtriser Linux, Git, Docker, Kubernetes, Cloud, CI/CD et Sécurité.",
      status: 'available',
      color: '#3B82F6',
      accentFrom: '#3B82F6',
      accentTo: '#8B5CF6',
      icon: ServerCog,
      href: '/parcours/devops',
      tag: 'Disponible',
    },
    {
      id: 'cyber',
      name: 'Cybersécurité',
      description: "Découverte des fondamentaux, durcissement, SOC, détection d'incidents, et bonnes pratiques modernes.",
      status: 'waitlist',
      color: '#10B981',
      accentFrom: '#10B981',
      accentTo: '#06B6D4',
      icon: Shield,
      tag: 'Waitlist',
    },
  ]), []);

  async function submitWaitlist(topic: string) {
    try {
      setLoading(true); setMessage(null);
      const res = await addToWaitlist(email, topic as any);
      if (res?.ok) {
        setMessage('Merci ! Vous êtes sur liste d\'attente.');
      }
    } catch (e: any) {
      setMessage(e?.message || "Impossible d\'enregistrer pour le moment.");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <Helmet>
        <title>Parcours | Catalogue des formations | LeChemin.tech</title>
        <meta name="description" content="Parcourez les parcours disponibles (DevOps) et rejoignez la waitlist pour les prochains (Cybersécurité)." />
        <link rel="canonical" href="https://lechemin.tech/parcours" />
        <meta property="og:title" content="Parcours | LeChemin.tech" />
        <meta property="og:description" content="Tous les parcours — Accédez au parcours DevOps ou rejoignez la waitlist pour la Cybersécurité." />
        <meta property="og:url" content="https://lechemin.tech/parcours" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Zap className="h-4 w-4" /> Parcours
            </div>
            <h1 className="mb-3 text-4xl font-black tracking-tight md:text-5xl">Choisissez votre parcours</h1>
            <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">
              Commencez à apprendre dès aujourd'hui. Gratuit, en français, structuré pour progresser.
            </p>
            <div className="mt-4">
              <Link to="/parcours/personnalise" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20">
                Créer un parcours personnalisé
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative pb-20 pt-2">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tracks.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group relative rounded-3xl border border-zinc-200/70 bg-white p-6 backdrop-blur transition hover:shadow-2xl dark:border-white/10 dark:bg-zinc-900/60 sm:p-8"
                style={{ boxShadow: `0 8px 30px ${t.color}14`, willChange: 'transform' }}
              >
                <div aria-hidden className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${t.accentFrom}22, ${t.accentTo}22)` }} />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ backgroundColor: `${t.color}1A` }}>
                        {React.createElement(t.icon, { className: 'h-6 w-6', style: { color: t.color } })}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">{t.name}</h3>
                        <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">{t.tag}</div>
                      </div>
                    </div>
                    {t.status === 'available' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-600 ring-1 ring-green-500/30 dark:text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-300">
                        <Hourglass className="h-3.5 w-3.5" /> Waitlist
                      </span>
                    )}
                  </div>

                  <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{t.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-zinc-200/70 dark:bg-white/5 dark:ring-white/10"><Clock className="h-3 w-3" />Parcours structuré</div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 ring-1 ring-zinc-200/70 dark:bg-white/5 dark:ring-white/10">Ressources ouvertes</div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    {t.status === 'available' ? (
                      <Link to={t.href!} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                        Commencer le parcours <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <button onClick={() => { setOpenTopic(t.id); setMessage(null); }} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20">
                        Être notifié <Mail className="h-4 w-4" />
                      </button>
                    )}

                    <div className="text-xs opacity-70">Gratuit • Ressources triées</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist modal */}
      {openTopic && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center p-4">
          <div aria-hidden className="absolute inset-0 bg-black/40" onClick={() => setOpenTopic(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-zinc-900/70 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
              <div>
        <h3 className="text-lg font-bold tracking-tight">Être notifié — {openTopic === 'cyber' ? 'Cybersécurité' : openTopic}</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Recevez un email dès l'ouverture. Aucune publicité.</p>
              </div>
            </div>
            {message && (
              <div className="mb-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700 ring-1 ring-green-500/20 dark:bg-green-500/15 dark:text-green-300 dark:ring-green-500/30">{message}</div>
            )}
            <label className="block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="vous@exemple.com"
              className="mt-1 w-full rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm outline-none ring-blue-500/0 transition focus:ring-2 dark:border-white/10 dark:bg-zinc-900/60"
            />
            <div className="mt-4 flex items-center justify-between">
              <button onClick={() => setOpenTopic(null)} className="rounded-xl px-3 py-1.5 text-sm opacity-80 hover:opacity-100">Annuler</button>
              <button
                disabled={loading || !email}
                onClick={() => submitWaitlist(openTopic)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Envoi…' : 'M\'avertir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bandeau distinct: créer son parcours perso */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-cyan-500/10 p-6 text-center backdrop-blur dark:border-white/10 dark:from-purple-500/10 dark:via-white/5 dark:to-cyan-500/10">
            <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-500/20 dark:bg-white/10 dark:text-white/80 dark:ring-white/15">
              <Sparkles className="h-3.5 w-3.5" /> Nouveau
            </div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Vous ne trouvez pas exactement ce qu’il vous faut ?</h2>
            <p className="mx-auto mt-1 max-w-2xl text-sm opacity-80">Créez votre propre parcours personnalisé avec un quiz intelligent. Une roadmap basée sur des compétences, adaptée à votre niveau.</p>
            <div className="mt-4 flex justify-center">
              <Link to="/parcours/personnalise" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700">
                Créer mon parcours <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb footer CTA */}
      <div className="pb-12 text-center text-sm opacity-70">
        <Link to="/" className="underline-offset-4 hover:underline">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
