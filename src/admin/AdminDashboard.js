export class AdminDashboard {
  constructor() {
    this.stats = {
      orders: 0,
      products: 0,
      clients: 0,
      pendingOrders: 0,
    };
    this.recentOrders = [];
    this.notifications = [];
  }

  async render() {
    // Check authentication
    if (!this.isAdminLoggedIn()) {
      document.dispatchEvent(
        new CustomEvent("navigate", { detail: { path: "/admin" } })
      );
      return;
    }

    await this.loadDashboardData();

    const appElement = document.getElementById("app");
    appElement.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  getHTML() {
    return `
      <div class="admin-layout">
        <!-- Header Navigation -->
        <header class="admin-header">
          <div class="admin-header-content">
            <div class="admin-brand">
              <div class="brand-icon">🏭</div>
              <div class="brand-text">
                <h1>Panel de Administración</h1>
                <p>Plataforma Chapas</p>
              </div>
            </div>
            
            <nav class="admin-nav">
              <a href="/admin/dashboard" class="nav-tab active" data-navigate>
                <span class="tab-icon">📊</span>
                <span class="tab-text">Dashboard</span>
              </a>
              <a href="/admin/pedidos" class="nav-tab" data-navigate>
                <span class="tab-icon">📦</span>
                <span class="tab-text">Pedidos</span>
                ${this.stats.pendingOrders > 0 ? `<span class="tab-badge">${this.stats.pendingOrders}</span>` : ""}
              </a>
              <a href="/admin/productos" class="nav-tab" data-navigate>
                <span class="tab-icon">🏗️</span>
                <span class="tab-text">Productos</span>
              </a>
              <a href="/admin/clientes" class="nav-tab" data-navigate>
                <span class="tab-icon">👥</span>
                <span class="tab-text">Clientes</span>
              </a>
            </nav>

            <div class="admin-actions">
              <div class="last-update">
                ${new Date().toLocaleTimeString()}
              </div>
              <button class="logout-btn" id="logout-btn">
                <span>🚪</span>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="admin-main">
        <!-- Main Content -->
        <main class="admin-main">
          <!-- Page Title -->
          <div class="page-header">
            <h2>Dashboard General</h2>
            <p>Resumen de actividad de la plataforma</p>
          </div>

          <!-- Stats Cards -->
          <div class="stats-container">
            <div class="stat-card primary">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <div class="stat-value">${this.stats.orders}</div>
                <div class="stat-label">Pedidos Totales</div>
                <div class="stat-change positive">+12% vs mes anterior</div>
              </div>
            </div>

            <div class="stat-card success">
              <div class="stat-icon">🏗️</div>
              <div class="stat-info">
                <div class="stat-value">${this.stats.products}</div>
                <div class="stat-label">Productos Activos</div>
                <div class="stat-change neutral">Catálogo completo</div>
              </div>
            </div>

            <div class="stat-card warning">
              <div class="stat-icon">⏳</div>
              <div class="stat-info">
                <div class="stat-value">${this.stats.pendingOrders}</div>
                <div class="stat-label">Pedidos Pendientes</div>
                <div class="stat-change ${this.stats.pendingOrders > 0 ? "negative" : "positive"}">
                  ${this.stats.pendingOrders > 0 ? "Requieren atención" : "Todo al día"}
                </div>
              </div>
            </div>

            <div class="stat-card info">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <div class="stat-value">${this.stats.clients}</div>
                <div class="stat-label">Clientes Registrados</div>
                <div class="stat-change positive">+5 esta semana</div>
              </div>
            </div>
          </div>

          <!-- Action Cards Grid -->
          <div class="actions-section">
            <h3>Acciones Rápidas</h3>
            <div class="actions-grid">
              <button class="action-card primary" data-navigate="/admin/productos">
                <div class="action-icon">➕</div>
                <div class="action-content">
                  <h4>Nuevo Producto</h4>
                  <p>Agregar producto al catálogo</p>
                </div>
              </button>
              
              <button class="action-card warning" data-navigate="/admin/pedidos">
                <div class="action-icon">📋</div>
                <div class="action-content">
                  <h4>Revisar Pedidos</h4>
                  <p>Gestionar pedidos pendientes</p>
                </div>
              </button>
              
              <button class="action-card info" onclick="window.open('/', '_blank')">
                <div class="action-icon">🌐</div>
                <div class="action-content">
                  <h4>Ver Sitio Web</h4>
                  <p>Abrir tienda en nueva pestaña</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="activity-section">
            <div class="section-header">
              <h3>Actividad Reciente</h3>
              <button class="btn-outline">Ver Todos</button>
            </div>
            <div class="activity-container">
              ${this.renderRecentActivity()}
            </div>
          </div>
        </main>
      </div>
    `;
  }

  renderRecentActivity() {
    if (this.recentOrders.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h4>No hay actividad reciente</h4>
          <p>Los nuevos pedidos aparecerán aquí</p>
        </div>
      `;
    }

    return this.recentOrders
      .slice(0, 5)
      .map(
        (order) => `
      <div class="activity-item">
        <div class="activity-status ${order.status}">
          ${
            order.status === "pending"
              ? "⏳"
              : order.status === "processing"
              ? "🔄"
              : "✅"
          }
        </div>
        <div class="activity-details">
          <h5>Pedido #${order.id}</h5>
          <p>${order.customerName} - $${order.total.toFixed(2)}</p>
          <span class="activity-time">${this.formatTime(order.createdAt)}</span>
        </div>
        <button class="btn-sm" data-navigate="/admin/pedidos">Ver Detalles</button>
      </div>
    `
      )
      .join("");
  }

  async loadDashboardData() {
    try {
      // Mock data - In real app this would be API calls
      this.stats = {
        orders: 127,
        products: 24,
        clients: 89,
        pendingOrders: 7,
      };

      this.recentOrders = [
        {
          id: "001",
          customerName: "Juan Pérez",
          total: 1250.0,
          status: "pending",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "002",
          customerName: "María González",
          total: 890.5,
          status: "processing",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
        {
          id: "003",
          customerName: "Carlos López",
          total: 2100.75,
          status: "completed",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ];
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }

  attachEventListeners() {
    // Navigation
    document.querySelectorAll("[data-navigate]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const path =
          e.currentTarget.getAttribute("href") ||
          e.currentTarget.dataset.navigate;
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path } })
        );
      });
    });

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Hace ${minutes} min`;
    } else if (hours < 24) {
      return `Hace ${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `Hace ${days}d`;
    }
  }

  isAdminLoggedIn() {
    return localStorage.getItem("admin_session") === "active";
  }

  logout() {
    localStorage.removeItem("admin_session");
    document.dispatchEvent(
      new CustomEvent("navigate", { detail: { path: "/admin" } })
    );
  }

  cleanup() {
    // Clean up any intervals or listeners
  }
}
