// Animaciones e interacciones de la landing. Si el sistema pide reducir el movimiento, la página queda estática y completa.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { estadoTienda } from "./horario.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// Encabezado: sólido fuera del hero
const encabezado = $(".encabezado");
const hero = $(".hero");
new IntersectionObserver(([e]) => encabezado.classList.toggle("solido", !e.isIntersecting), { rootMargin: "-68px 0px 0px" }).observe(hero);

// ¿Abierto ahora?
const abierto = $(".abierto");
const estado = estadoTienda();
abierto.textContent = estado.texto;
abierto.classList.toggle("si", estado.abierto);
abierto.hidden = false;

// Lupa: muestra la textura del cuero ampliada bajo el puntero (sólo con mouse)
if (matchMedia("(pointer: fine)").matches) {
  const lupa = $(".lupa");
  const ZOOM = 2.6;
  $$(".muestra figure").forEach((fig) => {
    const img = fig.querySelector("img");
    fig.classList.add("con-lupa");
    fig.addEventListener("pointerenter", () => {
      lupa.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
      lupa.classList.add("activa");
    });
    fig.addEventListener("pointerleave", () => lupa.classList.remove("activa"));
    fig.addEventListener("pointermove", (e) => {
      const r = img.getBoundingClientRect();
      lupa.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
      lupa.style.backgroundPosition = `${-(e.clientX - r.left) * ZOOM + 95}px ${-(e.clientY - r.top) * ZOOM + 95}px`;
      lupa.style.translate = `${e.clientX}px ${e.clientY}px`;
    });
  });
}

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) animar();

function animar() {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Scroll suave
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const destino = $(a.getAttribute("href"));
      if (destino) { e.preventDefault(); lenis.scrollTo(destino, { offset: -68 }); }
    })
  );

  // El encabezado se esconde al bajar y vuelve al subir
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (st) => encabezado.classList.toggle("oculto", st.direction === 1 && st.scroll() > innerHeight),
  });

  // Hero: las tiras caen y quedan colgando; luego el titular letra por letra
  const tiras = $$(".tira");
  gsap.set(".hero h1", { opacity: 0 });
  gsap.from(tiras, {
    yPercent: -105, rotation: () => gsap.utils.random(-10, 10),
    duration: 1.6, ease: "elastic.out(1, 0.45)",
    stagger: { each: 0.06, from: "random" },
  });
  document.fonts.ready.then(() => {
    const titular = SplitText.create(".hero h1", { type: "chars", mask: "chars" });
    gsap.set(".hero h1", { opacity: 1 });
    gsap.timeline({ delay: 0.4 })
      .from(titular.chars, { yPercent: 110, rotation: 8, duration: 0.9, ease: "power4.out", stagger: 0.025 })
      .from(".hero-texto > p, .hero .acciones", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, "-=0.5")
      .from(".sello", { scale: 0, rotation: -120, duration: 1, ease: "back.out(1.7)" }, "-=0.6");
  });

  // El sello gira solo y acelera con el scroll
  gsap.to(".sello .anillo", { rotation: 360, duration: 18, ease: "none", repeat: -1 });
  gsap.to(".sello", { rotation: 240, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  // Las tiras se mecen con el puntero
  if (matchMedia("(pointer: fine)").matches) {
    const mecer = tiras.map((t) => gsap.quickTo(t, "rotation", { duration: 1.2, ease: "elastic.out(1, 0.3)" }));
    hero.addEventListener("pointermove", (e) => {
      tiras.forEach((t, i) => {
        const r = t.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        mecer[i](gsap.utils.clamp(-6, 6, -dx * 14));
      });
    });
    hero.addEventListener("pointerleave", () => mecer.forEach((m) => m(0)));
  }

  // Al bajar, el perchero sube más lento que la página
  gsap.to(".perchero", { yPercent: 18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  // Muestrario horizontal en escritorio; en móvil se queda el deslizamiento nativo
  gsap.matchMedia().add("(min-width: 900px)", () => {
    const seccion = $(".muestrario");
    const pista = seccion.querySelector(".pista");
    seccion.classList.add("horizontal");
    const distancia = () => pista.scrollWidth - innerWidth;
    const recorrido = gsap.to(pista, {
      x: () => -distancia(), ease: "none",
      scrollTrigger: {
        trigger: seccion, start: "top top", end: () => "+=" + distancia(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
      },
    });
    gsap.to(".progreso i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: seccion, start: "top top", end: () => "+=" + distancia(), scrub: true } });
    // Cada foto se desliza un poco dentro de su marco mientras pasa
    seccion.querySelectorAll(".muestra img").forEach((img) =>
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: recorrido, start: "left right", end: "right left", scrub: true } })
    );
    return () => seccion.classList.remove("horizontal");
  });

  // Lista de materiales: entra renglón por renglón
  gsap.from(".lista-grande li", { x: 60, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: ".lista-grande", start: "top 80%" } });

  // Cómo pedir: la costura se cose con el scroll y los números aparecen a su paso
  gsap.fromTo(".pasos", { "--trazo": 0 }, { "--trazo": 1, ease: "none", scrollTrigger: { trigger: ".pasos", start: "top 75%", end: "top 30%", scrub: true } });
  gsap.from(".pasos .num", { scale: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.25, scrollTrigger: { trigger: ".pasos", start: "top 70%" } });

  // Frase de "por qué": se ilumina palabra por palabra al leerla
  const frase = SplitText.create(".porque blockquote", { type: "words" });
  gsap.from(frase.words, { opacity: 0.15, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".porque blockquote", start: "top 80%", end: "bottom 45%", scrub: true } });

  // Foto de "por qué" con parallax suave
  gsap.fromTo("[data-parallax]", { yPercent: -8 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".porque", start: "top bottom", end: "bottom top", scrub: true } });

  // La tarjeta llega girando y se acomoda
  gsap.from(".tarjeta-visita", { rotation: -9, y: 60, opacity: 0, duration: 1.1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".visita", start: "top 70%" } });

  // Cierre: el logotipo grande sube letra por letra
  document.fonts.ready.then(() => {
    const marca = SplitText.create(".marca", { type: "chars", mask: "chars" });
    gsap.from(marca.chars, { yPercent: 100, ease: "power3.out", stagger: 0.04, duration: 0.9, scrollTrigger: { trigger: ".cierre", start: "top 60%" } });
  });
}
