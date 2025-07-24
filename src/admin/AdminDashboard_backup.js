export class AdminDashboard {
  constructor() {
    this.stats = {
      orders: 0,
      products: 0,
      clients: 0,
      pendingOrders: 0
    }
    this.recentOrders = []
    this.notifications = []
  }

  async render() {
    // Check authentication
    if (!this.isAdminLoggedIn()) {
      document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin' } }))
      return
    }

    await this.loadDashboardData()

    const appElement = document.getElementById('app')
    appElement.innerHTML = this.getHTML()
    this.attachEventListeners()
  }

  getHTML() {
    return `
      <div class="admin-layout">
        <!-- Sidebar -->
        <div class="admin-sidebar">
          <div class="admin-header">
            <div class="admin-logo">
              <div class="logo-icon">🏭</div>
              <div class="logo-text">
                <h2>Admin Panel</h2>
                <p>Plataforma Chapas</p>
              </div>
            </div>
          </div>

          <nav class="admin-nav">
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="/admin/dashboard" class="nav-link active" data-navigate>
                  <span class="nav-icon">📊</span>
                  <span class="nav-text">Dashboard</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/admin/pedidos" class="nav-link" data-navigate>
                  <span class="nav-icon">📦</span>
                  <span class="nav-text">Pedidos</span>
                  ${this.stats.pendingOrders > 0 ? `<span class="nav-badge">${this.stats.pendingOrders}</span>` : ''}
                </a>
              </li>
              <li class="nav-item">
                <a href="/admin/productos" class="nav-link" data-navigate>
                  <span class="nav-icon">🏗️</span>
                  <span class="nav-text">Productos</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="/admin/clientes" class="nav-link" data-navigate>
                  <span class="nav-icon">👥</span>
                  <span class="nav-text">Clientes</span>
                </a>
              </li>
            </ul>
          </nav>

          <div class="admin-footer">
            <button class="logout-btn" id="logout-btn">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="admin-content">
          <!-- Header -->
          <div class="content-header">
            <div class="header-title">
              <h1>Dashboard</h1>
              <p>Resumen general de la plataforma</p>
            </div>
            <div class="header-actions">
              <div class="last-update">
                Última actualización: ${new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card primary">
              <div class="stat-header">
                <h3>Pedidos Totales</h3>
                <span class="stat-icon">📊</span>
              </div>
              <div class="stat-value">${this.stats.orders}</div>
              <div class="stat-change positive">+12% vs mes anterior</div>
            </div>

            <div class="stat-card success">
              <div class="stat-header">
                <h3>Productos Activos</h3>
                <span class="stat-icon">🏗️</span>
              </div>
              <div class="stat-value">${this.stats.products}</div>
              <div class="stat-change neutral">Catálogo completo</div>
            </div>

            <div class="stat-card warning">
              <div class="stat-header">
                <h3>Pedidos Pendientes</h3>
                <span class="stat-icon">⏳</span>
              </div>
              <div class="stat-value">${this.stats.pendingOrders}</div>
              <div class="stat-change ${this.stats.pendingOrders > 0 ? 'negative' : 'positive'}">
                ${this.stats.pendingOrders > 0 ? 'Requieren atención' : 'Todo al día'}
              </div>
            </div>

            <div class="stat-card info">
              <div class="stat-header">
                <h3>Clientes Registrados</h3>
                <span class="stat-icon">👥</span>
              </div>
              <div class="stat-value">${this.stats.clients}</div>
              <div class="stat-change positive">+5 esta semana</div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h2>Acciones Rápidas</h2>
            <div class="actions-grid">
              <button class="action-card" data-navigate="/admin/productos">
                <span class="action-icon">➕</span>
                <h3>Nuevo Producto</h3>
                <p>Agregar producto al catálogo</p>
              </button>
              <button class="action-card" data-navigate="/admin/pedidos">
                <span class="action-icon">📋</span>
                <h3>Revisar Pedidos</h3>
                <p>Gestionar pedidos pendientes</p>
              </button>
              <button class="action-card" onclick="window.open('/', '_blank')">
                <span class="action-icon">🌐</span>
                <h3>Ver Sitio Web</h3>
                <p>Abrir tienda en nueva pestaña</p>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="recent-activity">
            <div class="section-header">
              <h2>Actividad Reciente</h2>
              <button class="btn-secondary">Ver Todo</button>
            </div>
            <div class="activity-list">
              ${this.renderRecentActivity()}
            </div>
          </div>
        </div>
      </div>
    `
  }
                🏗️ Productos
              </a>
            </div>
            <div class="admin-nav-item">
              <a href="/admin/clientes" class="admin-nav-link" data-navigate>
                👥 Clientes
              </a>
            </div>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #374151;">
              <div class="admin-nav-item">
                <a href="/" class="admin-nav-link" data-navigate>
                  🏠 Ir al Sitio
                </a>
              </div>
              <div class="admin-nav-item">
                <button class="admin-nav-link" style="width: 100%; text-align: left; background: none; border: none; color: #cbd5e1;" onclick="this.logout()">
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="admin-content">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
              <h1 style="margin-bottom: 0.5rem;">Dashboard</h1>
              <p style="color: var(--text-secondary);">Resumen general de la plataforma</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="position: relative;">
                <button class="btn btn-outline" id="notifications-btn">
                  🔔 Notificaciones
                  ${this.notifications.filter(n => !n.read).length > 0 ? `
                    <span style="position: absolute; top: -5px; right: -5px; background: var(--error); color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;">
                      ${this.notifications.filter(n => !n.read).length}
                    </span>
                  ` : ''}
                </button>
              </div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">
                ${new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-4" style="margin-bottom: 3rem;">
            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Total Pedidos</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color); margin: 0;">${this.stats.orders}</p>
                </div>
                <div style="font-size: 2rem;">📦</div>
              </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Productos</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--success); margin: 0;">${this.stats.products}</p>
                </div>
                <div style="font-size: 2rem;">🏗️</div>
              </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Clientes</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--accent-color); margin: 0;">${this.stats.clients}</p>
                </div>
                <div style="font-size: 2rem;">👥</div>
              </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Pendientes</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--warning); margin: 0;">${this.stats.pendingOrders}</p>
                </div>
                <div style="font-size: 2rem;">⏳</div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-2" style="gap: 2rem;">
            <!-- Recent Orders -->
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0;">Pedidos Recientes</h2>
                <a href="/admin/pedidos" class="btn btn-outline btn-sm" data-navigate>Ver Todos</a>
              </div>
              
              ${this.recentOrders.length > 0 ? `
                <div>
                  ${this.recentOrders.map(order => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 1rem;">
                      <div>
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">${order.id}</div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">
                          ${order.customer.firstName} ${order.customer.lastName}
                        </div>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-weight: 600; color: var(--primary-color);">$${order.total.toFixed(2)}</div>
                        <span class="status-badge status-${order.status === 'pending_confirmation' ? 'pending' : order.status === 'processing' ? 'processing' : 'completed'}">
                          ${this.getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="text-center" style="padding: 2rem;">
                  <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">📦</div>
                  <p style="color: var(--text-secondary);">No hay pedidos recientes</p>
                </div>
              `}
            </div>

            <!-- Quick Actions -->
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <h2 style="margin-bottom: 1.5rem;">Acciones Rápidas</h2>
              
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/admin/productos'}}))">
                  ➕ Agregar Nuevo Producto
                </button>
                
                <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/admin/pedidos'}}))">
                  📋 Revisar Pedidos Pendientes
                </button>
                
                <button class="btn btn-secondary" onclick="this.exportData()">
                  📊 Exportar Datos
                </button>
                
                <button class="btn btn-outline" onclick="this.viewReports()">
                  📈 Ver Reportes
                </button>
              </div>

              <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                <h3 style="margin-bottom: 1rem;">Estado del Sistema</h3>
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                  <span style="color: var(--success); margin-right: 0.5rem;">●</span>
                  <span style="font-size: 0.875rem;">Servidor conectado</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                  <span style="color: var(--success); margin-right: 0.5rem;">●</span>
                  <span style="font-size: 0.875rem;">Base de datos activa</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: var(--warning); margin-right: 0.5rem;">●</span>
                  <span style="font-size: 0.875rem;">Modo demo activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  async loadDashboardData() {
    try {
      // Load orders
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      this.stats.orders = orders.length
      this.stats.pendingOrders = orders.filter(o => o.status === 'pending_confirmation').length
      this.recentOrders = orders.slice(-5).reverse()

      // Load products (from mock data)
      const { ProductService } = await import('../data/products.js')
      const products = await ProductService.getAllProducts()
      this.stats.products = products.length

      // Count unique clients
      const clients = new Set(orders.map(o => o.customer.email))
      this.stats.clients = clients.size

      // Load notifications
      this.notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]')

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  getStatusText(status) {
    const statusMap = {
      'pending_confirmation': 'Pendiente',
      'processing': 'En Proceso',
      'completed': 'Completado'
    }
    return statusMap[status] || status
  }

  attachEventListeners() {
    // Navigation links
    document.querySelectorAll('[data-navigate]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const path = e.currentTarget.getAttribute('href')
        document.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
      })
    })

    // Logout function
    window.logout = () => {
      localStorage.removeItem('admin_session')
      sessionStorage.removeItem('admin_session')
      document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin' } }))
    }

    // Quick actions
    window.exportData = () => {
      this.showMessage('Función de exportación en desarrollo', 'info')
    }

    window.viewReports = () => {
      this.showMessage('Módulo de reportes próximamente', 'info')
    }

    // Notifications
    const notificationsBtn = document.getElementById('notifications-btn')
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => {
        this.showNotifications()
      })
    }
  }

  showNotifications() {
    if (this.notifications.length === 0) {
      this.showMessage('No hay notificaciones nuevas', 'info')
      return
    }

    const content = this.notifications.map(notification => `
      <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); ${!notification.read ? 'background: var(--bg-secondary);' : ''}">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">${notification.message}</div>
        <div style="color: var(--text-secondary); font-size: 0.875rem;">
          ${new Date(notification.createdAt).toLocaleDateString('es-ES')}
        </div>
      </div>
    `).join('')

    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: 'Notificaciones',
        content: `<div style="max-height: 400px; overflow-y: auto;">${content}</div>`,
        footer: '<button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent(\'modal:close\'))">Cerrar</button>'
      }
    }))

    // Mark as read
    this.notifications.forEach(n => n.read = true)
    localStorage.setItem('admin_notifications', JSON.stringify(this.notifications))
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

  showMessage(text, type = 'info') {
    const colors = {
      success: 'var(--success)',
      error: 'var(--error)',
      warning: 'var(--warning)',
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
    `
    message.textContent = text
    
    document.body.appendChild(message)
    
    setTimeout(() => {
      message.remove()
    }, 4000)
  }

  cleanup() {
    // Clean up global functions
    delete window.logout
    delete window.exportData
    delete window.viewReports
  }
}
