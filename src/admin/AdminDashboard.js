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

  renderRecentActivity() {
    if (this.recentOrders.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No hay actividad reciente</h3>
          <p>Los nuevos pedidos aparecerán aquí</p>
        </div>
      `
    }

    return this.recentOrders.slice(0, 5).map(order => `
      <div class="activity-item">
        <div class="activity-icon ${order.status}">
          ${order.status === 'pending' ? '⏳' : order.status === 'processing' ? '🔄' : '✅'}
        </div>
        <div class="activity-content">
          <h4>Pedido #${order.id}</h4>
          <p>${order.customerName} - $${order.total.toFixed(2)}</p>
          <span class="activity-time">${this.formatTime(order.createdAt)}</span>
        </div>
        <div class="activity-action">
          <button class="btn-sm btn-primary" data-navigate="/admin/pedidos">Ver</button>
        </div>
      </div>
    `).join('')
  }

  async loadDashboardData() {
    try {
      // Mock data - In real app this would be API calls
      this.stats = {
        orders: 127,
        products: 24,
        clients: 89,
        pendingOrders: 7
      }

      this.recentOrders = [
        {
          id: '001',
          customerName: 'Juan Pérez',
          total: 1250.00,
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '002',
          customerName: 'María González',
          total: 890.50,
          status: 'processing',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          id: '003',
          customerName: 'Carlos López',
          total: 2100.75,
          status: 'completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  attachEventListeners() {
    // Navigation
    document.querySelectorAll('[data-navigate]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const path = e.currentTarget.getAttribute('href') || e.currentTarget.dataset.navigate
        document.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
      })
    })

    // Logout
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout())
    }
  }

  formatTime(date) {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `Hace ${minutes} min`
    } else if (hours < 24) {
      return `Hace ${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      return `Hace ${days}d`
    }
  }

  isAdminLoggedIn() {
    return localStorage.getItem('admin_session') === 'active'
  }

  logout() {
    localStorage.removeItem('admin_session')
    document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin' } }))
  }

  cleanup() {
    // Clean up any intervals or listeners
  }
}
