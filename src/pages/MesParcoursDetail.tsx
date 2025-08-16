import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRoadmap, type SavedRoadmap } from '../api/roadmaps';
import { useAuth } from '../context/AuthContext';
import type { Competency } from '../types/skills';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock3, ChevronDown, Check } from 'lucide-react';

export default function MesParcoursDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [item, setItem] = useState<SavedRoadmap | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/auth?next=' + encodeURIComponent(`/mes-parcours/${id}`), { replace: true }); return; }
    (async () => {
      if (!id) return;
      const res = await getRoadmap(id);
      if (!res) { setNotFound(true); return; }
      if ('error' in res) setErr(res.error); else setItem(res);
    })();
  }, [user, loading, id, navigate]);

  const title = item?.payload?.topic || item?.topic || 'Mon parcours';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <Helmet>
        <title>{title} | Mes parcours | LeChemin.tech</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <nav className="mb-6 text-sm opacity-80 flex gap-3 flex-wrap">
        <Link to="/mes-parcours" className="underline-offset-4 hover:underline">← Mes parcours</Link>
        <Link to="/parcours" className="underline-offset-4 hover:underline">Tous les parcours</Link>
      </nav>
      {!user || loading ? (
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">Chargement…</div>
      ) : notFound ? (
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">
          Introuvable ou vous n’y avez pas accès.
        </div>
      ) : err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{err}</div>
      ) : !item ? null : (
        <div>
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white dark:border-white/10 dark:bg-zinc-900">
            <div aria-hidden className="absolute inset-0 opacity-70" style={{background:'radial-gradient(1200px 500px at 20% -10%, rgba(0,82,255,.18), transparent 60%), radial-gradient(800px 400px at 100% 0%, rgba(124,58,237,.18), transparent 60%)'}} />
            <div className="relative p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 dark:text-blue-200">Parcours enregistré <Sparkles className="h-3.5 w-3.5"/></div>
              <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{item.payload.topic}</h1>
              <div className="mt-1 text-xs opacity-70">Créé le {new Date(item.created_at).toLocaleString()}</div>
              <p className="mt-3 max-w-3xl text-sm opacity-85 md:text-base">{item.payload.profile_summary}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur dark:bg-white/5"><Clock3 className="h-4 w-4"/> {item.payload.estimated_weeks} semaines</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <ol className="relative ml-3 border-l border-zinc-200/70 dark:border-white/10">
              <AnimatePresence initial={true}>
                {item.payload.competencies.map((c, idx) => (
                  <motion.li key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: idx * 0.04 }} className="relative -ml-3 mb-4 pl-6">
                    <span className="absolute -left-3 top-2 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-white shadow ring-4 ring-white dark:ring-zinc-950">{idx+1}</span>
                    <TimelineCard competency={c} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </div>

          {item.payload.practice && item.payload.practice.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold">Exercices pratiques</h3>
              <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {item.payload.practice.map((p) => (
                  <li key={p.id} className="rounded-2xl border border-zinc-200/70 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-900/60">
                    <div className="font-semibold">{p.title}</div>
                    <div className="opacity-80">{p.description}</div>
                    {p.est_hours ? <div className="mt-1 text-xs opacity-60">~{p.est_hours}h</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Badge({ level }: { level: Competency['level'] }) {
  const map = {
    debutant: 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-300',
    intermediaire: 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-300',
    avance: 'bg-purple-500/15 text-purple-600 ring-1 ring-purple-500/30 dark:text-purple-300'
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[level]}`}>{level}</span>;
}

function TimelineCard({ competency }: { competency: Competency }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{competency.name}</h3>
            <Badge level={competency.level} />
          </div>
          <p className="mt-1 text-sm opacity-80">{competency.description}</p>
          <div className="mt-2 text-xs opacity-60">{competency.outcomes.length} résultats attendus</div>
        </div>
        <button onClick={() => setOpen(v=>!v)} className="inline-flex items-center gap-1 rounded-xl border border-zinc-200/70 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-white/10">
          {open ? <><Check className="h-3.5 w-3.5"/> Masquer</> : <><ChevronDown className="h-3.5 w-3.5"/> Détails</>}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="border-t border-zinc-200/70 p-4 text-sm dark:border-white/10">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide opacity-70">Résultats attendus</div>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {competency.outcomes.map((o, i) => (<li key={i}>{o}</li>))}
              </ul>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wide opacity-70">Sous-compétences</div>
              <ul className="mt-1 space-y-2">
                {competency.subskills.map((s) => (
                  <li key={s.id} className="rounded-xl border border-zinc-200/70 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/40">
                    <div className="font-medium">{s.name}</div>
                    <div className="opacity-80">{s.why}</div>
                    {s.tips ? <div className="mt-1 text-xs opacity-70">Astuce: {s.tips}</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
