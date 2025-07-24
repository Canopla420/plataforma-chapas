export class AdminOrdersPage {
  constructor() {
    this.orders = []
    this.filteredOrders = []
    this.currentFilter = 'all'
    this.currentSort = 'date_desc'
  }

  async render() {
    if (!this.isAdminLoggedIn()) {
      document.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/admin' } }))
      return
    }

    await this.loadOrders()

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
              <a href="/admin/pedidos" class="admin-nav-link active" data-navigate>📦 Pedidos</a>
            </div>
            <div class="admin-nav-item">
              <a href="/admin/productos" class="admin-nav-link" data-navigate>🏗️ Productos</a>
            </div>
            <div class="admin-nav-item">
              <a href="/admin/clientes" class="admin-nav-link" data-navigate>👥 Clientes</a>
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
              <h1 style="margin-bottom: 0.5rem;">Gestión de Pedidos</h1>
              <p style="color: var(--text-secondary);">Administra todos los pedidos de la plataforma</p>
            </div>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-outline" onclick="this.exportOrders()">📊 Exportar</button>
              <button class="btn btn-primary" onclick="this.refreshOrders()">🔄 Actualizar</button>
            </div>
          </div>

          <!-- Filters and Search -->
          <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
            <div class="grid grid-3" style="gap: 1rem; align-items: end;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Estado del Pedido</label>
                <select id="status-filter" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                  <option value="all">Todos los estados</option>
                  <option value="pending_confirmation">Pendiente de Confirmación</option>
                  <option value="processing">En Proceso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Ordenar por</label>
                <select id="sort-select" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                  <option value="date_desc">Fecha (Más reciente)</option>
                  <option value="date_asc">Fecha (Más antiguo)</option>
                  <option value="total_desc">Total (Mayor a menor)</option>
                  <option value="total_asc">Total (Menor a mayor)</option>
                  <option value="status">Estado</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Buscar</label>
                <input type="text" id="search-input" placeholder="ID, cliente, email..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
              </div>
            </div>
          </div>

          <!-- Orders Table -->
          <div style="background: white; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); overflow: hidden;">
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
              <h2 style="margin: 0;">Lista de Pedidos (${this.filteredOrders.length})</h2>
            </div>
            
            ${this.filteredOrders.length > 0 ? `
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead style="background: var(--bg-secondary);">
                    <tr>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">ID Pedido</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Cliente</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Fecha</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Total</th>
                      <th style="padding: 1rem; text-align: left; font-weight: 600;">Estado</th>
                      <th style="padding: 1rem; text-align: center; font-weight: 600;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.filteredOrders.map(order => `
                      <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 1rem;">
                          <div style="font-weight: 600; color: var(--primary-color);">${order.id}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">${order.items.length} producto(s)</div>
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 500;">${order.customer.firstName} ${order.customer.lastName}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">${order.customer.email}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">${order.customer.phone}</div>
                        </td>
                        <td style="padding: 1rem;">
                          <div>${new Date(order.createdAt).toLocaleDateString('es-ES')}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">${new Date(order.createdAt).toLocaleTimeString('es-ES')}</div>
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 600; color: var(--primary-color);">$${order.total.toFixed(2)}</div>
                        </td>
                        <td style="padding: 1rem;">
                          <span class="status-badge status-${this.getStatusClass(order.status)}">
                            ${this.getStatusText(order.status)}
                          </span>
                        </td>
                        <td style="padding: 1rem; text-align: center;">
                          <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button class="btn btn-sm btn-outline" onclick="this.viewOrder('${order.id}')">👁️ Ver</button>
                            <button class="btn btn-sm btn-primary" onclick="this.updateStatus('${order.id}')">📝 Estado</button>
                            ${order.status === 'pending_confirmation' ? `
                              <button class="btn btn-sm btn-success" onclick="this.confirmOrder('${order.id}')">✅ Confirmar</button>
                            ` : ''}
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <div class="text-center" style="padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">📦</div>
                <h3 style="margin-bottom: 1rem;">No se encontraron pedidos</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                  ${this.currentFilter === 'all' ? 'Aún no hay pedidos en el sistema.' : 'No hay pedidos que coincidan con los filtros aplicados.'}
                </p>
                ${this.currentFilter !== 'all' ? `
                  <button class="btn btn-outline" onclick="this.clearFilters()">Limpiar Filtros</button>
                ` : ''}
              </div>
            `}
          </div>
        </div>
      </div>
    `
  }

  async loadOrders() {
    try {
      this.orders = JSON.parse(localStorage.getItem('orders') || '[]')
      this.applyFilters()
    } catch (error) {
      console.error('Error loading orders:', error)
      this.orders = []
      this.filteredOrders = []
    }
  }

  applyFilters() {
    let filtered = [...this.orders]

    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.currentFilter)
    }

    // Apply search
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase()
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.firstName.toLowerCase().includes(searchTerm) ||
        order.customer.lastName.toLowerCase().includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (this.currentSort) {
        case 'date_desc':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'date_asc':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'total_desc':
          return b.total - a.total
        case 'total_asc':
          return a.total - b.total
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    this.filteredOrders = filtered
  }

  getStatusClass(status) {
    const statusMap = {
      'pending_confirmation': 'pending',
      'processing': 'processing',
      'completed': 'success',
      'cancelled': 'error'
    }
    return statusMap[status] || 'pending'
  }

  getStatusText(status) {
    const statusMap = {
      'pending_confirmation': 'Pendiente Confirmación',
      'processing': 'En Proceso',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    }
    return statusMap[status] || status
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
    const statusFilter = document.getElementById('status-filter')
    const sortSelect = document.getElementById('sort-select')
    const searchInput = document.getElementById('search-input')

    if (statusFilter) {
      statusFilter.value = this.currentFilter
      statusFilter.addEventListener('change', (e) => {
        this.currentFilter = e.target.value
        this.applyFilters()
        this.updateTable()
      })
    }

    if (sortSelect) {
      sortSelect.value = this.currentSort
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value
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

    window.exportOrders = () => this.exportOrders()
    window.refreshOrders = () => this.refreshOrders()
    window.viewOrder = (id) => this.viewOrder(id)
    window.updateStatus = (id) => this.updateStatus(id)
    window.confirmOrder = (id) => this.confirmOrder(id)
    window.clearFilters = () => this.clearFilters()
  }

  updateTable() {
    const appElement = document.getElementById('app')
    appElement.innerHTML = this.getHTML()
    this.attachEventListeners()
  }

  async refreshOrders() {
    await this.loadOrders()
    this.updateTable()
    this.showMessage('Pedidos actualizados correctamente', 'success')
  }

  exportOrders() {
    const csv = this.ordersToCSV()
    this.downloadCSV(csv, 'pedidos.csv')
    this.showMessage('Archivo CSV descargado', 'success')
  }

  ordersToCSV() {
    const headers = ['ID', 'Fecha', 'Cliente', 'Email', 'Teléfono', 'Total', 'Estado', 'Productos']
    const rows = this.filteredOrders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleDateString('es-ES'),
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.customer.email,
      order.customer.phone,
      order.total.toFixed(2),
      this.getStatusText(order.status),
      order.items.map(item => `${item.name} (${item.quantity})`).join('; ')
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

  viewOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId)
    if (!order) return

    const content = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <div style="margin-bottom: 2rem;">
          <h3>Información del Cliente</h3>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;">
            <div><strong>Nombre:</strong> ${order.customer.firstName} ${order.customer.lastName}</div>
            <div><strong>Email:</strong> ${order.customer.email}</div>
            <div><strong>Teléfono:</strong> ${order.customer.phone}</div>
            <div><strong>Empresa:</strong> ${order.customer.company || 'No especificada'}</div>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3>Dirección de Entrega</h3>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;">
            <div>${order.customer.address}</div>
            <div>${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}</div>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3>Productos Solicitados</h3>
          <div style="margin-top: 1rem;">
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 0.5rem;">
                <div>
                  <div style="font-weight: 600;">${item.name}</div>
                  <div style="color: var(--text-secondary); font-size: 0.875rem;">
                    ${item.thickness}mm × ${item.width}cm × ${item.length}cm
                  </div>
                </div>
                <div style="text-align: right;">
                  <div>Cantidad: ${item.quantity}</div>
                  <div style="font-weight: 600; color: var(--primary-color);">$${item.price.toFixed(2)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: var(--primary-color); color: white; padding: 1rem; border-radius: var(--border-radius); text-align: center;">
          <strong>Total: $${order.total.toFixed(2)}</strong>
        </div>

        ${order.notes ? `
          <div style="margin-top: 2rem;">
            <h3>Notas Adicionales</h3>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;">
              ${order.notes}
            </div>
          </div>
        ` : ''}
      </div>
    `

    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: `Pedido ${order.id}`,
        content,
        footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cerrar</button>
            <button class="btn btn-primary" onclick="this.updateStatus('${order.id}'); document.dispatchEvent(new CustomEvent('modal:close'))">Cambiar Estado</button>
          </div>
        `
      }
    }))
  }

  updateStatus(orderId) {
    const order = this.orders.find(o => o.id === orderId)
    if (!order) return

    const content = `
      <div>
        <p style="margin-bottom: 1rem;">Estado actual: <strong>${this.getStatusText(order.status)}</strong></p>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nuevo Estado:</label>
        <select id="new-status" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 1rem;">
          <option value="pending_confirmation" ${order.status === 'pending_confirmation' ? 'selected' : ''}>Pendiente de Confirmación</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En Proceso</option>
          <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completado</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
        </select>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Notas (opcional):</label>
        <textarea id="status-notes" placeholder="Agregar notas sobre el cambio de estado..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); min-height: 100px; resize: vertical;"></textarea>
      </div>
    `

    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: `Actualizar Estado - ${order.id}`,
        content,
        footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cancelar</button>
            <button class="btn btn-primary" onclick="this.saveStatusUpdate('${orderId}')">Guardar Cambios</button>
          </div>
        `
      }
    }))

    window.saveStatusUpdate = (id) => this.saveStatusUpdate(id)
  }

  saveStatusUpdate(orderId) {
    const newStatus = document.getElementById('new-status')?.value
    const notes = document.getElementById('status-notes')?.value

    if (!newStatus) return

    const orderIndex = this.orders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) return

    this.orders[orderIndex].status = newStatus
    if (notes) {
      if (!this.orders[orderIndex].statusHistory) {
        this.orders[orderIndex].statusHistory = []
      }
      this.orders[orderIndex].statusHistory.push({
        status: newStatus,
        notes: notes,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin'
      })
    }

    localStorage.setItem('orders', JSON.stringify(this.orders))
    
    document.dispatchEvent(new CustomEvent('modal:close'))
    this.applyFilters()
    this.updateTable()
    this.showMessage('Estado actualizado correctamente', 'success')
  }

  confirmOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId)
    if (!order) return

    const content = `
      <div>
        <p style="margin-bottom: 1rem;">¿Confirmar este pedido y cambiar el estado a "En Proceso"?</p>
        <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
          <div><strong>Cliente:</strong> ${order.customer.firstName} ${order.customer.lastName}</div>
          <div><strong>Total:</strong> $${order.total.toFixed(2)}</div>
          <div><strong>Productos:</strong> ${order.items.length}</div>
        </div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Notas de confirmación (opcional):</label>
        <textarea id="confirm-notes" placeholder="Notas sobre la confirmación del pedido..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); min-height: 80px; resize: vertical;"></textarea>
      </div>
    `

    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: `Confirmar Pedido ${order.id}`,
        content,
        footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cancelar</button>
            <button class="btn btn-success" onclick="this.saveOrderConfirmation('${orderId}')">✅ Confirmar Pedido</button>
          </div>
        `
      }
    }))

    window.saveOrderConfirmation = (id) => this.saveOrderConfirmation(id)
  }

  saveOrderConfirmation(orderId) {
    const notes = document.getElementById('confirm-notes')?.value

    const orderIndex = this.orders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) return

    this.orders[orderIndex].status = 'processing'
    if (!this.orders[orderIndex].statusHistory) {
      this.orders[orderIndex].statusHistory = []
    }
    this.orders[orderIndex].statusHistory.push({
      status: 'processing',
      notes: notes || 'Pedido confirmado por administrador',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin'
    })

    localStorage.setItem('orders', JSON.stringify(this.orders))
    
    document.dispatchEvent(new CustomEvent('modal:close'))
    this.applyFilters()
    this.updateTable()
    this.showMessage('Pedido confirmado correctamente', 'success')
  }

  clearFilters() {
    this.currentFilter = 'all'
    this.currentSort = 'date_desc'
    document.getElementById('status-filter').value = 'all'
    document.getElementById('sort-select').value = 'date_desc'
    document.getElementById('search-input').value = ''
    this.applyFilters()
    this.updateTable()
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
    delete window.exportOrders
    delete window.refreshOrders
    delete window.viewOrder
    delete window.updateStatus
    delete window.confirmOrder
    delete window.clearFilters
    delete window.saveStatusUpdate
    delete window.saveOrderConfirmation
  }
}
