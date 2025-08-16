import type { SkillsRoadmap } from '../types/skills';
import { supabase } from './supabase';

export type QuizQuestion = {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'text';
  options?: string[];
  required?: boolean;
};

export type QuizState = {
  goal: string;
  answers: Record<string, string | string[]>;
};

async function buildHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (anon) {
    // Par défaut, envoyer anon pour CORS fonctions Supabase
    headers['Authorization'] = `Bearer ${anon}`;
    headers['apikey'] = anon;
  }
  // Si l'utilisateur est connecté, ajouter son access_token (utile si la fonction exige AUTH)
  try {
    const { data } = await supabase.auth.getSession();
    const access = data.session?.access_token;
    if (access) headers['Authorization'] = `Bearer ${access}`;
  } catch {}
  return headers;
}

// Mock client: remplacera des appels serveur vers OpenRouter (quiz bientôt migré aussi)
export async function startQuiz(goal: string): Promise<QuizQuestion[]> {
  const endpoint = import.meta.env.VITE_AI_ROADMAP_ENDPOINT as string | undefined;
  if (endpoint) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: await buildHeaders(),
        body: JSON.stringify({ action: 'quiz', goal: goal.trim(), answers: {} }),
      });
      if (resp.ok) {
        return (await resp.json()) as QuizQuestion[];
      }
      // eslint-disable-next-line no-console
      console.warn('AI quiz endpoint error', resp.status);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('AI quiz endpoint unreachable, using mock', e);
    }
  }
  await new Promise(r => setTimeout(r, 160));
  const g = goal.trim() || 'votre sujet';
  return [
    { id: 'experience', text: `Votre expérience actuelle liée à ${g} ?`, type: 'single', options: ['Débutant', 'Intermédiaire', 'Avancé'], required: true },
    { id: 'contexte', text: `Dans quel contexte souhaitez-vous appliquer ${g} ?`, type: 'single', options: ['Personnel', 'Études', 'Professionnel', 'Reconversion'] },
    { id: 'format', text: 'Formats d’apprentissage préférés ?', type: 'multi', options: ['Docs', 'Vidéos', 'Cours', 'Projets pratiques'] },
  ];
}

export async function nextQuestions(state: QuizState): Promise<QuizQuestion[]> {
  const endpoint = import.meta.env.VITE_AI_ROADMAP_ENDPOINT as string | undefined;
  if (endpoint) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: await buildHeaders(),
        body: JSON.stringify({ action: 'quiz', goal: state.goal.trim(), answers: state.answers }),
      });
      if (resp.ok) {
        return (await resp.json()) as QuizQuestion[];
      }
      // eslint-disable-next-line no-console
      console.warn('AI next-quiz endpoint error', resp.status);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('AI next-quiz endpoint unreachable, using mock', e);
    }
  }
  await new Promise(r => setTimeout(r, 160));
  const exp = state.answers['experience'];
  if (!exp) return [];
  // Follow-up stops once the specific follow-up is answered
  if (exp === 'Débutant') {
    if (!state.answers['temps_hebdo']) {
      return [{ id: 'temps_hebdo', text: 'Temps disponible par semaine ?', type: 'single', options: ['2–4h', '5–8h', '9–12h', '13h+'] }];
    }
    return [];
  }
  if (exp === 'Intermédiaire') {
    const v = state.answers['priorites'];
    if (!Array.isArray(v) || v.length === 0) {
      return [{ id: 'priorites', text: 'Vos priorités ?', type: 'multi', options: ['Bases à consolider', 'Pratique guidée', 'Outils & méthodo', 'Théorie avancée'] }];
    }
    return [];
  }
  // Avancé
  if (!state.answers['objectif']) {
    return [{ id: 'objectif', text: 'Objectif principal ?', type: 'single', options: ['Perfectionnement', 'Certification', 'Projet concret', 'Enseignement/mentorat'] }];
  }
  return [];
}

export async function generateRoadmap(state: QuizState): Promise<SkillsRoadmap> {
  // Si une URL d'API est fournie, appeler l'Edge Function sécurisée
  const endpoint = import.meta.env.VITE_AI_ROADMAP_ENDPOINT as string | undefined;
  if (endpoint) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: await buildHeaders(),
  body: JSON.stringify({ action: 'roadmap', goal: state.goal, answers: state.answers }),
      });
      if (resp.ok) {
  const data = (await resp.json()) as SkillsRoadmap;
        return data;
      }
      // Non-200: fallback au mock
      // eslint-disable-next-line no-console
      console.warn('AI endpoint error', resp.status);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('AI endpoint unreachable, using mock', e);
    }
  }

  // Fallback mock déterministe
  await new Promise(r => setTimeout(r, 250));
  const g = state.goal.trim() || 'votre sujet';
  return {
    topic: g,
    profile_summary: 'Synthèse basée sur vos réponses (exemple mock).',
    estimated_weeks: 6,
    competencies: [
      {
        id: 'fondamentaux',
        name: `${g}: fondamentaux`,
        description: `Comprendre les bases essentielles de ${g}.`,
        level: 'debutant',
        outcomes: [
          `Expliquer les concepts clés de ${g}`,
          `Appliquer les bases dans un petit projet`
        ],
        subskills: [
          { id: 'vocabulaire', name: 'Vocabulaire clé', why: `Maîtriser les termes courants liés à ${g}.` },
          { id: 'premiere-pratique', name: 'Première pratique', why: 'Ancrer les notions par la pratique.', tips: 'Objectifs courts et réguliers.' }
        ]
      },
      {
        id: 'approfondissement',
        name: 'Approfondissement',
        description: 'Consolider et élargir les compétences avec des exercices.',
        level: 'intermediaire',
        outcomes: [ 'Résoudre des cas concrets', 'Structurer une démarche' ],
        subskills: [
          { id: 'analyse', name: 'Analyse de cas', why: 'Développer le raisonnement et la prise de décision.' },
          { id: 'bonne-pratiques', name: 'Bonnes pratiques', why: 'Améliorer la qualité et la robustesse.' }
        ]
      }
    ],
    practice: [
      { id: 'mini-projet-1', title: `Mini-projet ${g}`, description: 'Mettre en pratique les bases sur un cas simple.', est_hours: 3 }
    ]
  };
}
