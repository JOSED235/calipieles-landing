# calipieles-landing

Nueva landing de Calipieles, peletería en Cali (Calle 17 # 8A-13).

La investigación del negocio está en [docs/](docs/README.md).

## Uso

```bash
npm install
npm run dev       # servidor de desarrollo con recarga; muestra también la URL para el celular
npm test          # pruebas del cálculo "abierto ahora"
npm run build     # genera dist/ listo para subir a cualquier hosting
npm run preview   # sirve dist/ para revisarlo antes de publicar
npm run imagenes  # regenera img/ desde docs/imagenes/ (requiere Python con Pillow)
```

## Estructura

- `index.html`: el contenido de la página.
- `css/estilos.css`: estilos.
- `js/main.js`: animaciones (GSAP + ScrollTrigger + SplitText), scroll suave (Lenis), lupa del muestrario y estado "abierto ahora".
- `js/horario.js`: horario de la tienda y cálculo de si está abierta, en hora de Colombia.
- `img/`: fotos optimizadas en WebP, generadas por `scripts/optimizar-imagenes.py`.

Si el sistema pide reducir el movimiento (en Windows: *Accesibilidad > Efectos visuales > Efectos de animación* apagado), la página se muestra completa pero sin animaciones.

## Pendiente antes de publicar

Ver [docs/pendientes-cliente.md](docs/pendientes-cliente.md). Lo que afecta directamente a la página:

- Confirmar el número de WhatsApp (hoy es el 320 612 6523).
- Confirmar los envíos nacionales y la asesoría gratuita.
- Falta la sección "Quiénes somos": necesita la historia del negocio y la autorización para usar la foto del mostrador.
- Cuando haya dominio, agregar `url` al JSON-LD y usar una ruta absoluta en `og:image`.
