# Together Website - Documentación

Este archivo contiene información útil para el proyecto Together Website.

## Recursos y snippets

### Analytics

Para incluir analytics respetuosos con la privacidad:

```html
<!-- 100% privacy-first analytics -->
<script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```

### Twilio SMS

El proyecto usa Twilio para enviar SMS. La función serverless está en `netlify/functions/send-sms.js`.

Variables de entorno necesarias:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

### Enlaces importantes

- Sitio desplegado: https://together-solutions.windsurf.build
- Dashboard de Netlify: [Acceder al proyecto en Netlify](https://app.netlify.com/)

## Notas de desarrollo

- El sitio está construido con HTML, CSS y JavaScript, sin frameworks adicionales
- Se usa Netlify Functions para el backend serverless
- La estructura del proyecto mantiene un enfoque minimalista y centrado en el usuario

---

*Última actualización: 12 de mayo de 2025*
