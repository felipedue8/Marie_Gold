# 🚀 Configuración de Cloudflare Pages para Marie Golden

## ⚠️ Problema Identificado
Las variables de entorno del archivo `.env` solo funcionan en desarrollo local. En producción (Cloudflare Pages), necesitas configurar las variables directamente en la plataforma.

## 🔧 Solución Paso a Paso

### 1. Acceder a Cloudflare Pages
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona tu cuenta
3. Ve a **Pages** en el menú lateral
4. Selecciona tu proyecto **Marie_Gold**

### 2. Configurar Variables de Entorno
1. En tu proyecto, ve a **Settings** (Configuración)
2. Scroll hasta **Environment variables**
3. Haz clic en **Add variable** para cada una:

**Variables requeridas:**
```
VITE_GITHUB_REPO = felipedue8/Marie_Gold
VITE_GITHUB_TOKEN = [TU_TOKEN_DE_GITHUB_AQUI]
VITE_ADMIN_USERNAME = [TU_USUARIO_ADMIN]  
VITE_ADMIN_PASSWORD = [TU_PASSWORD_SEGURO]
```

### 3. Configurar para Diferentes Entornos
- **Production**: Para la rama `main`
- **Preview**: Para otras ramas y pull requests

Usa las mismas variables para ambos entornos.

### 4. Forzar Redeploy
1. Ve a **Deployments**
2. Encuentra el deployment más reciente
3. Haz clic en **Retry deployment** o haz un push al repositorio

## 🔍 Verificar Configuración

### Página de Diagnóstico
Ve a: `https://tu-dominio.pages.dev/diagnostic`

Esta página te mostrará:
- ✅ Qué variables están configuradas
- ❌ Qué variables faltan
- 📊 Estado del sistema

### Verificar en Consola del Navegador
1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Escribe: `import.meta.env`
4. Deberías ver todas las variables `VITE_*`

## 🛡️ Configuración de Build

### Build Settings en Cloudflare Pages:
```
Build command: npm run build
Build output directory: dist
Root directory: /
Node.js version: 18 o superior
```

### Variables de Build (si es necesario):
```
NODE_VERSION = 18
NPM_FLAGS = --production=false
```

## 🐛 Troubleshooting

### Si las variables aún no funcionan:
1. **Verifica el prefijo**: Todas deben empezar con `VITE_`
2. **Revisa mayúsculas**: Los nombres son case-sensitive
3. **Limpia cache**: Haz un hard refresh (Ctrl+Shift+R)
4. **Nuevo deployment**: Haz un cambio menor y push al repo

### Si el panel admin no carga:
1. Ve a `/diagnostic` primero
2. Verifica que todas las variables estén en verde
3. Revisa la consola del navegador por errores
4. Verifica que el token de GitHub sea válido

### Si las imágenes no se suben:
1. Verifica que `VITE_GITHUB_TOKEN` esté configurado
2. Verifica que `VITE_GITHUB_REPO` sea exacto: `felipedue8/Marie_Gold`
3. Revisa que el token tenga permisos de escritura

## ✅ Checklist Final

- [ ] Variables de entorno agregadas en Cloudflare Pages
- [ ] Build exitoso sin errores
- [ ] Página `/diagnostic` muestra todo en verde
- [ ] Panel admin `/admin` carga correctamente
- [ ] Login funciona con las credenciales
- [ ] Subida de imágenes funciona
- [ ] Guardado de productos funciona

## 🔗 Enlaces Útiles

- **Dashboard Cloudflare**: https://dash.cloudflare.com
- **Diagnóstico**: https://tu-dominio.pages.dev/diagnostic
- **Panel Admin**: https://tu-dominio.pages.dev/admin
- **Documentación Cloudflare Pages**: https://developers.cloudflare.com/pages/

---

Una vez configuradas las variables, el panel administrativo funcionará exactamente igual que en local. ¡Todo debería funcionar perfectamente! 🎉
