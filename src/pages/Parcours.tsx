// LeChemin.tech — Page Parcours (MPA)
// Parcours DevOps simplifié et interactif

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';
import {
  ServerCog,
  ChevronRight,
  Clock,
  BookOpen,
  Terminal,
  Cloud,
  Shield,
  Zap,
  ArrowLeft,
  Star,
  Target,
  Link as LinkIcon,
} from "lucide-react";

// Props réduites pour mode MPA (thème géré dans l'entrypoint /src/parcours.tsx)
interface ParcoursProps {
  glowRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  accent: string;
  onNavigateHome?: () => void;
}

interface DevOpsStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  skills: string[];
  resources: { type: string; title: string; url: string }[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const devOpsPath: DevOpsStep[] = [
  {
    id: "fondamentaux",
    title: "Fondamentaux Linux & Réseaux",
    description:
      "Maîtrisez les bases indispensables : ligne de commande, système de fichiers, protocoles réseau. Une base solide pour tout DevOps Engineer.",
    duration: "4-6 semaines",
    difficulty: "Débutant",
    skills: ["Linux CLI", "SSH", "TCP/IP", "DNS", "Firewall", "Vim/Nano", "Cron"],
    resources: [
      { type: "YouTube", title: "Formation Linux - Xavki (Référence)", url: "https://youtube.com/playlist?list=PLn6POgpklwWp1yRsq3-PyyisSIDg94ct9&si=ZocnNBoShfsUy14O" },
      { type: "Livre", title: "Le Cahier de l'Admin Linux (français)", url: "https://debian-handbook.info/browse/fr-FR/stable/" },
      { type: "Docs", title: "Documentation Ubuntu Server (français)", url: "https://doc.ubuntu-fr.org/serveur" },
      { type: "Blog", title: "Les bases du réseau - IT-Connect", url: "https://www.it-connect.fr/cours-tutoriels/debuter-administration-systeme-reseau/" },
      { type: "Interactive", title: "OverTheWire - Bandit (Jeu en anglais, mais culte)", url: "https://overthewire.org/wargames/bandit/" },
    ],
    icon: Terminal,
    color: "#10B981",
  },
  {
    id: "versioning",
    title: "Contrôle de Version",
    description:
      "Git, GitHub/GitLab, workflows collaboratifs, branching strategies et bonnes pratiques. L'outil essentiel pour tout développement moderne.",
    duration: "2-3 semaines",
    difficulty: "Débutant",
    skills: ["Git", "GitHub", "GitLab", "Git Flow", "Pull Requests", "Merge Conflicts", "Git Hooks"],
    resources: [
      { type: "YouTube", title: "Git et le versionning - Graven", url: "https://youtu.be/gp_k0UVOYMw?si=K1Q8QK4BcPsb4e-O" },
      { type: "Interactive", title: "Learn Git Branching (Jeu interactif en français)", url: "https://learngitbranching.js.org/?locale=fr_FR" },
      { type: "Livre", title: "Pro Git (La Bible de Git, gratuite et en français)", url: "https://git-scm.com/book/fr/v2" },
      { type: "Cours", title: "Gérez du code avec Git et GitHub - OpenClassrooms", url: "https://openclassrooms.com/fr/courses/7162856-gerez-du-code-avec-git-et-github" },
      { type: "Blog", title: "Le guide complet de Git et GitHub - Une Tasse de Café", url: "https://git.avec.une-tasse-de.cafe/" },
    ],
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    id: "scripting",
    title: "Scripting & Automatisation",
    description:
      "Scripts Bash, Python pour l'automatisation, gestion des tâches répétitives et monitoring. Automatisez tout ce qui peut l'être !",
    duration: "3-4 semaines",
    difficulty: "Intermédiaire",
    skills: ["Bash Scripting", "Python", "Cron Jobs", "Monitoring", "APIs REST", "Ansible", "Regex"],
    resources: [
      { type: "YouTube", title: "Formation Scripting Bash - Xavki", url: "https://youtube.com/playlist?list=PLn6POgpklwWpGvmy-ddJeDxxw2-QZ-AGp&si=fhxTXnI5V7P8vjeb" },
      { type: "Cours", title: "Apprenez les bases du langage Python - OpenClassrooms", url: "https://openclassrooms.com/fr/courses/7168871-apprenez-les-bases-du-langage-python" },
      { type: "Blog", title: "Introduction à Ansible - Blog de Stéphane Robert", url: "https://blog.stephane-robert.info/docs/infra-as-code/gestion-de-configuration/ansible/" },
      { type: "Docs", title: "Documentation Ansible (français)", url: "https://docs.ansible.com/ansible/latest/user_guide/index.html#getting-started" },
      { type: "Interactive", title: "Regex101 (Testeur d'expressions régulières)", url: "https://regex101.com/" },
    ],
    icon: Zap,
    color: "#F59E0B",
  },
  {
    id: "containers",
    title: "Containerisation",
    description:
      "Docker, orchestration avec Kubernetes, microservices et déploiement de conteneurs. La révolution du packaging d'applications.",
    duration: "4-5 semaines",
    difficulty: "Intermédiaire",
    skills: ["Docker", "Kubernetes", "Container Registry", "Helm", "Microservices", "Docker Compose", "Podman"],
    resources: [
      { type: "YouTube", title: "Formation Docker - Xavki", url: "https://youtube.com/playlist?list=PLn6POgpklwWq0iz59-px2z-qjDdZKEvWd&si=6O_iVR9PY8oWwj0U" },
      { type: "Docs", title: "Documentation officielle de Kubernetes (français)", url: "https://kubernetes.io/fr/docs/home/" },
      { type: "Interactive", title: "Play with Docker / Kubernetes (Labs en ligne)", url: "https://labs.play-with-k8s.com/" },
      { type: "Blog", title: "Formation Kubernetes - Stephane Robert", url: "https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/kubernetes/" },
      { type: "Cours", title: "Déployez des applications avec Docker - OpenClassrooms", url: "https://openclassrooms.com/fr/courses/7141751-deployez-des-applications-avec-docker" },
    ],
    icon: ServerCog,
    color: "#8B5CF6",
  },
  {
    id: "cloud",
    title: "Plateformes Cloud",
    description:
      "AWS/Azure/GCP, infrastructure as code, services managés et architectures cloud-native. L'avenir de l'infrastructure.",
    duration: "5-6 semaines",
    difficulty: "Intermédiaire",
    skills: ["AWS", "Terraform", "CloudFormation", "VPC", "Load Balancers", "IAM", "EC2", "S3"],
    resources: [
      { type: "YouTube", title: "C'est quoi le Cloud - Cookie connecté", url: "https://youtu.be/RwbIMBSr8o8?si=SjoMYFYOGD2iJT5H" },
      { type: "YouTube", title: "Formation Terraform - Xavki", url: "https://youtube.com/playlist?list=PLn6POgpklwWrpWnv05paAdqbFbV6gApHx&si=cWDhyxVPUTlBm1QT" },
      { type: "Docs", title: "Documentation AWS en français", url: "https://docs.aws.amazon.com/index.html?nc2=h_ql_doc_do_v&language=fr_FR" },
      { type: "Blog", title: "Commencer a deployer sur OVH", url: "https://moxyone.be/demarrer-avec-un-serveur-mutualise-ovh-sous-linux-guide-pour-les-debutants/" },
      { type: "Blog", title: "Les guides Public Cloud d'OVHcloud (Pépite française)", url: "https://help.ovhcloud.com/csm/fr-public-cloud-compute-getting-started?id=kb_article_view&sysparm_article=KB0051011" },
    ],
    icon: Cloud,
    color: "#06B6D4",
  },
  {
    id: "cicd",
    title: "CI/CD Pipelines",
    description:
      "Jenkins, GitLab CI, GitHub Actions, déploiement automatisé et tests en continu. Livrez plus vite et plus souvent, sans erreurs.",
    duration: "4-5 semaines",
    difficulty: "Avancé",
    skills: ["Jenkins", "GitHub Actions", "Pipeline as Code", "Testing", "Deployment", "GitLab CI", "ArgoCD"],
    resources: [
      { type: "Docs", title: "Démarrage rapide de GitHub Actions (français)", url: "https://docs.github.com/fr/actions/quickstart" },
      { type: "Docs", title: "Démarrage rapide de GitLab CI/CD (français)", url: "https://docs.gitlab.com/ee/ci/quick_start/index.html" },
      { type: "YouTube", title: "Formation GitLab CI - Xavki", url: "https://youtube.com/playlist?list=PLn6POgpklwWrRoZZXv0xf71mvT4E0QDOF&si=voxbXlo3u4RlhRXe" },
      { type: "Blog", title: "CI/CD, de la théorie à la pratique", url: "https://www.redhat.com/fr/topics/devops/what-is-ci-cd" },
      { type: "Guide", title: "Introduction à ArgoCD (GitOps)", url: "https://argo-cd.readthedocs.io/en/stable/getting_started/" },
    ],
    icon: Target,
    color: "#EF4444",
  },
  {
    id: "security",
    title: "Sécurité & Observabilité",
    description:
      "Security scanning, monitoring avancé, logging, alerting et incident response. Sécurisez et surveillez vos systèmes en temps réel.",
    duration: "3-4 semaines",
    difficulty: "Avancé",
    skills: ["Security Scanning", "Prometheus", "Grafana", "ELK Stack", "Incident Response", "SIEM", "Vulnerability Assessment"],
    resources: [
      { type: "Référence", title: "Guides de l'ANSSI (L'Autorité française)", url: "https://www.ssi.gouv.fr/guide/" },
      { type: "YouTube", title: "Formation Prometheus - Xavki", url: "https://youtube.com/playlist?list=PLn6POgpklwWo3_2pj5Jflqwla62P5OI8n&si=D3N6UHMQ9B0lH-7j" },
      { type: "Blog", title: "Tutoriels Grafana - IT-Connect", url: "https://www.it-connect.fr/supervisez-votre-serveur-rapidement-avec-grafana-cloud/" },
      { type: "Référence", title: "OWASP Top 10 (français)", url: "https://owasp.org/Top10/fr/" },
      { type: "Blog", title: "Sécuriser son serveur SSH - Blog de Stéphane Robert", url: "https://blog.stephane-robert.info/docs/securiser/durcissement/ssh/" },
    ],
    icon: Shield,
    color: "#F97316",
  },
];

export default function Parcours({ glowRef, handleMouseMove, accent, onNavigateHome }: ParcoursProps) {
  const [selectedStep, setSelectedStep] = useState<DevOpsStep | null>(null);
  const [copied, setCopied] = useState(false);

  // Deep-link modal via hash (ouverture initiale)
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (!id) return;
    const step = devOpsPath.find(st => st.id === id);
    if (step) setSelectedStep(step);
  }, []);

  // Synchronisation hash uniquement si changement réel
  useEffect(() => {
    if (selectedStep) {
      const targetHash = `#${selectedStep.id}`;
      if (window.location.hash !== targetHash) history.replaceState(null, '', targetHash);
    } else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedStep]);

  // Blocage du scroll arrière-plan quand modal ouverte
  useEffect(() => {
    if (selectedStep) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [selectedStep]);

  const openFirstResource = (step: DevOpsStep) => {
    const first = step.resources?.[0];
    if (first?.url) window.open(first.url, '_blank', 'noopener,noreferrer');
  };

  const openStep = (step: DevOpsStep) => { if (selectedStep?.id !== step.id) setSelectedStep(step); };

  // Step card mémoïsée pour éviter re-rendus lors de l'ouverture du modal
  const StepCard = React.memo(function StepCard({ step, index, isConnected }: { step: DevOpsStep; index: number; isConnected: boolean }) {
    return (
      <motion.div
        id={step.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative"
        style={{ willChange: 'transform, opacity' }}
      >
        {isConnected && (
          <div className="absolute left-1/2 top-0 h-12 w-0.5 -translate-x-1/2 -translate-y-12 bg-gradient-to-b from-transparent via-zinc-700 to-transparent md:h-16 md:-translate-y-16" />
        )}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => openStep(step)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStep(step); } }}
          className="group relative cursor-pointer rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-8"
          style={{ boxShadow: `0 4px 18px ${step.color}10, inset 0 0 0 1px ${step.color}25`, willChange: 'transform' }}
        >
          <div
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-md sm:h-16 sm:w-16 sm:rounded-2xl"
            style={{ backgroundColor: `${step.color}22`, boxShadow: `0 4px 14px ${step.color}33` }}
          >
            {React.createElement(step.icon, { className: 'h-7 w-7 sm:h-8 sm:w-8', style: { color: step.color } })}
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight sm:text-xl">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-300 sm:text-sm">{step.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10 sm:text-xs"><Clock className="h-3 w-3" />{step.duration}</div>
              <div className={`rounded-full px-3 py-1 text-[11px] sm:text-xs ${
                step.difficulty === 'Débutant' ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30' :
                step.difficulty === 'Intermédiaire' ? 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30' :
                'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'}`}>{step.difficulty}</div>
            </div>
            <div className="flex flex-wrap gap-1">
              {step.skills.slice(0, 3).map(skill => (
                <span key={skill} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10 sm:text-xs">{skill}</span>
              ))}
              {step.skills.length > 3 && (
                <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10 sm:text-xs">+{step.skills.length - 3}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 sm:text-sm">Explorer ce module <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
          </div>
          <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/2 hidden h-36 w-36 -translate-x-1/2 rounded-full blur-2xl opacity-0 transition group-hover:opacity-40 sm:block" style={{ background: `radial-gradient(closest-side, ${step.color}, transparent)` }} />
        </motion.div>
      </motion.div>
    );
  });

  StepCard.displayName = 'StepCard';

  // Modal via portal pour éviter reflow de la grille
  const modal = selectedStep ? createPortal(
    <AnimatePresence>
      <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onMouseDown={() => setSelectedStep(null)}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-900/95 p-8 shadow-2xl ring-1 ring-white/10"
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${selectedStep.color}20` }}>
                {React.createElement(selectedStep.icon, { className: 'h-6 w-6', style: { color: selectedStep.color } })}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{selectedStep.title}</h2>
                <p className="text-sm text-zinc-400">{selectedStep.duration} • {selectedStep.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {} }}
                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/5 focus:outline-none focus:ring focus:ring-white/10"
              >
                <span className="flex items-center gap-1.5"><LinkIcon className="h-4 w-4" /> Copier</span>
              </button>
              <button onClick={() => setSelectedStep(null)} className="rounded-xl p-2 text-zinc-300 transition hover:bg-white/5 focus:outline-none focus:ring focus:ring-white/10" aria-label="Fermer"><ArrowLeft className="h-5 w-5" /></button>
            </div>
          </div>
          {copied && <div className="mb-4 rounded-lg bg-green-500/15 px-3 py-2 text-sm text-green-300 ring-1 ring-green-500/30">Lien copié</div>}
          <div className="space-y-6 text-zinc-300">
            <p className="leading-relaxed">{selectedStep.description}</p>
            <div>
              <h3 className="mb-3 font-semibold text-white">Compétences</h3>
              <div className="flex flex-wrap gap-2">{selectedStep.skills.map(skill => <span key={skill} className="rounded-md bg-white/5 px-3 py-1 text-sm text-zinc-200 ring-1 ring-white/10">{skill}</span>)}</div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-white">Ressources</h3>
              <div className="space-y-2">{selectedStep.resources.map((r,i)=>(
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm text-zinc-200 transition hover:bg-white/10 focus:outline-none focus:ring focus:ring-white/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/25"><BookOpen className="h-4 w-4 text-blue-400" /></div>
                  <div className="flex-1"><div className="font-medium text-white/90">{r.title}</div><div className="text-[11px] uppercase tracking-wide text-blue-300/70">{r.type}</div></div>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </a>
              ))}</div>
            </div>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button onClick={() => openFirstResource(selectedStep)} className="flex-1 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:brightness-110 focus:outline-none focus:ring focus:ring-blue-400/40">Commencer</button>
              {(() => { const idx = devOpsPath.findIndex(s => s.id === selectedStep.id); const next = devOpsPath[idx+1]; return next ? <button onClick={() => openStep(next)} className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring focus:ring-white/10">Suivant</button> : null; })()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>, document.body) : null;

  return (
    <div style={{ ["--accent" as string]: accent }} className="relative min-h-screen text-zinc-100 bg-zinc-950" onMouseMove={handleMouseMove}>
      {/* Décor */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, var(--accent) 0%, transparent 60%)", opacity: 0.08 }} />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Glow */}
      <div ref={glowRef} data-testid="global-glow" aria-hidden className="pointer-events-none fixed z-0 h-[300px] w-[300px] rounded-full opacity-30 blur-2xl" style={{ left: 0, top: 0, background: "radial-gradient(closest-side, var(--accent), transparent 70%)", transform: "translate3d(-150px, -150px, 0)", willChange: 'transform', mixBlendMode: 'screen' }} />
      <div className="relative z-10">
        {/* Hero */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400"><Star className="h-4 w-4" />Parcours DevOps</div>
              <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">Votre Chemin vers le <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">DevOps</span></h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed opacity-80">Un parcours structuré et visuel pour maîtriser DevOps étape par étape. Chaque module prépare le suivant.</p>
              <div className="mx-auto mb-2 max-w-3xl text-sm italic opacity-70">Pas de chiffres marketing artificiels — juste un chemin clair.</div>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <div className="rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur dark:bg-white/5">Construit avec passion</div>
                <div className="rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur dark:bg-white/5">Expérience terrain</div>
                <div className="rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur dark:bg-white/5">Ressources ouvertes</div>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Liste */}
        <section className="relative py-12">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="space-y-16">
              {devOpsPath.map((step, i) => <StepCard key={step.id} step={step} index={i} isConnected={i > 0} />)}
            </div>
          </div>
        </section>
        {/* Modal */}
        {modal}
        {/* CTA */}
        <section className="relative py-20">
          <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 backdrop-blur">
              <h2 className="mb-4 text-3xl font-bold">Prêt à commencer ?</h2>
              <p className="mb-8 opacity-80">Lancez-vous dès maintenant avec le premier module.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setSelectedStep(devOpsPath[0])} className="rounded-xl bg-blue-500 px-8 py-4 font-semibold text-white transition hover:bg-blue-600">Premier module</button>
                <button onClick={() => { if (onNavigateHome) onNavigateHome(); else window.location.href = "/"; }} className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/20">Accueil</button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
