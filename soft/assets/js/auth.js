import { supabase } from './supabaseClient.js';
import { state } from './state.js';
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  state.session = data.session || state.session || { user: { email: state.profile.email } };
  return state.session;
}
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  state.session = data.session || null;
  if (state.session?.user?.email) state.profile.email = state.session.user.email;
  return data;
}
export async function signUp(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
  if (error) throw error;
  return data;
}
export async function resetPassword(email) {
  const redirectTo = `${location.origin}${location.pathname}#/login`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}
export async function signOut() {
  try { await supabase.auth.signOut(); } catch {}
  state.session = null;
}
export function isAuthenticated() { return Boolean(state.session); }
