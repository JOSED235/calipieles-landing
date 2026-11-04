// Horario de la tienda en minutos desde medianoche, hora de Colombia. Índice 0 = domingo.
const HORARIO = [
  [],
  [[510, 720], [840, 1020]],
  [[510, 720], [840, 1020]],
  [[510, 720], [840, 1020]],
  [[510, 720], [840, 1020]],
  [[510, 720], [840, 1020]],
  [[510, 780]],
];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const hora = (min) => {
  const h = Math.floor(min / 60), m = String(min % 60).padStart(2, "0");
  if (min === 720) return "12:00 m.";
  return `${h > 12 ? h - 12 : h}:${m} ${h < 12 ? "a. m." : "p. m."}`;
};

// Devuelve { abierto, texto } para la fecha dada, calculado en America/Bogota.
export function estadoTienda(fecha = new Date()) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Bogota", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(fecha).map((p) => [p.type, p.value])
  );
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(partes.weekday);
  const ahora = +partes.hour * 60 + +partes.minute;

  const actual = HORARIO[dia].find(([a, c]) => ahora >= a && ahora < c);
  if (actual) return { abierto: true, texto: `Abierto ahora. Cierra a las ${hora(actual[1])}` };

  for (let i = 0; i < 7; i++) {
    const d = (dia + i) % 7;
    const sig = HORARIO[d].find(([a]) => i > 0 || a > ahora);
    if (sig) {
      const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DIAS[d]}`;
      return { abierto: false, texto: `Cerrado ahora. Abre ${cuando} a las ${hora(sig[0])}` };
    }
  }
}
