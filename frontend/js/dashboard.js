/**
 * Lógica del Dashboard Protegido.
 * Valida el Token JWT, obtiene el enlace de Power BI y permite registrar nuevos usuarios autorizados.
 */

const API_BASE_URL = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Validar acceso inmediato
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    // Si no hay token o datos de sesión, redirigir inmediatamente
    window.location.href = '/index.html';
    return;
  }

  const user = JSON.parse(userStr);

  // 2. Mostrar datos del usuario en la interfaz
  displayUserProfile(user);

  // 3. Cargar la URL de Power BI de forma protegida
  fetchDashboardConfiguration(token);

  // 4. Configurar botones de acción (Cerrar Sesión, Modales)
  setupDashboardActions();
});

/**
 * Muestra el perfil y rol del usuario actual.
 */
function displayUserProfile(user) {
  const userNameEl = document.getElementById('user-name');
  const userRoleEl = document.getElementById('user-role');
  const userAvatarEl = document.getElementById('user-avatar');

  if (userNameEl) userNameEl.textContent = user.name;
  if (userRoleEl) userRoleEl.textContent = user.role || 'Colaborador';
  
  if (userAvatarEl && user.name) {
    // Inicial del nombre
    userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
  }
}

/**
 * Solicita la configuración y enlace seguro de Power BI al backend.
 */
async function fetchDashboardConfiguration(token) {
  const loader = document.getElementById('loader');
  const iframe = document.getElementById('powerbi-iframe');
  const container = document.getElementById('powerbi-container');

  try {
    const response = await fetch(`${API_BASE_URL}/dashboard-config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Inyectar el enlace de Power BI en el iframe
      if (iframe) {
        iframe.src = data.dashboardUrl;
        
        // Esperar a que el iframe termine de cargar para remover el loader con transición suave
        iframe.addEventListener('load', () => {
          if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
              loader.style.display = 'none';
            }, 500);
          }
        });
      }
    } else {
      // Token inválido o expirado
      console.warn('Fallo de validación de sesión en servidor:', data.message);
      handleLogout();
    }
  } catch (error) {
    console.error('Error al conectar con la API protegida:', error);
    if (loader) {
      loader.innerHTML = `
        <div style="color: #ef4444; text-align: center; padding: 20px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 10px;">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h4 style="margin-bottom: 8px;">Error de Conexión</h4>
          <p style="color: #94a3b8; font-size: 0.9rem;">No pudimos cargar el Dashboard de Power BI. Inténtelo de nuevo.</p>
          <button onclick="location.reload()" class="btn-premium" style="margin-top: 15px; padding: 8px 20px; font-size: 0.8rem;">Reintentar</button>
        </div>
      `;
    }
  }
}

/**
 * Configura los eventos del panel de control
 */
function setupDashboardActions() {
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  // Lógica del modal para registrar nuevos usuarios
  const btnOpenRegister = document.getElementById('btn-open-register');
  const registerModal = document.getElementById('register-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const registerForm = document.getElementById('register-form');
  const modalAlert = document.getElementById('modal-alert');

  if (btnOpenRegister && registerModal && btnCloseModal) {
    btnOpenRegister.addEventListener('click', () => {
      registerModal.classList.add('active');
    });

    btnCloseModal.addEventListener('click', () => {
      registerModal.classList.remove('active');
      if (registerForm) registerForm.reset();
      if (modalAlert) modalAlert.style.display = 'none';
    });

    // Cerrar al hacer clic fuera del contenido
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        registerModal.classList.remove('active');
        if (registerForm) registerForm.reset();
        if (modalAlert) modalAlert.style.display = 'none';
      }
    });
  }

  // Formulario de Registro
  if (registerForm && modalAlert) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const role = document.getElementById('reg-role').value;
      const btnRegSubmit = registerForm.querySelector('button[type="submit"]');

      modalAlert.style.display = 'none';

      if (!name || !email || !password) {
        showModalAlert(modalAlert, 'Por favor, complete todos los campos.', 'error');
        return;
      }

      setLoadingState(btnRegSubmit, true, 'Registrando...');

      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showModalAlert(modalAlert, '¡Usuario registrado con éxito!', 'success');
          registerForm.reset();
          
          // Cerrar modal automáticamente después de un momento
          setTimeout(() => {
            registerModal.classList.remove('active');
            modalAlert.style.display = 'none';
          }, 1500);
        } else {
          showModalAlert(modalAlert, data.message || 'Error al registrar.', 'error');
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        showModalAlert(modalAlert, 'Error de conexión con el servidor.', 'error');
      } finally {
        setLoadingState(btnRegSubmit, false);
      }
    });
  }
}

/**
 * Cierra la sesión activa borrando las credenciales locales y redirigiendo a login.
 */
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

/**
 * Muestra alertas dentro del modal
 */
function showModalAlert(container, message, type) {
  container.className = `alert-message ${type}`;
  container.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'error' 
        ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
      }
    </svg>
    <span>${message}</span>
  `;
  container.style.display = 'flex';
}

function setLoadingState(button, isLoading, text = 'Procesando...') {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
      <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
      <span>${text}</span>
    `;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Registrar Acceso';
  }
}
