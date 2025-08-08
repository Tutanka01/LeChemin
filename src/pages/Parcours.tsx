// LeChemin.tech — Page Parcours
// Interface révolutionnaire pour visualiser et suivre les chemins de carrière tech

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ServerCog,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  Terminal,
  Cloud,
  Shield,
  Zap,
  ArrowLeft,
  Star,
  Trophy,
  Target,
} from "lucide-react";

interface ParcoursProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  glowRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  accent: string;
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
  status: "completed" | "current" | "locked";
  prerequisites?: string[];
}

const devOpsPath: DevOpsStep[] = [
  {
    id: "fondamentaux",
    title: "Fondamentaux Linux & Réseaux",
    description: "Maîtrisez les bases indispensables : ligne de commande, système de fichiers, protocoles réseau.",
    duration: "4-6 semaines",
    difficulty: "Débutant",
    skills: ["Bash", "SSH", "TCP/IP", "DNS", "Firewall"],
    resources: [
      { type: "Cours", title: "Linux Command Line", url: "#" },
      { type: "Lab", title: "Virtual Network Setup", url: "#" },
      { type: "Livre", title: "The Linux Command Line", url: "#" }
    ],
    icon: Terminal,
    color: "#10B981",
    status: "completed"
  },
  {
    id: "versioning",
    title: "Contrôle de Version",
    description: "Git, GitHub/GitLab, workflows collaboratifs, branching strategies et bonnes pratiques.",
    duration: "2-3 semaines",
    difficulty: "Débutant", 
    skills: ["Git", "GitHub", "GitLab", "Git Flow", "Pull Requests"],
    resources: [
      { type: "Cours", title: "Git & GitHub Mastery", url: "#" },
      { type: "Practice", title: "Interactive Git Tutorial", url: "#" },
      { type: "Guide", title: "Git Best Practices", url: "#" }
    ],
    icon: BookOpen,
    color: "#3B82F6",
    status: "current"
  },
  {
    id: "scripting",
    title: "Scripting & Automatisation", 
    description: "Scripts Bash, Python pour l'automatisation, gestion des tâches répétitives et monitoring.",
    duration: "3-4 semaines",
    difficulty: "Intermédiaire",
    skills: ["Bash Scripting", "Python", "Cron Jobs", "Monitoring", "APIs"],
    resources: [
      { type: "Cours", title: "Automation with Python", url: "#" },
      { type: "Project", title: "Build Monitoring Scripts", url: "#" },
      { type: "Tool", title: "Ansible Basics", url: "#" }
    ],
    icon: Zap,
    color: "#F59E0B",
    status: "locked",
    prerequisites: ["versioning"]
  },
  {
    id: "containers",
    title: "Containerisation",
    description: "Docker, orchestration avec Kubernetes, microservices et déploiement de conteneurs.",
    duration: "4-5 semaines", 
    difficulty: "Intermédiaire",
    skills: ["Docker", "Kubernetes", "Container Registry", "Helm", "Microservices"],
    resources: [
      { type: "Cours", title: "Docker & Kubernetes", url: "#" },
      { type: "Lab", title: "K8s Cluster Setup", url: "#" },
      { type: "Certification", title: "CKA Preparation", url: "#" }
    ],
    icon: ServerCog,
    color: "#8B5CF6",
    status: "locked",
    prerequisites: ["scripting"]
  },
  {
    id: "cloud",
    title: "Plateformes Cloud",
    description: "AWS/Azure/GCP, infrastructure as code, services managés et architectures cloud-native.",
    duration: "5-6 semaines",
    difficulty: "Intermédiaire", 
    skills: ["AWS", "Terraform", "CloudFormation", "VPC", "Load Balancers"],
    resources: [
      { type: "Certification", title: "AWS Solutions Architect", url: "#" },
      { type: "Lab", title: "Terraform Projects", url: "#" },
      { type: "Course", title: "Cloud Architecture Patterns", url: "#" }
    ],
    icon: Cloud,
    color: "#06B6D4",
    status: "locked",
    prerequisites: ["containers"]
  },
  {
    id: "cicd",
    title: "CI/CD Pipelines",
    description: "Jenkins, GitLab CI, GitHub Actions, déploiement automatisé et tests en continu.",
    duration: "4-5 semaines",
    difficulty: "Avancé",
    skills: ["Jenkins", "GitHub Actions", "Pipeline as Code", "Testing", "Deployment"],
    resources: [
      { type: "Project", title: "Build CI/CD Pipeline", url: "#" },
      { type: "Tool", title: "Jenkins Configuration", url: "#" },
      { type: "Guide", title: "Pipeline Best Practices", url: "#" }
    ],
    icon: Target,
    color: "#EF4444",
    status: "locked",
    prerequisites: ["cloud"]
  },
  {
    id: "security",
    title: "Sécurité & Observabilité",
    description: "Security scanning, monitoring avancé, logging, alerting et incident response.",
    duration: "3-4 semaines",
    difficulty: "Avancé",
    skills: ["Security Scanning", "Prometheus", "Grafana", "ELK Stack", "Incident Response"],
    resources: [
      { type: "Course", title: "DevSecOps Fundamentals", url: "#" },
      { type: "Tool", title: "Monitoring Setup", url: "#" },
      { type: "Certification", title: "Security+ Preparation", url: "#" }
    ],
    icon: Shield,
    color: "#F97316",
    status: "locked",
    prerequisites: ["cicd"]
  }
];

export default function Parcours({ glowRef, handleMouseMove, accent }: ParcoursProps) {
  const [selectedStep, setSelectedStep] = useState<DevOpsStep | null>(null);
  
  const StepCard = ({ step, index, isConnected }: { step: DevOpsStep, index: number, isConnected: boolean }) => {
    const isCompleted = step.status === "completed";
    const isCurrent = step.status === "current";
    const isLocked = step.status === "locked";
    
    return (
      <motion.div
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
          onClick={() => !isLocked && setSelectedStep(step)}
          className={`group relative cursor-pointer rounded-3xl border p-8 backdrop-blur transition-all duration-300 ${
            isCompleted 
              ? 'border-green-500/30 bg-green-500/10 hover:border-green-500/50' 
              : isCurrent 
                ? 'border-blue-500/50 bg-blue-500/10 hover:border-blue-500/70 shadow-lg shadow-blue-500/20'
                : isLocked
                  ? 'border-zinc-300/20 bg-zinc-900/20 opacity-60 cursor-not-allowed'
                  : 'border-zinc-300/30 bg-white/5 hover:border-zinc-300/50 dark:border-zinc-600/30 dark:bg-zinc-900/30'
          }`}
        >
          {/* Status indicator */}
          <div className="absolute -top-3 left-8">
            {isCompleted ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            ) : isCurrent ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                <Play className="h-3 w-3" />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-zinc-400 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800" />
            )}
          </div>

          {/* Icon */}
          <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${
            isCompleted ? 'bg-green-500/20' : isCurrent ? 'bg-blue-500/20' : 'bg-zinc-500/20'
          }`} style={!isLocked ? { boxShadow: `inset 0 0 0 1px ${step.color}33` } : {}}>
            <step.icon className={`h-8 w-8 ${
              isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : 'text-zinc-500'
            }`} style={!isLocked ? { color: step.color } : {}} />
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
              <div className={`rounded-full px-3 py-1 text-xs ${
                step.difficulty === "Débutant" ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                step.difficulty === "Intermédiaire" ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                "bg-red-500/20 text-red-600 dark:text-red-400"
              }`}>
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
                <span className="rounded-md bg-zinc-200/50 px-2 py-1 text-xs dark:bg-zinc-700/50">
                  +{step.skills.length - 3}
                </span>
              )}
            </div>

            {!isLocked && (
              <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                {isCompleted ? "Terminé" : isCurrent ? "En cours" : "Commencer"}
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const ProgressBar = () => {
    const completedSteps = devOpsPath.filter(step => step.status === "completed").length;
    const totalSteps = devOpsPath.length;
    const progress = (completedSteps / totalSteps) * 100;

    return (
      <div className="mx-auto mb-12 max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">Progression du parcours</span>
          <span className="text-sm font-medium">{completedSteps}/{totalSteps} étapes</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
          />
        </div>
        <div className="mt-2 text-center text-xs opacity-70">
          {progress.toFixed(0)}% terminé
        </div>
      </div>
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
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.03] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <Trophy className="h-4 w-4" />
                Parcours Interactif
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

        {/* Progress Bar */}
        <section className="relative py-8">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <ProgressBar />
          </div>
        </section>

        {/* Learning Path */}
        <section className="relative py-12">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="space-y-16">
              {devOpsPath.map((step, index) => (
                <StepCard 
                  key={step.id} 
                  step={step} 
                  index={index}
                  isConnected={index > 0}
                />
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
                      <selectedStep.icon className="h-6 w-6" style={{ color: selectedStep.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStep.title}</h2>
                      <p className="text-sm opacity-70">{selectedStep.duration} • {selectedStep.difficulty}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="leading-relaxed opacity-90">{selectedStep.description}</p>

                  <div>
                    <h3 className="mb-3 font-semibold">Compétences acquises</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStep.skills.map((skill) => (
                        <span key={skill} className="rounded-lg bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold">Ressources recommandées</h3>
                    <div className="space-y-2">
                      {selectedStep.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{resource.title}</div>
                            <div className="text-xs opacity-70">{resource.type}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedStep.prerequisites && (
                    <div>
                      <h3 className="mb-3 font-semibold">Prérequis</h3>
                      <div className="space-y-2">
                        {selectedStep.prerequisites.map((prereq) => {
                          const prereqStep = devOpsPath.find(s => s.id === prereq);
                          return prereqStep ? (
                            <div key={prereq} className="flex items-center gap-2 text-sm opacity-80">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              {prereqStep.title}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      className="flex-1 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
                      style={{ background: selectedStep.color }}
                    >
                      {selectedStep.status === "completed" ? "Revoir" : selectedStep.status === "current" ? "Continuer" : "Commencer"}
                    </button>
                    <button className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold transition hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800">
                      Marquer comme lu
                    </button>
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
                <button className="rounded-xl bg-blue-500 px-8 py-4 font-semibold text-white transition hover:bg-blue-600">
                  Commencer gratuitement
                </button>
                <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/20">
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
