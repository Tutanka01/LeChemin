import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Linkedin, Twitter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isDark, setIsDark] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const glowRef = React.useRef<HTMLDivElement | null>(null);
  const accent = '#0052FF';
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  React.useEffect(() => { setOpen(false); }, [pathname]);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current; if (!el) return;
    const size = 300; const x = e.clientX - size/2; const y = e.clientY - size/2;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
  };

  const activeClass = ({ isActive }: { isActive: boolean }) => isActive ? 'nav-link opacity-100' : 'nav-link';

  return (
    <div
      style={{ ["--accent" as any]: accent } as React.CSSProperties}
      className="relative min-h-screen text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100"
      onMouseMove={onMouseMove}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, var(--accent) 0%, transparent 60%)', opacity: 0.08 }} />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div ref={glowRef} data-testid="global-glow" aria-hidden className="pointer-events-none fixed z-0 h-[300px] w-[300px] rounded-full opacity-30 blur-2xl" style={{ left: 0, top: 0, background: 'radial-gradient(closest-side, var(--accent), transparent 70%)', transform: 'translate3d(-150px, -150px, 0)', willChange: 'transform', mixBlendMode: 'screen' }} />

      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:py-4 md:px-6">
          <Link to="/" className="group inline-flex items-center gap-2" aria-label="Aller à l'accueil">
            <div className="h-7 w-7 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent), #1E1E1E)' }} />
            <span className="text-base font-semibold tracking-tight">LeChemin.tech</span>
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <NavLink to="/" className={activeClass} end>Accueil</NavLink>
            <NavLink to="/parcours" className={activeClass}>Parcours</NavLink>
            <a href="#contact" className="nav-link">Contact</a>
            {!user ? (
              <button onClick={() => navigate('/auth')} className="nav-link">Connexion</button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-80">{user.email}</span>
                <button onClick={() => signOut()} className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/60 px-3 py-1 text-xs transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">Déconnexion</button>
              </div>
            )}
            <button onClick={() => setIsDark(v => !v)} aria-label="Basculer le thème" title="Basculer le thème" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/60 transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsDark(v => !v)} aria-label="Basculer le thème" title="Basculer le thème" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/60 transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/50 p-2 text-zinc-900 transition hover:bg-white/70 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900" aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        <div id="mobile-menu" className={`md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-200`}>
          <div className="mx-auto max-w-7xl px-4 pb-4">
            <div className="rounded-2xl border border-white/10 bg-white/80 p-4 text-zinc-900 backdrop-blur dark:bg-zinc-900/80 dark:text-zinc-100">
              <NavLink to="/" className="block py-2 text-base font-medium" onClick={() => setOpen(false)} end>Accueil</NavLink>
              <NavLink to="/parcours" className="block py-2 text-base font-medium" onClick={() => setOpen(false)}>Parcours</NavLink>
              <a href="#contact" className="block py-2 text-base font-medium" onClick={() => setOpen(false)}>Contact</a>
              {!user ? (
                <button onClick={() => { setOpen(false); navigate('/auth'); }} className="mt-2 w-full rounded-xl border border-white/10 bg-white/60 px-4 py-2 text-sm font-semibold transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">Connexion</button>
              ) : (
                <button onClick={() => { setOpen(false); signOut(); }} className="mt-2 w-full rounded-xl border border-white/10 bg-white/60 px-4 py-2 text-sm font-semibold transition hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">Déconnexion</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer id="contact" className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md" style={{ background: 'linear-gradient(135deg, var(--accent), #1E1E1E)' }} />
            <span className="text-sm font-semibold">LeChemin.tech</span>
          </div>
          <p className="text-center text-xs opacity-70 md:text-left">© {new Date().getFullYear()} LeChemin.tech — Une initiative pour rendre la connaissance accessible.</p>
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

      <style>{`
        .nav-link { position: relative; font-size: 0.9rem; opacity: 0.85; }
        .nav-link:hover { opacity: 1; }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: right; transition: transform .2s ease; }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
      `}</style>
    </div>
  );
}
