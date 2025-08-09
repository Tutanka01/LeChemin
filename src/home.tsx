import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import './index.css';

// Entrypoint MPA homepage (dark mode forcé)
const glowRef = React.createRef<HTMLDivElement>();
const accent = '#0052FF';

function Root() {
  React.useEffect(()=>{ document.documentElement.classList.add('dark'); }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current; if(!el) return;
    const size = 300; const x = e.clientX - size/2; const y = e.clientY - size/2;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
  };

  const navigateToParcours = () => { window.location.href = '/parcours.html'; };

  return (
    <>
      <Header />
      <Home onNavigateToParcours={navigateToParcours} glowRef={glowRef} handleMouseMove={handleMouseMove} accent={accent} />
      <style>{`.nav-link{position:relative;font-size:.9rem;opacity:.85;transition:.2s}.nav-link:hover{opacity:1}.nav-link:after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:2px;background:${accent};transform:scaleX(0);transform-origin:right;transition:transform .25s}.nav-link:hover:after{transform:scaleX(1);transform-origin:left}`}</style>
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:py-4 md:px-6">
        <a href="/" className="group inline-flex items-center gap-2" aria-label="Aller à l'accueil">
          <div className="h-7 w-7 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent), #1E1E1E)' }} />
          <span className="text-base font-semibold tracking-tight">LeChemin.tech</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/parcours.html" className="nav-link">Parcours</a>
          <a href="#mission" className="nav-link">Mission</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </nav>
    </header>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
