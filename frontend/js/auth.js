/**
 * Lógica de Autenticación de Cliente para el Portal Corporativo Premium.
 * Gestiona el inicio de sesión, almacenamiento de JWT y redirecciones de seguridad.
 */

const API_BASE_URL = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirigir al dashboard si ya tiene sesión activa en localStorage
  checkActiveSession();

  // 2. Gestionar el envío del Formulario de Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

/**
 * Verifica si existe un token y es válido. Si es así, redirige al Dashboard.
 */
async function checkActiveSession() {
  const token = localStorage.getItem('token');
  if (!token) return; // No hay sesión

  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Redirigir de inmediato al panel protegido si el token es válido
        window.location.href = '/dashboard.html';
      }
    } else {
      // El token guardado ya no es válido, lo removemos
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error al verificar sesión activa:', error);
  }
}

/**
 * Procesa la petición de inicio de sesión de manera segura.
 */
async function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertContainer = document.getElementById('alert-container');
  const btnSubmit = document.querySelector('#login-form button[type="submit"]');

  if (!emailInput || !passwordInput || !alertContainer || !btnSubmit) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Reset de alertas anteriores
  hideAlert(alertContainer);

  // Validación básica del lado del cliente
  if (!email || !password) {
    showAlert(alertContainer, 'Por favor, ingrese el correo y la contraseña.', 'error');
    return;
  }

  // Deshabilitar botón para prevenir múltiples envíos
  setLoadingState(btnSubmit, true);

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Mostrar alerta de éxito
      showAlert(alertContainer, data.message || 'Acceso concedido. Redirigiendo...', 'success');
      
      // Guardar sesión de forma segura en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir al dashboard protegido tras un breve delay para permitir ver la animación de éxito
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      showAlert(alertContainer, data.message || 'Error al iniciar sesión.', 'error');
      setLoadingState(btnSubmit, false);
    }
  } catch (error) {
    console.error('Error de conexión con el backend:', error);
    showAlert(alertContainer, 'Error de conexión con el servidor. Inténtelo más tarde.', 'error');
    setLoadingState(btnSubmit, false);
  }
}

/**
 * Muestra alertas con diseño elegante en la UI.
 */
function showAlert(container, message, type) {
  container.className = `alert-message ${type}`;
  container.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'error' 
        ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
      }
    </svg>
    <span>${message}</span>
  `;
  container.style.display = 'flex';
}

function hideAlert(container) {
  container.style.display = 'none';
  container.className = 'alert-message';
}

function setLoadingState(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
      <div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
      <span>Verificando...</span>
    `;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Ingresar al Portal';
  }
}
