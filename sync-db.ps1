# Script para sincronizar base de datos local a remoto
# Ejecutar cada comando uno por uno

echo "Sincronizando base de datos local a remoto..."

# Crear tabla email_verification
npx wrangler d1 execute marie-gold --remote --command="CREATE TABLE IF NOT EXISTS email_verification (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, token TEXT NOT NULL, expires_at TEXT NOT NULL, verified BOOLEAN DEFAULT FALSE, created_at TEXT DEFAULT (datetime('now')), used_at TEXT DEFAULT NULL);"

# Agregar columna email_verified a usuarios (solo si no existe)
npx wrangler d1 execute marie-gold --remote --command="ALTER TABLE usuarios ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;" 2>/dev/null || echo "Columna email_verified ya existe"

# Verificar resultado
echo "Verificando tablas en remoto:"
npx wrangler d1 execute marie-gold --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

echo "Sincronización completada!"
