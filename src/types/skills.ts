export type CompetencyLevel = 'debutant' | 'intermediaire' | 'avance';

export type SkillResourceHint = {
  title: string;
  url: string;
  type?: 'doc' | 'video' | 'article';
};

export type Subskill = {
  id: string;
  name: string;
  why: string;
  tips?: string;
  suggested_resources?: SkillResourceHint[];
  // Actions concrètes et vérifiables que l’utilisateur peut cocher.
  // Exemple: ["Installer Docker", "Construire une image avec Dockerfile", "Déployer avec Compose"].
  // Rester concis (2–6 actions). Si absent, l’UI n’affiche que la description.
  actions?: string[];
};

export type Competency = {
  id: string;
  name: string;
  description: string;
  level: CompetencyLevel;
  outcomes: string[];
  subskills: Subskill[];
};

export type PracticeItem = {
  id: string;
  title: string;
  description: string;
  est_hours?: number;
};

export type SkillsRoadmap = {
  topic: string;
  profile_summary: string;
  estimated_weeks: number;
  competencies: Competency[];
  practice?: PracticeItem[];
};
