# Plan de Proyecto: Software Web de Facturación, Contabilidad y Trazabilidad para Microempresa de Pulpas de Frutas

Este documento detalla la planificación, arquitectura, especificaciones técnicas y la guía práctica para dibujar los diagramas del sistema. Está diseñado para servir como mapa de ruta antes de iniciar la codificación.

---

## 1. Arquitectura Completa del Sistema

Para una microempresa, buscamos un balance entre simplicidad, bajo costo de mantenimiento y facilidad de desarrollo, sin comprometer la robustez.

### Estilo Arquitectónico: Monolito Modular
Utilizaremos una **Arquitectura Monolítica Modular (Modular Monolith)**. A diferencia de un monolito desordenado, aquí el backend está claramente separado por módulos con responsabilidades únicas (ventas, producción, inventario, etc.), facilitando una futura migración a microservicios si fuese necesario.

### Componentes de la Arquitectura
1. **Frontend**: Aplicación Web Single Page Application (SPA) o SSR ligero. Proponemos una interfaz web responsiva construida con HTML5, Tailwind CSS y JavaScript moderno (React o JS Vanilla para máxima simplicidad).
2. **Backend**: API REST en **Node.js con Express**. Node.js es altamente eficiente en operaciones de E/S, ideal para APIs y generación de reportes. Su ecosistema de paquetes (npm) acelerará el desarrollo.
3. **Base de Datos (BD)**: **PostgreSQL**. La contabilidad, facturación e inventario requieren transacciones estrictas (propiedades ACID) y consistencia relacional (p. ej., evitar que un lote de pulpa exista sin un lote de fruta asociado).
4. **Seguridad y Autenticación**: JSON Web Tokens (JWT) para sesiones sin estado, almacenados de forma segura.
5. **Capa de Almacenamiento**: Sistema de archivos local o almacenamiento en la nube (S3/Cloudinary) para PDFs de facturas.

---

## 2. Estructura de Carpetas Recomendada

Proponemos una estructura limpia basada en separación por capas e integrando la modularidad:

```text
pulpas-facturacion/
├── config/                  # Configuraciones globales (BD, variables de entorno)
│   ├── database.js
│   └── passport.js
├── src/
│   ├── controllers/         # Controladores (procesan solicitudes HTTP)
│   │   ├── auth.controller.js
│   │   ├── compras.controller.js
│   │   ├── produccion.controller.js
│   │   ├── inventario.controller.js
│   │   ├── contabilidad.controller.js
│   │   ├── calidad.controller.js
│   │   └── reportes.controller.js
│   ├── middlewares/         # Middlewares (autenticación, roles, errores)
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   ├── models/              # Modelos de datos (Mongoose o Sequelize/Prisma)
│   │   ├── Usuario.js
│   │   ├── Cliente.js
│   │   ├── Proveedor.js
│   │   ├── Compra.js
│   │   ├── Insumo.js
│   │   ├── LoteMateriaPrima.js
│   │   ├── LoteProduccion.js
│   │   ├── Venta.js
│   │   ├── Gasto.js
│   │   ├── RegistroCalidad.js
│   │   ├── RegistroTiempo.js
│   │   └── Auditoria.js
│   ├── routes/              # Definición de endpoints de la API
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── compras.routes.js
│   │   ├── produccion.routes.js
│   │   └── ... (rutas por módulo)
│   ├── services/            # Lógica de negocio pura (cálculos de costos, merma)
│   │   ├── costo.service.js
│   │   ├── trazabilidad.service.js
│   │   └── proyeccion.service.js
│   ├── utils/               # Funciones de ayuda (formateadores, generadores de PDF)
│   └── app.js               # Punto de entrada de la aplicación Express
├── .env.example             # Plantilla de variables de entorno
├── package.json             # Dependencias y scripts de ejecución
└── README.md                # Instrucciones de despliegue y desarrollo
```

---

## 3. Lista de Módulos y Submódulos

### Módulos Comunes
1. **Administración y Seguridad**
   - Control de accesos y perfiles de usuario.
   - Roles: Administrador, Supervisor de Producción, Operario, Vendedor/Cajero.
2. **Contactos (Clientes y Proveedores)**
   - Directorio de proveedores de fruta, empaques e insumos.
   - Directorio de clientes de pulpas (tiendas, restaurantes, supermercados).
3. **Compras y Gastos**
   - Registro de compras de fruta (kg, precio por kg).
   - Compras de insumos (bolsas, etiquetas).
   - Control de gastos operativos (servicios, transporte, mano de obra fija).
4. **Facturación y Ventas**
   - Punto de venta (POS) para pedidos.
   - Generación de facturas de venta, notas de crédito y recibos de pago.
5. **Inventario**
   - Inventario de materias primas (fruta fresca, bolsas, insumos).
   - Inventario de producto terminado (pulpas congeladas por sabor y presentación).
   - Alertas automáticas de inventario crítico.
6. **Contabilidad Básica**
   - Flujo de caja diario (Ingresos vs. Egresos).
   - Registro de cuentas por cobrar (ventas a crédito) y por pagar.

### Módulos Especiales (Poco Comunes)
7. **Control de Producción y Lotes**
   - Registro de procesos de despulpe y empacado.
   - Rendimiento por fruta y **control de merma por tipo de fruta** (ej: la guanábana deja 40% de merma, la fresa 5%).
   - Asignación de código de **Lote de Producción**.
8. **Costeo y Calidad**
   - **Cálculo automático de costo por unidad producida** (Suma de: costo de fruta usada + costo de bolsa + costo de etiqueta + prorrateo de mano de obra y servicios).
   - **Registro de temperatura de congelación** por lote (monitoreo de cadena de frío).
   - **Módulo de calidad**: Clasificación de fruta recibida (dañada, madura, óptima) y descarte.
9. **Trazabilidad y Proyecciones**
   - **Trazabilidad Completa (End-to-End)**: Rastreo desde qué lote de fruta de un proveedor específico se usó para producir un lote de pulpa, hasta qué facturas y clientes compraron unidades de ese lote.
   - **Registro de tiempos de producción por empleado**: Tiempos dedicados por operario al despulpe o empaque para evaluar eficiencia.
   - **Proyección de demanda**: Algoritmo sencillo basado en promedios móviles de ventas históricas para sugerir cuánto producir o comprar la próxima semana.

---

## 4. Modelos de Datos y sus Relaciones

Diseñado para PostgreSQL (Modelo Relacional).

```sql
-- 1. Usuarios, Roles y Permisos
Table Usuario {
  id integer [primary key]
  nombre varchar
  email varchar [unique]
  password_hash varchar
  rol varchar -- 'Administrador', 'Supervisor', 'Operario', 'Vendedor'
  activo boolean
}

-- 2. Clientes y Proveedores
Table Contacto {
  id integer [primary key]
  tipo varchar -- 'Cliente' o 'Proveedor'
  nombre varchar
  nit_documento varchar
  telefono varchar
  direccion varchar
}

-- 3. Insumos (Materia Prima)
Table Insumo {
  id integer [primary key]
  nombre varchar -- 'Fresa', 'Guanábana', 'Bolsa 250g', 'Bolsa 1kg', 'Etiqueta'
  tipo varchar -- 'Fruta', 'Empaque', 'Aditivo'
  stock_actual decimal
  stock_minimo_alerta decimal
  unidad_medida varchar -- 'Kg', 'Unidad'
}

-- 4. Registro de Compras de Materia Prima (Trazabilidad origen)
Table Compra {
  id integer [primary key]
  proveedor_id integer [ref: > Contacto.id]
  fecha timestamp
  total decimal
}

Table DetalleCompra {
  id integer [primary key]
  compra_id integer [ref: > Compra.id]
  insumo_id integer [ref: > Insumo.id]
  cantidad decimal
  precio_unitario decimal
  lote_proveedor varchar -- Código de lote asignado por el proveedor o el sistema
}

-- 5. Control de Producción y Lotes de Producto Terminado
Table LoteProduccion {
  id integer [primary key]
  codigo_lote varchar [unique] -- Ej: LP-FR-20260617-01
  fecha_produccion timestamp
  insumo_fruta_id integer [ref: > Insumo.id] -- Fruta origen
  cantidad_fruta_usada decimal -- en kg
  cantidad_pulpa_obtenida decimal -- en kg
  merma_calculada decimal -- cantidad_fruta_usada - cantidad_pulpa_obtenida
  porcentaje_merma decimal
  sabor varchar -- 'Fresa', 'Mango', etc.
  presentacion_empaque_id integer [ref: > Insumo.id] -- Bolsa utilizada
  unidades_producidas integer -- Cantidad de bolsas finales
  costo_unitario_calculado decimal -- costo_total / unidades_producidas
  temperatura_congelacion decimal -- en °C (ej: -18.5)
  estado_calidad varchar -- 'Aprobado', 'Rechazado', 'En Observación'
}

-- Relación de Trazabilidad entre Lote de Producción e Insumos Comprados
Table TrazabilidadMateriaPrima {
  id integer [primary key]
  lote_produccion_id integer [ref: > LoteProduccion.id]
  detalle_compra_id integer [ref: > DetalleCompra.id] -- Vincula el lote con la compra exacta
  cantidad_utilizada decimal
}

-- 6. Calidad de Fruta Recibida
Table RegistroCalidad {
  id integer [primary key]
  detalle_compra_id integer [ref: > DetalleCompra.id]
  fecha_inspeccion timestamp
  cant_optima decimal
  cant_madura decimal -- para procesamiento inmediato
  cant_danada decimal -- merma inmediata en recepción
  observaciones text
}

-- 7. Tiempos de Producción por Empleado
Table RegistroTiempoEmpleado {
  id integer [primary key]
  lote_produccion_id integer [ref: > LoteProduccion.id]
  usuario_id integer [ref: > Usuario.id]
  actividad varchar -- 'Despulpe', 'Empacado', 'Lavado'
  fecha_hora_inicio timestamp
  fecha_hora_fin timestamp
  minutos_trabajados integer
}

-- 8. Facturación y Ventas
Table Venta {
  id integer [primary key]
  cliente_id integer [ref: > Contacto.id]
  usuario_vendedor_id integer [ref: > Usuario.id]
  fecha timestamp
  tipo_documento varchar -- 'Factura', 'Nota Credito', 'Recibo'
  subtotal decimal
  impuesto decimal
  total decimal
  metodo_pago varchar -- 'Efectivo', 'Transferencia', 'Crédito'
  estado_pago varchar -- 'Pagado', 'Pendiente'
}

Table DetalleVenta {
  id integer [primary key]
  venta_id integer [ref: > Venta.id]
  lote_produccion_id integer [ref: > LoteProduccion.id] -- TRAZABILIDAD: Permite saber qué lote compró cada cliente
  cantidad integer
  precio_unitario decimal
}

-- 9. Contabilidad Básica (Flujo de Caja y Gastos)
Table Gasto {
  id integer [primary key]
  categoria varchar -- 'Servicios', 'Transporte', 'Mano de Obra', 'Mantenimiento'
  descripcion varchar
  monto decimal
  fecha timestamp
  soporte_url varchar
}

-- 10. Auditoría de Movimientos
Table RegistroAuditoria {
  id integer [primary key]
  usuario_id integer [ref: > Usuario.id]
  accion varchar -- 'CREAR_VENTA', 'MODIFICAR_INVENTARIO', 'CERRAR_LOTE'
  tabla_afectada varchar
  registro_id integer
  detalles text -- JSON con valores anteriores y nuevos
  fecha timestamp
}
```

---

## 5. Flujo de Usuario (Desde la Compra hasta la Venta Final)

Este es el recorrido que sigue la materia prima hasta convertirse en ingresos monetarios:

```text
[ Compra de Materia Prima ]
         │
         ▼
[ Control de Calidad ] ──► Registra Fruta Dañada (Merma en Recepción)
         │
         ▼
[ Entrada al Inventario ] (Fruta Fresca, Bolsas, Etiquetas)
         │
         ▼
[ Orden de Producción / Lote ] (Se selecciona la fruta e insumos)
         │
         ├─► [ Registro de Tiempos ] (Operarios registran horas por actividad)
         ├─► [ Control de Merma ] (Se pesa pulpa final vs. fruta inicial)
         ├─► [ Costeo Unitario ] (Cálculo automático de costo por unidad)
         └─► [ Registro de Cadena de Frío ] (Se registra temperatura de congelador)
         │
         ▼
[ Producto Terminado en Inventario ] (Pulpas listas para la venta por lotes)
         │
         ▼
[ Módulo de Ventas / Facturación ] (Se asocia el lote de pulpa vendido al cliente)
         │
         ├─► [ Trazabilidad Completa ] (Rastreo inverso: Venta ➔ Lote Prod ➔ Lote Compra)
         └─► [ Flujo de Caja ] (Registro de ingresos contables automáticos)
```

---

## 6. Dependencias Necesarias (Node.js)

Para iniciar el proyecto en Node.js, requeriremos instalar las siguientes dependencias clave:

### Producción (`dependencies`):
- `express`: Framework para la API REST.
- `pg` y `sequelize` (o `@prisma/client`): Para conexión y ORM con PostgreSQL.
- `bcryptjs`: Para encriptación segura de contraseñas de usuarios.
- `jsonwebtoken` (JWT): Para la autenticación de usuarios.
- `dotenv`: Gestión de variables de entorno seguras.
- `cors` y `helmet`: Seguridad para peticiones HTTP.
- `express-validator`: Validación robusta de datos entrantes.
- `pdfkit` o `html-pdf-node`: Generación dinámica de facturas en PDF.

### Desarrollo (`devDependencies`):
- `nodemon`: Reinicio automático del servidor en desarrollo.
- `jest` y `supertest`: Pruebas unitarias y de endpoints API.

---

## 7. Endpoints de la API Organizados por Módulo

### 🔐 Módulo de Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios (Solo Admin).
- `POST /api/auth/login` - Inicio de sesión (Devuelve JWT y rol).

### 🍎 Módulo de Compras, Insumos y Calidad
- `GET /api/insumos` - Obtener lista de insumos y sus niveles de stock.
- `POST /api/compras` - Registrar una compra de materia prima (asigna lote de compra).
- `POST /api/calidad` - Registrar calidad de la fruta recién recibida.

### 🏭 Módulo de Producción y Lotes
- `POST /api/produccion/iniciar` - Iniciar un lote (reserva fruta e insumos).
- `POST /api/produccion/finalizar` - Finalizar lote (calcula merma, costo automático, registra temperatura y entra a inventario).
- `POST /api/produccion/tiempos` - Registrar tiempo dedicado por un empleado a un lote.

### 💰 Módulo de Ventas y Facturación
- `POST /api/ventas` - Crear una venta (emite factura, descuenta unidades de lote específico).
- `GET /api/ventas/:id/pdf` - Descargar PDF de la factura.

### 📊 Módulo de Trazabilidad, Contabilidad y Reportes
- `GET /api/traw/lote/:codigo` - Reporte de trazabilidad de un lote de pulpa (Origen ➔ Destino).
- `GET /api/reportes/flujo-caja` - Reporte de ingresos, egresos y balance neto.
- `GET /api/reportes/proyeccion` - Sugerencia de compra basada en histórico.
- `GET /api/reportes/mermas` - Reporte comparativo de merma por tipo de fruta.

---

## 8. Pasos para Iniciar el Proyecto (Guía de Arranque)

1. **Inicializar el proyecto**:
   ```bash
   npm init -y
   ```
2. **Instalar las dependencias de producción y desarrollo**:
   ```bash
   npm install express pg sequelize dotenv bcryptjs jsonwebtoken cors helmet express-validator
   npm install --save-dev nodemon jest supertest
   ```
3. **Configurar el entorno**:
   Crear un archivo `.env` con las variables `PORT`, `DATABASE_URL`, y `JWT_SECRET`.
4. **Configurar Base de Datos**:
   Inicializar Sequelize/Prisma, definir la conexión a PostgreSQL y ejecutar migraciones iniciales para crear las tablas.
5. **Configurar Servidor**:
   Escribir el código base de `app.js` configurando middlewares comunes y el enrutador principal.
6. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

---

## 9. Recomendaciones Técnicas para Escalabilidad

A medida que el negocio de pulpas de frutas crezca, el sistema debe responder adecuadamente:

1. **Uso de Transacciones**: Cada vez que se registre una venta o producción, se deben emplear transacciones de base de datos. Si la base de datos falla al descontar stock, la factura no debe guardarse. Esto garantiza que no haya inconsistencias.
2. **Consultas Indexadas**: Crear índices en la columna `codigo_lote` de la tabla `LoteProduccion` y en `nit_documento` de `Contacto`. Esto acelera las búsquedas de trazabilidad y reportes históricos instantáneamente.
3. **Caché para Proyecciones**: Las proyecciones de demanda pueden ser pesadas de calcular. Implementar un almacenamiento en caché simple en memoria (o Redis en el futuro) para que el reporte no recalcule las ventas de meses anteriores en cada consulta.
4. **Almacenamiento Desacoplado**: Almacenar las facturas en PDF en un bucket de nube (ej. AWS S3) en vez de guardarlos localmente en el servidor. Esto permite escalar el servidor web horizontalmente sin perder acceso a los archivos.

---

## 10. Guía Completa para Dibujar los Diagramas del Proyecto con Papel y Lápiz

No necesitas software sofisticado para diseñar el sistema. El papel y lápiz son herramientas de pensamiento de alta fidelidad. Aquí tienes cómo dibujar paso a paso cada diagrama de manera clara y profesional:

### Reglas Básicas para Diagramar con Éxito
- **Usa una hoja cuadriculada u horizontal**: Facilita enormemente trazar líneas rectas y alinear elementos.
- **Códigos de figuras**:
  - **Rectángulos**: Módulos, componentes o pantallas de usuario.
  - **Óvalos/Círculos**: Inicio, fin de un proceso, o puntos de decisión.
  - **Cilindros (un rectángulo con curvas arriba y abajo)**: Bases de datos o archivos de almacenamiento.
  - **Líneas con flechas**: Dirección del flujo de datos o secuencia de pasos.
- **Código de colores**: Si tienes lápices de colores o marcadores finos, usa uno para el usuario (p. ej., azul), otro para la base de datos (p. ej., verde) y otro para las alertas/mermas (rojo).

---

### A. Cómo dibujar el Diagrama de Arquitectura General
Este diagrama muestra cómo interactúa el usuario con tu software y la base de datos.

1. **Dibuja tres columnas principales en tu hoja horizontal**:
   - **Columna Izquierda (Cliente)**: Dibuja un rectángulo que represente un "Navegador Web / Celular" (la interfaz del usuario).
   - **Columna Central (Servidor REST API)**: Dibuja un gran rectángulo vertical que diga "Servidor Node.js / Express".
   - **Columna Derecha (Persistencia)**: Dibuja un cilindro rotulado como "Base de Datos PostgreSQL" y un rectángulo de carpeta que diga "Almacenamiento de PDFs".
2. **Conecta los bloques**:
   - Dibuja una flecha que salga de la izquierda a la derecha (peticiones HTTP/HTTPS como `POST /api/ventas`) apuntando al Servidor.
   - Dibuja otra flecha de vuelta de la columna central a la izquierda (respuesta JSON con el resultado o archivo PDF de factura).
   - Conecta el Servidor con la Base de Datos mediante flechas bidireccionales (`<--->`) que representen consultas SQL y respuestas.

---

### B. Cómo dibujar el Diagrama de Módulos y Submódulos
Este diagrama organiza el mapa de la aplicación para que no olvides ninguna sección.

1. **Dibuja una caja central en la parte superior**: Escribe el título del sistema: "ERP Pulpas de Fruta".
2. **Divide en 3 ramificaciones principales hacia abajo**:
   - **Rama Izquierda: Módulos Operativos (Producción, Inventario, Calidad)**.
   - **Rama Central: Módulos Administrativos (Facturación, Compras, Proveedores/Clientes)**.
   - **Rama Derecha: Módulos de Inteligencia (Trazabilidad, Costeo, Reportes, Proyecciones)**.
3. **Dibuja submódulos**: Debajo de cada rama, haz rectángulos más pequeños. Por ejemplo, de *Producción* saca líneas para:
   - *Control de Lotes*
   - *Control de Mermas*
   - *Tiempos de Empleados*

---

### C. Cómo representar los Modelos de Datos y sus Relaciones (Derivado de un MER simplificado)
Te ayudará a entender cómo se estructuran las tablas antes de escribir el código SQL.

1. **Dibuja cajas rectangulares para cada entidad clave**:
   - Dibuja `Proveedor`, `Compra`, `LoteProduccion`, `Venta` y `Cliente`.
2. **Divide cada caja en tres secciones horizontales**:
   - *Sección superior*: El nombre de la tabla (ej. `LoteProduccion`).
   - *Sección media*: Atributos clave con una "PK" al lado (ej. `id (PK)`, `codigo_lote`).
   - *Sección inferior*: El resto de atributos (ej. `sabor`, `merma_calculada`, `costo_unitario`, `temperatura`).
3. **Dibuja las relaciones**:
   - Conecta con una línea `Cliente` con `Venta`. En el extremo de `Cliente` dibuja un "1" y en el extremo de `Venta` dibuja un símbolo de infinito o pata de gallo (`<`) indicando que **un** cliente puede tener **muchas** ventas.
   - Conecta `LoteProduccion` con `DetalleVenta` de la misma manera: un lote de pulpa puede aparecer en muchos detalles de ventas.

---

### D. Cómo hacer el Diagrama de Flujo del Proceso (Desde Compra hasta Venta)
Esto asegura que el flujo de control y las condiciones estén bien cubiertos en el software.

1. **Inicio**: Dibuja un óvalo que diga "Inicio del Ciclo de Producción" en el extremo superior izquierdo.
2. **Paso 1 (Compra)**: Dibuja una flecha a un rectángulo: "Registrar Compra de Fruta al Proveedor".
3. **Decisión de Calidad (Rombo)**: Saca una flecha a un rombo que pregunte "¿Pasa control de calidad?".
   - *Camino NO*: Flecha hacia "Registrar Fruta Dañada (Merma)" y luego "Fin".
   - *Camino SÍ*: Flecha hacia "Ingresar Fruta al Almacén (Kg)".
4. **Paso 2 (Producción)**: Conecta con "Abrir Lote de Producción (Sabor y Presentación)".
5. **Proceso paralelo**: Dibuja dos líneas que se abran:
   - Rama A: "Registrar tiempos de operarios".
   - Rama B: "Pesar despulpe final para obtener merma".
6. **Paso 3 (Cierre de Lote)**: Une las ramas en "Guardar Temperatura, Calcular Costo Unitario y Registrar Entrada de Pulpas Terminadas".
7. **Paso 4 (Venta)**: Flecha a "Emitir Factura al Cliente seleccionando el Lote de Pulpa".
8. **Fin**: Óvalo final que diga "Registrar ingreso financiero en Flujo de Caja y Fin".

---

### E. Cómo representar la Trazabilidad y los Lotes
Este es el diagrama de "hilo conductor", vital para auditorías sanitarias o reclamos de calidad.

1. **Dibuja una secuencia horizontal de 3 círculos grandes o cilindros**:
   - **Círculo 1**: "Lote Proveedor / Compra" (Ej: `COMP-045 - Proveedor: Frutas del Valle`).
   - **Círculo 2**: "Lote de Producción de Pulpa" (Ej: `LP-FR-20260617-01 - Fresa 250g`).
   - **Círculo 3**: "Lote Vendido / Factura" (Ej: `FAC-9011 - Cliente: Supermercado Central`).
2. **Conexión de Trazabilidad**:
   - Dibuja una línea gruesa o doble flecha que pase por el medio conectándolos de izquierda a derecha. Esto representará cómo puedes rastrear hacia adelante (Forward Tracing) y hacia atrás (Backward Tracing).
   - Escribe bajo la flecha 1: *"Se transformó en"*. Escribe bajo la flecha 2: *"Se despachó en"*.
   - Añade una caja flotante punteada que se conecte a la flecha central que diga: *"Alertas si temperatura sube de -15°C o si hay fruta madura/dañada reportada"*.

---

¡Este plan proporciona toda la estructura, especificaciones y técnicas necesarias para conceptualizar, diagramar y posteriormente construir un ERP robusto e innovador para el negocio de pulpas de frutas!
