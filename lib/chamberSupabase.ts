import { createClient } from "@supabase/supabase-js";

const chamberUrl = process.env.NEXT_PUBLIC_CHAMBER_SUPABASE_URL!;
const chamberAnonKey = process.env.NEXT_PUBLIC_CHAMBER_SUPABASE_ANON_KEY!;

export const chamberSupabase = createClient(
  chamberUrl,
  chamberAnonKey
);