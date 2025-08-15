import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Linkedin, Twitter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  // Initialise à partir de la classe HTML (définie tôt dans index.html) pour éviter le FOUC
  const [isDark, setIsDark] = React.useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  );
  const [open, setOpen] = React.useState(false);
  const glowRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const accent = '#0052FF';
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
    // Met à jour la couleur de la barre système mobile
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0a0a0b' : '#ffffff');
  }, [isDark]);

  React.useEffect(() => { setOpen(false); }, [pathname]);

  // Mesure dynamique de la hauteur du header pour caler le menu mobile
  React.useEffect(() => {
    const updateHeaderVar = () => {
      const h = headerRef.current?.offsetHeight ?? 60;
      document.documentElement.style.setProperty('--header-bottom', `${h}px`);
    };
    updateHeaderVar();
    window.addEventListener('resize', updateHeaderVar);
    window.addEventListener('orientationchange', updateHeaderVar);
    return () => {
      window.removeEventListener('resize', updateHeaderVar);
      window.removeEventListener('orientationchange', updateHeaderVar);
    };
  }, []);

  // Accentue le verre du header et calcule la progression de lecture au scroll
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        setIsScrolled(y > 8);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current; if (!el) return;
    const size = 300; const x = e.clientX - size/2; const y = e.clientY - size/2;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
  };

  const activeClass = ({ isActive }: { isActive: boolean }) => isActive ? 'nav-link opacity-100' : 'nav-link';

  return (
    <div
      style={{ ["--accent" as any]: accent } as React.CSSProperties}
      className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100"
      onMouseMove={onMouseMove}
    >
      {/* Mesh global léger (atténué en dark) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mesh-bg" />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, var(--accent) 0%, transparent 60%)', opacity: 0.08 }} />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

  <div ref={glowRef} data-testid="global-glow" aria-hidden className="pointer-events-none fixed z-[1] h-[300px] w-[300px] rounded-full opacity-30 blur-2xl" style={{ left: 0, top: 0, background: 'radial-gradient(closest-side, var(--accent), transparent 70%)', transform: 'translate3d(-150px, -150px, 0)', willChange: 'transform', mixBlendMode: 'screen' }} />

      <header
        ref={headerRef}
        className={`sticky sticky-header top-0 z-50 border-b supports-[backdrop-filter]:bg-white/70 transition-all relative ${
          isScrolled
            ? 'scrolled border-zinc-200/80 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] dark:border-white/10 dark:bg-zinc-950/70 dark:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]'
            : 'border-zinc-200/70 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60'
        }`}
      >
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
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-200 dark:hover:bg-blue-600/20"
              >
                Connexion
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-80">{user.email}</span>
                <button onClick={() => signOut()} className="inline-flex items-center justify-center rounded-xl border border-zinc-200/70 bg-white px-3 py-1 text-xs transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">Déconnexion</button>
              </div>
            )}
            <button onClick={() => setIsDark(v => !v)} aria-label="Basculer le thème" title="Basculer le thème" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/70 bg-white transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsDark(v => !v)} aria-label="Basculer le thème" title="Basculer le thème" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/70 bg-white transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-xl border border-zinc-200/70 bg-white p-2 text-zinc-900 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900" aria-label="Ouvrir le menu" aria-controls="mobile-menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        <div
          id="mobile-menu"
          className={`md:hidden fixed inset-x-0 top-[var(--header-bottom,56px)] z-50 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-200`}
          style={{
            // Fallback si la var CSS n'est pas définie (approx hauteur header mobile)
            // La valeur exacte est ~56-64px selon padding. On ajuste à 60.
            // Défini dynamiquement ci-dessous via style tag.
          } as React.CSSProperties}
        >
          <div className={`absolute inset-0 ${open ? 'bg-black/30' : 'bg-transparent'}`} aria-hidden onClick={() => setOpen(false)} />
          <div className="relative mx-auto max-w-7xl px-4 pb-4">
            <div className="mt-2 rounded-2xl border border-zinc-200/70 bg-white/90 p-4 text-zinc-900 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/85 dark:text-zinc-100">
              <NavLink to="/" className="block py-2 text-base font-medium" onClick={() => setOpen(false)} end>Accueil</NavLink>
              <NavLink to="/parcours" className="block py-2 text-base font-medium" onClick={() => setOpen(false)}>Parcours</NavLink>
              <a href="#contact" className="block py-2 text-base font-medium" onClick={() => setOpen(false)}>Contact</a>
              {!user ? (
                <button onClick={() => { setOpen(false); navigate('/auth'); }} className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-200 dark:hover:bg-blue-600/20">Connexion</button>
              ) : (
                <button onClick={() => { setOpen(false); signOut(); }} className="mt-2 w-full rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">Déconnexion</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

  <footer id="contact" className="border-t border-zinc-200/70 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md" style={{ background: 'linear-gradient(135deg, var(--accent), #1E1E1E)' }} />
            <span className="text-sm font-semibold">LeChemin.tech</span>
          </div>
          <p className="text-center text-xs opacity-70 md:text-left">© {new Date().getFullYear()} LeChemin.tech — Une initiative pour rendre la connaissance accessible.</p>
          <div className="flex items-center gap-3">
    <a href="https://www.linkedin.com/in/mohamad-el-akhal/" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/70 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10" aria-label="LinkedIn" title="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
    <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/70 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/10" aria-label="Twitter" title="Twitter/X">
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
        @media (max-width: 767px) {
          :root { --header-bottom: 60px; }
        }
  .sticky-header { will-change: backdrop-filter, background-color, box-shadow, border-color; }
  .mesh-bg { position: fixed; inset: 0; filter: blur(50px); pointer-events: none; z-index: 0; }
  .mesh-bg::before { content: ""; position: absolute; inset: 0; transform: scale(1.08); transform-origin: center;
          background:
            radial-gradient(1200px 600px at 10% 10%, rgba(0,82,255,0.10), transparent 60%),
            radial-gradient(800px 500px at 80% 0%, rgba(124,58,237,0.10), transparent 60%),
            radial-gradient(900px 700px at 20% 80%, rgba(16,185,129,0.10), transparent 60%),
            radial-gradient(600px 600px at 90% 80%, rgba(251,146,60,0.08), transparent 60%);
          opacity: .6;
        }
        :root.dark .mesh-bg::before { opacity: .18; }
  /* Empêche des conteneurs horizontaux de bloquer la molette verticale */
  .no-vert-capture { overscroll-behavior-y: contain; }
      `}</style>
    </div>
  );
}
