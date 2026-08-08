const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

/**
 * Genera un token JWT firmado.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    }
  );
};

/**
 * Controlador de Inicio de Sesión (Login)
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, ingrese el correo electrónico y la contraseña.'
      });
    }

    // Buscar al usuario por correo electrónico
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas. Verifique el correo o la contraseña.'
      });
    }

    // Comparar la contraseña ingresada con el hash guardado en la base de datos
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas. Verifique el correo o la contraseña.'
      });
    }

    // Generar el Token JWT
    const token = generateToken(user);

    // Responder exitosamente con el token y datos públicos del usuario
    return res.status(200).json({
      success: true,
      message: 'Autenticación exitosa. Bienvenido al portal corporativo.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error interno en el servidor.'
    });
  }
};

/**
 * Controlador para Registrar Nuevos Usuarios
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, complete todos los campos obligatorios (nombre, correo, contraseña).'
      });
    }

    // Validar formato del correo electrónico básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, ingrese un formato de correo electrónico válido.'
      });
    }

    // Validar largo de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres por seguridad.'
      });
    }

    // Crear el usuario usando nuestro módulo de base de datos local
    const newUser = db.createUser(name, email, password, role || 'Usuario');

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente en el sistema corporativo.',
      user: newUser
    });
  } catch (error) {
    console.error('Error en el proceso de registro:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'No se pudo registrar el usuario.'
    });
  }
};

/**
 * Obtener la URL protegida del Dashboard de Power BI.
 * GET /api/auth/dashboard-config
 * [PROTEGIDA por authMiddleware]
 */
const getDashboardConfig = async (req, res) => {
  try {
    // El middleware de autenticación (protect) ya validó el token e inyectó req.user
    const dashboardUrl = process.env.POWER_BI_DASHBOARD_URL;

    if (!dashboardUrl) {
      return res.status(404).json({
        success: false,
        message: 'La URL del Dashboard de Power BI no está configurada en el servidor.'
      });
    }

    // Retorna la configuración de acceso
    return res.status(200).json({
      success: true,
      user: req.user,
      dashboardUrl: dashboardUrl
    });
  } catch (error) {
    console.error('Error al recuperar configuración del dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al cargar la información del Dashboard.'
    });
  }
};

/**
 * Verificar Token (Para que el Frontend valide la persistencia de la sesión de inmediato)
 * GET /api/auth/verify
 * [PROTEGIDA por authMiddleware]
 */
const verifyToken = async (req, res) => {
  // Si el middleware 'protect' pasa con éxito, el token es válido
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = {
  login,
  register,
  getDashboardConfig,
  verifyToken
};
