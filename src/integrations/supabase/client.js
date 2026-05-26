import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://yfsurrorbdpxfxzufzxz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dnyUni7fNeI8DG5oXNRDLg_VHbtrAZa";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
});
