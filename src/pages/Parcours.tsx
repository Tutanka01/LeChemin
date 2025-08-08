// LeChemin.tech — Page Parcours
// Parcours DevOps simplifié et interactif

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ServerCog,
  ChevronRight,
  Clock,
  Users,
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
      { type: "Livre", title: "The Linux Command Line (William Shotts)", url: "https://linuxcommand.org/tlcl.php" },
      { type: "Cours", title: "Introduction to Linux - Linux Foundation (gratuit)", url: "https://www.edx.org/learn/linux/the-linux-foundation-introduction-to-linux" },
      { type: "Interactive", title: "OverTheWire - Bandit (CLI Game)", url: "https://overthewire.org/wargames/bandit/" },
      { type: "Cours", title: "Networking Essentials - Cisco", url: "https://www.netacad.com/courses/networking/networking-essentials" },
      { type: "YouTube", title: "Linux Tutorial for Beginners", url: "https://www.youtube.com/watch?v=BMGixkvJ-6w" },
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
      { type: "Livre", title: "Pro Git (Gratuit en français)", url: "https://git-scm.com/book/fr/v2" },
      { type: "Interactive", title: "Learn Git Branching (français)", url: "https://learngitbranching.js.org/?locale=fr_FR" },
      { type: "Gratuit", title: "GitHub Skills - Parcours interactifs", url: "https://skills.github.com/" },
      { type: "Cours", title: "Git et GitHub - OpenClassrooms", url: "https://openclassrooms.com/fr/courses/7162856-gerez-du-code-avec-git-et-github" },
      { type: "Cheat Sheet", title: "Git Cheat Sheet - Atlassian", url: "https://www.atlassian.com/git/tutorials/atlassian-git-cheatsheet" },
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
      { type: "Livre", title: "Automate the Boring Stuff with Python (gratuit)", url: "https://automatetheboringstuff.com/" },
      { type: "Guide", title: "Advanced Bash-Scripting Guide", url: "https://tldp.org/LDP/abs/html/" },
      { type: "Cours", title: "Ansible for Beginners - KodeKloud", url: "https://kodekloud.com/courses/ansible-for-the-absolute-beginner/" },
      { type: "Interactive", title: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { type: "Pratique", title: "Bash Scripting Tutorial", url: "https://ryanstutorials.net/bash-scripting-tutorial/" },
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
      { type: "Cours", title: "Docker Curriculum (gratuit)", url: "https://docker-curriculum.com/" },
      { type: "Interactive", title: "Kubernetes Basics - Tutorial officiel", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
      { type: "Cours", title: "Docker Mastery - Udemy", url: "https://www.udemy.com/course/docker-mastery/" },
      { type: "Gratuit", title: "Play with Docker", url: "https://labs.play-with-docker.com/" },
      { type: "Guide", title: "Kubernetes The Hard Way", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way" },
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
      { type: "Gratuit", title: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
      { type: "Ateliers", title: "AWS Workshops (hands-on)", url: "https://workshops.aws/" },
      { type: "Cours", title: "Terraform Tutorials - HashiCorp Learn", url: "https://developer.hashicorp.com/terraform/tutorials" },
      { type: "Certification", title: "AWS Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
      { type: "Guide", title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/" },
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
      { type: "Docs", title: "GitHub Actions - Documentation officielle", url: "https://docs.github.com/fr/actions" },
      { type: "Cours", title: "Jenkins Pipeline Tutorial", url: "https://www.jenkins.io/doc/book/pipeline/" },
      { type: "Gratuit", title: "GitLab CI/CD Tutorial", url: "https://docs.gitlab.com/ee/ci/quick_start/" },
      { type: "Certification", title: "CDF - Continuous Delivery Foundation", url: "https://cd.foundation/learn/" },
      { type: "Pratique", title: "DevOps Pipeline Project", url: "https://github.com/mtararujs/python-devops" },
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
      { type: "Gratuit", title: "OWASP Top Ten 2021", url: "https://owasp.org/Top10/fr/" },
      { type: "Docs", title: "Prometheus - Getting Started", url: "https://prometheus.io/docs/prometheus/latest/getting_started/" },
      { type: "Cours", title: "Grafana Fundamentals", url: "https://grafana.com/tutorials/grafana-fundamentals/" },
      { type: "Gratuit", title: "Elastic Stack Tutorial", url: "https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html" },
      { type: "Certification", title: "CompTIA Security+", url: "https://www.comptia.org/certifications/security" },
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

              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>+2,450 apprenants</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.8/5 étoiles</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>24-30 semaines</span>
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
