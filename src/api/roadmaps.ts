import { supabase } from '../lib/supabase';
import type { SkillsRoadmap } from '../types/skills';

export type SavedRoadmap = {
  id: string;
  topic: string;
  kind: 'skills';
  payload: SkillsRoadmap;
  created_at: string;
  updated_at: string;
};

export async function saveRoadmap(payload: SkillsRoadmap): Promise<{ id: string } | { error: string }> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user?.id;
  if (!uid) return { error: 'not_authenticated' };
  const insert = {
    user_id: uid,
    topic: payload.topic,
    kind: 'skills' as const,
    payload,
  } as const;
  const { data, error } = await supabase.from('roadmaps').insert(insert).select('id').single();
  if (error) return { error: error.message };
  return { id: data!.id };
}

export async function listMyRoadmaps(): Promise<SavedRoadmap[] | { error: string }> {
  const { data, error } = await supabase.from('roadmaps').select('*').order('created_at', { ascending: false });
  if (error) return { error: error.message };
  return (data as any[]).map((r) => ({ ...r, payload: r.payload as SkillsRoadmap })) as SavedRoadmap[];
}

export async function getRoadmap(id: string): Promise<SavedRoadmap | null | { error: string }> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    return { error: error.message };
  }
  return { ...(data as any), payload: (data as any).payload as SkillsRoadmap } as SavedRoadmap;
}
