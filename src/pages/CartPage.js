import { CartService } from "../services/CartService.js";

export class CartPage {
  constructor() {
    this.cartService = new CartService();
    this.items = [];
  }

  async render() {
    this.items = this.cartService.getItems();

    const appElement = document.getElementById("app");
    appElement.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  getHTML() {
    if (this.items.length === 0) {
      return this.getEmptyCartHTML();
    }

    return `
      <div class="container" style="padding: 2rem 0;">
        <h1 style="margin-bottom: 2rem;">Tu Carrito de Compras</h1>
        
        <div class="grid grid-2" style="gap: 3rem; align-items: start;">
          <!-- Cart Items -->
          <div>
            <div id="cart-items">
              ${this.renderCartItems()}
            </div>
          </div>

          <!-- Cart Summary -->
          <div>
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); position: sticky; top: 2rem;">
              <h2 style="margin-bottom: 1.5rem;">Resumen del Pedido</h2>
              
              <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span>Subtotal (${this.getTotalItems()} items):</span>
                  <span>$${this.cartService.getTotal().toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-secondary);">
                  <span>Envío:</span>
                  <span>A coordinar</span>
                </div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 0.5rem; display: flex; justify-content: space-between; font-size: 1.125rem; font-weight: 600;">
                  <span>Total:</span>
                  <span style="color: var(--primary-color);">$${this.cartService
                    .getTotal()
                    .toFixed(2)}</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <button class="btn btn-primary btn-lg" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/checkout'}}))">
                  Proceder al Checkout
                </button>
                <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/catalogo'}}))">
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getEmptyCartHTML() {
    return `
      <div class="container text-center" style="padding: 4rem 0;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🛒</div>
        <h1>Tu carrito está vacío</h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          ¡Agrega algunos productos para comenzar tu compra!
        </p>
        <button class="btn btn-primary btn-lg" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/catalogo'}}))">
          Explorar Productos
        </button>
      </div>
    `;
  }

  renderCartItems() {
    return this.items
      .map(
        (item) => `
      <div class="cart-item" style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); margin-bottom: 1rem;">
        <div style="display: flex; gap: 1rem;">
          <img 
            src="${item.product.image}" 
            alt="${item.product.name}"
            style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--border-radius);"
            onerror="this.src='/images/placeholder.jpg'"
          />
          <div style="flex: 1;">
            <h3 style="margin-bottom: 0.5rem;">${item.product.name}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${
              item.variant.size
            }</p>
            <p style="font-weight: 600; color: var(--primary-color);">$${item.variant.price.toFixed(
              2
            )} c/u</p>
          </div>
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
              <button class="btn btn-sm btn-secondary" onclick="this.updateQuantity('${
                item.id
              }', ${item.quantity - 1})">-</button>
              <span style="padding: 0.5rem 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">${
                item.quantity
              }</span>
              <button class="btn btn-sm btn-secondary" onclick="this.updateQuantity('${
                item.id
              }', ${item.quantity + 1})">+</button>
            </div>
            <div style="font-weight: 600; margin-bottom: 1rem;">$${(
              item.quantity * item.variant.price
            ).toFixed(2)}</div>
            <button class="btn btn-sm" style="background: var(--error); color: white;" onclick="this.removeItem('${
              item.id
            }')">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  attachEventListeners() {
    // Add methods to window for inline handlers
    window.updateQuantity = (itemId, newQuantity) => {
      this.cartService.updateQuantity(itemId, newQuantity);
      this.render(); // Re-render
    };

    window.removeItem = (itemId) => {
      this.cartService.removeItem(itemId);
      this.render(); // Re-render
    };
  }

  cleanup() {
    // Clean up global methods
    delete window.updateQuantity;
    delete window.removeItem;
  }
}
