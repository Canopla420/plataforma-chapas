import { ProductService } from "../data/products.js";
import { CartService } from "../services/CartService.js";

export class ProductPage {
  constructor(params) {
    this.productId = params.id;
    this.product = null;
    this.selectedVariant = null;
    this.quantity = 1;
    this.cartService = new CartService();
  }

  async render() {
    try {
      this.product = await ProductService.getProductById(this.productId);
      this.selectedVariant = this.product.variants[0]; // Select first variant by default

      const appElement = document.getElementById("app");
      appElement.innerHTML = this.getHTML();
      this.attachEventListeners();
    } catch (error) {
      console.error("Error loading product:", error);
      this.showError();
    }
  }

  getHTML() {
    if (!this.product) {
      return '<div class="loading"><div class="spinner"></div></div>';
    }

    return `
      <div class="container" style="padding: 2rem 0;">
        <!-- Breadcrumb -->
        <nav style="margin-bottom: 2rem;">
          <a href="/" style="color: var(--text-secondary); text-decoration: none;">Inicio</a>
          <span style="margin: 0 0.5rem; color: var(--text-light);">></span>
          <a href="/catalogo" style="color: var(--text-secondary); text-decoration: none;">Catálogo</a>
          <span style="margin: 0 0.5rem; color: var(--text-light);">></span>
          <span style="color: var(--text-primary);">${this.product.name}</span>
        </nav>

        <div class="grid grid-2" style="gap: 3rem; align-items: start;">
          <!-- Product Images -->
          <div>
            <div style="margin-bottom: 1rem;">
              <img 
                id="main-image"
                src="${this.product.image}" 
                alt="${this.product.name}"
                style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--border-radius); border: 1px solid var(--border-color);"
                onerror="this.src='/images/placeholder.jpg'"
              />
            </div>
            ${
              this.product.images && this.product.images.length > 1
                ? `
              <div style="display: flex; gap: 0.5rem; overflow-x: auto;">
                ${this.product.images
                  .map(
                    (img, index) => `
                  <img 
                    src="${img}" 
                    alt="${this.product.name} - ${index + 1}"
                    style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--border-radius); border: 1px solid var(--border-color); cursor: pointer; opacity: ${
                      img === this.product.image ? "1" : "0.7"
                    };"
                    onclick="this.closest('.container').querySelector('#main-image').src = '${img}'"
                    onerror="this.src='/images/placeholder.jpg'"
                  />
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>

          <!-- Product Info -->
          <div>
            <h1 style="margin-bottom: 1rem;">${this.product.name}</h1>
            
            <div style="margin-bottom: 2rem;">
              <p style="font-size: 1.125rem; line-height: 1.6;">${
                this.product.description
              }</p>
            </div>

            <!-- Product Details -->
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--border-radius); margin-bottom: 2rem;">
              <h3 style="margin-bottom: 1rem;">Especificaciones</h3>
              <div class="grid grid-2" style="gap: 1rem;">
                <div>
                  <span style="color: var(--text-secondary); font-size: 0.875rem;">Tipo:</span>
                  <div style="font-weight: 600;">${this.product.type}</div>
                </div>
                <div>
                  <span style="color: var(--text-secondary); font-size: 0.875rem;">Calibre:</span>
                  <div style="font-weight: 600;">${this.product.caliber}</div>
                </div>
                <div>
                  <span style="color: var(--text-secondary); font-size: 0.875rem;">Material:</span>
                  <div style="font-weight: 600;">${this.product.material}</div>
                </div>
                <div>
                  <span style="color: var(--text-secondary); font-size: 0.875rem;">Stock:</span>
                  <div style="font-weight: 600; color: var(--success);">✓ Disponible</div>
                </div>
              </div>
            </div>

            <!-- Features -->
            ${
              this.product.features && this.product.features.length > 0
                ? `
              <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">Características</h3>
                <ul style="list-style: none; padding: 0;">
                  ${this.product.features
                    .map(
                      (feature) => `
                    <li style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                      <span style="color: var(--success); margin-right: 0.5rem;">✓</span>
                      <span>${feature}</span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
            `
                : ""
            }

            <!-- Variant Selection -->
            <div style="margin-bottom: 2rem;">
              <label class="form-label">Seleccionar Tamaño:</label>
              <select id="variant-select" class="form-select">
                ${this.product.variants
                  .map(
                    (variant, index) => `
                  <option value="${index}" ${index === 0 ? "selected" : ""}>
                    ${variant.size} - $${variant.price.toFixed(2)}
                  </option>
                `
                  )
                  .join("")}
              </select>
            </div>

            <!-- Price -->
            <div style="margin-bottom: 2rem;">
              <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="price-display">
                $${this.selectedVariant.price.toFixed(2)}
              </div>
              <p style="color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">
                *Precio sujeto a confirmación de stock con proveedor
              </p>
            </div>

            <!-- Quantity and Add to Cart -->
            <div style="margin-bottom: 2rem;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <label class="form-label" style="margin-bottom: 0;">Cantidad:</label>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" id="decrease-qty">-</button>
                  <input 
                    type="number" 
                    id="quantity-input" 
                    class="form-input" 
                    value="1" 
                    min="1" 
                    max="999"
                    style="width: 80px; text-align: center;"
                  />
                  <button class="btn btn-secondary btn-sm" id="increase-qty">+</button>
                </div>
              </div>
              
              <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary btn-lg" id="add-to-cart" style="flex: 1;">
                  Agregar al Carrito - $<span id="total-price">${this.selectedVariant.price.toFixed(
                    2
                  )}</span>
                </button>
                <button class="btn btn-outline" id="buy-now">
                  Comprar Ahora
                </button>
              </div>
            </div>

            <!-- Additional Info -->
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--border-radius);">
              <h4 style="margin-bottom: 1rem;">Información Importante</h4>
              <ul style="list-style: none; padding: 0; color: var(--text-secondary); font-size: 0.875rem;">
                <li style="margin-bottom: 0.5rem;">📦 Los precios pueden variar según disponibilidad del proveedor</li>
                <li style="margin-bottom: 0.5rem;">🚚 Entrega coordinada directamente con el proveedor</li>
                <li style="margin-bottom: 0.5rem;">📞 Contacto inmediato para confirmar tu pedido</li>
                <li>💰 Sin pagos online - Coordinación directa para pago y entrega</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Related Products Section -->
        <div style="margin-top: 4rem;">
          <h2 style="margin-bottom: 2rem;">Productos Relacionados</h2>
          <div id="related-products" class="grid grid-3">
            <!-- Related products will be loaded here -->
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Variant selection
    const variantSelect = document.getElementById("variant-select");
    if (variantSelect) {
      variantSelect.addEventListener("change", (e) => {
        const variantIndex = parseInt(e.target.value);
        this.selectedVariant = this.product.variants[variantIndex];
        this.updatePrice();
      });
    }

    // Quantity controls
    const quantityInput = document.getElementById("quantity-input");
    const decreaseBtn = document.getElementById("decrease-qty");
    const increaseBtn = document.getElementById("increase-qty");

    if (quantityInput) {
      quantityInput.addEventListener("change", (e) => {
        this.quantity = Math.max(1, parseInt(e.target.value) || 1);
        this.updatePrice();
      });
    }

    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        if (this.quantity > 1) {
          this.quantity--;
          quantityInput.value = this.quantity;
          this.updatePrice();
        }
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        this.quantity++;
        quantityInput.value = this.quantity;
        this.updatePrice();
      });
    }

    // Add to cart
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        this.addToCart();
      });
    }

    // Buy now
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        this.addToCart();
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path: "/checkout" } })
        );
      });
    }

    // Load related products
    this.loadRelatedProducts();
  }

  updatePrice() {
    const priceDisplay = document.getElementById("price-display");
    const totalPrice = document.getElementById("total-price");

    if (priceDisplay) {
      priceDisplay.textContent = `$${this.selectedVariant.price.toFixed(2)}`;
    }

    if (totalPrice) {
      const total = this.selectedVariant.price * this.quantity;
      totalPrice.textContent = total.toFixed(2);
    }
  }

  addToCart() {
    this.cartService.addItem(this.product, this.quantity, this.selectedVariant);
    this.showAddToCartFeedback();
  }

  showAddToCartFeedback() {
    const message = document.createElement("div");
    message.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--success);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    message.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>✓</span>
        <span>${this.quantity} x "${this.product.name}" agregado al carrito</span>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = "slideOut 0.3s ease";
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  async loadRelatedProducts() {
    try {
      const allProducts = await ProductService.getAllProducts();
      const related = allProducts
        .filter(
          (p) =>
            p.id !== this.product.id && p.category === this.product.category
        )
        .slice(0, 3);

      const relatedContainer = document.getElementById("related-products");
      if (relatedContainer && related.length > 0) {
        relatedContainer.innerHTML = related
          .map(
            (product) => `
          <div class="product-card">
            <img 
              src="${product.image}" 
              alt="${product.name}"
              class="product-image"
              onerror="this.src='/images/placeholder.jpg'"
            />
            <div class="product-info">
              <h3 class="product-title">${product.name}</h3>
              <p class="product-description">${product.description.substring(
                0,
                100
              )}...</p>
              <div class="product-price">
                Desde $${Math.min(
                  ...product.variants.map((v) => v.price)
                ).toFixed(2)}
              </div>
              <div class="product-actions">
                <button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/producto/${
                  product.id
                }'}}))">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        `
          )
          .join("");
      } else if (relatedContainer) {
        relatedContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-center; padding: 2rem;">
            <p style="color: var(--text-secondary);">No hay productos relacionados disponibles.</p>
            <button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/catalogo'}}))">
              Ver Todos los Productos
            </button>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error loading related products:", error);
    }
  }

  showError() {
    const appElement = document.getElementById("app");
    appElement.innerHTML = `
      <div class="container p-4 text-center">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
        <div style="margin-top: 2rem;">
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

  cleanup() {
    // Clean up event listeners
  }
}
