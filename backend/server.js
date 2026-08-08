require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');

// Inicializar el servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar la base de datos simulada en memoria/JSON
// Esto crea el archivo db.json con los usuarios por defecto si no existe
db.loadUsers();

// Middlewares globales
app.use(cors()); // Permitir Cross-Origin Resource Sharing
app.use(express.json()); // Habilitar lectura de JSON en el cuerpo de las peticiones

// Servir la carpeta frontend como recursos estáticos de forma que podamos
// acceder a la interfaz premium desde http://localhost:PORT directamente.
app.use(express.static(path.join(__dirname, '../frontend')));

// Logger de peticiones básico
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Registrar rutas de la API de Autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Manejador de rutas para SPA - Redirigir cualquier petición no encontrada a index.html (opcional)
app.get('*', (req, res, next) => {
  // Solo redirigir si no es una ruta de API
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware global de manejo de errores en Express
app.use((err, req, res, next) => {
  console.error('Error no controlado en el servidor:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Ha ocurrido un error inesperado en el servidor.'
  });
});

// Levantar el servidor en el puerto configurado
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` Portal Corporativo de Power BI - Servidor Activo`);
  console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL Local: http://localhost:${PORT}`);
  console.log(`================================================================`);
});
