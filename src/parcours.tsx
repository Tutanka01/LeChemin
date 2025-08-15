import React from 'react';
import ReactDOM from 'react-dom/client';
import Parcours from './pages/Parcours';
import './index.css';

const glowRef = React.createRef<HTMLDivElement>();
const accent = '#0052FF';

function Root() {
  // Mode sombre forcé (classe appliquée une fois)
  React.useEffect(() => { document.documentElement.classList.add('dark'); }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current; if (!el) return;
    const size = 300; const x = e.clientX - size/2; const y = e.clientY - size/2;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
  };

  const navigateHome = () => { window.location.href = '/'; };

  return (
    <>
      <Header navigateHome={navigateHome} />
      <Parcours glowRef={glowRef} handleMouseMove={handleMouseMove} accent={accent} onNavigateHome={navigateHome} />
      <style>{`.nav-link{position:relative;font-size:.9rem;opacity:.85;transition:.2s}.nav-link:hover{opacity:1}.nav-link:after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:2px;background:${accent};transform:scaleX(0);transform-origin:right;transition:transform .25s}.nav-link:hover:after{transform:scaleX(1);transform-origin:left}`}</style>
    </>
  );
}

function Header({ navigateHome }: { navigateHome: ()=>void }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:py-4 md:px-6">
        <button onClick={navigateHome} className="group inline-flex items-center gap-2" aria-label="Aller à l'accueil">
          <div className="h-7 w-7 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent), #1E1E1E)' }} />
          <span className="text-base font-semibold tracking-tight">LeChemin.tech</span>
        </button>
        <div className="flex items-center gap-4">
          <button onClick={navigateHome} className="nav-link">Accueil</button>
        </div>
      </nav>
    </header>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
