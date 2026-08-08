# 🏢 Portal de Inteligencia Corporativa Premium con Power BI

Este es un portal corporativo elegante y sofisticado para juntas directivas y ejecutivos, diseñado con estilo **"empresa pudiente" (Glassmorphism, colores sobrios oscuros, acentos dorados y sombras premium)**. Permite el inicio de sesión seguro, autenticación mediante **JSON Web Tokens (JWT)**, encriptación hash con **bcrypt** y visualización de dashboards interactivos de **Power BI** en rutas protegidas.

---

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express, jsonwebtoken (JWT), bcryptjs, dotenv, cors.
*   **Frontend:** HTML5 semántico, CSS3 Premium (Variables, Flexbox, CSS Grid, Glassmorphism), Vanilla JavaScript ES6 (Asíncrono con Fetch API).
*   **Persistencia:** Base de datos simulada en formato JSON local (`db.json`) autogenerada con hashing bcrypt en su inicialización.
*   **Dashboard:** Power BI incrustado dinámicamente mediante iframe, protegido bajo flujo seguro.

---

## 📂 Estructura del Proyecto y Explicación de Archivos

```
proyec.news/
│
├── .env                       # Variables de entorno críticas (Puerto, Secretos, URL de Power BI)
├── .gitignore                 # Exclusiones de Git (node_modules, .env, db.json)
├── package.json               # Dependencias de Node.js y scripts de inicio
├── README.md                  # Este manual completo de instrucciones y arquitectura
│
├── backend/                   # 🖥️ Código de Servidor (Node.js + Express)
│   ├── server.js              # Punto de entrada de la app. Configura Express, sirve estáticos y APIs
│   ├── config/
│   │   └── db.js              # Base de datos JSON de usuarios locales. Hashea contraseñas por defecto
│   ├── controllers/
│   │   └── authController.js  # Lógica de negocio: Login, Registro de Usuarios, Configuración del Dashboard
│   ├── middleware/
│   │   └── authMiddleware.js  # Middleware interceptor de seguridad para verificar firmas JWT
│   └── routes/
│       └── authRoutes.js      # Definición de endpoints de API (/login, /register, /verify, /dashboard-config)
│
└── frontend/                  # 🎨 Código de Cliente (HTML, CSS y JS)
    ├── index.html             # Landing Page corporativa y Panel elegante de Login
    ├── dashboard.html         # Panel de Control Protegido para visualización de Power BI
    ├── css/
    │   └── style.css          # Estilos de marca Elite (Fondo pizarra, acentos oro y glassmorphic)
    └── js/
        ├── auth.js            # Lógica para gestionar peticiones de login y sesión del lado del cliente
        └── dashboard.js       # Comportamiento del dashboard protegido, peticiones JWT y modal de registro
```

---

## 🔐 Cuentas Corporativas por Defecto (Pre-configuradas)

Para facilitar la evaluación de múltiples accesos del sistema, la base de datos se inicializará automáticamente con tres usuarios con diferentes roles organizacionales y contraseñas hasheadas:

| Nombre | Correo Electrónico | Contraseña | Rol Organizacional |
| :--- | :--- | :--- | :--- |
| **Administrador Principal** | `admin@empresa.com` | `admin123` | Administrador |
| **Analista de Datos** | `analista@empresa.com` | `analista123` | Analista de Datos |
| **Gerencia General** | `gerente@empresa.com` | `gerente123` | Director |

> 💡 **Registro Dinámico:** Puedes registrar más usuarios desde el propio Dashboard haciendo clic en el botón **"Registrar Acceso"**, el cual agregará de forma segura el nuevo usuario a la base de datos local `db.json`.

---

## 🚀 Instrucciones para Correr el Proyecto

Sigue estos sencillos pasos para levantar la plataforma en tu entorno local:

### 1. Instalar las dependencias
Abre tu terminal en la raíz del proyecto y ejecuta el instalador de paquetes de Node:
```bash
npm install
```

### 2. Verificar las Variables de Entorno
El archivo `.env` ya se encuentra configurado en la raíz con valores por defecto completamente listos para desarrollo local, incluyendo una URL real e interactiva de demostración corporativa de Power BI:
```env
PORT=3000
JWT_SECRET=super_secret_corporate_key_2026_powerbi_secure_app
JWT_EXPIRES_IN=2h
POWER_BI_DASHBOARD_URL=https://app.powerbi.com/view?r=eyJrIjoiYTM1M2Q0YjUtMzNjMy00YTI0LWFkNDYtMzM0NTE4YWU5ZmU3IiwidCI6ImM0YTA2ODdiLTFkMDItNDhmYy1iYjdmLTZlYzhhNjhkMzhkYiIsImMiOjF9
```

### 3. Iniciar el Servidor de Express
Puedes correr el servidor en modo producción o en modo desarrollo con auto-recarga (vigilancia de archivos):

*   **Modo Estándar (Recomendado):**
    ```bash
    npm start
    ```
*   **Modo Desarrollo (Auto-recarga en Node.js):**
    ```bash
    npm run dev
    ```

### 4. Acceder al Portal
Abre tu navegador preferido e ingresa a:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔍 Verificación del Flujo de Seguridad (Paso a Paso)

1.  **Página de Inicio y Login:** Al ingresar a `http://localhost:3000`, serás recibido por la Landing Page de Apex Analytics. Podrás ver la propuesta de valor y el formulario de inicio de sesión premium a la derecha.
2.  **Seguridad JWT Activa:** Si intentas ingresar manualmente a `http://localhost:3000/dashboard.html` sin haber iniciado sesión, el script de frontend validará la ausencia del token y te **redirigirá automáticamente** de vuelta a la página de login de forma segura.
3.  **Proceso de Login:** Ingresa con cualquiera de las cuentas de prueba (ej: `admin@empresa.com` / `admin123`). El sistema enviará la petición al backend, verificará el hash con `bcrypt` y retornará un Token JWT firmado digitalmente.
4.  **Acceso al Dashboard:** Tras la validación, el frontend guardará el token en `localStorage` y te redirigirá al dashboard protegido.
5.  **Carga del Power BI:** El dashboard enviará el JWT en los headers de autorización (`Authorization: Bearer <token>`). El servidor validará el token y, solo si es correcto, retornará la URL del dashboard de Power BI para que el iframe lo cargue de inmediato.
6.  **Crear múltiples usuarios:** Presiona el botón dorado **"Registrar Acceso"** en la parte superior derecha del panel para desplegar el modal interactivo, registra un nuevo colega, cierra sesión e ingresa con la nueva cuenta creada para validar que se guarda y encripta correctamente en `db.json`.
