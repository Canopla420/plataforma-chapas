export class AdminLoginPage {
  constructor() {
    this.isLoading = false
  }

  async render() {
    // Check if already logged in
    if (this.isAdminLoggedIn()) {
      document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin/dashboard' } }))
      return
    }

    const appElement = document.getElementById('app')
    appElement.innerHTML = this.getHTML()
    this.attachEventListeners()
  }

  getHTML() {
    return `
      <div style="min-height: 100vh; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div style="background: white; padding: 3rem; border-radius: var(--border-radius); box-shadow: var(--shadow-lg); width: 100%; max-width: 400px;">
          <div class="text-center" style="margin-bottom: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
            <h1 style="margin-bottom: 0.5rem;">Panel de Administración</h1>
            <p style="color: var(--text-secondary);">Acceso restringido para administradores</p>
          </div>

          <form id="admin-login-form">
            <div class="form-group">
              <label class="form-label">Usuario</label>
              <input type="text" name="username" class="form-input" required placeholder="Ingresa tu usuario">
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" name="password" class="form-input" required placeholder="Ingresa tu contraseña">
            </div>

            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" name="remember">
                <span>Recordar sesión</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="login-btn">
              <span id="login-text">Iniciar Sesión</span>
              <span id="login-spinner" class="hidden">Verificando...</span>
            </button>
          </form>

          <div style="margin-top: 2rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius); font-size: 0.875rem;">
            <strong>Demo - Credenciales de prueba:</strong><br>
            Usuario: <code>admin</code><br>
            Contraseña: <code>admin123</code>
          </div>

          <div class="text-center" style="margin-top: 2rem;">
            <a href="/" style="color: var(--primary-color); text-decoration: none;">
              ← Volver al sitio principal
            </a>
          </div>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    const form = document.getElementById('admin-login-form')
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        this.handleLogin(form)
      })
    }
  }

  async handleLogin(form) {
    if (this.isLoading) return

    this.isLoading = true
    this.updateLoginButton(true)

    const formData = new FormData(form)
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
      remember: formData.get('remember')
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simple authentication (in production, this would be a secure API call)
      if (this.validateCredentials(credentials.username, credentials.password)) {
        this.setAdminSession(credentials.remember)
        this.showSuccess()
        
        // Redirect to dashboard
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin/dashboard' } }))
        }, 1500)
      } else {
        this.showError('Usuario o contraseña incorrectos')
      }
    } catch (error) {
      console.error('Login error:', error)
      this.showError('Error de conexión. Intenta de nuevo.')
    } finally {
      this.isLoading = false
      this.updateLoginButton(false)
    }
  }

  validateCredentials(username, password) {
    // Demo credentials - in production, this would validate against a secure backend
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'administrador', password: 'chapas2025' }
    ]

    return validCredentials.some(cred => 
      cred.username === username && cred.password === password
    )
  }

  setAdminSession(remember = false) {
    const sessionData = {
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
      role: 'admin'
    }

    if (remember) {
      localStorage.setItem('admin_session', JSON.stringify(sessionData))
    } else {
      sessionStorage.setItem('admin_session', JSON.stringify(sessionData))
    }
  }

  isAdminLoggedIn() {
    const sessionData = localStorage.getItem('admin_session') || sessionStorage.getItem('admin_session')
    if (!sessionData) return false

    try {
      const session = JSON.parse(sessionData)
      return session.isLoggedIn === true
    } catch (error) {
      return false
    }
  }

  updateLoginButton(loading) {
    const loginText = document.getElementById('login-text')
    const loginSpinner = document.getElementById('login-spinner')
    const loginBtn = document.getElementById('login-btn')

    if (loading) {
      loginText.classList.add('hidden')
      loginSpinner.classList.remove('hidden')
      loginBtn.disabled = true
    } else {
      loginText.classList.remove('hidden')
      loginSpinner.classList.add('hidden')
      loginBtn.disabled = false
    }
  }

  showSuccess() {
    this.showMessage('¡Acceso concedido! Redirigiendo...', 'success')
  }

  showError(message) {
    this.showMessage(message, 'error')
  }

  showMessage(text, type = 'info') {
    const colors = {
      success: 'var(--success)',
      error: 'var(--error)',
      info: 'var(--primary-color)'
    }

    const message = document.createElement('div')
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `
    message.textContent = text
    
    document.body.appendChild(message)
    
    setTimeout(() => {
      message.remove()
    }, 4000)
  }

  cleanup() {
    // Clean up any event listeners
  }
}
