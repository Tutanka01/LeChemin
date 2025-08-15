import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AuthPage() {
  const { signIn, signUp } = useAuth() as any;
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
