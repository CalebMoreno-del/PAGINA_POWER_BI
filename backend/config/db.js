const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ruta del archivo que servirá como base de datos local JSON
const DB_PATH = path.join(process.cwd(), 'db.json');

/**
 * Carga los usuarios desde el archivo JSON de la base de datos.
 * Si el archivo no existe, lo inicializa con usuarios por defecto.
 */
function loadUsers() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Inicializar base de datos con usuarios por defecto si no existe
      const salt = bcrypt.genSaltSync(10);
      const defaultUsers = [
        {
          id: '1',
          name: 'Administrador Principal',
          email: 'admin@empresa.com',
          password: bcrypt.hashSync('admin123', salt),
          role: 'Administrador',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Analista de Datos',
          email: 'analista@empresa.com',
          password: bcrypt.hashSync('analista123', salt),
          role: 'Analista',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Gerencia General',
          email: 'gerente@empresa.com',
          password: bcrypt.hashSync('gerente123', salt),
          role: 'Director',
          createdAt: new Date().toISOString()
        }
      ];
      
      saveUsers(defaultUsers);
      console.log('Base de datos inicializada con usuarios por defecto de forma segura.');
      return defaultUsers;
    }
    
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar la base de datos de usuarios:', error);
    return [];
  }
}

/**
 * Guarda el arreglo de usuarios en el archivo JSON.
 */
function saveUsers(users) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar la base de datos de usuarios:', error);
  }
}

/**
 * Busca un usuario por su correo electrónico.
 */
function findUserByEmail(email) {
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Registra un nuevo usuario en la base de datos local de manera segura.
 */
function createUser(name, email, plainPassword, role = 'Usuario') {
  const users = loadUsers();
  
  // Validar si el email ya existe
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('El correo electrónico ya se encuentra registrado.');
  }
  
  const salt = bcrypt.genSaltSync(10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(plainPassword, salt),
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt
  };
}

module.exports = {
  loadUsers,
  findUserByEmail,
  createUser
};
