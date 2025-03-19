import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verificar si las variables de entorno están definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are not defined!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
