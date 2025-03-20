import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verificar si las variables de entorno están definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase environment variables are not defined!');
} else {
  console.log('Supabase configuration found:', { 
    url: supabaseUrl.replace(/^(https:\/\/[^.]+).*$/, '$1...'), // Muestra solo el inicio de la URL por seguridad
    keyConfigured: !!supabaseKey
  });
}

// Opciones adicionales para el cliente
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
};

// Crear el cliente
export const supabase = createClient(supabaseUrl, supabaseKey, options);

// Definición del tipo para el resultado de la verificación
interface ConnectionStatus {
  connected: boolean;
  error?: string;
  code?: string;
  type?: string;
}

// Verificar conexión (opcional)
export const checkSupabaseConnection = async (): Promise<ConnectionStatus> => {
  // Crear un promesa con timeout para evitar que la verificación se quede colgada
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Connection check timed out after 5 seconds')), 5000)
  );
  
  try {
    // Competir entre la verificación real y el timeout
    const result = await Promise.race([
      // Verificación real de la conexión
      (async () => {
        try {
          // Usamos una operación simple que debería fallar rápido si hay problemas
          const { data, error } = await supabase.from('appointments').select('count', { count: 'exact', head: true });
          
          if (error) {
            console.error('❌ Supabase connection check failed:', error);
            // Informamos más detalles sobre el error
            if (error.code === '42P01') {
              return { connected: false, error: 'La tabla appointments no existe' };
            } else if (error.code === '28P01') {
              return { connected: false, error: 'Credenciales de Supabase inválidas' };
            } else if (error.code === 'PGRST116') {
              return { connected: false, error: 'Permisos insuficientes en Supabase' };
            }
            return { connected: false, error: error.message, code: error.code };
          }
          
          console.log('✅ Supabase connection successful');
          return { connected: true };
        } catch (err) {
          console.error('❌ Supabase operation error:', err);
          return { 
            connected: false, 
            error: err instanceof Error ? err.message : 'Error desconocido en la operación de Supabase',
            type: 'operation_error'
          };
        }
      })(),
      timeoutPromise
    ]);
    
    return result;
  } catch (err) {
    // Si llegamos aquí, probablemente sea por el timeout
    if (err instanceof Error && err.message.includes('timed out')) {
      console.error('❌ Supabase connection timeout');
      return { connected: false, error: 'La conexión a Supabase agotó el tiempo de espera', type: 'timeout' };
    }
    
    console.error('❌ Unexpected Supabase connection error:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Error inesperado al verificar la conexión',
      type: 'unexpected_error'
    };
  }
};
