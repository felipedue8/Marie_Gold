// Script para limpiar verificaciones vencidas de la base de datos
// Ejecuta: node clean-verifications.js

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta a la base de datos local
const dbPath = join(__dirname, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');

try {
  // Abrir base de datos local de desarrollo
  console.log('🧹 Limpiando verificaciones vencidas...');
  
  // Para desarrollo local, podemos usar una consulta simple
  console.log('✅ Para limpiar verificaciones vencidas en desarrollo:');
  console.log('1. Ve al panel de Wrangler en http://127.0.0.1:3000');
  console.log('2. Abre devtools [d]');
  console.log('3. Ve a la pestaña D1');
  console.log('4. Ejecuta: DELETE FROM email_verification WHERE datetime(expires_at) < datetime("now");');
  console.log('');
  console.log('O simplemente espera 5 minutos entre intentos de envío 😊');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('💡 Tip: Si necesitas enviar un código inmediatamente para pruebas,');
  console.log('   puedes modificar temporalmente el tiempo de espera en send-verification.js');
}
