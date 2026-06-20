# SoporteBot — Chatbot de Soporte Técnico Nivel 1

Trabajo Práctico Integrador — Organización Empresarial
Tecnicatura Universitaria en Programación a Distancia (UTN)

Simulación de chatbot que automatiza el proceso de soporte técnico de primer nivel,
modelado previamente con BPMN 2.0. El bot valida al usuario, diagnostica el problema
según una base de datos simulada y deriva a un técnico si no logra resolverlo.

---

## Descripción del proceso

El bot guía al usuario a través de 5 estados (Máquina de Estados Finita):

1. **ESPERANDO_START** — espera el saludo inicial (`hola` o `/start`)
2. **SOLICITANDO_ID** — valida el número de legajo del empleado
3. **MENU_PRINCIPAL** — el usuario elige el tipo de falla (Internet / Software / Hardware)
4. **PROCESANDO_SOLUCION** — el bot sugiere una solución y pregunta si funcionó
5. **DERIVANDO_TICKET** — si no se resolvió, genera un ticket para Nivel 2


---

## Estructura del proyecto

```
soporte_bot/
├── index.html         # Estructura HTML de la interfaz
├── css/
│   └── style.css       # Estilos visuales (sin lógica)
├── js/
│   ├── bot.js           # Lógica pura: FSM, switch de estados, validaciones
│   └── app.js            # Interfaz: maneja el DOM, llama a bot.js
└── data/
    └── db.json            # Base de datos simulada (legajos y soluciones)
```

La lógica del bot (`bot.js`) está completamente separada de la interfaz (`app.js`):
`bot.js` no toca el DOM, y `app.js` no contiene reglas de negocio. Esto facilita
testear y modificar la lógica sin afectar la presentación.

---

## Cómo desplegarlo

El proyecto usa `fetch()` para cargar `data/db.json`, por lo que **no funciona**
abriendo `index.html` directamente con doble clic (los navegadores bloquean
peticiones `fetch` sobre el protocolo `file://`). Hace falta un servidor local.

### VS Code + Live Server (recomendado)

1. Instalar la extensión **Live Server** en VS Code.
2. Abrir la carpeta `soporte_bot/` en VS Code.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. Se abre automáticamente en `http://localhost:5500`.

Luego abrir el navegador en `http://localhost:8000`.

---

## Casos de prueba (Camino feliz / Camino infeliz)

| Paso | Input usuario | Resultado esperado |
|---|---|---|
| 1 | `hola` | Bot saluda y pide legajo |
| 2 | `9999` | ❌ Error: legajo inválido (permanece en mismo estado) |
| 3 | `1001` | ✅ Legajo validado, muestra menú |
| 4 | `9` | ❌ Error: opción inválida (1-3) |
| 5 | `1` | ✅ Muestra solución de Internet |
| 6 | `tal vez` | ❌ Error: solo admite SI/NO |
| 7 | `NO` | ✅ Genera ticket y reinicia |

---

## Tecnologías utilizadas

- **HTML5** — estructura de la interfaz
- **CSS3** — estilos (sin frameworks)
- **JavaScript (Vanilla)** — lógica de la FSM y manejo del DOM
- **JSON** — persistencia simulada (reemplaza una base de datos real)

---

## 👤 Autores

Rodrigo Collazo y Daian Horst — Tecnicatura Universitaria en Programación a Distancia (UTN)
Cátedra: Organización Empresarial
