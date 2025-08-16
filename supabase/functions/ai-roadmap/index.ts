// @ts-nocheck
// Supabase Edge Function: ai-roadmap
// Runtime: Deno (deploy with `supabase functions deploy ai-roadmap`)
// Expects POST { goal: string, answers: Record<string, string | string[]> }
// Returns: Roadmap JSON (see src/types/roadmap.ts)

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
// Import Deno std http server for Edge runtime
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Hint TS locally (Node workspace) that Deno env exists at runtime
// This is safe and ignored by Deno which already provides global `Deno`.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const Deno: { env: { get(key: string): string | undefined } };

type QuizState = {
  goal: string;
  answers: Record<string, string | string[]>;
  action?: 'quiz' | 'roadmap';
};

type RoadmapResource = {
  type: 'doc' | 'video' | 'course' | 'repo' | 'tool' | 'article';
  title: string;
  url: string;
  language?: string;
  est_minutes?: number;
  difficulty?: 'debutant' | 'intermediaire' | 'avance';
};

type RoadmapModule = {
  id: string;
  title: string;
  goal: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  prerequisites: string[];
  resources: RoadmapResource[];
};

type Roadmap = {
  topic: string;
  profile_summary: string;
  estimated_weeks: number;
  modules: RoadmapModule[];
};

type QuizQuestion = {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'text';
  options?: string[];
  required?: boolean;
};

// Nouveau schéma basé sur des COMPÉTENCES (pour l'UI finale)
type CompetencyLevel = 'debutant' | 'intermediaire' | 'avance';
type SkillResourceHint = { title: string; url: string; type?: 'doc' | 'video' | 'article' };
type Subskill = { id: string; name: string; why: string; tips?: string; suggested_resources?: SkillResourceHint[] };
type Competency = { id: string; name: string; description: string; level: CompetencyLevel; outcomes: string[]; subskills: Subskill[] };
type PracticeItem = { id: string; title: string; description: string; est_hours?: number };
type SkillsRoadmap = { topic: string; profile_summary: string; estimated_weeks: number; competencies: Competency[]; practice?: PracticeItem[] };

function corsHeaders(origin?: string) {
  const o = origin && /^https?:\/\//.test(origin) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,apikey',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  } as Record<string, string>;
}

function jsonResponse(status: number, data: unknown, origin?: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

function isOriginAllowed(origin?: string) {
  const list = Deno.env.get('ALLOWED_ORIGINS');
  if (!list) return true; // no restriction configured
  if (!origin) return false;
  return list.split(',').map(s => s.trim()).includes(origin);
}

function validateRoadmap(payload: unknown): payload is Roadmap {
  try {
    const obj = payload as Roadmap;
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.topic !== 'string') return false;
    if (typeof obj.profile_summary !== 'string') return false;
    if (typeof obj.estimated_weeks !== 'number' || !isFinite(obj.estimated_weeks)) return false;
    if (!Array.isArray(obj.modules)) return false;
    for (const m of obj.modules) {
      if (typeof m.id !== 'string') return false;
      if (typeof m.title !== 'string') return false;
      if (typeof m.goal !== 'string') return false;
      if (!['debutant', 'intermediaire', 'avance'].includes(m.level as any)) return false;
      if (!Array.isArray(m.prerequisites)) return false;
      if (!Array.isArray(m.resources)) return false;
      for (const r of m.resources) {
        if (!r || typeof r !== 'object') return false;
        if (!['doc', 'video', 'course', 'repo', 'tool', 'article'].includes((r as any).type)) return false;
        if (typeof (r as any).title !== 'string') return false;
        if (typeof (r as any).url !== 'string') return false;
        if ('language' in r && typeof (r as any).language !== 'string') return false;
        if ('est_minutes' in r && typeof (r as any).est_minutes !== 'number') return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function validateSkillsRoadmap(payload: unknown): payload is SkillsRoadmap {
  try {
    const r = payload as SkillsRoadmap;
    if (!r || typeof r !== 'object') return false;
    if (typeof r.topic !== 'string') return false;
    if (typeof r.profile_summary !== 'string') return false;
    if (typeof r.estimated_weeks !== 'number' || !isFinite(r.estimated_weeks)) return false;
    if (!Array.isArray(r.competencies) || r.competencies.length === 0) return false;
    for (const c of r.competencies) {
      if (!c || typeof c !== 'object') return false;
      if (typeof c.id !== 'string' || !c.id) return false;
      if (typeof c.name !== 'string' || !c.name) return false;
      if (typeof c.description !== 'string') return false;
      if (!['debutant','intermediaire','avance'].includes((c as any).level)) return false;
      if (!Array.isArray(c.outcomes) || !c.outcomes.every(x => typeof x === 'string')) return false;
      if (!Array.isArray(c.subskills) || c.subskills.length === 0) return false;
      for (const s of c.subskills) {
        if (typeof (s as any).id !== 'string' || !(s as any).id) return false;
        if (typeof (s as any).name !== 'string' || !(s as any).name) return false;
        if (typeof (s as any).why !== 'string') return false;
        if ((s as any).tips && typeof (s as any).tips !== 'string') return false;
        if ((s as any).suggested_resources) {
          if (!Array.isArray((s as any).suggested_resources)) return false;
          for (const h of (s as any).suggested_resources) {
            if (typeof (h as any).title !== 'string' || typeof (h as any).url !== 'string') return false;
            if ((h as any).type && !['doc','video','article'].includes((h as any).type)) return false;
          }
        }
      }
    }
    if ((r as any).practice) {
      if (!Array.isArray((r as any).practice)) return false;
      for (const p of (r as any).practice) {
        if (typeof (p as any).id !== 'string' || !(p as any).id) return false;
        if (typeof (p as any).title !== 'string' || !(p as any).title) return false;
        if (typeof (p as any).description !== 'string') return false;
        if ((p as any).est_hours !== undefined && (typeof (p as any).est_hours !== 'number' || !isFinite((p as any).est_hours))) return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function validateQuiz(payload: unknown): payload is QuizQuestion[] {
  if (!Array.isArray(payload)) return false;
  for (const q of payload) {
    if (!q || typeof q !== 'object') return false;
    const t = (q as any).type;
    if (typeof (q as any).id !== 'string' || !(q as any).id) return false;
    if (typeof (q as any).text !== 'string' || !(q as any).text) return false;
    if (!['single', 'multi', 'text'].includes(t)) return false;
    if ((t === 'single' || t === 'multi')) {
      if (!Array.isArray((q as any).options) || (q as any).options.length < 2) return false;
      if (!(q as any).options.every((o: unknown) => typeof o === 'string')) return false;
    }
  }
  return true;
}

const SKILLS_PROMPT = `Tu es un assistant pédagogique francophone. Ta mission: produire une FEUILLE DE ROUTE PAR COMPÉTENCES, ultra-personnalisée à l'objectif et AUX RÉPONSES de l'utilisateur. Tu dois CONSOLIDER le niveau de départ, respecter ses contraintes (temps, priorités, contexte) et proposer une progression claire orientée résultats.

Réponds STRICTEMENT au format JSON ci-dessous (sans aucun texte autour). N'AJOUTE PAS de clés non prévues et respecte l'orthographe française:

{
  "topic": string,
  "profile_summary": string,
  "estimated_weeks": number,
  "competencies": Array<{
    "id": string,
    "name": string,
    "description": string,
    "level": "debutant" | "intermediaire" | "avance",
    "outcomes": string[],
    "subskills": Array<{
      "id": string,
      "name": string,
      "why": string,
      "tips"?: string,
      "suggested_resources"?: Array<{ "title": string, "url": string, "type"?: "doc" | "video" | "article" }>
    }>
  }>,
  "practice"?: Array<{
    "id": string,
    "title": string,
    "description": string,
    "est_hours"?: number
  }>
}

Contraintes de QUALITÉ et PERSONNALISATION:
- 3 à 6 compétences MAX, PROGRESSIVES, chacune avec 2 à 5 sous-compétences.
- Adapte les niveaux aux réponses: débutant → bases claires; intermédiaire → consolidation + structuration; avancé → perfectionnement/projets ambitieux.
- Si l'utilisateur indique un temps hebdo (ex: "2–4h"), ajuste "estimated_weeks" de façon réaliste; sinon, fournis une estimation prudente.
- "outcomes" doivent être ACTIONNABLES (verbes mesurables: "concevoir", "déployer", "automatiser", ...), et vérifiables.
- Évite les redondances entre compétences; chaque compétence doit ajouter une capacité distincte.
- "suggested_resources" est OPTIONNELLE (0–2 max) et uniquement des références STABLES (docs officielles, articles de fond). PAS de contenu douteux ni réseau social.
- Mets en avant la PRATIQUE: si possible, ajoute 1–3 "practice" alignés aux priorités/objectif indiqués.
- Pas de texte hors JSON. Pas de markdown. Respecte EXACTEMENT le schéma.
`;

const QUIZ_PROMPT = `Tu es un assistant pédagogique francophone. Génère un court quiz (3 à 6 questions) pour comprendre le NIVEAU, le CONTEXTE et les CONTRAINTES de l'utilisateur par rapport à son objectif. Réponds STRICTEMENT avec un TABLEAU JSON d'objets, sans texte autour.

Chaque question suit ce schéma TypeScript:
{
  "id": string,           // kebab-case stable et unique
  "text": string,         // question en français claire et concise
  "type": "single" | "multi" | "text",
  "options"?: string[],   // requis pour single/multi (2 à 6 options), absent pour text
  "required"?: boolean
}

Contraintes:
- Pas d'hypothèse technique si l'objectif ne l'implique pas.
- Mélange de formats (single, multi, text).
- Questions neutres, précises et adaptées au sujet.
- Couvre idéalement: expérience, contexte d'usage, temps hebdo, priorités d'apprentissage, objectif concret.
`;

const QUIZ_FOLLOWUP_PROMPT = `Tu es un assistant pédagogique francophone. En te basant sur l'objectif et les RÉPONSES DÉJÀ RECUEILLIES, décide si d'autres questions sont nécessaires.

Réponds STRICTEMENT avec un tableau JSON d'objets (même schéma que le quiz initial). Si les informations sont suffisantes pour générer une roadmap de COMPÉTENCES pertinente, renvoie UN TABLEAU VIDE []. Sinon, renvoie 1 à 3 questions MAXIMUM, très ciblées.

Rappels:
- 0 question si suffisant, sinon 1–3 maximum ciblées UNIQUEMENT sur les manques critiques (ex: temps hebdo, priorités, contexte).
- Pas de texte hors JSON, pas de markdown.
`;

interface OpenRouterChoice {
  message?: { content?: string };
}

interface OpenRouterResp {
  choices?: OpenRouterChoice[];
}

export default async function handler(req: Request) {
  const origin = req.headers.get('origin') ?? undefined;

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { ...corsHeaders(origin) } });
  }
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' }, origin);
  }

  if (!isOriginAllowed(origin)) {
    return jsonResponse(403, { error: 'Forbidden origin' }, origin);
  }

  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) {
    return jsonResponse(500, { error: 'Server not configured' }, origin);
  }

  // Optional: require authenticated user (set REQUIRE_AUTH=1 and provide SUPABASE_URL/ANON env)
  if (Deno.env.get('REQUIRE_AUTH') === '1') {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnon) {
      return jsonResponse(500, { error: 'Auth not configured' }, origin);
    }
    const supa = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
    });
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return jsonResponse(401, { error: 'Unauthorized' }, origin);
  }

  let body: QuizState;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' }, origin);
  }

  const goal = (body?.goal || '').toString().trim();
  if (!goal || goal.length < 3 || goal.length > 200) {
    return jsonResponse(400, { error: 'Invalid goal' }, origin);
  }

  const action: 'quiz' | 'roadmap' = (body?.action as any) === 'quiz' ? 'quiz' : 'roadmap';
  const userContext = JSON.stringify({ goal, answers: body.answers ?? {} });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    // Conseillé par OpenRouter: référent/titre pour observabilité
    'HTTP-Referer': 'https://lechemin.tech',
    'X-Title': 'LeChemin AI Roadmap',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: action === 'quiz' ? ((Object.keys((body as any)?.answers ?? {}).length > 0) ? QUIZ_FOLLOWUP_PROMPT : QUIZ_PROMPT) : SKILLS_PROMPT },
          { role: 'user', content: action === 'quiz' ? `Objectif et réponses: ${userContext}` : `Génère la roadmap de COMPÉTENCES personnalisée pour: ${userContext}` },
        ],
        temperature: 0.4,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return jsonResponse(502, { error: 'Upstream error', status: resp.status }, origin);
    }

    const data = (await resp.json()) as OpenRouterResp;
    const content = data?.choices?.[0]?.message?.content ?? '';

    // Extract JSON (object or array), tolerant to code fences/backticks
    function extractJson(text: string): string | null {
      // fenced JSON first
      const fenceJson = text.match(/```json\s*([\s\S]*?)```/i);
      if (fenceJson) return fenceJson[1].trim();
      const fenceAny = text.match(/```[a-zA-Z]*\s*([\s\S]*?)```/);
      if (fenceAny) return fenceAny[1].trim();
      // direct JSON
      try { JSON.parse(text); return text; } catch {}
      // try object slice
      const oStart = text.indexOf('{');
      const oEnd = text.lastIndexOf('}');
      if (oStart !== -1 && oEnd !== -1 && oEnd > oStart) {
        const slice = text.slice(oStart, oEnd + 1);
        try { JSON.parse(slice); return slice; } catch {}
      }
      // try array slice
      const aStart = text.indexOf('[');
      const aEnd = text.lastIndexOf(']');
      if (aStart !== -1 && aEnd !== -1 && aEnd > aStart) {
        const slice = text.slice(aStart, aEnd + 1);
        try { JSON.parse(slice); return slice; } catch {}
      }
      return null;
    }

    const raw = extractJson(content);
    if (!raw) return jsonResponse(502, { error: 'Invalid JSON from model' }, origin);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return jsonResponse(502, { error: 'Invalid JSON from model' }, origin);
    }

    if (action === 'quiz') {
      if (!validateQuiz(parsed)) {
        return jsonResponse(502, { error: 'Response failed validation (quiz)' }, origin);
      }
      return jsonResponse(200, parsed, origin);
    } else {
      if (!validateSkillsRoadmap(parsed)) {
        return jsonResponse(502, { error: 'Response failed validation (skills_roadmap)' }, origin);
      }
      return jsonResponse(200, parsed, origin);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('AbortError')) {
      return jsonResponse(504, { error: 'Upstream timeout' }, origin);
    }
    return jsonResponse(500, { error: 'Internal error', message: msg }, origin);
  } finally {
    clearTimeout(timeout);
  }
}

// Route binding
serve(handler);
