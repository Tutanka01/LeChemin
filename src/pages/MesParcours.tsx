import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { listMyRoadmaps, type SavedRoadmap } from '../api/roadmaps';
import { useAuth } from '../context/AuthContext';

export default function MesParcours() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedRoadmap[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/auth?next=' + encodeURIComponent('/mes-parcours'), { replace: true }); return; }
    (async () => {
      const res = await listMyRoadmaps();
      if (Array.isArray(res)) setItems(res);
      else setErr(res.error);
    })();
  }, [user, loading, navigate]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Helmet>
        <title>Mes parcours | LeChemin.tech</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Mes parcours</h1>
        <Link to="/parcours/personnalise" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Créer un nouveau</Link>
      </div>
      {!user || loading ? (
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">Chargement…</div>
      ) : err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{err}</div>
      ) : items && items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 text-center text-sm opacity-80 dark:border-white/10 dark:bg-zinc-900/60">
          Aucun parcours enregistré pour le moment.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items?.map((it) => (
            <li key={it.id} className="rounded-2xl border border-zinc-200/70 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/60">
              <div className="text-xs opacity-60">{new Date(it.created_at).toLocaleString()}</div>
              <div className="mt-1 text-lg font-semibold">{it.payload?.topic || it.topic}</div>
              <div className="mt-1 text-sm opacity-80 line-clamp-2">{it.payload?.profile_summary}</div>
              <div className="mt-3">
                <Link to={`/mes-parcours/${it.id}`} className="rounded-xl border border-zinc-200/70 bg-white px-3 py-1.5 text-xs dark:border-white/10 dark:bg-zinc-900/60">Ouvrir</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
