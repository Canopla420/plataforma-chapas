import { ProductService } from "../data/products.js";
import { CartService } from "../services/CartService.js";

export class CatalogPage {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.categories = [];
    this.currentCategory = "all";
    this.currentSearch = "";
    this.cartService = new CartService();
  }

  async render() {
    try {
      // Load data
      await Promise.all([this.loadProducts(), this.loadCategories()]);

      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      this.currentCategory = urlParams.get("category") || "all";
      this.currentSearch = urlParams.get("search") || "";

      // Apply filters
      this.applyFilters();

      const appElement = document.getElementById("app");
      appElement.innerHTML = this.getHTML();
      this.attachEventListeners();
    } catch (error) {
      console.error("Error loading catalog:", error);
      this.showError();
    }
  }

  async loadProducts() {
    this.products = await ProductService.getAllProducts();
  }

  loadCategories() {
    this.categories = ProductService.getCategories();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Filter by category
    if (this.currentCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === this.currentCategory
      );
    }

    // Filter by search
    if (this.currentSearch) {
      const search = this.currentSearch.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.type.toLowerCase().includes(search) ||
          product.material.toLowerCase().includes(search)
      );
    }

    this.filteredProducts = filtered;
  }

  getHTML() {
    return `
      <div class="container" style="padding: 2rem 0;">
        <!-- Page Header -->
        <div style="margin-bottom: 2rem;">
          <h1 style="margin-bottom: 1rem;">Catálogo de Chapas</h1>
          <p style="color: var(--text-secondary); margin: 0;">Encuentra la chapa perfecta para tu proyecto. Todos nuestros productos son de alta calidad y están disponibles para entrega inmediata.</p>
        </div>

        <!-- Search and Filters -->
        <div class="catalog-filters" style="margin-bottom: 2rem;">
          <div class="filter-row">
            <div class="filter-group">
              <label class="form-label">Buscar productos</label>
              <input 
                type="text" 
                id="search-input" 
                class="form-input" 
                placeholder="Buscar por nombre, tipo, material..."
                value="${this.currentSearch}"
              />
            </div>
            <div class="filter-group">
              <label class="form-label">Categoría</label>
              <select id="category-select" class="form-select">
                ${this.categories
                  .map(
                    (cat) => `
                  <option value="${cat.id}" ${
                      cat.id === this.currentCategory ? "selected" : ""
                    }>
                    ${cat.name} (${cat.count})
                  </option>
                `
                  )
                  .join("")}
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info" style="margin-bottom: 2rem;">
          <p style="margin: 0; color: var(--text-secondary);">
            Mostrando ${this.filteredProducts.length} de ${
      this.products.length
    } productos
            ${this.currentSearch ? ` para "${this.currentSearch}"` : ""}
            ${
              this.currentCategory !== "all"
                ? ` en ${
                    this.categories.find((c) => c.id === this.currentCategory)
                      ?.name
                  }`
                : ""
            }
          </p>
        </div>

        <!-- Products Grid -->
        <div class="products-container">
          <div class="grid grid-3" id="products-grid">
            ${this.renderProducts()}
          </div>
        </div>

        ${this.filteredProducts.length === 0 ? this.renderNoResults() : ""}
      </div>
    `;
  }

  renderProducts() {
    if (this.filteredProducts.length === 0) {
      return "";
    }

    return this.filteredProducts
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
            120
          )}...</p>
          
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-secondary); font-size: 0.875rem;">Tipo:</span>
              <span style="font-weight: 500;">${product.type}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-secondary); font-size: 0.875rem;">Calibre:</span>
              <span style="font-weight: 500;">${product.caliber}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary); font-size: 0.875rem;">Material:</span>
              <span style="font-weight: 500;">${product.material}</span>
            </div>
          </div>

          <div class="product-price">
            Desde $${Math.min(...product.variants.map((v) => v.price)).toFixed(
              2
            )}
          </div>
          
          <div class="product-actions">
            <button class="btn btn-primary" data-navigate="/producto/${
              product.id
            }">
              Ver Detalles
            </button>
            <button class="btn btn-secondary" data-product-id="${
              product.id
            }" data-action="quick-add">
              + Carrito
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderNoResults() {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
        <h3>No se encontraron productos</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          ${
            this.currentSearch
              ? `No hay productos que coincidan con "${this.currentSearch}"`
              : "No hay productos en esta categoría"
          }
        </p>
        <div>
          <button class="btn btn-primary" onclick="this.clearFilters()">
            Ver Todos los Productos
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.currentSearch = e.target.value;
          this.updateFilters();
        }, 300); // Debounce search
      });
    }

    // Category select
    const categorySelect = document.getElementById("category-select");
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.currentCategory = e.target.value;
        this.updateFilters();
      });
    }

    // Product navigation
    document.querySelectorAll("[data-navigate]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const path = e.target.dataset.navigate;
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path } })
        );
      });
    });

    // Quick add to cart
    document.querySelectorAll('[data-action="quick-add"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.dataset.productId;
        this.quickAddToCart(productId);
      });
    });
  }

  updateFilters() {
    this.applyFilters();

    // Update URL
    const params = new URLSearchParams();
    if (this.currentCategory !== "all") {
      params.set("category", this.currentCategory);
    }
    if (this.currentSearch) {
      params.set("search", this.currentSearch);
    }

    const newUrl =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState(null, "", newUrl);

    // Update products grid
    const productsGrid = document.getElementById("products-grid");
    if (productsGrid) {
      productsGrid.innerHTML = this.renderProducts();

      // Re-attach event listeners for new products
      this.attachProductListeners();
    }

    // Update results info
    this.updateResultsInfo();
  }

  updateResultsInfo() {
    const resultsInfo = document.querySelector(
      '[style*="background: var(--bg-secondary)"] p'
    );
    if (resultsInfo) {
      resultsInfo.textContent = `Mostrando ${this.filteredProducts.length} de ${
        this.products.length
      } productos${this.currentSearch ? ` para "${this.currentSearch}"` : ""}${
        this.currentCategory !== "all"
          ? ` en ${
              this.categories.find((c) => c.id === this.currentCategory)?.name
            }`
          : ""
      }`;
    }
  }

  attachProductListeners() {
    // Re-attach product navigation
    document.querySelectorAll("[data-navigate]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const path = e.target.dataset.navigate;
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path } })
        );
      });
    });

    // Re-attach quick add to cart
    document.querySelectorAll('[data-action="quick-add"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.dataset.productId;
        this.quickAddToCart(productId);
      });
    });
  }

  quickAddToCart(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      // Add smallest/cheapest variant by default
      const defaultVariant = product.variants.reduce((min, variant) =>
        variant.price < min.price ? variant : min
      );

      this.cartService.addItem(product, 1, defaultVariant);

      // Show feedback
      this.showAddToCartFeedback(product.name);
    }
  }

  showAddToCartFeedback(productName) {
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
        <span>"${productName}" agregado al carrito</span>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = "slideOut 0.3s ease";
      setTimeout(() => message.remove(), 300);
    }, 2000);
  }

  clearFilters() {
    this.currentCategory = "all";
    this.currentSearch = "";

    // Update form elements
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");

    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "all";

    this.updateFilters();
  }

  showError() {
    const appElement = document.getElementById("app");
    appElement.innerHTML = `
      <div class="container p-4 text-center">
        <h1>Error al cargar el catálogo</h1>
        <p>Hubo un problema al cargar los productos. Por favor, intenta de nuevo.</p>
        <button class="btn btn-primary" onclick="location.reload()">Recargar Página</button>
      </div>
    `;
  }

  cleanup() {
    // Clean up any timers or event listeners
  }
}
