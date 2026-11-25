# AI_LOG — VentasLite

Bitácora de uso de herramientas de inteligencia artificial para la prueba técnica Programador Jr. Las entradas resumen los momentos relevantes del desarrollo; deben revisarse y ajustarse si algún detalle no coincide con el historial real del trabajo.

| # | Herramienta | Qué pediste (prompt resumido) | Qué te dio | Qué estaba mal o qué cambiaste | Por qué |
|---:|---|---|---|---|---|
| 1 | ChatGPT | Orientación para estructurar el MVP VentasLite con Laravel y React. | Guía de organización del proyecto y separación frontend/backend. | Se mantuvo el proyecto existente y se evitó iniciar una estructura paralela. | Continuar sobre el repositorio ya creado y reducir cambios innecesarios. |
| 2 | ChatGPT | Ayuda para revisar la autenticación y las rutas API de Laravel. | Orientación para usar login, token Bearer y rutas protegidas. | Se revisaron las rutas existentes y se conservaron los endpoints del backend. | Evitar duplicar lógica o cambiar contratos que ya utilizaba el frontend. |
| 3 | ChatGPT | Ayuda para revisar el módulo de ventas y sus respuestas JSON. | Orientación para consumir el endpoint `/sales` desde React. | Se mantuvo la lectura de `response.data.data` y los campos disponibles en la respuesta. | Mostrar los registros existentes sin inventar una estructura distinta de API. |
| 4 | ChatGPT | Mejorar la presentación del dashboard y agregar gráficas. | Propuesta de tarjetas KPI y gráficas con Recharts. | Se conservaron los endpoints de reportes ya implementados y se comprobó visualmente que las gráficas aparecieran. | Mejorar la lectura de indicadores sin trasladar cálculos masivos al navegador. |
| 5 | ChatGPT | Mejorar la interfaz del módulo de reportes. | Propuesta de selector de reportes, tablas y visualizaciones. | Se mantuvo el consumo de endpoints de reportes existentes; los nombres de campos deben contrastarse con las respuestas reales. | Evitar cambios innecesarios en el backend y presentar los datos disponibles. |
| 6 | ChatGPT | Mejorar la interfaz del asistente de IA. | Propuesta de interfaz tipo chat e historial de preguntas. | Se conservó la llamada a `POST /admin/assistant/ask` y el envío de `pregunta` y `resumen_ejecutivo`. | La interfaz debe comunicarse con el backend y no llamar al proveedor LLM desde el navegador. |
| 7 | ChatGPT | Revisar y mejorar la vista de ventas. | Propuesta de listado con indicadores, búsqueda, filtro de estado y formato de moneda mexicana. | Se conservó `GET /sales`; la búsqueda y el filtro presentados en la interfaz son filtros del lado del cliente. | Mejorar la consulta visual sin afirmar que se implementó paginación o filtrado en servidor. |
| 8 | ChatGPT | Revisar la documentación solicitada en el PDF de la prueba técnica. | Identificación de README, AI_LOG, `.env.example`, wireframe, capturas y video como entregables. | Se separaron las funciones comprobadas de los requisitos que todavía deben verificarse. | No documentar como terminadas funciones, despliegues o pruebas que no se han confirmado. |

## Nota de transparencia

Esta bitácora es un borrador basado en las etapas de trabajo registradas en la conversación. Antes de entregar, el candidato debe confirmar que los prompts resumidos representan fielmente su uso de IA, completar cualquier corrección manual adicional y eliminar o modificar cualquier entrada que no corresponda.
