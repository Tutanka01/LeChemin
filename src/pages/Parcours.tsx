// LeChemin.tech — Page Parcours
// Parcours DevOps simplifié et interactif

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ParcoursProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
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

  // Deep-link: open modal if URL hash matches an id
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const step = devOpsPath.find((st) => st.id === id);
    if (step) setSelectedStep(step);
  }, []);

  // When modal opens/closes, sync hash
  useEffect(() => {
    if (selectedStep) {
      history.replaceState(null, "", `#${selectedStep.id}`);
    } else {
      history.replaceState(null, "", window.location.pathname);
    }
  }, [selectedStep]);

  const openFirstResource = (step: DevOpsStep) => {
    const first = step.resources?.[0];
    if (first?.url) window.open(first.url, "_blank", "noopener,noreferrer");
  };

  const StepCard = ({ step, index, isConnected }: { step: DevOpsStep; index: number; isConnected: boolean }) => {
    return (
      <motion.div 
        id={step.id} 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.3 }} 
        transition={{ duration: 0.5, delay: index * 0.1 }} 
        className="relative"
      >
        {/* Connecting line */}
        {isConnected && (
          <div className="absolute left-1/2 top-0 h-16 w-0.5 -translate-x-1/2 -translate-y-16 bg-gradient-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-600" />
        )}

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => setSelectedStep(step)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedStep(step);
            }
          }}
          className="group relative cursor-pointer rounded-3xl border border-white/20 bg-white/60 p-8 backdrop-blur transition-all duration-300 hover:shadow-xl dark:bg-zinc-900/60 hover:border-white/40"
          style={{ 
            boxShadow: `0 10px 40px ${step.color}15, inset 0 0 0 1px ${step.color}20`
          }}
        >
          {/* Icon */}
          <div
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            style={{ 
              backgroundColor: `${step.color}20`,
              boxShadow: `0 6px 20px ${step.color}30`
            }}
          >
            {React.createElement(step.icon, {
              className: "h-8 w-8",
              style: { color: step.color }
            })}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{step.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs">
                <Clock className="h-3 w-3" />
                {step.duration}
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs ${
                  step.difficulty === "Débutant"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : step.difficulty === "Intermédiaire"
                    ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                    : "bg-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                {step.difficulty}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {step.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-md bg-zinc-200/50 px-2 py-1 text-xs dark:bg-zinc-700/50">
                  {skill}
                </span>
              ))}
              {step.skills.length > 3 && (
                <span className="rounded-md bg-zinc-200/50 px-2 py-1 text-xs dark:bg-zinc-700/50">+{step.skills.length - 3}</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
              Explorer ce module
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </div>

          {/* Glow effect on hover */}
          <div 
            aria-hidden 
            className="absolute -bottom-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl opacity-0 transition group-hover:opacity-40" 
            style={{ background: `radial-gradient(closest-side, ${step.color}, transparent)` }} 
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      style={{ ["--accent" as string]: accent }}
      className="relative min-h-screen text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent) 0%, transparent 60%)", opacity: 0.08 }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Mouse glow */}
      <div
        ref={glowRef}
        data-testid="global-glow"
        aria-hidden
        className="pointer-events-none fixed z-0 h-[300px] w-[300px] rounded-full opacity-30 blur-2xl"
        style={{
          left: 0,
          top: 0,
          background: "radial-gradient(closest-side, var(--accent), transparent 70%)",
          transform: "translate3d(-150px, -150px, 0)",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <Star className="h-4 w-4" />
                Parcours DevOps
              </div>

              <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
                Votre Chemin vers le
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> DevOps</span>
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed opacity-80">
                Un parcours structuré et visuel pour maîtriser DevOps étape par étape.
                Chaque module vous prépare au suivant avec des ressources sélectionnées.
              </p>

              {/* Bloc de transparence authentique (remplace les métriques abstraites) */}
              <div className="mx-auto mb-2 max-w-3xl text-sm italic opacity-70">
                Pas de chiffres marketing artificiels — juste un chemin clair, vivant et améliorable.
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <div className="rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur dark:bg-white/5">
                  Construit avec passion et maintenu en continu
                </div>
                <div className="rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur dark:bg-white/5">
                  Basé sur +5 ans d'expérience combinée (Cloud, Dev, Ops)
                </div>
                <div className="rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur dark:bg-white/5">
                  Ressources ouvertes, priorisées & francophones quand possible
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="relative py-12">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="space-y-16">
              {devOpsPath.map((step, index) => (
                <StepCard key={step.id} step={step} index={index} isConnected={index > 0} />
              ))}
            </div>
          </div>
        </section>

        {/* Step Detail Modal */}
        <AnimatePresence>
          {selectedStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedStep(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-white/95 p-8 backdrop-blur dark:bg-zinc-900/95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${selectedStep.color}20` }}>
                      {React.createElement(selectedStep.icon, {
                        className: "h-6 w-6",
                        style: { color: selectedStep.color }
                      })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStep.title}</h2>
                      <p className="text-sm opacity-70">
                        {selectedStep.duration} • {selectedStep.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        } catch (_) {}
                      }}
                      className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Copier le lien de l'étape"
                    >
                      <div className="flex items-center gap-1.5"><LinkIcon className="h-4 w-4" /> Copier le lien</div>
                    </button>
                    <button onClick={() => setSelectedStep(null)} className="rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Fermer">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {copied && (
                  <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                    Lien copié !
                  </div>
                )}

                <div className="space-y-6">
                  <p className="leading-relaxed opacity-90">{selectedStep.description}</p>

                  <div>
                    <h3 className="mb-3 font-semibold">Compétences à acquérir</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStep.skills.map((skill) => (
                        <span key={skill} className="rounded-md bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold">Ressources recommandées</h3>
                    <div className="space-y-2">
                      {selectedStep.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 transition hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{resource.title}</div>
                            <div className="text-xs opacity-70">{resource.type}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => openFirstResource(selectedStep)}
                      className="flex-1 rounded-xl px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
                      style={{ background: selectedStep.color }}
                    >
                      Commencer à apprendre
                    </button>
                    {(() => {
                      const idx = devOpsPath.findIndex((s) => s.id === selectedStep.id);
                      const next = devOpsPath[idx + 1];
                      return next ? (
                        <button
                          onClick={() => setSelectedStep(next)}
                          className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
                        >
                          Module suivant
                        </button>
                      ) : null;
                    })()}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <section className="relative py-20">
          <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 backdrop-blur"
            >
              <h2 className="mb-4 text-3xl font-bold">Prêt à commencer votre transformation ?</h2>
              <p className="mb-8 opacity-80">
                Rejoignez des milliers d'apprenants qui construisent leur carrière DevOps avec nos parcours guidés.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setSelectedStep(devOpsPath[0])}
                  className="rounded-xl bg-blue-500 px-8 py-4 font-semibold text-white transition hover:bg-blue-600"
                >
                  Commencer le premier module
                </button>
                <button
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome();
                    else window.location.href = "/";
                  }}
                  className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  Voir tous les parcours
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
