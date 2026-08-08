const jwt = require('jsonwebtoken');

/**
 * Middleware para validar la sesión del usuario mediante un Token JWT.
 * El token debe venir en los headers en la forma: Authorization: Bearer <token>
 */
const protect = (req, res, next) => {
  let token;

  // Verificar si hay una cabecera de autorización y si comienza con Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraer el token de la cabecera
      token = req.headers.authorization.split(' ')[1];

      // Verificar y decodificar el token con nuestra clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Agregar los datos del usuario decodificados al objeto req para las siguientes capas
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };

      // Continuar al siguiente controlador
      return next();
    } catch (error) {
      console.error('Error de validación del token:', error.message);
      return res.status(401).json({
        success: false,
        message: 'No autorizado. El token no es válido o ha expirado.'
      });
    }
  }

  // Si no se proporcionó ningún token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Falta el token de autenticación.'
    });
  }
};

module.exports = { protect };
