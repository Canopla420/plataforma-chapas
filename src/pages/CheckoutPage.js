import { CartService } from "../services/CartService.js";

export class CheckoutPage {
  constructor() {
    this.cartService = new CartService();
    this.items = [];
    this.total = 0;
  }

  async render() {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();

    // Redirect to cart if empty
    if (this.items.length === 0) {
      document.dispatchEvent(
        new CustomEvent("navigate", { detail: { path: "/catalogo" } })
      );
      return;
    }

    const appElement = document.getElementById("app");
    appElement.innerHTML = this.getHTML();
    this.attachEventListeners();
  }

  getHTML() {
    return `
      <div class="container" style="padding: 2rem 0;">
        <!-- Page Header -->
        <div style="margin-bottom: 2rem;">
          <h1>Finalizar Pedido</h1>
          <p>Completa tus datos para que podamos procesar tu pedido. No necesitas registrarte.</p>
        </div>

        <div class="grid grid-2" style="gap: 3rem; align-items: start;">
          <!-- Customer Form -->
          <div>
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
              <h2 style="margin-bottom: 1.5rem;">Datos de Contacto y Envío</h2>
              
              <form id="checkout-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input type="text" name="firstName" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Apellido *</label>
                    <input type="text" name="lastName" class="form-input" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input type="email" name="email" class="form-input" required>
                  <small style="color: var(--text-secondary); font-size: 0.875rem;">
                    Te enviaremos la confirmación de tu pedido a este email
                  </small>
                </div>

                <div class="form-group">
                  <label class="form-label">Teléfono *</label>
                  <input type="tel" name="phone" class="form-input" required>
                  <small style="color: var(--text-secondary); font-size: 0.875rem;">
                    Para coordinar la entrega contigo
                  </small>
                </div>

                <div class="form-group">
                  <label class="form-label">Dirección de Entrega *</label>
                  <input type="text" name="address" class="form-input" placeholder="Calle y número" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Ciudad *</label>
                    <input type="text" name="city" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Código Postal</label>
                    <input type="text" name="zipCode" class="form-input">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Comentarios Adicionales</label>
                  <textarea name="comments" class="form-textarea" rows="3" placeholder="Instrucciones especiales para la entrega, referencias, etc."></textarea>
                </div>

                <div class="form-group">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" name="acceptTerms" required>
                    <span>Acepto los <a href="#" style="color: var(--primary-color);">términos y condiciones</a> *</span>
                  </label>
                </div>

                <div class="form-group">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" name="newsletter">
                    <span>Quiero recibir ofertas y novedades por email</span>
                  </label>
                </div>
              </form>
            </div>
          </div>

          <!-- Order Summary -->
          <div>
            <div style="background: white; padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); position: sticky; top: 2rem;">
              <h2 style="margin-bottom: 1.5rem;">Resumen del Pedido</h2>
              
              <!-- Order Items -->
              <div style="margin-bottom: 1.5rem;">
                ${this.items
                  .map(
                    (item) => `
                  <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
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
                      <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                        ${item.variant.size}
                      </div>
                      <div style="font-size: 0.875rem; color: var(--text-secondary);">
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

              <!-- Totals -->
              <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span>Subtotal:</span>
                  <span>$${this.total.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-secondary);">
                  <span>Envío:</span>
                  <span>A coordinar</span>
                </div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 0.5rem; display: flex; justify-content: space-between; font-size: 1.125rem; font-weight: 600;">
                  <span>Total:</span>
                  <span style="color: var(--primary-color);">$${this.total.toFixed(
                    2
                  )}</span>
                </div>
              </div>

              <!-- Important Notice -->
              <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1.5rem; font-size: 0.875rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--warning);">⚠️ Importante</h4>
                <ul style="list-style: none; padding: 0; color: var(--text-secondary);">
                  <li style="margin-bottom: 0.25rem;">• Los precios están sujetos a confirmación de stock</li>
                  <li style="margin-bottom: 0.25rem;">• El costo de envío se coordinará según la ubicación</li>
                  <li style="margin-bottom: 0.25rem;">• Te contactaremos dentro de las 24 horas</li>
                  <li>• No se realizan pagos online en esta etapa</li>
                </ul>
              </div>

              <!-- Action Buttons -->
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <button type="submit" form="checkout-form" class="btn btn-primary btn-lg" id="place-order">
                  Confirmar Pedido
                </button>
                <button type="button" class="btn btn-outline" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: {path: '/catalogo'}}))">
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });
    }

    // Real-time form validation
    const requiredInputs = form.querySelectorAll(
      "input[required], textarea[required]"
    );
    requiredInputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();

    if (!isValid) {
      field.style.borderColor = "var(--error)";
      if (
        !field.nextElementSibling ||
        !field.nextElementSibling.classList.contains("error-message")
      ) {
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.style.cssText =
          "color: var(--error); font-size: 0.875rem; margin-top: 0.25rem;";
        errorMsg.textContent =
          field.validationMessage || "Este campo es requerido";
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
      }
    } else {
      field.style.borderColor = "var(--border-color)";
      const errorMsg = field.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains("error-message")) {
        errorMsg.remove();
      }
    }

    return isValid;
  }

  validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll(
      "input[required], textarea[required]"
    );

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Additional validation
    const email = form.querySelector('input[type="email"]');
    if (email && email.value && !this.isValidEmail(email.value)) {
      this.showFieldError(email, "Por favor ingresa un email válido");
      isValid = false;
    }

    const phone = form.querySelector('input[type="tel"]');
    if (phone && phone.value && !this.isValidPhone(phone.value)) {
      this.showFieldError(phone, "Por favor ingresa un teléfono válido");
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    return /^[\+]?[\d\s\-\(\)]{8,}$/.test(phone);
  }

  showFieldError(field, message) {
    field.style.borderColor = "var(--error)";

    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains("error-message")) {
      existingError.textContent = message;
    } else {
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.style.cssText =
        "color: var(--error); font-size: 0.875rem; margin-top: 0.25rem;";
      errorMsg.textContent = message;
      field.parentNode.insertBefore(errorMsg, field.nextSibling);
    }
  }

  handleSubmit(form) {
    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document.querySelectorAll("input, textarea").forEach((el) => {
      el.style.borderColor = "var(--border-color)";
    });

    if (!this.validateForm(form)) {
      this.showMessage(
        "Por favor corrige los errores en el formulario",
        "error"
      );
      return;
    }

    const formData = new FormData(form);
    const customerData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      zipCode: formData.get("zipCode"),
      comments: formData.get("comments"),
      acceptTerms: formData.get("acceptTerms"),
      newsletter: formData.get("newsletter"),
    };

    this.placeOrder(customerData);
  }

  placeOrder(customerData) {
    try {
      // Create order
      const order = this.cartService.createOrder(customerData);

      // Show success message
      this.showOrderSuccess(order);

      // Navigate to confirmation page
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { path: `/confirmacion/${order.id}` },
          })
        );
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      this.showMessage(
        "Hubo un error al procesar tu pedido. Por favor intenta de nuevo.",
        "error"
      );
    }
  }

  showOrderSuccess(order) {
    document.dispatchEvent(
      new CustomEvent("modal:open", {
        detail: {
          title: "¡Pedido Confirmado!",
          content: `
          <div class="text-center">
            <div style="font-size: 4rem; color: var(--success); margin-bottom: 1rem;">✓</div>
            <h3 style="margin-bottom: 1rem;">Tu pedido ha sido enviado exitosamente</h3>
            <p style="margin-bottom: 1rem;">
              <strong>Número de pedido:</strong> ${order.id}
            </p>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Hemos enviado una confirmación a tu email. Te contactaremos dentro de las próximas 24 horas para confirmar el stock y coordinar la entrega.
            </p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--border-radius); margin: 1rem 0; font-size: 0.875rem;">
              <strong>Estado actual:</strong> Pendiente de confirmación de stock
            </div>
          </div>
        `,
          footer:
            '<button class="btn btn-primary" onclick="document.dispatchEvent(new CustomEvent(\'modal:close\'))">Continuar</button>',
        },
      })
    );
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
      top: 100px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      max-width: 400px;
    `;
    message.textContent = text;

    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  cleanup() {
    // Clean up event listeners
  }
}
