const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Ruta pública para iniciar sesión
router.post('/login', authController.login);

// Ruta pública para registrar nuevos usuarios corporativos
router.post('/register', authController.register);

// Ruta protegida para verificar la validez del token guardado en el cliente
router.get('/verify', protect, authController.verifyToken);

// Ruta protegida para obtener el enlace del Dashboard de Power BI
router.get('/dashboard-config', protect, authController.getDashboardConfig);

module.exports = router;
