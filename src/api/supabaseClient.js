import { createClient } from '@supabase/supabase-js';

// 1. Tu URL de Supabase
const supabaseUrl = 'https://vwfppxyzfbsihkwaqvuc.supabase.co';

// 2. Tu Clave Pública (Publishable key)
const supabaseKey = 'sb_publishable_ru0XWbzcgWqj5JYMD6cYGQ_WRQfIMGM';

// Inicializamos la conexión real a la nube
export const supabase = createClient(supabaseUrl, supabaseKey);

// Mantenemos la simulación de usuario para que la app sepa quién eres
export const base44 = {
  auth: {
    me: async () => {
      // Aquí definimos que el usuario activo eres tú
      return { email: 'busonlautaro@gmail.com' }; 
    },
    redirectToLogin: () => {
      window.location.reload();
    }
  }
};