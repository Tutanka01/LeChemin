import { supabase } from '../lib/supabase';

export interface ProgressRecord {
  user_id: string;
  module_id: string; // e.g., 'fondamentaux'
  type: 'skill' | 'resource';
  key: string; // skill name or resource url
  completed: boolean;
  updated_at?: string;
}

export async function getUserProgress() {
  const { data, error } = await supabase
    .from('progress')
    .select('*');
  if (error) throw error;
  return (data ?? []) as ProgressRecord[];
}

export async function setProgress(moduleId: string, type: 'skill' | 'resource', key: string, completed: boolean) {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error('Not authenticated');

  const { error } = await supabase.from('progress').upsert({
    user_id: uid,
    module_id: moduleId,
    type,
    key,
    completed,
  }, { onConflict: 'user_id,module_id,type,key' });
  if (error) throw error;
}

export function computeModuleProgress(total: number, done: number) {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}
