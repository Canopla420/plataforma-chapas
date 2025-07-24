import { ProductService } from '../data/products.js'

export class HomePage {
  constructor() {
    this.featuredProducts = []
  }

  async render() {
    try {
      this.featuredProducts = await ProductService.getFeaturedProducts()
      
      const appElement = document.getElementById('app')
      appElement.innerHTML = this.getHTML()
      this.attachEventListeners()
    } catch (error) {
      console.error('Error loading home page:', error)
      this.showError()
    }
  }

  getHTML() {
    return `
      <!-- Hero Section -->
      <section style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white; padding: 4rem 0;">
        <div class="container text-center">
          <h1 style="color: white; margin-bottom: 1rem;">
            Plataforma de Chapas Metálicas
          </h1>
          <p style="font-size: 1.25rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            Tu proveedor confiable de chapas de alta calidad. Compra online de forma rápida y sencilla, sin necesidad de registro.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-lg" style="background: white; color: var(--primary-color);" data-navigate="/catalogo">
              Ver Catálogo Completo
            </button>
            <button class="btn btn-lg btn-outline" style="border-color: white; color: white;" onclick="document.querySelector('#about').scrollIntoView({behavior: 'smooth'})">
              Conocer Más
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section style="padding: 4rem 0; background: var(--bg-secondary);">
        <div class="container">
          <h2 class="text-center" style="margin-bottom: 3rem;">¿Por qué elegirnos?</h2>
          <div class="grid grid-3">
            <div class="text-center" style="padding: 2rem;">
              <div style="font-size: 3rem; margin-bottom: 1.5rem;">🚚</div>
              <h3 style="margin-bottom: 1rem;">Entrega Rápida</h3>
              <p>Coordinamos la entrega directamente con nuestros proveedores para garantizar tiempos óptimos.</p>
            </div>
            <div class="text-center" style="padding: 2rem;">
              <div style="font-size: 3rem; margin-bottom: 1.5rem;">💰</div>
              <h3 style="margin-bottom: 1rem;">Precios Competitivos</h3>
              <p>Trabajamos directamente con fabricantes para ofrecerte los mejores precios del mercado.</p>
            </div>
            <div class="text-center" style="padding: 2rem;">
              <div style="font-size: 3rem; margin-bottom: 1.5rem;">🛒</div>
              <h3 style="margin-bottom: 1rem;">Compra Fácil</h3>
              <p>Sin registros complicados. Agrega al carrito y compra en pocos pasos como invitado.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section style="padding: 4rem 0;">
        <div class="container">
          <h2 class="text-center" style="margin-bottom: 3rem;">Productos Destacados</h2>
          <div class="grid grid-3" id="featured-products" style="margin-bottom: 3rem;">
            ${this.renderFeaturedProducts()}
          </div>
          <div class="text-center">
            <button class="btn btn-primary btn-lg" data-navigate="/catalogo">
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" style="padding: 4rem 0; background: var(--bg-secondary);">
        <div class="container">
          <div class="grid grid-2" style="align-items: center; gap: 3rem;">
            <div>
              <h2 style="margin-bottom: 1.5rem;">Sobre Nosotros</h2>
              <p style="margin-bottom: 1rem;">Con más de 20 años de experiencia en el sector, somos tu intermediario confiable entre las mejores chapas del mercado y tu proyecto.</p>
              <p style="margin-bottom: 1rem;">Trabajamos directamente con fabricantes líderes para garantizar que recibas productos de la más alta calidad al mejor precio.</p>
              <p style="margin-bottom: 2rem;">Nuestro proceso simplificado te permite realizar pedidos online de manera rápida y segura, sin complicaciones.</p>
              <div>
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <span style="color: var(--success); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                  <span>Más de 1000 proyectos completados</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <span style="color: var(--success); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                  <span>Garantía de calidad en todos nuestros productos</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: var(--success); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                  <span>Asesoramiento técnico especializado</span>
                </div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="background: var(--primary-color); color: white; padding: 2.5rem; border-radius: var(--border-radius); max-width: 400px; margin: 0 auto;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏗️</div>
                <h3 style="color: white; margin-bottom: 1rem; font-size: 1.25rem;">Tu Proyecto, Nuestra Prioridad</h3>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 0.9rem;">Desde pequeñas reparaciones hasta grandes construcciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" style="padding: 4rem 0;">
        <div class="container">
          <h2 class="text-center mb-4">Contáctanos</h2>
          <div class="grid grid-2" style="align-items: start;">
            <div>
              <h3>Información de Contacto</h3>
              <div style="margin: 2rem 0;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <span style="margin-right: 1rem; font-size: 1.25rem;">📍</span>
                  <div>
                    <strong>Dirección:</strong><br>
                    Calle Principal 123, Ciudad, País
                  </div>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <span style="margin-right: 1rem; font-size: 1.25rem;">📞</span>
                  <div>
                    <strong>Teléfono:</strong><br>
                    +1 234 567 8900
                  </div>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <span style="margin-right: 1rem; font-size: 1.25rem;">✉️</span>
                  <div>
                    <strong>Email:</strong><br>
                    info@plataformachapas.com
                  </div>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                  <span style="margin-right: 1rem; font-size: 1.25rem;">🕒</span>
                  <div>
                    <strong>Horarios:</strong><br>
                    Lunes a Viernes: 8:00 - 18:00<br>
                    Sábados: 8:00 - 13:00
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3>Envíanos un Mensaje</h3>
              <form id="contact-form" style="margin-top: 2rem;">
                <div class="form-group">
                  <label class="form-label">Nombre Completo</label>
                  <input type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-input">
                </div>
                <div class="form-group">
                  <label class="form-label">Mensaje</label>
                  <textarea class="form-textarea" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-lg">Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `
  }

  renderFeaturedProducts() {
    if (this.featuredProducts.length === 0) {
      return '<div class="loading"><div class="spinner"></div></div>'
    }

    return this.featuredProducts.map(product => `
      <div class="product-card">
        <div class="product-image" style="background-image: ${product.image ? `url(${product.image})` : 'none'}; background-size: cover; background-position: center;">
          ${!product.image ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem; color: var(--text-secondary);">🏗️</div>' : ''}
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description.substring(0, 100)}...</p>
          <div class="product-price">
            Desde $${Math.min(...product.variants.map(v => v.price)).toFixed(2)}
          </div>
          <div class="product-actions">
            <button class="btn btn-primary" data-navigate="/producto/${product.id}">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    `).join('')
  }

  attachEventListeners() {
    // Navigation buttons
    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const path = e.target.dataset.navigate || e.target.closest('[data-navigate]').dataset.navigate
        document.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
      })
    })

    // Contact form
    const contactForm = document.getElementById('contact-form')
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.handleContactForm(contactForm)
      })
    }
  }

  handleContactForm(form) {
    const formData = new FormData(form)
    
    // In a real application, this would send to a server
    console.log('Contact form submitted:', Object.fromEntries(formData))
    
    // Show success message
    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        title: 'Mensaje Enviado',
        content: `
          <div class="text-center">
            <div style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;">✓</div>
            <p>Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.</p>
          </div>
        `,
        footer: '<button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent(\'modal:close\'))">Cerrar</button>'
      }
    }))

    form.reset()
  }

  showError() {
    const appElement = document.getElementById('app')
    appElement.innerHTML = `
      <div class="container p-4 text-center">
        <h1>Error al cargar la página</h1>
        <p>Hubo un problema al cargar el contenido. Por favor, intenta de nuevo.</p>
        <button class="btn btn-primary" onclick="location.reload()">Recargar Página</button>
      </div>
    `
  }

  cleanup() {
    // Clean up any event listeners or timers if needed
  }
}
