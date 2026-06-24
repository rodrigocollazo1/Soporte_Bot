# SoporteBot — Chatbot de Soporte Técnico Nivel 1
### Trabajo Práctico Integrador — Cátedra de Organización Empresarial
**Tecnicatura Universitaria en Programación a Distancia (UTN)** **Desarrolladores:** Collazo Rodrigo & Daian Horst  
**Año Académico:** 2026  

---

## 1. Descripción General del Sistema
`SoporteBot` es un artefacto de software diseñado bajo un **enfoque sistémico** para automatizar la recepción, clasificación y resolución primaria de incidentes informáticos comunes (Internet, Software y Hardware) dentro del ámbito organizacional. 

El núcleo del sistema está gobernado de forma determinística por una **Máquina de Estados Finitos (FSM)** que garantiza el cumplimiento de las reglas de negocio de la empresa, aislando por completo la lógica procedimental de los componentes de presentación visual (DOM).

---

## 2. Manual Básico de Uso (Guía Funcional)

El sistema emula un canal de comunicación interna para empleados. Para interactuar correctamente con el bot, siga estos pasos operativos:

1. **Inicialización del Canal (Estado: `ESPERANDO_START`)** Al cargar la interfaz, el sistema se encuentra en reposo. Para activarlo, el usuario debe enviar el mensaje `hola`, el comando `/start` o presionar los botones de respuesta rápida (*Quick Replies*) provistos en pantalla.
2. **Autenticación del Personal (Estado: `SOLICITANDO_ID`)** El bot solicitará de forma obligatoria el número de legajo del empleado. El sistema validará el dato contra el registro de la organización (`db.json`).  
   * *Legajos de prueba válidos:* `1001` (Ana García), `1002` (Carlos López), `1003` (María Torres).  
   * Si se ingresa un legajo inexistente, el bot emitirá una alerta visual de error y retendrá al usuario en el estado actual hasta que provea una credencial válida.
3. **Clasificación del Incidente (Estado: `MENU_PRINCIPAL`)** Una vez autenticado el usuario, se desplegará un menú interactivo con las categorías de fallas estandarizadas. Debe ingresar el número correspondiente:
   * **`1`** — Problemas de Internet.
   * **`2`** — Fallas de Software.
   * **`3`** — Inconvenientes de Hardware.
4. **Evaluación de la Solución (Estado: `PROCESANDO_SOLUCION`)** El bot consultará la base de conocimientos y devolverá una instrucción técnica precisa en pantalla. Inmediatamente después, interrogará al usuario de forma dicotómica sobre la efectividad de la guía. El usuario debe responder estrictamente:
   * **`SI`**: Si la solución mitigó la falla, el bot dará por resuelto el caso (Camino Feliz) y reseteará el ciclo regresando al estado inicial.
   * **`NO`**: Si el inconveniente persiste, el sistema activará la lógica de excepción (Camino Infeliz) derivando el flujo hacia la generación de un ticket.
5. **Cierre de Incidente y Derivación (Estado: `DERIVANDO_TICKET`)** Ante una respuesta negativa, el sistema invoca dinámicamente una rutina que genera un identificador numérico único, estructurando un objeto de datos de excepción que se almacena en memoria de sesión y transfiriendo el control de la contingencia al equipo físico de Nivel 2 de manera automática.

---

## 3. Estructura Arquitectónica del Proyecto

El código fuente respeta rigurosamente el patrón de separación de responsabilidades:

```text
soporte_bot/
├── index.html         # Estructura e interfaces semánticas del Chat y el Panel FSM.
├── css/
│   └── style.css      # Maquetación elástica mediante Flexbox (Alineación e interfaz limpia).
├── js/
│   ├── bot.js         # LÓGICA PURA: Control de estados (switch-case), persistencia y validaciones.
│   └── app.js         # INTERFAZ: Orquestador del DOM, eventos de teclado y pasaje de datos a bot.js.
└── data/
    └── db.json        # Persistencia Estática: Archivo JSON con datos estructurados de empleados y soluciones.
```

---

## 4. Persistencia de Datos y Simulación de Negocio

El ecosistema de información simula un modelo relacional de base de datos dividido en dos flujos específicos:
* **Lectura Asrincrónica:** Al inicializar la aplicación, `app.js` ejecuta un procedimiento `fetch()` sobre `data/db.json`, cargando en memoria del entorno del bot las entidades de control corporativo para evitar estructuras estáticas (*hardcoded*).
* **Persistencia en Caliente (Tabla Ficticia `Tickets_Soporte`):** Por razones de seguridad nativas de los navegadores (*sandbox*), la escritura de archivos locales está bloqueada. Por ende, la generación de tickets se almacena en caliente a través de colecciones de objetos estructurados (`dbTicketsSimulados = []`) dentro de `bot.js`. Cada registro captura la marca de tiempo, legajo del usuario afectado, tipo de falla y ID único, modelando con exactitud lógica una fila relacional que es auditable mediante la consola del desarrollador (`console.table`).

---

## 5. Instrucciones de Despliegue Local

Debido a que el navegador restringe las peticiones `fetch()` locales ejecutadas bajo el protocolo de archivos directos (`file://`), el proyecto **requiere obligatoriamente un entorno de servidor local** para funcionar.

1. Abra la carpeta raíz del proyecto (`soporte_bot/`) en **Visual Studio Code**.
2. Instale la extensión oficial **Live Server** (creada por Ritwick Dey).
3. Diríjase al archivo `index.html`, haga clic derecho en cualquier sección de las líneas de código y seleccione **"Open with Live Server"**.
4. La aplicación se inicializará y quedará disponible automáticamente en el navegador bajo la dirección: `http://localhost:5500`.

---

## 6. Casos de Prueba Estructurados

| Paso | Entrada del Usuario | Estado del Bot | Resultado Esperado en Pantalla |
| :--- | :--- | :--- | :--- |
| **1** | `hola` o `/start` | `ESPERANDO_START` | Mensaje de bienvenida institucional y solicitud de ID. |
| **2** | `9999` (Inexistente) | `SOLICITANDO_ID` | ❌ Burbuja de error. Solicita reingreso de legajo. |
| **3** | `1001` (Válido) | `SOLICITANDO_ID` |  Mensaje personalizado ("¡Hola Ana!") y despliegue de menú. |
| **4** | `9` (Inexistente) | `MENU_PRINCIPAL` | ❌ Alerta de opción inválida. Re-despliega opciones del 1 al 3. |
| **5** | `1` | `MENU_PRINCIPAL` |  Muestra la guía técnica para problemas de Internet. |
| **6** | `No lo sé` (Inválido) | `PROCESANDO_SOLUCION` | ❌ Error de entrada. Fuerza entrada binaria (Botones SI / NO). |
| **7** | `NO` | `PROCESANDO_SOLUCION` |  Ejecuta flujo de derivación, imprime N° de Ticket y reinicia FSM. |