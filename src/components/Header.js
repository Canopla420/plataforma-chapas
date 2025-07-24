import { CartService } from '../services/CartService.js'

export class Header {
  constructor() {
    this.cartService = new CartService()
  }

  render() {
    const headerElement = document.getElementById('header')
    if (!headerElement) {
      console.error('Header element not found')
      return
    }
    
    headerElement.innerHTML = this.getHTML()
    this.attachEventListeners()
    this.updateCartCount()
  }

  getHTML() {
    return `
      <div class="container">
        <div class="header-content">
          <a href="/" class="logo" data-navigate>
            <span>🏗️</span> Plataforma Chapas
          </a>
          
          <nav class="nav-menu">
            <a href="/" class="nav-link" data-navigate>Inicio</a>
            <a href="/catalogo" class="nav-link" data-navigate>Catálogo</a>
            <a href="#about" class="nav-link">Nosotros</a>
            <a href="#contact" class="nav-link">Contacto</a>
          </nav>
          
          <div class="header-actions">
            <button class="btn btn-outline cart-btn" id="cart-toggle">
              <span>🛒</span>
              <span class="cart-count" id="cart-count">0</span>
              Carrito
            </button>
          </div>
        </div>
      </div>
    `
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

    // Cart toggle
    const cartToggle = document.getElementById('cart-toggle')
    if (cartToggle) {
      cartToggle.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('cart:toggle'))
      })
    }

    // Update active nav link
    this.updateActiveLink()
  }

  updateActiveLink() {
    const currentPath = window.location.pathname
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active')
      }
    })
  }

  updateCartCount() {
    const cartCount = document.getElementById('cart-count')
    if (cartCount) {
      const count = this.cartService.getItemCount()
      cartCount.textContent = count
      cartCount.style.display = count > 0 ? 'flex' : 'none'
    }
  }
}
