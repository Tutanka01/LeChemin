import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet-async';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [message, setMessage] = useState<string>('Finalisation de la connexion…');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = search.get('next') || '/parcours';
        const hasCode = typeof window !== 'undefined' && window.location.search.includes('code=');
        const hasHashToken = typeof window !== 'undefined' && window.location.hash.includes('access_token=');

        if (hasCode) {
          // OAuth (GitHub/Google) — échange du code PKCE contre une session
          await supabase.auth.exchangeCodeForSession(window.location.search);
        } else if (hasHashToken) {
          // Lien de confirmation email/magic link — parse le fragment et crée la session
          const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
          const access_token = params.get('access_token') ?? undefined;
          const refresh_token = params.get('refresh_token') ?? undefined;
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            // Nettoyer le hash pour éviter re-traitement
            history.replaceState(null, '', window.location.pathname + window.location.search);
          } else {
            throw new Error('Jetons manquants dans le lien de confirmation.');
          }
        }

        if (!cancelled) navigate(next, { replace: true });
      } catch (e: any) {
        console.error('Auth callback error:', e);
        if (!cancelled) setMessage("Impossible de finaliser la connexion. Réessayez.");
      }
    })();
    return () => { cancelled = true; };
  }, [navigate, search]);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Helmet>
        <title>Connexion en cours… | LeChemin.tech</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
        <div className="text-sm opacity-80">{message}</div>
      </div>
    </div>
  );
}
