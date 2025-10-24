# Together Website

[![Deploy to Netlify](https://github.com/el-together/together-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/el-together/together-website/actions/workflows/deploy.yml)

Sitio web estático que presenta la plataforma Together. Diseñado para ser simple, rápido y efectivo.

## Estructura del proyecto

```
together-website/
├── assets/         # Imágenes y SVGs
├── css/            # Archivos CSS
├── js/             # JavaScript (cuando sea estrictamente necesario)
├── index.html      # Página principal
└── next.html       # Página secundaria
```

## Desarrollo local

Para trabajar en el proyecto localmente:

1. Clona este repositorio
2. Abre los archivos HTML directamente en tu navegador
3. Para realizar cambios, edita los archivos HTML, CSS o añade JavaScript solo cuando sea estrictamente necesario

## Despliegue

El sitio se despliega automáticamente a través de **Netlify** mediante GitHub Actions cuando se hace push o merge a la rama `main`.

### Despliegue Automático

Cada vez que se hace push/merge a `main`:
1. GitHub Actions ejecuta el workflow de despliegue
2. Instala las dependencias (`npm install`)
3. Despliega el sitio a Netlify
4. El sitio está disponible en: https://together.day

### Configuración Inicial

Para que el despliegue automático funcione, se deben configurar los siguientes secrets en GitHub:

**Repositorio → Settings → Secrets and variables → Actions → New repository secret**

Secrets requeridos:
- `NETLIFY_AUTH_TOKEN` - Token de autenticación de Netlify
- `NETLIFY_SITE_ID` - ID del sitio en Netlify
- `TWILIO_ACCOUNT_SID` - Account SID de Twilio (para envío de SMS)
- `TWILIO_AUTH_TOKEN` - Auth Token de Twilio
- `TWILIO_PHONE_NUMBER` - Número de teléfono Twilio

Ver instrucciones detalladas en: `.github/DEPLOYMENT.md`
