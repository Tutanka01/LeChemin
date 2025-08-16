import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import type { SkillsRoadmap, Competency } from '../types/skills';
import { startQuiz, nextQuestions, generateRoadmap, type QuizQuestion, type QuizState } from '../lib/aiClient';

export default function ParcoursPersonnalise() {
  const [step, setStep] = useState<'goal' | 'quiz' | 'result'>('goal');
  const [goal, setGoal] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<SkillsRoadmap | null>(null);
  const [uiLoading, setUiLoading] = useState(false);
  const state: QuizState = { goal, answers };

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
        setStep('result');
      } else {
        setQuestions(more);
      }
    } finally {
      setLoading(false); setUiLoading(false);
    }
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
          <h2 className="text-2xl font-bold tracking-tight">Compétences pour: {roadmap.topic}</h2>
          <p className="mt-1 opacity-80">{roadmap.profile_summary}</p>
          <p className="mt-1 text-sm opacity-70">Estimation: {roadmap.estimated_weeks} semaines</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roadmap.competencies.map((c) => (
              <CompetencyCard key={c.id} competency={c} />
            ))}
          </div>
          {roadmap.practice && roadmap.practice.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Exercices pratiques</h3>
              <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                {roadmap.practice.map((p) => (
                  <li key={p.id} className="rounded-xl border border-zinc-200/70 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-900/60">
                    <div className="font-semibold">{p.title}</div>
                    <div className="opacity-80">{p.description}</div>
                    {p.est_hours ? <div className="mt-1 text-xs opacity-60">~{p.est_hours}h</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Commencer ce parcours</button>
            <button className="rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/60">Enregistrer</button>
            <Link to="/parcours" className="rounded-xl border border-zinc-200/70 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/60">Voir tous les parcours</Link>
          </div>
        </section>
      )}

      {uiLoading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-[fadeIn_300ms_ease] rounded-2xl border border-white/10 bg-zinc-900/80 p-5 text-center text-white shadow-2xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <div className="mt-3 font-medium">Génération en cours…</div>
            <div className="mt-1 text-sm opacity-80">Nous préparons votre parcours personnalisé.</div>
          </div>
        </div>
      )}
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

function CompetencyCard({ competency }: { competency: Competency }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-5 transition-shadow hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60">
      <div className="absolute -inset-px -z-10 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, #22d3ee22, #818cf822)' }} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{competency.name}</h3>
          <p className="mt-1 text-sm opacity-80">{competency.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge level={competency.level} />
            <span className="text-xs opacity-60">{competency.outcomes.length} résultats</span>
          </div>
        </div>
        <button onClick={() => setOpen(v=>!v)} className="rounded-xl border border-zinc-200/70 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-white/10">{open ? 'Masquer' : 'Détails'}</button>
      </div>
      {open && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide opacity-70">Résultats attendus</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {competency.outcomes.map((o, i) => (<li key={i}>{o}</li>))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide opacity-70">Sous-compétences</div>
            <ul className="mt-1 space-y-2">
              {competency.subskills.map((s) => (
                <li key={s.id} className="rounded-xl border border-zinc-200/70 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="font-medium">{s.name}</div>
                  <div className="opacity-80">{s.why}</div>
                  {s.tips ? <div className="mt-1 text-xs opacity-70">Astuce: {s.tips}</div> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
