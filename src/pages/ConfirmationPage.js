export class ConfirmationPage {
  constructor(params) {
    this.orderId = params.orderId;
    this.order = null;
  }

  async render() {
    this.loadOrder();

    const appElement = document.getElementById("app");
    appElement.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  loadOrder() {
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      this.order = orders.find((order) => order.id === this.orderId);
    } catch (error) {
      console.error("Error loading order:", error);
    }
  }

  getHTML() {
    if (!this.order) {
      return this.getOrderNotFoundHTML();
    }

    return `
      <div class="container" style="padding: 2rem 0;">
        <!-- Success Header -->
        <div class="text-center" style="margin-bottom: 3rem;">
          <div style="font-size: 5rem; color: var(--success); margin-bottom: 1rem;">✓</div>
          <h1 style="color: var(--success);">¡Pedido Confirmado!</h1>
          <p style="font-size: 1.125rem; color: var(--text-secondary);">
            Tu pedido ha sido recibido exitosamente
          </p>
        </div>

        <div class="grid grid-2" style="gap: 3rem; align-items: start;">
          <!-- Order Details -->
          <div>
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <h2 style="margin-bottom: 1.5rem;">Detalles del Pedido</h2>
              
              <div style="margin-bottom: 2rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                  <div>
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">Número de Pedido:</span>
                    <div style="font-weight: 600; font-size: 1.125rem;">${
                      this.order.id
                    }</div>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">Fecha:</span>
                    <div style="font-weight: 600;">${new Date(
                      this.order.createdAt
                    ).toLocaleDateString("es-ES")}</div>
                  </div>
                </div>
                
                <div>
                  <span style="color: var(--text-secondary); font-size: 0.875rem;">Estado:</span>
                  <div>
                    <span class="status-badge status-pending">Pendiente de Confirmación</span>
                  </div>
                </div>
              </div>

              <!-- Customer Info -->
              <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">Datos del Cliente</h3>
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--border-radius);">
                  <div style="margin-bottom: 0.5rem;">
                    <strong>${this.order.customer.firstName} ${
      this.order.customer.lastName
    }</strong>
                  </div>
                  <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                    📧 ${this.order.customer.email}
                  </div>
                  <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                    📞 ${this.order.customer.phone}
                  </div>
                  <div style="color: var(--text-secondary);">
                    📍 ${this.order.customer.address}, ${
      this.order.customer.city
    }
                    ${
                      this.order.customer.zipCode
                        ? `, ${this.order.customer.zipCode}`
                        : ""
                    }
                  </div>
                </div>
              </div>

              <!-- Items -->
              <div>
                <h3 style="margin-bottom: 1rem;">Productos Pedidos</h3>
                <div>
                  ${this.order.items
                    .map(
                      (item) => `
                    <div style="display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 1rem;">
                      <img 
                        src="${item.product.image}" 
                        alt="${item.product.name}"
                        style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--border-radius);"
                        onerror="this.src='/images/placeholder.jpg'"
                      />
                      <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">${
                          item.product.name
                        }</div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">
                          ${item.variant.size}
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">
                          ${item.quantity} x $${item.variant.price.toFixed(
                        2
                      )} = $${(item.quantity * item.variant.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
                
                <div style="text-align: right; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius); margin-top: 1rem;">
                  <div style="font-size: 1.125rem; font-weight: 600; color: var(--primary-color);">
                    Total: $${this.order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div>
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
              <h2 style="margin-bottom: 1.5rem;">Próximos Pasos</h2>
              
              <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <div style="width: 30px; height: 30px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 0.875rem;">1</div>
                  <div>
                    <div style="font-weight: 600;">Pedido Recibido</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Tu pedido ha sido registrado en nuestro sistema</div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <div style="width: 30px; height: 30px; background: var(--warning); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 0.875rem;">2</div>
                  <div>
                    <div style="font-weight: 600;">Verificación de Stock</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Consultaremos disponibilidad con nuestro proveedor</div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <div style="width: 30px; height: 30px; background: var(--text-light); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 0.875rem;">3</div>
                  <div>
                    <div style="font-weight: 600;">Confirmación y Envío</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Te contactaremos para confirmar y coordinar la entrega</div>
                  </div>
                </div>
              </div>

              <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius);">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--primary-color);">📧 Email de Confirmación</div>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">
                  Hemos enviado una copia de tu pedido a <strong>${
                    this.order.customer.email
                  }</strong>. 
                  Te contactaremos dentro de las próximas 24 horas.
                </p>
              </div>
            </div>

            <!-- Important Info -->
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
              <h3 style="margin-bottom: 1rem;">Información Importante</h3>
              <ul style="list-style: none; padding: 0; color: var(--text-secondary); font-size: 0.875rem;">
                <li style="margin-bottom: 0.5rem; display: flex; align-items: center;">
                  <span style="color: var(--warning); margin-right: 0.5rem;">⚠️</span>
                  Los precios están sujetos a confirmación de stock
                </li>
                <li style="margin-bottom: 0.5rem; display: flex; align-items: center;">
                  <span style="color: var(--primary-color); margin-right: 0.5rem;">📞</span>
                  Te contactaremos al ${this.order.customer.phone}
                </li>
                <li style="margin-bottom: 0.5rem; display: flex; align-items: center;">
                  <span style="color: var(--success); margin-right: 0.5rem;">🚚</span>
                  El envío se coordinará según tu ubicación
                </li>
                <li style="display: flex; align-items: center;">
                  <span style="color: var(--text-primary); margin-right: 0.5rem;">💰</span>
                  No se requiere pago online en esta etapa
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="text-center" style="margin-top: 3rem;">
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/catalogo'}}))">
              Continuar Comprando
            </button>
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/'}}))">
              Volver al Inicio
            </button>
            <button class="btn btn-secondary" onclick="window.print()">
              Imprimir Pedido
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getOrderNotFoundHTML() {
    return `
      <div class="container text-center" style="padding: 4rem 0;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">❌</div>
        <h1>Pedido No Encontrado</h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          No pudimos encontrar el pedido con ID: ${this.orderId}
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/catalogo'}}))">
            Ver Catálogo
          </button>
          <button class="btn btn-secondary" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/'}}))">
            Ir al Inicio
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Any additional event listeners can be added here
  }

  cleanup() {
    // Clean up any event listeners
  }
}
