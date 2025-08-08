# 🛠️ Setup del Panel Administrativo - Marie Golden

## ⚠️ IMPORTANTE - Configuración de Seguridad

### 1. Verifica que el archivo .env NO esté en Git:
```bash
git status
```
Si aparece `.env` en la lista, ejecuta:
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### 2. Cambia las credenciales por defecto en .env:
```env
VITE_ADMIN_USERNAME=tu_usuario_seguro
VITE_ADMIN_PASSWORD=tu_password_super_segura_2025
```

### 3. Instalar dependencias (si es necesario):
```bash
npm install
```

### 4. Ejecutar en desarrollo:
```bash
npm run dev
```

### 5. Acceso al Panel Administrativo:
- URL: `http://localhost:5173/admin`
- Credenciales: Las que configuraste en el archivo .env
- Enlace discreto: Hay un pequeño punto (•) en el footer

## 🔧 Funcionalidades del Panel:

### ✅ Ya Implementado:
- 🔐 Sistema de autenticación seguro
- 📸 Subida de imágenes a GitHub con **optimización automática**
- ✏️ Edición de productos existentes
- ➕ Creación de nuevos productos
- 🗑️ Eliminación de productos
- 💾 Guardado automático en GitHub
- 🖼️ Galería de imágenes
- 📱 Diseño responsivo
- ⚡ **Optimización automática de imágenes**:
  - Conversión automática a formato WebP
  - Compresión inteligente (hasta 80% reducción)
  - Redimensionado automático (máximo 800px)
  - Calidad optimizada para web
  - Estadísticas detalladas de optimización

### 🛡️ Seguridad:
- Token de GitHub en variables de entorno
- Credenciales protegidas
- Validación de tipos de archivo
- Límite de tamaño de imágenes optimizado
- Sesión persistente con localStorage

### 🚀 Optimización de Imágenes:
- **Automática**: Todas las imágenes se optimizan sin intervención
- **WebP**: Formato moderno para mejor compresión
- **Compresión**: Reduce archivos hasta 80% manteniendo calidad
- **Redimensionado**: Máximo 800px para productos, 300px para thumbnails
- **Estadísticas**: Modal con información detallada de la optimización

### 📊 GitHub Integration:
- Subida de imágenes al repositorio
- Actualización automática de productos.js
- Commits descriptivos
- Manejo de errores robusto

## 🚀 Para Producción:

### En Vercel:
1. Agrega las variables de entorno en el dashboard
2. No subas el archivo .env al repositorio
3. Las variables deben tener el prefijo `VITE_`

### Variables requeridas:
- `VITE_GITHUB_REPO=felipedue8/Marie_Gold`
- `VITE_GITHUB_TOKEN=tu_token_aqui`
- `VITE_ADMIN_USERNAME=admin`
- `VITE_ADMIN_PASSWORD=password_seguro`

## 🔒 Notas de Seguridad:
1. Cambia las credenciales por defecto INMEDIATAMENTE
2. El token de GitHub tiene permisos de escritura - manténlo seguro
3. Considera implementar 2FA para mayor seguridad
4. El acceso admin es solo para usuarios autorizados

## 🆘 Troubleshooting:
- Si no puedes subir imágenes: Verifica el token de GitHub
- Si no guardas productos: Verifica permisos del repositorio  
- Si no puedes acceder: Verifica las credenciales en .env
- Para reset: Elimina 'marie-admin-auth' del localStorage

¡El panel administrativo está listo para usar! 🎉
