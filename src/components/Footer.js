export class Footer {
  render() {
    const footerElement = document.getElementById('footer')
    if (!footerElement) {
      console.error('Footer element not found')
      return
    }
    
    footerElement.innerHTML = this.getHTML()
    this.attachEventListeners()
  }

  attachEventListeners() {
    // Admin access link
    const adminLink = document.querySelector('[data-admin-access]')
    if (adminLink) {
      adminLink.addEventListener('click', (e) => {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('navigate', { 
          detail: { path: '/admin' } 
        }))
      })
    }
  }

  getHTML() {
    return `
      <div class="container">
        <div class="grid grid-3" style="padding: 3rem 0 2rem;">
          <div>
            <h4>Plataforma Chapas</h4>
            <p>Tu proveedor confiable de chapas metálicas. Calidad y servicio garantizados desde hace más de 20 años.</p>
            <div style="margin-top: 1rem;">
              <span style="color: var(--primary-color);">🏗️</span>
              <strong>Calidad Garantizada</strong>
            </div>
          </div>
          
          <div>
            <h4>Productos</h4>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 0.5rem;">
                <a href="/catalogo?category=techos" style="color: var(--text-secondary); text-decoration: none;">Chapas para Techos</a>
              </li>
              <li style="margin-bottom: 0.5rem;">
                <a href="/catalogo?category=fachadas" style="color: var(--text-secondary); text-decoration: none;">Chapas para Fachadas</a>
              </li>
              <li style="margin-bottom: 0.5rem;">
                <a href="/catalogo?category=industrial" style="color: var(--text-secondary); text-decoration: none;">Uso Industrial</a>
              </li>
              <li style="margin-bottom: 0.5rem;">
                <a href="/catalogo?category=cerramientos" style="color: var(--text-secondary); text-decoration: none;">Cerramientos</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4>Contacto</h4>
            <div style="margin-bottom: 1rem;">
              <div style="margin-bottom: 0.5rem;">
                <span>📍</span> Dirección de la empresa
              </div>
              <div style="margin-bottom: 0.5rem;">
                <span>📞</span> +1 234 567 8900
              </div>
              <div style="margin-bottom: 0.5rem;">
                <span>✉️</span> info@plataformachapas.com
              </div>
              <div style="margin-bottom: 0.5rem;">
                <span>🕒</span> Lun - Vie: 8:00 - 18:00
              </div>
            </div>
          </div>
        </div>
        
        <div style="border-top: 1px solid var(--border-color); padding: 1.5rem 0; text-align: center; color: var(--text-light);">
          <p>&copy; 2025 Plataforma Chapas. Todos los derechos reservados.</p>
          <p style="margin-top: 0.5rem; font-size: 0.875rem;">
            Los precios están sujetos a confirmación de stock con nuestro proveedor.
          </p>
          <div style="margin-top: 1rem;">
            <a href="#" data-admin-access style="color: var(--text-light); text-decoration: none; font-size: 0.75rem; opacity: 0.7; cursor: pointer;">
              🔐 Acceso Administrador
            </a>
          </div>
        </div>
      </div>
    `
  }
}
