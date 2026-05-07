// Shared frontend Supabase client. This must use the public anon key, never a service role key.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const missingEnvVars = [
  !supabaseUrl && "REACT_APP_SUPABASE_URL",
  !supabaseAnonKey && "REACT_APP_SUPABASE_ANON_KEY",
].filter(Boolean);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Supabase environment variable(s): ${missingEnvVars.join(
      ", "
    )}. Add them to family-tree/.env before starting the app.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
