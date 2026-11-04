// npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { estadoTienda } from "./horario.js";

// Colombia es UTC-5 todo el año: las 10:00 en Cali son las 15:00 UTC.
const cali = (iso) => new Date(`${iso}-05:00`);

test("abierto un martes en la mañana", () => {
  assert.deepEqual(estadoTienda(cali("2026-11-03T10:00")), { abierto: true, texto: "Abierto ahora. Cierra a las 12:00 m." });
});
test("almuerzo: abre a las 2", () => {
  assert.equal(estadoTienda(cali("2026-11-03T12:30")).texto, "Cerrado ahora. Abre hoy a las 2:00 p. m.");
});
test("viernes en la noche: abre mañana sábado", () => {
  assert.equal(estadoTienda(cali("2026-11-06T18:00")).texto, "Cerrado ahora. Abre mañana a las 8:30 a. m.");
});
test("sábado 1 p. m. en punto ya está cerrado; abre el lunes", () => {
  assert.equal(estadoTienda(cali("2026-11-07T13:00")).texto, "Cerrado ahora. Abre el lunes a las 8:30 a. m.");
});
test("tarde: cierra a las 5", () => {
  assert.equal(estadoTienda(cali("2026-11-04T16:59")).texto, "Abierto ahora. Cierra a las 5:00 p. m.");
});
