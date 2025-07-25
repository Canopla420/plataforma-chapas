import { CartService } from "../services/CartService.js";

export class CartSidebar {
  constructor() {
    this.cartService = new CartService();
    this.isOpen = false;
  }

  render() {
    const sidebarElement = document.getElementById("cart-sidebar");
    if (!sidebarElement) {
      console.error("Cart sidebar element not found");
      return;
    }

    sidebarElement.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  getHTML() {
    const items = this.cartService.getItems();
    const total = this.cartService.getTotal();

    if (items.length === 0) {
      return `
        <div class="cart-header">
          <h3>Carrito de Compras</h3>
          <button class="btn btn-secondary btn-sm" id="close-cart">×</button>
        </div>
        <div class="cart-content">
          <div class="text-center p-4">
            <p style="color: var(--text-light); margin-bottom: 2rem;">
              🛒 Tu carrito está vacío
            </p>
            <button class="btn btn-primary" id="browse-products">
              Ver Productos
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="cart-header">
        <h3>Carrito (${items.length})</h3>
        <button class="btn btn-secondary btn-sm" id="close-cart">×</button>
      </div>
      
      <div class="cart-content">
        ${items.map((item) => this.renderCartItem(item)).join("")}
      </div>
      
      <div class="cart-footer">
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-size: 1.125rem; font-weight: 600;">
            <span>Total:</span>
            <span style="color: var(--primary-color);">$${total.toFixed(
              2
            )}</span>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.5rem;">
            *Precios sujetos a confirmación de stock
          </p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <button class="btn btn-primary btn-lg" id="proceed-checkout">
            Proceder al Checkout
          </button>
          <button class="btn btn-outline btn-sm" id="clear-cart">
            Vaciar Carrito
          </button>
        </div>
      </div>
    `;
  }

  renderCartItem(item) {
    return `
      <div class="cart-item" data-item-id="${item.id}">
        <img 
          src="${item.product.image}" 
          alt="${item.product.name}"
          class="cart-item-image"
          onerror="this.src='/images/placeholder.jpg'"
        />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.product.name}</div>
          <div class="cart-item-details">
            ${item.variant.size} - $${item.variant.price.toFixed(2)} c/u
          </div>
          <div class="cart-item-actions">
            <button class="btn btn-secondary btn-sm" onclick="this.closest('.cart-sidebar').dispatchEvent(new CustomEvent('decrease-quantity', {detail: '${
              item.id
            }'}))">-</button>
            <input 
              type="number" 
              class="quantity-input form-input" 
              value="${item.quantity}" 
              min="1" 
              max="999"
              data-item-id="${item.id}"
            />
            <button class="btn btn-secondary btn-sm" onclick="this.closest('.cart-sidebar').dispatchEvent(new CustomEvent('increase-quantity', {detail: '${
              item.id
            }'}))">+</button>
            <button class="btn btn-secondary btn-sm" onclick="this.closest('.cart-sidebar').dispatchEvent(new CustomEvent('remove-item', {detail: '${
              item.id
            }'}))" style="margin-left: 0.5rem; color: var(--error);">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const sidebar = document.getElementById("cart-sidebar");

    // Close cart
    const closeBtn = sidebar.querySelector("#close-cart");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Browse products
    const browseBtn = sidebar.querySelector("#browse-products");
    if (browseBtn) {
      browseBtn.addEventListener("click", () => {
        this.close();
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path: "/catalogo" } })
        );
      });
    }

    // Proceed to checkout
    const checkoutBtn = sidebar.querySelector("#proceed-checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        this.close();
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path: "/checkout" } })
        );
      });
    }

    // Clear cart
    const clearBtn = sidebar.querySelector("#clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
          this.cartService.clearCart();
          this.render();
        }
      });
    }

    // Quantity inputs
    sidebar.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const itemId = e.target.dataset.itemId;
        const quantity = parseInt(e.target.value);
        if (quantity > 0) {
          this.cartService.updateQuantity(itemId, quantity);
          this.render();
        }
      });
    });

    // Custom events for quantity changes
    sidebar.addEventListener("increase-quantity", (e) => {
      const itemId = e.detail;
      const item = this.cartService.getItems().find((i) => i.id === itemId);
      if (item) {
        this.cartService.updateQuantity(itemId, item.quantity + 1);
        this.render();
      }
    });

    sidebar.addEventListener("decrease-quantity", (e) => {
      const itemId = e.detail;
      const item = this.cartService.getItems().find((i) => i.id === itemId);
      if (item && item.quantity > 1) {
        this.cartService.updateQuantity(itemId, item.quantity - 1);
        this.render();
      }
    });

    sidebar.addEventListener("remove-item", (e) => {
      const itemId = e.detail;
      this.cartService.removeItem(itemId);
      this.render();
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.render(); // Update content
    const sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.add("open");
    this.isOpen = true;

    // Add overlay
    this.addOverlay();
  }

  close() {
    const sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.remove("open");
    this.isOpen = false;

    // Remove overlay
    this.removeOverlay();
  }

  addOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "cart-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 150;
      cursor: pointer;
    `;
    overlay.addEventListener("click", () => this.close());
    document.body.appendChild(overlay);
  }

  removeOverlay() {
    const overlay = document.getElementById("cart-overlay");
    if (overlay) {
      overlay.remove();
    }
  }
}
