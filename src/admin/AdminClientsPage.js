export class AdminClientsPage {
  constructor() {
    this.clients = []
    this.filteredClients = []
    this.currentSort = 'date_desc'
  }

  async render() {
    if (!this.isAdminLoggedIn()) {
      document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin' } }))
      return
    }

    await this.loadClients()

    const appElement = document.getElementById('app')
    appElement.innerHTML = this.getHTML()
    this.attachEventListeners()
  }

  getHTML() {
    return `
      <div class="admin-layout">
        <!-- Sidebar -->
        <div class="admin-sidebar">
          <div style="margin-bottom: 2rem;">
            <h2 style="color: white; margin-bottom: 0.5rem;">Panel Admin</h2>
            <p style="color: #cbd5e1; font-size: 0.875rem;">Plataforma Chapas</p>
          </div>

          <nav class="admin-nav">
            <div class="admin-nav-item">
              <a href="/admin/dashboard" class="admin-nav-link" data-navigate>📊 Dashboard</a>
            </div>
            <div class="admin-nav-item">
              <a href="/admin/pedidos" class="admin-nav-link" data-navigate>📦 Pedidos</a>
            </div>
            <div class="admin-nav-item">
              <a href="/admin/productos" class="admin-nav-link" data-navigate>🏗️ Productos</a>
            </div>
            <div class="admin-nav-item">
              <a href="/admin/clientes" class="admin-nav-link active" data-navigate>👥 Clientes</a>
            </div>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #374151;">
              <div class="admin-nav-item">
                <a href="/" class="admin-nav-link" data-navigate>🏠 Ir al Sitio</a>
              </div>
              <div class="admin-nav-item">
                <button class="admin-nav-link" style="width: 100%; text-align: left; background: none; border: none; color: #cbd5e1;" onclick="this.logout()">🚪 Cerrar Sesión</button>
              </div>
            </div>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="admin-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
              <h1 style="margin-bottom: 0.5rem;">Gestión de Clientes</h1>
              <p style="color: var(--text-secondary);">Administra la información de los clientes</p>
            </div>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-outline" onclick="this.exportClients()">📊 Exportar</button>
              <button class="btn btn-outline" onclick="this.generateReport()">📈 Reporte</button>
              <button class="btn btn-primary" onclick="this.refreshClients()">🔄 Actualizar</button>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-4" style="margin-bottom: 2rem;">
            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Total Clientes</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color); margin: 0;">${this.clients.length}</p>
                </div>
                <div style="font-size: 2rem;">👥</div>
              </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Clientes Activos</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--success); margin: 0;">${this.getActiveClientsCount()}</p>
                </div>
                <div style="font-size: 2rem;">✅</div>
              </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Empresas</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--accent-color); margin: 0;">${this.getCompanyClientsCount()}</p>
                </div>
                <div style="font-size: 2rem;">🏢</div>
              </div>
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Valor Promedio</p>
                  <p style="font-size: 2rem; font-weight: 700; color: var(--warning); margin: 0;">$${this.getAverageOrderValue().toFixed(0)}</p>
                </div>
                <div style="font-size: 2rem;">💰</div>
              </div>
            </div>
          </div>

          <!-- Filters and Search -->
          <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
            <div class="grid grid-3" style="gap: 1rem; align-items: end;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Ordenar por</label>
                <select id="sort-select" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                  <option value="date_desc">Fecha registro (Más reciente)</option>
                  <option value="date_asc">Fecha registro (Más antiguo)</option>
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="name_desc">Nombre (Z-A)</option>
                  <option value="orders_desc">Más pedidos</option>
                  <option value="total_desc">Mayor valor total</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Filtrar por tipo</label>
                <select id="type-filter" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                  <option value="all">Todos los clientes</option>
                  <option value="individual">Clientes individuales</option>
                  <option value="company">Empresas</option>
                  <option value="active">Solo activos</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Buscar</label>
                <input type="text" id="search-input" placeholder="Nombre, email, empresa..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
              </div>
            </div>
          </div>

          <!-- Clients Table -->
          <div style="background: white; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); overflow: hidden;">
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
              <h2 style="margin: 0;">Lista de Clientes (${this.filteredClients.length})</h2>
            </div>
            
            ${this.filteredClients.length > 0 ? `
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead style="background: var(--bg-secondary);">
                    <tr>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Cliente</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Información</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Registro</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Pedidos</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Total Compras</th>
                      <th style="padding: 1rem; text-align: center; font-weight: 600;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.filteredClients.map(client => `
                      <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 1rem;">
                          <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 40px; height: 40px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600;">
                              ${client.firstName.charAt(0).toUpperCase()}${client.lastName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style="font-weight: 600;">${client.firstName} ${client.lastName}</div>
                              ${client.company ? `<div style="color: var(--text-secondary); font-size: 0.875rem;">🏢 ${client.company}</div>` : ''}
                            </div>
                          </div>
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-size: 0.875rem;">
                            <div>📧 ${client.email}</div>
                            <div style="margin-top: 0.25rem;">📞 ${client.phone}</div>
                            ${client.city ? `<div style="margin-top: 0.25rem;">📍 ${client.city}, ${client.state}</div>` : ''}
                          </div>
                        </td>
                        <td style="padding: 1rem;">
                          <div>${new Date(client.firstOrderDate).toLocaleDateString('es-ES')}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">
                            ${this.getTimeSince(client.firstOrderDate)}
                          </div>
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 600; color: var(--primary-color);">${client.orderCount}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">
                            ${client.lastOrderDate ? `Último: ${new Date(client.lastOrderDate).toLocaleDateString('es-ES')}` : 'Sin pedidos'}
                          </div>
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 600; color: var(--success);">$${client.totalSpent.toFixed(2)}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">
                            Promedio: $${(client.totalSpent / (client.orderCount || 1)).toFixed(2)}
                          </div>
                        </td>
                        <td style="padding: 1rem; text-align: center;">
                          <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button class="btn btn-sm btn-outline" onclick="this.viewClient('${client.email}')">👁️ Ver</button>
                            <button class="btn btn-sm btn-primary" onclick="this.viewOrders('${client.email}')">📦 Pedidos</button>
                            <button class="btn btn-sm btn-secondary" onclick="this.contactClient('${client.email}')">📧 Contactar</button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <div class="text-center" style="padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">👥</div>
                <h3 style="margin-bottom: 1rem;">No se encontraron clientes</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                  Los clientes aparecerán aquí después de realizar su primer pedido.
                </p>
              </div>
            `}
          </div>
        </div>
      </div>
    `
  }

  async loadClients() {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      
      // Group orders by customer email to create client profiles
      const clientMap = new Map()
      
      orders.forEach(order => {
        const email = order.customer.email
        if (!clientMap.has(email)) {
          clientMap.set(email, {
            ...order.customer,
            orderCount: 0,
            totalSpent: 0,
            firstOrderDate: order.createdAt,
            lastOrderDate: order.createdAt,
            orders: []
          })
        }
        
        const client = clientMap.get(email)
        client.orderCount++
        client.totalSpent += order.total
        client.orders.push(order)
        
        // Update first and last order dates
        if (new Date(order.createdAt) < new Date(client.firstOrderDate)) {
          client.firstOrderDate = order.createdAt
        }
        if (new Date(order.createdAt) > new Date(client.lastOrderDate)) {
          client.lastOrderDate = order.createdAt
        }
      })
      
      this.clients = Array.from(clientMap.values())
      this.applyFilters()
    } catch (error) {
      console.error('Error loading clients:', error)
      this.clients = []
      this.filteredClients = []
    }
  }

  applyFilters() {
    let filtered = [...this.clients]

    // Apply type filter
    const typeFilter = document.getElementById('type-filter')?.value
    if (typeFilter && typeFilter !== 'all') {
      switch (typeFilter) {
        case 'individual':
          filtered = filtered.filter(client => !client.company)
          break
        case 'company':
          filtered = filtered.filter(client => client.company)
          break
        case 'active':
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          filtered = filtered.filter(client => new Date(client.lastOrderDate) > threeMonthsAgo)
          break
      }
    }

    // Apply search
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase()
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.firstName.toLowerCase().includes(searchTerm) ||
        client.lastName.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        (client.company && client.company.toLowerCase().includes(searchTerm))
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (this.currentSort) {
        case 'date_desc':
          return new Date(b.firstOrderDate) - new Date(a.firstOrderDate)
        case 'date_asc':
          return new Date(a.firstOrderDate) - new Date(b.firstOrderDate)
        case 'name_asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case 'name_desc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`)
        case 'orders_desc':
          return b.orderCount - a.orderCount
        case 'total_desc':
          return b.totalSpent - a.totalSpent
        default:
          return 0
      }
    })

    this.filteredClients = filtered
  }

  getActiveClientsCount() {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return this.clients.filter(client => new Date(client.lastOrderDate) > threeMonthsAgo).length
  }

  getCompanyClientsCount() {
    return this.clients.filter(client => client.company).length
  }

  getAverageOrderValue() {
    if (this.clients.length === 0) return 0
    const totalSpent = this.clients.reduce((sum, client) => sum + client.totalSpent, 0)
    const totalOrders = this.clients.reduce((sum, client) => sum + client.orderCount, 0)
    return totalOrders > 0 ? totalSpent / totalOrders : 0
  }

  getTimeSince(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoy'
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 30) return `Hace ${diffInDays} días`
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`
    return `Hace ${Math.floor(diffInDays / 365)} años`
  }

  attachEventListeners() {
    // Navigation
    document.querySelectorAll('[data-navigate]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const path = e.currentTarget.getAttribute('href')
        document.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
      })
    })

    // Filters
    const sortSelect = document.getElementById('sort-select')
    const typeFilter = document.getElementById('type-filter')
    const searchInput = document.getElementById('search-input')

    if (sortSelect) {
      sortSelect.value = this.currentSort
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value
        this.applyFilters()
        this.updateTable()
      })
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', () => {
        this.applyFilters()
        this.updateTable()
      })
    }

    if (searchInput) {
      let timeout
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          this.applyFilters()
          this.updateTable()
        }, 300)
      })
    }

    // Global functions
    window.logout = () => {
      localStorage.removeItem('admin_session')
      sessionStorage.removeItem('admin_session')
      document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin' } }))
    }

    window.exportClients = () => this.exportClients()
    window.generateReport = () => this.generateReport()
    window.refreshClients = () => this.refreshClients()
    window.viewClient = (email) => this.viewClient(email)
    window.viewOrders = (email) => this.viewOrders(email)
    window.contactClient = (email) => this.contactClient(email)
  }

  updateTable() {
    const appElement = document.getElementById('app')
    appElement.innerHTML = this.getHTML()
    this.attachEventListeners()
  }

  async refreshClients() {
    await this.loadClients()
    this.updateTable()
    this.showMessage('Datos de clientes actualizados', 'success')
  }

  exportClients() {
    const csv = this.clientsToCSV()
    this.downloadCSV(csv, 'clientes.csv')
    this.showMessage('Archivo CSV descargado', 'success')
  }

  clientsToCSV() {
    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Empresa', 'Ciudad', 'Estado', 'Primer Pedido', 'Último Pedido', 'Total Pedidos', 'Total Gastado']
    const rows = this.filteredClients.map(client => [
      client.firstName,
      client.lastName,
      client.email,
      client.phone,
      client.company || '',
      client.city || '',
      client.state || '',
      new Date(client.firstOrderDate).toLocaleDateString('es-ES'),
      client.lastOrderDate ? new Date(client.lastOrderDate).toLocaleDateString('es-ES') : '',
      client.orderCount,
      client.totalSpent.toFixed(2)
    ])

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')
  }

  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  generateReport() {
    const totalClients = this.clients.length
    const activeClients = this.getActiveClientsCount()
    const companyClients = this.getCompanyClientsCount()
    const avgOrderValue = this.getAverageOrderValue()
    const totalRevenue = this.clients.reduce((sum, client) => sum + client.totalSpent, 0)

    const content = `
      <div>
        <h3 style="margin-bottom: 1.5rem;">Reporte de Clientes</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius);">
            <div style="font-weight: 600; color: var(--primary-color); font-size: 1.5rem;">${totalClients}</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem;">Total de Clientes</div>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius);">
            <div style="font-weight: 600; color: var(--success); font-size: 1.5rem;">${activeClients}</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem;">Clientes Activos (3 meses)</div>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius);">
            <div style="font-weight: 600; color: var(--accent-color); font-size: 1.5rem;">${companyClients}</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem;">Clientes Empresariales</div>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius);">
            <div style="font-weight: 600; color: var(--warning); font-size: 1.5rem;">$${avgOrderValue.toFixed(2)}</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem;">Valor Promedio por Pedido</div>
          </div>
        </div>

        <div style="background: var(--primary-color); color: white; padding: 1.5rem; border-radius: var(--border-radius); text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">$${totalRevenue.toFixed(2)}</div>
          <div>Ingresos Totales Generados</div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h4 style="margin-bottom: 1rem;">Top 5 Clientes por Valor</h4>
          ${this.clients
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5)
            .map((client, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 0.5rem;">
                <div>
                  <span style="font-weight: 600; margin-right: 1rem;">#${index + 1}</span>
                  ${client.firstName} ${client.lastName}
                  ${client.company ? `<span style="color: var(--text-secondary); font-size: 0.875rem;"> - ${client.company}</span>` : ''}
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: 600; color: var(--primary-color);">$${client.totalSpent.toFixed(2)}</div>
                  <div style="color: var(--text-secondary); font-size: 0.875rem;">${client.orderCount} pedidos</div>
                </div>
              </div>
            `).join('')}
        </div>

        <div style="color: var(--text-secondary); font-size: 0.875rem; text-align: center;">
          Reporte generado el ${new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    `

    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: 'Reporte de Clientes',
        content,
        footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cerrar</button>
            <button class="btn btn-primary" onclick="this.exportClients(); document.dispatchEvent(new CustomEvent('modal:close'))">📊 Exportar Datos</button>
          </div>
        `
      }
    }))
  }

  viewClient(email) {
    const client = this.clients.find(c => c.email === email)
    if (!client) return

    const content = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 60px; height: 60px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600;">
              ${client.firstName.charAt(0).toUpperCase()}${client.lastName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style="margin: 0;">${client.firstName} ${client.lastName}</h3>
              ${client.company ? `<p style="color: var(--text-secondary); margin: 0;">🏢 ${client.company}</p>` : ''}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h4>Información de Contacto</h4>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius);">
            <div style="margin-bottom: 0.5rem;">📧 <strong>Email:</strong> ${client.email}</div>
            <div style="margin-bottom: 0.5rem;">📞 <strong>Teléfono:</strong> ${client.phone}</div>
            ${client.address ? `<div style="margin-bottom: 0.5rem;">📍 <strong>Dirección:</strong> ${client.address}</div>` : ''}
            ${client.city ? `<div>🏙️ <strong>Ciudad:</strong> ${client.city}, ${client.state} ${client.zipCode || ''}</div>` : ''}
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h4>Estadísticas</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
              <div style="font-size: 1.5rem; font-weight: 600; color: var(--primary-color);">${client.orderCount}</div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Pedidos</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
              <div style="font-size: 1.5rem; font-weight: 600; color: var(--success);">$${client.totalSpent.toFixed(2)}</div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Gastado</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
              <div style="font-size: 1.5rem; font-weight: 600; color: var(--accent-color);">$${(client.totalSpent / client.orderCount).toFixed(2)}</div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">Promedio por Pedido</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); text-align: center;">
              <div style="font-size: 1.5rem; font-weight: 600; color: var(--warning);">${this.getTimeSince(client.firstOrderDate)}</div>
              <div style="color: var(--text-secondary); font-size: 0.875rem;">Cliente desde</div>
            </div>
          </div>
        </div>

        <div>
          <h4>Historial de Pedidos Recientes</h4>
          ${client.orders.slice(-5).reverse().map(order => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 0.5rem;">
              <div>
                <div style="font-weight: 600;">${order.id}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">
                  ${new Date(order.createdAt).toLocaleDateString('es-ES')} - ${order.items.length} productos
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 600; color: var(--primary-color);">$${order.total.toFixed(2)}</div>
                <span class="status-badge status-${order.status === 'pending_confirmation' ? 'pending' : order.status === 'processing' ? 'processing' : 'success'}">
                  ${order.status === 'pending_confirmation' ? 'Pendiente' : order.status === 'processing' ? 'En Proceso' : 'Completado'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `

    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: `Cliente: ${client.firstName} ${client.lastName}`,
        content,
        footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cerrar</button>
            <button class="btn btn-secondary" onclick="this.contactClient('${client.email}'); document.dispatchEvent(new CustomEvent('modal:close'))">📧 Contactar</button>
            <button class="btn btn-primary" onclick="this.viewOrders('${client.email}'); document.dispatchEvent(new CustomEvent('modal:close'))">📦 Ver Todos los Pedidos</button>
          </div>
        `
      }
    }))
  }

  viewOrders(email) {
    const client = this.clients.find(c => c.email === email)
    if (!client) return

    document.dispatchEvent(new CustomEvent('navigate', { 
      detail: { path: `/admin/pedidos?cliente=${encodeURIComponent(email)}` } 
    }))
  }

  contactClient(email) {
    const client = this.clients.find(c => c.email === email)
    if (!client) return

    this.showMessage(`Función de contacto en desarrollo. Email: ${email}`, 'info')
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
    delete window.logout
    delete window.exportClients
    delete window.generateReport
    delete window.refreshClients
    delete window.viewClient
    delete window.viewOrders
    delete window.contactClient
  }
}
