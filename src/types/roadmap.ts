export type RoadmapResource = {
  type: 'doc' | 'video' | 'course' | 'repo' | 'tool' | 'article';
  title: string;
  url: string;
  est_minutes?: number;
  language?: 'fr' | 'en';
};

export type RoadmapModule = {
  id: string;
  title: string;
  goal: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  prerequisites: string[];
  resources: RoadmapResource[];
};

export type Roadmap = {
  topic: string;
  profile_summary: string;
  estimated_weeks: number;
  modules: RoadmapModule[];
};
