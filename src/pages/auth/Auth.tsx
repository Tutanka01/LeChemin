import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AuthPage() {
  const { signIn, signUp, signInWithGithub } = useAuth() as any;
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const action = mode === 'login' ? signIn : signUp;
    const { error } = await action(email, password);
    setLoading(false);
    if (error) setError(error);
    else {
      // Attendre que la session se mette à jour côté client
      setTimeout(() => navigate('/parcours'), 50);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/60 p-6 backdrop-blur dark:bg-zinc-900/60">
        {!isSupabaseConfigured() && (
          <div className="mb-4 rounded-lg bg-yellow-500/15 px-3 py-2 text-sm text-yellow-300 ring-1 ring-yellow-500/30">
            Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local puis relancez le serveur.
          </div>
        )}
        <h1 className="mb-2 text-2xl font-bold">{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
        <p className="mb-6 text-sm opacity-70">Par e-mail et mot de passe</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm outline-none dark:bg-zinc-950/70" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Mot de passe</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm outline-none dark:bg-zinc-950/70" />
          </div>
          {error && <div className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">{error}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Traitement…' : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}</button>
        </form>
        <div className="my-4 flex items-center gap-3 opacity-60">
          <div className="h-px flex-1 bg-current" />
          <span className="text-xs">ou</span>
          <div className="h-px flex-1 bg-current" />
        </div>
        <button onClick={() => signInWithGithub()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/70 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false" className="opacity-80"><path fill="currentColor" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.69-1.29-3.69-1.29-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.09.08 1.67 1.12 1.67 1.12.98 1.67 2.58 1.19 3.21.91.1-.71.38-1.19.68-1.46-2.43-.28-4.98-1.22-4.98-5.43 0-1.2.43-2.18 1.12-2.95-.11-.28-.48-1.41.11-2.93 0 0 .91-.29 2.98 1.13a10.3 10.3 0 0 1 5.43 0c2.07-1.42 2.98-1.13 2.98-1.13.59 1.52.22 2.65.11 2.93.69.77 1.12 1.75 1.12 2.95 0 4.22-2.56 5.15-5 5.43.39.34.73 1 .73 2.03 0 1.46-.01 2.64-.01 3 0 .29.2.64.76.53A10.52 10.52 0 0 0 23 11.5C23 5.24 18.27.5 12 .5z"/></svg>
          Continuer avec GitHub
        </button>
        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <button className="underline" onClick={()=>setMode('register')}>Pas de compte ? Inscription</button>
          ) : (
            <button className="underline" onClick={()=>setMode('login')}>Déjà inscrit ? Connexion</button>
          )}
        </div>
      </div>
    </div>
  );
}
