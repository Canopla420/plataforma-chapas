import { Router } from "./services/Router.js";
import { CartService } from "./services/CartService.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { CartSidebar } from "./components/CartSidebar.js";

export class App {
  constructor() {
    this.router = new Router();
    this.cartService = new CartService();
    this.header = new Header();
    this.footer = new Footer();
    this.cartSidebar = new CartSidebar();
  }

  init() {
    // Make CartService globally available
    window.CartService = this.cartService;

    this.setupComponents();
    this.setupRoutes();
    this.router.init();

    // Start cart cleanup timer (12 hours)
    this.cartService.startCleanupTimer();
  }

  setupComponents() {
    // Verify DOM elements exist
    const requiredElements = [
      "header",
      "footer",
      "cart-sidebar",
      "app",
      "modal-container",
    ];
    for (const id of requiredElements) {
      if (!document.getElementById(id)) {
        console.error(`Required DOM element not found: ${id}`);
        return;
      }
    }

    // Initialize header
    this.header.render();

    // Initialize footer
    this.footer.render();

    // Initialize cart sidebar
    this.cartSidebar.render();

    // Setup global event listeners
    this.setupGlobalEvents();
  }

  setupRoutes() {
    // Client routes
    this.router.addRoute("/", async () => {
      const { HomePage } = await import("./pages/HomePage.js");
      return new HomePage();
    });

    this.router.addRoute("/catalogo", async () => {
      const { CatalogPage } = await import("./pages/CatalogPage.js");
      return new CatalogPage();
    });

    this.router.addRoute("/producto/:id", async () => {
      const { ProductPage } = await import("./pages/ProductPage.js");
      return new ProductPage();
    });

    this.router.addRoute("/carrito", async () => {
      const { CartPage } = await import("./pages/CartPage.js");
      return new CartPage();
    });

    this.router.addRoute("/checkout", async () => {
      const { CheckoutPage } = await import("./pages/CheckoutPage.js");
      return new CheckoutPage();
    });

    this.router.addRoute("/confirmacion/:orderId", async () => {
      const { ConfirmationPage } = await import("./pages/ConfirmationPage.js");
      return new ConfirmationPage();
    });

    // Admin routes
    this.router.addRoute("/admin", async () => {
      const { AdminLoginPage } = await import("./admin/AdminLoginPage.js");
      return new AdminLoginPage();
    });

    this.router.addRoute("/admin/dashboard", async () => {
      const { AdminDashboard } = await import("./admin/AdminDashboard.js");
      return new AdminDashboard();
    });

    this.router.addRoute("/admin/productos", async () => {
      const { AdminProductsPage } = await import(
        "./admin/AdminProductsPage.js"
      );
      return new AdminProductsPage();
    });

    this.router.addRoute("/admin/pedidos", async () => {
      const { AdminOrdersPage } = await import("./admin/AdminOrdersPage.js");
      return new AdminOrdersPage();
    });

    this.router.addRoute("/admin/clientes", async () => {
      const { AdminClientsPage } = await import("./admin/AdminClientsPage.js");
      return new AdminClientsPage();
    });
  }

  setupGlobalEvents() {
    // Cart events
    document.addEventListener("cart:updated", () => {
      this.header.updateCartCount();
    });

    document.addEventListener("cart:toggle", () => {
      this.cartSidebar.toggle();
    });

    // Navigation events
    document.addEventListener("navigate", (event) => {
      this.router.navigate(event.detail.path);
    });

    // Modal events
    document.addEventListener("modal:open", (event) => {
      this.openModal(event.detail);
    });

    document.addEventListener("modal:close", () => {
      this.closeModal();
    });
  }

  openModal(modalData) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) {
      console.error("Modal container not found");
      return;
    }

    modalContainer.innerHTML = `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>${modalData.title}</h3>
            <button class="btn btn-secondary btn-sm" onclick="document.dispatchEvent(new CustomEvent('modal:close'))">×</button>
          </div>
          <div class="modal-content">
            ${modalData.content}
          </div>
          ${
            modalData.footer
              ? `<div class="modal-footer">${modalData.footer}</div>`
              : ""
          }
        </div>
      </div>
    `;
    modalContainer.classList.remove("hidden");
  }

  closeModal() {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) {
      console.error("Modal container not found");
      return;
    }

    modalContainer.innerHTML = "";
    modalContainer.classList.add("hidden");
  }
}
