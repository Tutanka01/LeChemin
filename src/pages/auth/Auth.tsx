import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AuthPage() {
  const { signIn, signUp, signInWithGithub, signInWithGoogle } = useAuth() as any;
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  // Si on arrive ici avec un état de redirection après inscription, afficher le message et forcer le mode login
  useEffect(() => {
    const st = location.state as any;
    if (st?.registered) {
      setMode('login');
      setInfo("Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte.");
      // Nettoyer l'état d'historique pour éviter de réafficher le message en revenant en arrière
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const action = mode === 'login' ? signIn : signUp;
    const { error } = await action(email, password);
    setLoading(false);
    if (error) setError(error);
    else {
      if (mode === 'login') {
        // Attendre que la session se mette à jour côté client
        setTimeout(() => navigate('/parcours'), 50);
      } else {
        // Après inscription: informer et rediriger vers la page de login
        setEmail('');
        setPassword('');
        setMode('login');
        navigate('/auth', { replace: true, state: { registered: true } });
      }
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
        <Helmet>
          <title>{mode === 'login' ? 'Connexion' : 'Créer un compte'} | LeChemin.tech</title>
          <meta name="robots" content="noindex,nofollow" />
          <link rel="canonical" href="https://lechemin.tech/auth" />
        </Helmet>
        {info && (
          <div className="mb-4 rounded-lg bg-blue-500/15 px-3 py-2 text-sm text-blue-300 ring-1 ring-blue-500/30">
            {info}
          </div>
        )}
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
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-zinc-950/70" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Mot de passe</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-zinc-950/70" />
          </div>
          {error && <div className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">{error}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Traitement…' : (mode === 'login' ? 'Se connecter' : "S'enregistrer")}</button>
        </form>
        <div className="my-4 flex items-center gap-3 opacity-60">
          <div className="h-px flex-1 bg-current" />
          <span className="text-xs">ou</span>
          <div className="h-px flex-1 bg-current" />
        </div>
  <button onClick={() => signInWithGithub()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false" className="opacity-80"><path fill="currentColor" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.69-1.29-3.69-1.29-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.09.08 1.67 1.12 1.67 1.12.98 1.67 2.58 1.19 3.21.91.1-.71.38-1.19.68-1.46-2.43-.28-4.98-1.22-4.98-5.43 0-1.2.43-2.18 1.12-2.95-.11-.28-.48-1.41.11-2.93 0 0 .91-.29 2.98 1.13a10.3 10.3 0 0 1 5.43 0c2.07-1.42 2.98-1.13 2.98-1.13.59 1.52.22 2.65.11 2.93.69.77 1.12 1.75 1.12 2.95 0 4.22-2.56 5.15-5 5.43.39.34.73 1 .73 2.03 0 1.46-.01 2.64-.01 3 0 .29.2.64.76.53A10.52 10.52 0 0 0 23 11.5C23 5.24 18.27.5 12 .5z"/></svg>
          Continuer avec GitHub
        </button>
        <div className="mt-2" />
  <button onClick={() => signInWithGoogle()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16" className="opacity-80" aria-hidden focusable="false"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.602,31.912,29.278,35,24,35c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,5.053,28.983,3,24,3C12.955,3,4,11.955,4,23s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,5.053,28.983,3,24,3C16.318,3,9.656,7.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,43c5.207,0,9.8-1.988,13.292-5.229l-6.146-5.2C29.877,33.091,27.104,34,24,34c-5.259,0-9.566-3.105-11.189-7.409l-6.561,5.054C9.646,40.556,16.226,43,24,43z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.627,4.088-5.951,7-11.303,7c-5.259,0-9.566-3.105-11.189-7.409l-6.561,5.054C9.646,40.556,16.226,43,24,43c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Continuer avec Google
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
