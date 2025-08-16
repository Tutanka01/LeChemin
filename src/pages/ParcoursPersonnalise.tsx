import { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { SkillsRoadmap, Competency } from '../types/skills';
import { startQuiz, nextQuestions, generateRoadmap, type QuizQuestion, type QuizState } from '../lib/aiClient';
import { saveRoadmap } from '../api/roadmaps';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock3, Target, Check, ChevronDown } from 'lucide-react';
import { getUserProgress, setProgress, type ProgressRecord, computeModuleProgress } from '../api/progress';

export default function ParcoursPersonnalise() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<'goal' | 'quiz' | 'result'>('goal');
  const [goal, setGoal] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<SkillsRoadmap | null>(null);
  const [uiLoading, setUiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [progress, setProgressState] = useState<ProgressRecord[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const state: QuizState = { goal, answers };
  const nextParam = useMemo(() => encodeURIComponent('/parcours/personnalise'), []);

  // Helpers clés compactes et stables
  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
  }
  function keyForAction(moduleId: string, subIndex: number, actionIndex: number, actionText: string) {
    const mod = slugify(moduleId);
    return `${mod}:skill:${subIndex.toString(36)}:${actionIndex.toString(36)}:${slugify(actionText)}`;
  }

  async function handleStart() {
    setLoading(true); setUiLoading(true);
    try {
      const qs = await startQuiz(goal.trim());
      setQuestions(qs);
      setStep('quiz');
    } finally {
      setLoading(false); setUiLoading(false);
    }
  }

  async function handleNext() {
    setLoading(true); setUiLoading(true);
    try {
      const more = await nextQuestions(state);
      if (!more || more.length === 0) {
        const rm = await generateRoadmap(state);
        setRoadmap(rm);
          // Fermer l'overlay immédiatement dès que la roadmap est disponible
          setUiLoading(false);
        if (user) {
          try { const data = await getUserProgress(); setProgressState(data); } catch { setProgressState([]); }
        }
        setStep('result');
      } else {
        setQuestions(more);
      }
    } finally {
      setLoading(false); setUiLoading(false);
    }
  }

  // Garde d'auth: exiger connexion avant d'accéder au quiz personnalisé
  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Helmet>
          <title>Parcours personnalisé | LeChemin.tech</title>
        </Helmet>
        <div className="mx-auto max-w-sm rounded-2xl border border-zinc-200/70 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          <div className="mt-2 text-sm opacity-80">Chargement…</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <Helmet>
          <title>Connexion requise | LeChemin.tech</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <nav className="mb-6 text-sm opacity-80"><Link to="/parcours" className="underline-offset-4 hover:underline">← Tous les parcours</Link></nav>
        <div className="rounded-3xl border border-zinc-200/70 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">
          <h1 className="text-2xl font-bold tracking-tight">Créez votre parcours personnalisé</h1>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-80">Connectez-vous ou créez un compte gratuit pour utiliser le générateur de parcours personnalisé et sauvegarder vos progrès.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to={`/auth?next=${nextParam}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Se connecter / S’enregistrer</Link>
            <Link to="/parcours" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-5 py-2.5 text-sm dark:border-white/10 dark:bg-zinc-900/60">Voir les parcours</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <Helmet>
        <title>Parcours personnalisé | Quiz adaptatif | LeChemin.tech</title>
        <meta name="description" content="Un quiz intelligent pour créer une roadmap adaptée à votre niveau et à vos objectifs." />
        <link rel="canonical" href="https://lechemin.tech/parcours/personnalise" />
      </Helmet>

      <nav className="mb-6 text-sm opacity-80"><Link to="/parcours" className="underline-offset-4 hover:underline">← Tous les parcours</Link></nav>

      {step === 'goal' && (
        <section>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Créez votre parcours personnalisé</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">Décrivez ce que vous voulez apprendre. Ex: “Kubernetes pour déployer en prod”.</p>
          <div className="mt-4 flex gap-2">
            <input
              placeholder="Que voulez-vous apprendre ?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-200/70 bg-white px-3 py-2 outline-none focus:ring-2 dark:border-white/10 dark:bg-zinc-900/60"
            />
            <button onClick={handleStart} disabled={!goal.trim() || loading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? '...' : 'Démarrer le quiz'}</button>
          </div>
          <div className="mt-2 text-xs opacity-70">Gratuit • 5–8 questions • Résultat en moins d’une minute</div>
        </section>
      )}

      {step === 'quiz' && (
        <section>
          <h2 className="text-2xl font-bold tracking-tight">Votre quiz</h2>
          <p className="mt-1 text-sm opacity-80">Objectif: {goal}</p>
          <div className="mt-4 space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-zinc-200/70 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/60">
                <div className="mb-2 font-semibold">{q.text}</div>
                {q.type === 'text' && (
                  <input
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    value={(answers[q.id] as string) || ''}
                    placeholder="Votre réponse"
                    className="w-full rounded-xl border border-zinc-200/70 bg-white px-3 py-2 outline-none focus:ring-2 dark:border-white/10 dark:bg-zinc-900/60"
                  />
                )}
                {q.type === 'single' && (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className={`rounded-xl border px-3 py-1.5 text-sm ${answers[q.id] === opt ? 'border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-200' : 'border-zinc-200/70 bg-white dark:border-white/10 dark:bg-white/5'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {q.type === 'multi' && (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((opt) => {
                      const current = (answers[q.id] as string[]) || [];
                      const checked = current.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: checked ? current.filter((v) => v !== opt) : [...current, opt] }))}
                          className={`rounded-xl border px-3 py-1.5 text-sm ${checked ? 'border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-200' : 'border-zinc-200/70 bg-white dark:border-white/10 dark:bg-white/5'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep('goal')} className="rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/60">Modifier l’objectif</button>
            <button onClick={handleNext} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? '...' : 'Continuer'}</button>
          </div>
        </section>
      )}

  {step === 'result' && roadmap && (
        <section>
          {/* Hero moderne */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white dark:border-white/10 dark:bg-zinc-900">
            <div aria-hidden className="absolute inset-0 opacity-70" style={{background:'radial-gradient(1200px 500px at 20% -10%, rgba(0,82,255,.18), transparent 60%), radial-gradient(800px 400px at 100% 0%, rgba(124,58,237,.18), transparent 60%)'}} />
            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 dark:text-blue-200">Parcours personnalisé <Sparkles className="h-3.5 w-3.5"/></div>
                  <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{roadmap.topic}</h2>
                  <p className="mt-2 max-w-3xl text-sm opacity-85 md:text-base">{roadmap.profile_summary}</p>
                </div>
                <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm backdrop-blur dark:bg-white/5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs"><Clock3 className="h-3.5 w-3.5"/> Estimé</div>
                  <div className="mt-1 text-2xl font-bold">{roadmap.estimated_weeks}<span className="ml-1 text-sm font-normal opacity-70">semaines</span></div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs ring-1 ring-zinc-200/70 dark:bg-white/5 dark:ring-white/10">Objectif: {goal}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs ring-1 ring-zinc-200/70 dark:bg-white/5 dark:ring-white/10">Compétences: {roadmap.competencies.length}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Target className="h-4 w-4"/> Commencer</button>
                <button
                  disabled={saveStatus==='saving'}
                  onClick={async ()=>{
                    if (!roadmap) return;
                    setSaveStatus('saving');
                    const res = await saveRoadmap(roadmap);
                    if ('error' in res) setSaveStatus('error'); else setSaveStatus('saved');
                    setTimeout(()=> setSaveStatus('idle'), 2500);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/60 disabled:opacity-60"
                >
                  {saveStatus==='saving' ? 'Enregistrement…' : saveStatus==='saved' ? 'Enregistré ✓' : 'Enregistrer'}
                </button>
                <Link to="/parcours" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/60">Voir tous les parcours</Link>
              </div>
            </div>
          </div>

          {/* Timeline des compétences */}
          <div className="mt-8">
            <ol className="relative ml-3 border-l border-zinc-200/70 dark:border-white/10">
              <AnimatePresence initial={true}>
                {roadmap.competencies.map((c, idx) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="group relative -ml-3 mb-4 pl-6"
                  >
                    <span className="absolute -left-3 top-2 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-white shadow ring-4 ring-white dark:ring-zinc-950">{idx+1}</span>
                    <TimelineCard
                      competency={c}
                      userId={user?.id || null}
                      progress={progress}
                      onToggle={async (key: string, next: boolean) => {
                        if (!user) return;
                        // local optimistic update
                        setProgressState(prev => {
                          const idx = prev.findIndex(p => p.module_id === c.id && p.type === 'skill' && p.key === key);
                          const copy = [...prev];
                          if (idx >= 0) copy[idx] = { ...copy[idx], completed: next };
                          else copy.push({ user_id: user.id!, module_id: c.id, type: 'skill', key, completed: next });
                          return copy;
                        });
                        try {
                          await setProgress(c.id, 'skill', key, next);
                        } catch {
                          // revert
                          setProgressState(prev => {
                            const idx = prev.findIndex(p => p.module_id === c.id && p.type === 'skill' && p.key === key);
                            const copy = [...prev];
                            if (idx >= 0) copy[idx] = { ...copy[idx], completed: !next };
                            else copy.push({ user_id: user!.id!, module_id: c.id, type: 'skill', key, completed: !next });
                            return copy;
                          });
                          setNotice("Une erreur est survenue, réessayez.");
                          setTimeout(()=> setNotice(null), 2000);
                        }
                      }}
                      keyForAction={keyForAction}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </div>

          {roadmap.practice && roadmap.practice.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold">Exercices pratiques</h3>
              <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {roadmap.practice.map((p) => (
                  <li key={p.id} className="rounded-2xl border border-zinc-200/70 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-900/60">
                    <div className="font-semibold">{p.title}</div>
                    <div className="opacity-80">{p.description}</div>
                    {p.est_hours ? <div className="mt-1 text-xs opacity-60">~{p.est_hours}h</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {notice && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-yellow-500/15 px-3 py-2 text-sm text-yellow-800 ring-1 ring-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-200">{notice}</div>
      )}

  {uiLoading && <LoadingOverlay />}
    </div>
  );
}

function Badge({ level }: { level: Competency['level'] }) {
  const map = {
    debutant: 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-300',
    intermediaire: 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-300',
    avance: 'bg-purple-500/15 text-purple-600 ring-1 ring-purple-500/30 dark:text-purple-300'
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[level]}`}>{level}</span>;
}

function TimelineCard({ competency, userId, progress, onToggle, keyForAction }: {
  competency: Competency,
  userId: string | null,
  progress: ProgressRecord[],
  onToggle: (key: string, next: boolean) => Promise<void> | void,
  keyForAction: (moduleId: string, subIndex: number, actionIndex: number, actionText: string) => string,
}) {
  const [open, setOpen] = useState(false);
  // Calcul progression: nombre d'actions cochées / total d'actions
  const { total, done } = useMemo(() => {
    let t = 0, d = 0;
    competency.subskills.forEach((s, si) => {
      const acts = s.actions ?? [];
      acts.forEach((a, ai) => {
        t += 1;
        const key = keyForAction(competency.id, si, ai, a);
        const rec = progress.find(p => p.module_id === competency.id && p.type === 'skill' && p.key === key);
        if (rec?.completed) d += 1;
      });
    });
    return { total: t, done: d };
  }, [competency, progress, keyForAction]);
  const pct = computeModuleProgress(total, done);
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{competency.name}</h3>
            <Badge level={competency.level} />
          </div>
          <p className="mt-1 text-sm opacity-80">{competency.description}</p>
          <div className="mt-2 text-xs opacity-60">{competency.outcomes.length} résultats attendus • {total > 0 ? `${pct}%` : 'Aucune action'}</div>
        </div>
        <button onClick={() => setOpen(v=>!v)} className="inline-flex items-center gap-1 rounded-xl border border-zinc-200/70 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-white/10">
          {open ? <><Check className="h-3.5 w-3.5"/> Masquer</> : <><ChevronDown className="h-3.5 w-3.5"/> Détails</>}
        </button>
      </div>
      {total > 0 && (
        <div className="mx-4 mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: `${pct}%` }} />
        </div>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-zinc-200/70 p-4 text-sm dark:border-white/10"
          >
            <div>
              <div className="text-xs font-medium uppercase tracking-wide opacity-70">Résultats attendus</div>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {competency.outcomes.map((o, i) => (<li key={i}>{o}</li>))}
              </ul>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wide opacity-70">Sous-compétences</div>
              <ul className="mt-1 space-y-2">
                {competency.subskills.map((s, si) => (
                  <li key={s.id} className="rounded-xl border border-zinc-200/70 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/40">
                    <div className="font-medium">{s.name}</div>
                    <div className="opacity-80">{s.why}</div>
                    {s.tips ? <div className="mt-1 text-xs opacity-70">Astuce: {s.tips}</div> : null}
                    {Array.isArray(s.actions) && s.actions.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wide opacity-70">Actions</div>
                        <ul className="space-y-1.5">
                          {s.actions.map((a, ai) => {
                            const key = keyForAction(competency.id, si, ai, a);
                            const rec = progress.find(p => p.module_id === competency.id && p.type === 'skill' && p.key === key);
                            const checked = Boolean(rec?.completed);
                            return (
                              <li key={ai} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={!userId}
                                  onClick={() => onToggle(key, !checked)}
                                  className={`grid h-6 w-6 place-items-center rounded-md border text-[10px] ${checked ? 'border-green-500/50 bg-green-500/30 text-green-900 dark:text-white' : 'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/20 dark:bg-white/10 dark:text-white/70'} disabled:opacity-60`}
                                  aria-label={checked ? 'Marqué comme fait' : 'Marquer comme fait'}
                                >
                                  {checked && <Check className="h-4 w-4" />}
                                </button>
                                <span>{a}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingOverlay() {
  const steps = [
    'Analyse vos réponses…',
    'Compose votre parcours…',
    'Rédige des actions utiles…',
    'Sélectionne des ressources fiables…',
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI((v) => (v + 1) % steps.length), 3200);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/25 p-4 backdrop-blur-sm dark:bg-black/40">
      <motion.div
        role="status" aria-live="polite"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm rounded-2xl border border-zinc-200/70 bg-white p-5 text-center text-zinc-900 shadow-xl dark:border-white/10 dark:bg-zinc-900/85 dark:text-white"
      >
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 dark:border-white/20 dark:border-t-white" />
        <div className="mt-3 text-base font-semibold">Préparation du parcours</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{steps[i]}</div>
      </motion.div>
    </div>
  );
}
