# VentasLite

Sistema web de ventas desarrollado como MVP para la prueba técnica **Programador Jr. (React + PHP + IA)**.

> **Importante:** este README documenta la estructura y las funciones que se han trabajado en el proyecto. Los puntos marcados como **Por verificar** o **Pendiente** deben comprobarse en el código y en el entorno de entrega antes de presentar el proyecto. No se afirma que una función esté terminada si no se ha comprobado.

## 1. Descripción

VentasLite es una aplicación interna para consultar operaciones de venta y proporcionar información de apoyo a la gerencia mediante reportes y un asistente de IA. La solución está dividida en un frontend desarrollado con React y un backend desarrollado con Laravel que expone una API REST en JSON.

## 2. Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Navegación | React Router |
| Gráficas | Recharts |
| Cliente HTTP | Axios |
| Backend | PHP + Laravel |
| Autenticación API | Laravel Sanctum (según las rutas trabajadas; verificar configuración final) |
| Base de datos | MySQL/MariaDB |
| Control de versiones | Git y GitHub |

Las versiones exactas deben obtenerse de `frontend/package.json`, `backend/composer.json` y del entorno de ejecución. No se fijan aquí versiones que no hayan sido verificadas.

## 3. Estructura general

```text
VentasLite/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── .env.example
├── frontend/                # Aplicación React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Assistant.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── .env.example
└── docs/                    # Wireframes, capturas y material de entrega
```

La estructura es orientativa. Ajustar los nombres si el repositorio contiene carpetas o archivos diferentes.

## 4. Requisitos previos

- PHP 8.2 o superior.
- Composer.
- Node.js y npm.
- MySQL 8 o MariaDB compatible.
- Git.
- Un proveedor o servicio de modelo de lenguaje (LLM) si se habilita el asistente de IA.

## 5. Configuración local

### 5.1 Obtener el proyecto

```bash
git clone https://github.com/Luisfernando77/VentasLite.git
cd VentasLite
```

### 5.2 Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configurar en `backend/.env` la conexión a la base de datos:

```dotenv
APP_NAME=VentasLite
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ventaslite
DB_USERNAME=root
DB_PASSWORD=
```

Los valores anteriores son ejemplos para desarrollo local. Utilizar las credenciales reales del entorno y no subir el archivo `.env`.

Después de configurar la base de datos:

```bash
php artisan migrate
```

Si los seeders del repositorio están preparados y se desea reconstruir la base desde cero:

```bash
php artisan migrate:fresh --seed
```

**Advertencia:** `migrate:fresh` elimina las tablas existentes. Ejecutarlo únicamente en una base de datos de desarrollo o prueba.

Iniciar la API:

```bash
php artisan serve
```

Por defecto, Laravel queda disponible en `http://127.0.0.1:8000`.

### 5.3 Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear `frontend/.env` con la URL de la API:

```dotenv
VITE_API_URL=http://127.0.0.1:8000/api
```

Iniciar Vite:

```bash
npm run dev
```

Abrir la URL local que indique Vite, normalmente `http://localhost:5173`.

## 6. Variables de entorno y seguridad

- Los secretos deben permanecer en archivos `.env` locales o en variables seguras del proveedor de despliegue.
- No subir contraseñas, tokens ni claves de proveedores de IA.
- Mantener `.env.example` con nombres de variables y valores de ejemplo no secretos.
- El frontend debe comunicarse con el backend; no debe llamar directamente al proveedor LLM.
- Configurar CORS para permitir únicamente los orígenes del frontend autorizados.
- En producción, desactivar `APP_DEBUG` y utilizar HTTPS.

Variables adicionales del proveedor de IA dependen de la integración implementada en el backend. Documentar aquí sus nombres reales después de revisar el archivo de configuración/controlador; no inventar nombres de variables.

## 7. Autenticación y acceso

La aplicación dispone de una pantalla de inicio de sesión y utiliza un token enviado en el encabezado:

```http
Authorization: Bearer <token>
```

El frontend conserva el token en `localStorage` para las solicitudes autenticadas. El backend debe validar el token y los permisos de cada operación.

Credenciales de demostración indicadas en la prueba técnica:

- Correo: `admin@ventaslite.test`
- Contraseña: `password`

Estas credenciales solo deben estar habilitadas en un entorno de prueba y deben coincidir con el usuario creado por los seeders del proyecto.

**Por verificar antes de entregar:** invalidación del token al cerrar sesión, middleware de roles, aislamiento de ventas por vendedor y bloqueo después de cinco intentos fallidos durante un minuto.

## 8. Módulos del frontend

### 8.1 Login

Permite introducir las credenciales y acceder a las rutas protegidas. El frontend utiliza el servicio Axios configurado en `src/services/api.js`.

### 8.2 Dashboard

Presenta indicadores generales y gráficas. Los indicadores trabajados son:

- Total de ventas.
- Ingresos.
- Ticket promedio.
- Unidades vendidas.

También consume los endpoints de ventas mensuales y productos más vendidos y representa la información con Recharts.

### 8.3 Ventas

La vista `src/pages/Sales.jsx` consulta `GET /sales` y muestra el listado de operaciones. La interfaz trabajada incluye búsqueda por identificador o vendedor, filtro visual por estado, actualización manual, total de registros, importe acumulado y formato de moneda mexicana.

**Alcance comprobado en la vista compartida:** listado y filtros en el navegador. Esto no demuestra por sí solo que exista paginación del lado del servidor, filtros por fecha/sucursal/vendedor en la API, detalle de venta, alta de venta o cancelación con devolución de inventario. Verificar cada función en backend y frontend antes de marcarla como terminada.

### 8.4 Reportes

La vista `src/pages/Reports.jsx` se diseñó para consultar los reportes disponibles mediante endpoints del backend y representar los resultados con tablas y gráficas.

Endpoints identificados en las rutas/controlador revisados durante el desarrollo:

- `GET /admin/reports/dashboard`
- `GET /admin/reports/monthly-sales`
- `GET /admin/reports/top-products`
- `GET /admin/reports/seller-ranking`
- `GET /admin/reports/branch-performance`
- `GET /admin/reports/sales-by-category`
- `GET /admin/reports/gross-margin`
- `GET /admin/reports/export`

Verificar los parámetros de filtros y el formato de exportación directamente en `ReportController` y `routes/api.php`.

### 8.5 Asistente de IA

La vista `src/pages/Assistant.jsx` envía las preguntas al endpoint:

- `POST /admin/assistant/ask`

La solicitud trabajada utiliza el campo `pregunta` y `resumen_ejecutivo`. La comunicación con el modelo debe realizarse desde el backend, que debe preparar contexto agregado y devolver una respuesta basada en cifras reales.

**Por verificar:** proveedor LLM configurado, manejo de ausencia de API key, respuesta con cifras reales, botón de resumen ejecutivo y tratamiento de errores del proveedor.

## 9. API

Rutas identificadas durante el desarrollo:

| Método | Ruta | Uso |
|---|---|---|
| POST | `/login` | Inicio de sesión |
| POST | `/logout` | Cierre de sesión |
| GET | `/user` | Usuario autenticado |
| GET | `/sales` | Listado de ventas |
| POST | `/sales` | Registro de venta |
| GET | `/sales/{id}` | Consulta de una venta |
| DELETE | `/sales/{id}` | Eliminación/cancelación administrativa, según implementación |
| GET | `/admin/reports/dashboard` | Indicadores del dashboard |
| GET | `/admin/reports/monthly-sales` | Ventas por mes |
| GET | `/admin/reports/top-products` | Productos más vendidos |
| GET | `/admin/reports/seller-ranking` | Ranking de vendedores |
| GET | `/admin/reports/branch-performance` | Rendimiento por sucursal |
| GET | `/admin/reports/sales-by-category` | Ventas por categoría |
| GET | `/admin/reports/gross-margin` | Margen bruto |
| GET | `/admin/reports/export` | Exportación de reportes |
| POST | `/admin/assistant/ask` | Consulta al asistente IA |

Las rutas administrativas deben estar protegidas por autenticación y autorización de rol. Confirmar en `backend/routes/api.php` los prefijos y middleware exactos, porque Laravel puede agrupar rutas bajo `/api`.

## 10. Base de datos

El documento de la prueba solicita al menos estas seis tablas:

- `users`
- `branches`
- `categories`
- `products`
- `sales`
- `sale_items`

Relaciones solicitadas:

- `products.category_id` referencia `categories.id`.
- `sales.user_id` referencia `users.id`.
- `sales.branch_id` referencia `branches.id`.
- `sale_items.sale_id` referencia `sales.id`, con eliminación en cascada.
- `sale_items.product_id` referencia `products.id`.

Reglas importantes del modelo:

- Utilizar `DECIMAL(12,2)` para importes, no `FLOAT`.
- Guardar `unit_price` en cada renglón de venta para conservar el precio histórico.
- Calcular el total como suma de renglones más IVA del 16 %.
- Las operaciones de inventario deben ejecutarse en transacciones.

**Por verificar:** revisar las migraciones reales y confirmar que existen las seis tablas, llaves foráneas, índices, tipos decimales y restricciones requeridas.

## 11. Datos de prueba y seeders

La prueba técnica solicita:

| Tabla | Cantidad mínima |
|---|---:|
| users | 1 administrador y 8 vendedores |
| branches | 4 |
| categories | 8 |
| products | 150 |
| sales | 2,500 |
| sale_items | Aproximadamente 7,500 |

También solicita datos distribuidos en los últimos 18 meses, aproximadamente 5 % de ventas canceladas, mayor actividad en diciembre y una sucursal con resultados claramente inferiores.

No afirmar que se cumplen estas cantidades hasta ejecutar los seeders y comprobar los conteos en la base de datos.

## 12. Pruebas de funcionamiento

Antes de la entrega, realizar y documentar estas comprobaciones:

1. Iniciar sesión con las credenciales de prueba.
2. Probar credenciales incorrectas y el límite de intentos.
3. Confirmar que las rutas privadas rechazan solicitudes sin token.
4. Confirmar los permisos de administrador y vendedor.
5. Consultar el listado de ventas y revisar estados, fechas e importes.
6. Verificar el detalle, registro y cancelación de ventas, si están implementados.
7. Comparar los indicadores del dashboard con los datos de la base.
8. Revisar que las ventas canceladas no se incluyan en reportes.
9. Probar los reportes y sus filtros.
10. Probar la exportación.
11. Enviar una pregunta al asistente y probar el escenario de error del proveedor IA.
12. Revisar la interfaz en escritorio y en un viewport de 375 px.

Registrar resultados, capturas y cualquier limitación detectada.

## 13. Despliegue

La prueba solicita publicar el frontend y el backend en servicios compatibles y entregar una URL funcional con datos sembrados.

**Estado del despliegue: por confirmar.** Completar esta sección con:

- URL pública del frontend.
- URL pública de la API.
- Proveedor de hosting.
- Variables de entorno configuradas en el servidor.
- Procedimiento de migración y seeding de producción/prueba.
- Credenciales de acceso de demostración.

No publicar secretos ni claves en este documento.

## 14. Historial de Git

Repositorio del proyecto:

https://github.com/Luisfernando77/VentasLite

La prueba solicita commits frecuentes. El historial debe reflejar avances separados y significativos. Antes de entregar, comprobar que todos los cambios estén confirmados y enviados al remoto:

```bash
git status
git log --oneline
git push
```

## 15. Entregables de la prueba técnica

| Entregable | Estado |
|---|---|
| Repositorio Git con historial de commits | Enlace identificado; revisar historial final |
| URL pública frontend y API | Pendiente de confirmar |
| `README.md` | Este documento, ajustar datos verificados |
| `.env.example` | Revisar que exista en backend y frontend si aplica |
| Wireframe en `/docs` | Pendiente de incorporar |
| Capturas de dashboard y ventas en escritorio y celular | Pendiente de incorporar |
| Video de 3–5 minutos | Pendiente de grabar |
| `AI_LOG.md` con al menos 8 entradas | Archivo incluido en este paquete |

## 16. Decisiones técnicas y pendientes

Decisiones identificadas:

- Separación frontend/backend.
- API REST en Laravel.
- React con Vite para la interfaz.
- Axios centralizado para solicitudes HTTP.
- Recharts para visualización.
- Token Bearer para las solicitudes autenticadas.
- Los reportes se solicitan al backend mediante endpoints dedicados.

Pendientes de validar contra el repositorio y la prueba:

- Cantidad y contenido real de migraciones y seeders.
- Paginación y filtros en servidor para ventas.
- Detalle, registro y cancelación de ventas y actualización de stock.
- Restricciones de acceso por rol.
- Límite de intentos de login.
- Filtros de periodo y sucursal en todos los reportes.
- Exportación CSV o Excel.
- Integración real del proveedor LLM y resumen ejecutivo.
- Wireframe, capturas, video y despliegue público.

---
Documento de trabajo para la prueba técnica. Actualizarlo con resultados comprobados antes de enviarlo al evaluador.
