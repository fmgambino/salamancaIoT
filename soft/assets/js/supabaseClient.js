import { APP_CONFIG } from './config.js';
export function createSupabaseClient() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = APP_CONFIG;
  if (!window.supabase?.createClient) throw new Error('No se cargó Supabase.');
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
export const supabase = createSupabaseClient();
