// bot.js — LÓGICA PURA
// No toca el DOM. Solo recibe input, devuelve respuesta.
// ─────────────────────────────────────────────────────────

// Enum de estados
const EstadoBot = {
  ESPERANDO_START: "ESPERANDO_START",
  SOLICITANDO_ID: "SOLICITANDO_ID",
  MENU_PRINCIPAL: "MENU_PRINCIPAL",
  PROCESANDO_SOLUCION: "PROCESANDO_SOLUCION",
  DERIVANDO_TICKET: "DERIVANDO_TICKET"
};

// Estado actual y variable de sesión
let estadoActual = EstadoBot.ESPERANDO_START;
let opcionSeleccionada = "";

// BD cargada desde db.json (la llena app.js al inicio)
let DB = null;

// ── Carga la BD desde el JSON ─────────────────────────────
async function cargarDB() {
  const res = await fetch("data/db.json");
  DB = await res.json();
}

// ── Equivalente a empleadosValidos.Contains(input) ───────
function legajoValido(legajo) {
  return DB.empleados.some(e => e.legajo === legajo.trim());
}

// ── Equivalente a soluciones.ContainsKey(input) ──────────
function opcionValida(opcion) {
  return DB.soluciones.hasOwnProperty(opcion.trim());
}

// ── Equivalente a soluciones[userInput] ──────────────────
function getSolucion(opcion) {
  return DB.soluciones[opcion.trim()];
}

// ── Equivalente a new Random().Next(1000, 9999) ──────────
function generarTicket() {
  return Math.floor(Math.random() * 9000) + 1000;
}

// ─────────────────────────────────────────────────────────
// Función principal
// Recibe: string con el input del usuario
// Devuelve: objeto { mensajes: [], estado: "", quickReplies: [] }
// ─────────────────────────────────────────────────────────
function procesarInput(userInput) {
  const inp = userInput.trim();
  const respuesta = { mensajes: [], quickReplies: [], tipo: "normal" };

  switch (estadoActual) {

    // ── case EstadoBot.ESPERANDO_START ──────────────────
    case EstadoBot.ESPERANDO_START:
      if (inp.toLowerCase() === "/start" || inp.toLowerCase() === "hola") {
        respuesta.mensajes.push("¡Hola! Bienvenido al Soporte Técnico.");
        respuesta.mensajes.push("Por favor, ingresá tu número de Legajo:");
        estadoActual = EstadoBot.SOLICITANDO_ID;
      } else {
        respuesta.mensajes.push("[ERROR] Escribí /start o hola para comenzar.");
        respuesta.tipo = "error";
        respuesta.quickReplies = [
          { label: "/start", value: "/start" },
          { label: "hola",   value: "hola"   }
        ];
      }
      break;

    // ── case EstadoBot.SOLICITANDO_ID ───────────────────
    case EstadoBot.SOLICITANDO_ID:
      if (legajoValido(inp)) {
        respuesta.mensajes.push("Legajo validado con éxito.");
        respuesta.mensajes.push(
          "Seleccioná el tipo de falla:\n1. Problemas de Internet\n2. Falla de Software\n3. Problemas de Hardware"
        );
        respuesta.tipo = "exito";
        respuesta.quickReplies = [
          { label: "1 — Internet",  value: "1" },
          { label: "2 — Software",  value: "2" },
          { label: "3 — Hardware",  value: "3" }
        ];
        estadoActual = EstadoBot.MENU_PRINCIPAL;
      } else {
        respuesta.mensajes.push(`[ERROR] El legajo "${inp}" no existe. Ingresá un legajo válido (Ej: 1001):`);
        respuesta.tipo = "error";
      }
      break;

    // ── case EstadoBot.MENU_PRINCIPAL ───────────────────
    case EstadoBot.MENU_PRINCIPAL:
      if (opcionValida(inp)) {
        opcionSeleccionada = inp;
        const sol = getSolucion(inp);
        respuesta.mensajes.push(`Categoría: ${sol.categoria}`);
        respuesta.mensajes.push(`Solución sugerida: ${sol.texto}`);
        respuesta.mensajes.push("¿Se solucionó el problema? (Respondé: SI / NO)");
        respuesta.quickReplies = [
          { label: "SI", value: "SI" },
          { label: "NO", value: "NO" }
        ];
        estadoActual = EstadoBot.PROCESANDO_SOLUCION;
      } else {
        respuesta.mensajes.push("[ERROR] Opción no válida. Elegí una opción entre 1 y 3:");
        respuesta.tipo = "error";
        respuesta.quickReplies = [
          { label: "1 — Internet",  value: "1" },
          { label: "2 — Software",  value: "2" },
          { label: "3 — Hardware",  value: "3" }
        ];
      }
      break;

    // ── case EstadoBot.PROCESANDO_SOLUCION ──────────────
    case EstadoBot.PROCESANDO_SOLUCION:
      if (inp.toUpperCase() === "SI") {
        respuesta.mensajes.push("¡Excelente! Nos alegra haberte ayudado. Proceso finalizado. Chau.");
        respuesta.tipo = "exito";
        estadoActual = EstadoBot.ESPERANDO_START;
      } else if (inp.toUpperCase() === "NO") {
        // Entra al estado de derivación antes de generar el ticket
        estadoActual = EstadoBot.DERIVANDO_TICKET;
        const ticket = generarTicket();
        respuesta.mensajes.push("Lamentamos que no funcione. Generando ticket para Nivel 2...");
        respuesta.mensajes.push(`Ticket N° ${ticket} creado con éxito. Un técnico te contactará pronto. ¡Gracias!`);
        // El proceso queda cerrado: vuelve al estado de reposo
        estadoActual = EstadoBot.ESPERANDO_START;
      } else {
        respuesta.mensajes.push("[ERROR] Por favor respondé únicamente SI o NO:");
        respuesta.tipo = "error";
        respuesta.quickReplies = [
          { label: "SI", value: "SI" },
          { label: "NO", value: "NO" }
        ];
      }
      break;
  }

  respuesta.estado = estadoActual;
  return respuesta;
}

// Reset de sesión
function resetBot() {
  estadoActual = EstadoBot.ESPERANDO_START;
  opcionSeleccionada = "";
}