export class AdminProductsPage {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentCategory = "all";
    this.currentSort = "name_asc";
  }

  async render() {
    if (!this.isAdminLoggedIn()) {
      document.dispatchEvent(
        new CustomEvent("navigate", { detail: { path: "/admin" } })
      );
      return;
    }

    await this.loadProducts();

    const appElement = document.getElementById("app");
    appElement.innerHTML = this.getHTML();
    this.attachEventListeners();
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
              <a href="/admin/productos" class="admin-nav-link active" data-navigate>🏗️ Productos</a>
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
              <h1 style="margin-bottom: 0.5rem;">Gestión de Productos</h1>
              <p style="color: var(--text-secondary);">Administra el catálogo de productos</p>
            </div>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-outline" onclick="this.exportProducts()">📊 Exportar</button>
              <button class="btn btn-primary" onclick="this.addProduct()">➕ Nuevo Producto</button>
            </div>
          </div>

          <!-- Filters -->
          <div style="background: white; padding: 1.5rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
            <div class="grid grid-3" style="gap: 1rem; align-items: end;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Categoría</label>
                <select id="category-filter" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                  <option value="all">Todas las categorías</option>
                  <option value="acero">Acero al Carbono</option>
                  <option value="inoxidable">Acero Inoxidable</option>
                  <option value="aluminio">Aluminio</option>
                  <option value="galvanizado">Galvanizado</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Ordenar por</label>
                <select id="sort-select" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="name_desc">Nombre (Z-A)</option>
                  <option value="price_asc">Precio (Menor a mayor)</option>
                  <option value="price_desc">Precio (Mayor a menor)</option>
                  <option value="category">Categoría</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Buscar</label>
                <input type="text" id="search-input" placeholder="Nombre, descripción..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div style="background: white; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); overflow: hidden;">
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <h2 style="margin: 0;">Catálogo de Productos (${
                this.filteredProducts.length
              })</h2>
              <div style="display: flex; gap: 1rem;">
                <button class="btn btn-sm btn-outline" onclick="this.toggleView('grid')" id="grid-view">📋 Grilla</button>
                <button class="btn btn-sm btn-primary" onclick="this.toggleView('table')" id="table-view">📊 Tabla</button>
              </div>
            </div>
            
            ${
              this.filteredProducts.length > 0
                ? `
              <div id="products-container">
                ${this.renderProductsGrid()}
              </div>
            `
                : `
              <div class="text-center" style="padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🏗️</div>
                <h3 style="margin-bottom: 1rem;">No se encontraron productos</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                  ${
                    this.currentCategory === "all"
                      ? "Aún no hay productos en el catálogo."
                      : "No hay productos que coincidan con los filtros aplicados."
                  }
                </p>
                <button class="btn btn-primary" onclick="this.addProduct()">➕ Agregar Primer Producto</button>
              </div>
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  renderProductsGrid() {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; padding: 1.5rem;">
        ${this.filteredProducts
          .map(
            (product) => `
          <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius); overflow: hidden; transition: transform 0.2s; cursor: pointer;" 
               onmouseover="this.style.transform='translateY(-2px)'" 
               onmouseout="this.style.transform='translateY(0)'">
            <div style="height: 200px; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative;">
              ${
                product.image
                  ? `
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
              `
                  : `
                <div style="font-size: 3rem; opacity: 0.5;">🏗️</div>
              `
              }
              <div style="position: absolute; top: 0.5rem; right: 0.5rem; background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: var(--border-radius); font-size: 0.75rem;">
                ${this.getCategoryName(product.category)}
              </div>
            </div>
            <div style="padding: 1rem;">
              <h3 style="margin-bottom: 0.5rem; font-size: 1.125rem;">${
                product.name
              }</h3>
              <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.4;">
                ${product.description}
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                  <div style="font-weight: 600; color: var(--primary-color); font-size: 1.125rem;">
                    $${product.basePrice.toFixed(2)}/m²
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.875rem;">
                    ${product.variants?.length || 0} variantes
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="color: var(--text-secondary); font-size: 0.875rem;">Espesor</div>
                  <div style="font-weight: 600;">${product.thickness}mm</div>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-sm btn-outline" onclick="this.viewProduct('${
                  product.id
                }')" style="flex: 1;">👁️ Ver</button>
                <button class="btn btn-sm btn-primary" onclick="this.editProduct('${
                  product.id
                }')" style="flex: 1;">✏️ Editar</button>
                <button class="btn btn-sm btn-error" onclick="this.deleteProduct('${
                  product.id
                }')">🗑️</button>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  renderProductsTable() {
    return `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: var(--bg-secondary);">
            <tr>
              <th style="padding: 1rem; text-align: left; font-weight: 600;">Producto</th>
              <th style="padding: 1rem; text-align: left; font-weight: 600;">Categoría</th>
              <th style="padding: 1rem; text-align: left; font-weight: 600;">Precio Base</th>
              <th style="padding: 1rem; text-align: left; font-weight: 600;">Espesor</th>
              <th style="padding: 1rem; text-align: left; font-weight: 600;">Variantes</th>
              <th style="padding: 1rem; text-align: center; font-weight: 600;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredProducts
              .map(
                (product) => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 50px; height: 50px; background: var(--bg-secondary); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: center;">
                      ${
                        product.image
                          ? `
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius);">
                      `
                          : `
                        <span style="font-size: 1.5rem; opacity: 0.5;">🏗️</span>
                      `
                      }
                    </div>
                    <div>
                      <div style="font-weight: 600;">${product.name}</div>
                      <div style="color: var(--text-secondary); font-size: 0.875rem;">${product.description.substring(
                        0,
                        50
                      )}...</div>
                    </div>
                  </div>
                </td>
                <td style="padding: 1rem;">
                  <span class="status-badge status-info">${this.getCategoryName(
                    product.category
                  )}</span>
                </td>
                <td style="padding: 1rem;">
                  <div style="font-weight: 600; color: var(--primary-color);">$${product.basePrice.toFixed(
                    2
                  )}/m²</div>
                </td>
                <td style="padding: 1rem;">
                  <div style="font-weight: 600;">${product.thickness}mm</div>
                </td>
                <td style="padding: 1rem;">
                  <div>${product.variants?.length || 0} variantes</div>
                </td>
                <td style="padding: 1rem; text-align: center;">
                  <div style="display: flex; gap: 0.5rem; justify-content: center;">
                    <button class="btn btn-sm btn-outline" onclick="this.viewProduct('${
                      product.id
                    }')">👁️</button>
                    <button class="btn btn-sm btn-primary" onclick="this.editProduct('${
                      product.id
                    }')">✏️</button>
                    <button class="btn btn-sm btn-error" onclick="this.deleteProduct('${
                      product.id
                    }')">🗑️</button>
                  </div>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  async loadProducts() {
    try {
      const { ProductService } = await import("../data/products.js");
      this.products = await ProductService.getAllProducts();
      this.applyFilters();
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
      this.filteredProducts = [];
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply category filter
    if (this.currentCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === this.currentCategory
      );
    }

    // Apply search
    const searchTerm = document
      .getElementById("search-input")
      ?.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (this.currentSort) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "price_asc":
          return a.basePrice - b.basePrice;
        case "price_desc":
          return b.basePrice - a.basePrice;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    this.filteredProducts = filtered;
  }

  getCategoryName(category) {
    const categoryMap = {
      acero: "Acero al Carbono",
      inoxidable: "Acero Inoxidable",
      aluminio: "Aluminio",
      galvanizado: "Galvanizado",
    };
    return categoryMap[category] || category;
  }

  attachEventListeners() {
    // Navigation
    document.querySelectorAll("[data-navigate]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const path = e.currentTarget.getAttribute("href");
        document.dispatchEvent(
          new CustomEvent("navigate", { detail: { path } })
        );
      });
    });

    // Filters
    const categoryFilter = document.getElementById("category-filter");
    const sortSelect = document.getElementById("sort-select");
    const searchInput = document.getElementById("search-input");

    if (categoryFilter) {
      categoryFilter.value = this.currentCategory;
      categoryFilter.addEventListener("change", (e) => {
        this.currentCategory = e.target.value;
        this.applyFilters();
        this.updateProductsContainer();
      });
    }

    if (sortSelect) {
      sortSelect.value = this.currentSort;
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
        this.updateProductsContainer();
      });
    }

    if (searchInput) {
      let timeout;
      searchInput.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.applyFilters();
          this.updateProductsContainer();
        }, 300);
      });
    }

    // Global functions
    window.logout = () => {
      localStorage.removeItem("admin_session");
      sessionStorage.removeItem("admin_session");
      document.dispatchEvent(
        new CustomEvent("navigate", { detail: { path: "/admin" } })
      );
    };

    window.exportProducts = () => this.exportProducts();
    window.addProduct = () => this.addProduct();
    window.viewProduct = (id) => this.viewProduct(id);
    window.editProduct = (id) => this.editProduct(id);
    window.deleteProduct = (id) => this.deleteProduct(id);
    window.toggleView = (view) => this.toggleView(view);
  }

  updateProductsContainer() {
    const container = document.getElementById("products-container");
    if (container) {
      container.innerHTML = this.renderProductsGrid();
    }
  }

  toggleView(view) {
    const container = document.getElementById("products-container");
    const gridBtn = document.getElementById("grid-view");
    const tableBtn = document.getElementById("table-view");

    if (view === "grid") {
      container.innerHTML = this.renderProductsGrid();
      gridBtn.className = "btn btn-sm btn-primary";
      tableBtn.className = "btn btn-sm btn-outline";
    } else {
      container.innerHTML = this.renderProductsTable();
      gridBtn.className = "btn btn-sm btn-outline";
      tableBtn.className = "btn btn-sm btn-primary";
    }
  }

  exportProducts() {
    const csv = this.productsToCSV();
    this.downloadCSV(csv, "productos.csv");
    this.showMessage("Archivo CSV descargado", "success");
  }

  productsToCSV() {
    const headers = [
      "ID",
      "Nombre",
      "Descripción",
      "Categoría",
      "Precio Base",
      "Espesor",
      "Variantes",
    ];
    const rows = this.filteredProducts.map((product) => [
      product.id,
      product.name,
      product.description,
      this.getCategoryName(product.category),
      product.basePrice.toFixed(2),
      product.thickness,
      product.variants?.length || 0,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
  }

  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  addProduct() {
    const content = `
      <form id="product-form" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="grid grid-2" style="gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nombre del Producto *</label>
            <input type="text" id="product-name" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Categoría *</label>
            <select id="product-category" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
              <option value="">Seleccionar categoría</option>
              <option value="acero">Acero al Carbono</option>
              <option value="inoxidable">Acero Inoxidable</option>
              <option value="aluminio">Aluminio</option>
              <option value="galvanizado">Galvanizado</option>
            </select>
          </div>
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Descripción *</label>
          <textarea id="product-description" required placeholder="Describe las características del producto..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); min-height: 100px; resize: vertical;"></textarea>
        </div>

        <div class="grid grid-2" style="gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Precio Base ($/m²) *</label>
            <input type="number" id="product-price" step="0.01" min="0" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Espesor (mm) *</label>
            <input type="number" id="product-thickness" step="0.1" min="0" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
          </div>
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">URL de Imagen (opcional)</label>
          <input type="url" id="product-image" placeholder="https://ejemplo.com/imagen.jpg" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Notas Especiales (opcional)</label>
          <textarea id="product-notes" placeholder="Información adicional sobre el producto..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); min-height: 80px; resize: vertical;"></textarea>
        </div>
      </form>
    `;

    document.dispatchEvent(
      new CustomEvent("modal:open", {
        detail: {
          title: "Agregar Nuevo Producto",
          content,
          footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cancelar</button>
            <button class="btn btn-primary" onclick="this.saveNewProduct()">💾 Guardar Producto</button>
          </div>
        `,
        },
      })
    );

    window.saveNewProduct = () => this.saveNewProduct();
  }

  saveNewProduct() {
    const form = document.getElementById("product-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const newProduct = {
      id: "product_" + Date.now(),
      name: document.getElementById("product-name").value,
      category: document.getElementById("product-category").value,
      description: document.getElementById("product-description").value,
      basePrice: parseFloat(document.getElementById("product-price").value),
      thickness: parseFloat(document.getElementById("product-thickness").value),
      image: document.getElementById("product-image").value || null,
      notes: document.getElementById("product-notes").value || null,
      variants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, this would save to the backend
    // For demo purposes, we'll show a success message
    document.dispatchEvent(new CustomEvent("modal:close"));
    this.showMessage("Producto agregado correctamente (modo demo)", "success");
  }

  viewProduct(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const content = `
      <div style="max-height: 70vh; overflow-y: auto;">
        ${
          product.image
            ? `
          <div style="margin-bottom: 2rem; text-align: center;">
            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 300px; border-radius: var(--border-radius);">
          </div>
        `
            : ""
        }
        
        <div style="margin-bottom: 2rem;">
          <h3>Información General</h3>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;">
            <div><strong>Nombre:</strong> ${product.name}</div>
            <div><strong>Categoría:</strong> ${this.getCategoryName(
              product.category
            )}</div>
            <div><strong>Precio Base:</strong> $${product.basePrice.toFixed(
              2
            )}/m²</div>
            <div><strong>Espesor:</strong> ${product.thickness}mm</div>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3>Descripción</h3>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;">
            ${product.description}
          </div>
        </div>

        ${
          product.variants && product.variants.length > 0
            ? `
          <div style="margin-bottom: 2rem;">
            <h3>Variantes Disponibles (${product.variants.length})</h3>
            <div style="margin-top: 1rem;">
              ${product.variants
                .map(
                  (variant) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 0.5rem;">
                  <div>
                    <div style="font-weight: 600;">${variant.width}cm × ${
                    variant.length
                  }cm</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Dimensiones estándar</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 600; color: var(--primary-color);">$${variant.price.toFixed(
                      2
                    )}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">por unidad</div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          product.notes
            ? `
          <div style="margin-bottom: 2rem;">
            <h3>Notas Especiales</h3>
            <div style="background: var(--warning); color: var(--warning-text); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;">
              ${product.notes}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;

    document.dispatchEvent(
      new CustomEvent("modal:open", {
        detail: {
          title: `Producto: ${product.name}`,
          content,
          footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cerrar</button>
            <button class="btn btn-primary" onclick="this.editProduct('${product.id}'); document.dispatchEvent(new CustomEvent('modal:close'))">✏️ Editar</button>
          </div>
        `,
        },
      })
    );
  }

  editProduct(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    this.showMessage("Función de edición en desarrollo (modo demo)", "info");
  }

  deleteProduct(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const content = `
      <div>
        <p style="margin-bottom: 1rem;">¿Estás seguro de que deseas eliminar este producto?</p>
        <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
          <div><strong>Producto:</strong> ${product.name}</div>
          <div><strong>Categoría:</strong> ${this.getCategoryName(
            product.category
          )}</div>
          <div><strong>Precio:</strong> $${product.basePrice.toFixed(
            2
          )}/m²</div>
        </div>
        <div style="background: var(--error); color: white; padding: 1rem; border-radius: var(--border-radius); font-size: 0.875rem;">
          ⚠️ Esta acción no se puede deshacer. El producto será eliminado permanentemente del catálogo.
        </div>
      </div>
    `;

    document.dispatchEvent(
      new CustomEvent("modal:open", {
        detail: {
          title: "Confirmar Eliminación",
          content,
          footer: `
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">Cancelar</button>
            <button class="btn btn-error" onclick="this.confirmDeleteProduct('${productId}')">🗑️ Eliminar Producto</button>
          </div>
        `,
        },
      })
    );

    window.confirmDeleteProduct = (id) => this.confirmDeleteProduct(id);
  }

  confirmDeleteProduct(productId) {
    // In a real app, this would delete from the backend
    document.dispatchEvent(new CustomEvent("modal:close"));
    this.showMessage("Producto eliminado correctamente (modo demo)", "success");
  }

  isAdminLoggedIn() {
    const sessionData =
      localStorage.getItem("admin_session") ||
      sessionStorage.getItem("admin_session");
    if (!sessionData) return false;

    try {
      const session = JSON.parse(sessionData);
      return session.isLoggedIn === true;
    } catch (error) {
      return false;
    }
  }

  showMessage(text, type = "info") {
    const colors = {
      success: "var(--success)",
      error: "var(--error)",
      warning: "var(--warning)",
      info: "var(--primary-color)",
    };

    const message = document.createElement("div");
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
    `;
    message.textContent = text;

    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 4000);
  }

  cleanup() {
    delete window.logout;
    delete window.exportProducts;
    delete window.addProduct;
    delete window.viewProduct;
    delete window.editProduct;
    delete window.deleteProduct;
    delete window.toggleView;
    delete window.saveNewProduct;
    delete window.confirmDeleteProduct;
  }
}
