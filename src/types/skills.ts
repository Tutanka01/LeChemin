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
