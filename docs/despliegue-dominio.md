# Despliegue y dominio propio

El sitio se publica solo en GitHub Pages con cada push a `main` (`.github/workflows/deploy.yml`).
URL actual: https://josed235.github.io/calipieles-landing/

## Costo

| Concepto | Dónde | Costo aproximado |
|---|---|---|
| Hosting | GitHub Pages | Gratis (requiere repositorio público en el plan gratis) |
| HTTPS | GitHub Pages (Let's Encrypt) | Gratis |
| DNS | Cloudflare | Gratis |
| Dominio `calipieles.com` | Cloudflare Registrar (alternativa: Porkbun) | US$10–11 al año, renueva al mismo precio |

Evitar GoDaddy y Hostinger: el primer año es barato y la renovación cuesta 2–3 veces más.
`.com.co` cuesta más y se compra en un registrador colombiano; solo si el cliente lo prefiere.

## Paso a paso (en este orden)

1. **Comprar el dominio.** Crear cuenta en Cloudflare, ir a *Domain Registration → Register Domains*, verificar que `calipieles.com` esté disponible y comprarlo.
2. **Crear los registros DNS** en Cloudflare (*DNS → Records*), todos en modo "DNS only" (nube gris):

   | Tipo | Nombre | Valor |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `josed235.github.io` |

3. **Agregar el archivo `public/CNAME`** con una sola línea: `calipieles.com`. Vite lo copia a `dist/` y así el dominio no se pierde en cada despliegue.
4. **Actualizar `index.html`:** cambiar `og:url` y `og:image` a `https://calipieles.com/` y `https://calipieles.com/og.jpg`.
5. **Hacer commit y push a `main`.** Esperar a que termine la acción *Deploy a GitHub Pages*.
6. **Configurar GitHub:** en el repositorio ir a *Settings → Pages*, escribir `calipieles.com` en *Custom domain* y guardar. Esperar la verificación DNS (de minutos a unas horas).
7. **Activar "Enforce HTTPS"** en la misma pantalla, cuando GitHub termine de emitir el certificado.
8. **Verificar:**
   - `https://calipieles.com` y `https://www.calipieles.com` abren el sitio con candado.
   - Pegar el enlace en WhatsApp y comprobar que sale la vista previa con imagen.
   - Revisar el enlace en https://developers.facebook.com/tools/debug/ (botón *Scrape Again* si muestra datos viejos).

## Después

- Registrar el sitio en Google Business Profile y Google Search Console.
- Cambiar el enlace en Facebook y en las fichas de directorios (ver `pendientes-cliente.md`).
- Cancelar el sitio UENI cuando el nuevo esté en línea.
