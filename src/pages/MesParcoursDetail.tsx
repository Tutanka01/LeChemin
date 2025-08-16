import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRoadmap, type SavedRoadmap } from '../api/roadmaps';
import { useAuth } from '../context/AuthContext';
import type { Competency } from '../types/skills';

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
          <h1 className="text-2xl font-bold tracking-tight">{item.payload.topic}</h1>
          <div className="mt-1 text-sm opacity-60">Créé le {new Date(item.created_at).toLocaleString()}</div>
          <p className="mt-3 opacity-80">{item.payload.profile_summary}</p>
          <p className="mt-1 text-sm opacity-70">Estimation: {item.payload.estimated_weeks} semaines</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {item.payload.competencies.map((c) => (<CompetencyCard key={c.id} competency={c} />))}
          </div>
          {item.payload.practice && item.payload.practice.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Exercices pratiques</h3>
              <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                {item.payload.practice.map((p) => (
                  <li key={p.id} className="rounded-xl border border-zinc-200/70 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-900/60">
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

function CompetencyCard({ competency }: { competency: Competency }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-5 transition-shadow hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60">
      <div className="absolute -inset-px -z-10 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, #22d3ee22, #818cf822)' }} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{competency.name}</h3>
          <p className="mt-1 text-sm opacity-80">{competency.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge level={competency.level} />
            <span className="text-xs opacity-60">{competency.outcomes.length} résultats</span>
          </div>
        </div>
        <button onClick={() => setOpen(v=>!v)} className="rounded-xl border border-zinc-200/70 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-white/10">{open ? 'Masquer' : 'Détails'}</button>
      </div>
      {open && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide opacity-70">Résultats attendus</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {competency.outcomes.map((o, i) => (<li key={i}>{o}</li>))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide opacity-70">Sous-compétences</div>
            <ul className="mt-1 space-y-2">
              {competency.subskills.map((s) => (
                <li key={s.id} className="rounded-xl border border-zinc-200/70 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="font-medium">{s.name}</div>
                  <div className="opacity-80">{s.why}</div>
                  {s.tips ? <div className="mt-1 text-xs opacity-70">Astuce: {s.tips}</div> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
