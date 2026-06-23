// app.js — INTERFAZ
// Solo responsabilidad: leer el DOM, llamar bot.js, mostrar resultados.
// No tiene ninguna lógica de negocio ni conoce los estados del bot.
// ─────────────────────────────────────────────────────────

// ── Referencias al DOM ───────────────────────────────────
const mensajesDiv  = document.getElementById("mensajes");
const inputEl      = document.getElementById("user-input");
const sendBtn      = document.getElementById("send-btn");
const resetBtn     = document.getElementById("reset-btn");
const estadoEl     = document.getElementById("estado-actual");
const quickDiv     = document.getElementById("quick-replies");

// ── Inicialización ───────────────────────────────────────
window.addEventListener("DOMContentLoaded", async () => {
  await cargarDB();             // carga data/db.json en bot.js
  actualizarEstado("ESPERANDO_START");
  agregarMensajeBot(
    "Escribí /start o hola para comenzar.",
    "normal"
  );
  mostrarQuickReplies([
    { label: "/start", value: "/start" },
    { label: "hola",   value: "hola"   }
  ]);
});

// ── Enviar mensaje ────────────────────────────────────────
function enviar(valorInput) {
  const texto = (valorInput ?? inputEl.value).trim();
  if (!texto) return;

  agregarMensajeUsuario(texto);
  inputEl.value = "";
  limpiarQuickReplies();

  // Delega toda la lógica a bot.js
  const resultado = procesarInput(texto);

  // Muestra cada mensaje del bot con pequeño delay
  resultado.mensajes.forEach((msg, i) => {
    setTimeout(() => {
      agregarMensajeBot(msg, resultado.tipo);
    }, i * 350);
  });

  // Muestra quick replies si los hay
  if (resultado.quickReplies.length > 0) {
    setTimeout(() => {
      mostrarQuickReplies(resultado.quickReplies);
    }, resultado.mensajes.length * 350);
  }

  // Actualiza el panel de estado FSM
  actualizarEstado(resultado.estado);
}

// ── Reiniciar bot ─────────────────────────────────────────
resetBtn.addEventListener("click", () => {
  resetBot();
  mensajesDiv.innerHTML = "";
  limpiarQuickReplies();
  actualizarEstado("ESPERANDO_START");
  agregarMensajeBot("Bot reiniciado. Escribí /start o hola.", "normal");
  mostrarQuickReplies([
    { label: "/start", value: "/start" },
    { label: "hola",   value: "hola"   }
  ]);
});

// ── Enter para enviar ─────────────────────────────────────
inputEl.addEventListener("keydown", e => {
  if (e.key === "Enter") enviar();
});
sendBtn.addEventListener("click", () => enviar());

// ─────────────────────────────────────────────────────────
// Funciones de UI (solo tocan el DOM)
// ─────────────────────────────────────────────────────────

function agregarMensajeBot(texto, tipo) {
  const div = document.createElement("div");
  div.className = `burbuja bot ${tipo}`;
  div.innerHTML = texto.replace(/\n/g, "<br>");
  mensajesDiv.appendChild(div);
  mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
}

function agregarMensajeUsuario(texto) {
  const div = document.createElement("div");
  div.className = "burbuja usuario";
  div.textContent = texto;
  mensajesDiv.appendChild(div);
  mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
}

function mostrarQuickReplies(replies) {
  quickDiv.innerHTML = "";
  replies.forEach(r => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.textContent = r.label;
    btn.onclick = () => {
      limpiarQuickReplies();
      enviar(r.value);
    };
    quickDiv.appendChild(btn);
  });
}

function limpiarQuickReplies() {
  quickDiv.innerHTML = "";
}

function actualizarEstado(estado) {
  estadoEl.textContent = estado;

  // Resalta el estado activo en el panel lateral
  document.querySelectorAll(".estado-item").forEach(el => {
    el.classList.toggle("activo", el.dataset.estado === estado);
  });
}