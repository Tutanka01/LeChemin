import { supabase } from '../lib/supabase';

// Contract
// input: { email: string; topic: 'cyber' }
// output: { ok: true } or throws Error with safe message
export async function addToWaitlist(email: string, topic: 'cyber' = 'cyber') {
  // Client-side validation (defense in depth)
  const normalized = email.trim().toLowerCase();
  if (!normalized || normalized.length < 6 || normalized.length > 254) {
    throw new Error('Email invalide');
  }
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!re.test(normalized)) {
    throw new Error('Format d\'email invalide');
  }

  const { error } = await supabase.rpc('add_to_waitlist', { _email: normalized, _topic: topic });
  if (error) {
    // Map server errors to friendly messages without leaking details
    if (error.message?.includes('invalid_email')) throw new Error("Email invalide");
    if (error.message?.includes('invalid_topic')) throw new Error("Sujet invalide");
    if (error.code === '23505') return { ok: true }; // duplicate -> idempotent OK
    // generic
    throw new Error("Impossible d'enregistrer votre demande pour le moment.");
  }
  return { ok: true } as const;
}
