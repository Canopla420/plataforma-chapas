export class CartService {
  constructor() {
    this.items = [];
    this.loadFromStorage();
    this.cleanupTimer = null;
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("cart_data");
      if (stored) {
        const data = JSON.parse(stored);

        // Check if cart is expired (12 hours)
        const now = new Date().getTime();
        const cartAge = now - data.timestamp;
        const twelveHours = 12 * 60 * 60 * 1000;

        if (cartAge < twelveHours) {
          this.items = data.items || [];
        } else {
          this.clearCart();
        }
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      this.clearCart();
    }
  }

  saveToStorage() {
    try {
      const data = {
        items: this.items,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem("cart_data", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }

  addItem(product, quantity = 1, selectedVariant = null) {
    const variantId = selectedVariant
      ? selectedVariant.id
      : product.variants[0].id;
    const variant = selectedVariant || product.variants[0];

    const existingItemIndex = this.items.findIndex(
      (item) => item.productId === product.id && item.variantId === variantId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      this.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const item = {
        id: this.generateItemId(),
        productId: product.id,
        variantId: variantId,
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          description: product.description,
        },
        variant: {
          id: variant.id,
          size: variant.size,
          price: variant.price,
        },
        quantity: quantity,
        addedAt: new Date().toISOString(),
      };
      this.items.push(item);
    }

    this.saveToStorage();
    this.notifyUpdate();
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.saveToStorage();
    this.notifyUpdate();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find((item) => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
        this.notifyUpdate();
      }
    }
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem("cart_data");
    this.notifyUpdate();
  }

  getItems() {
    return [...this.items];
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.variant.price * item.quantity;
    }, 0);
  }

  isEmpty() {
    return this.items.length === 0;
  }

  generateItemId() {
    return "item_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
  }

  notifyUpdate() {
    document.dispatchEvent(
      new CustomEvent("cart:updated", {
        detail: {
          items: this.getItems(),
          count: this.getItemCount(),
          total: this.getTotal(),
        },
      })
    );
  }

  startCleanupTimer() {
    // Clean up expired carts every hour
    this.cleanupTimer = setInterval(() => {
      this.loadFromStorage(); // This will clear if expired
    }, 60 * 60 * 1000); // 1 hour
  }

  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // For checkout process
  createOrder(customerData) {
    const order = {
      id: this.generateOrderId(),
      customer: customerData,
      items: this.getItems(),
      total: this.getTotal(),
      status: "pending_confirmation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order (in a real app this would go to a server)
    this.saveOrder(order);

    // Clear cart after successful order
    this.clearCart();

    return order;
  }

  generateOrderId() {
    return (
      "ORDER_" +
      new Date().getFullYear() +
      String(new Date().getMonth() + 1).padStart(2, "0") +
      String(new Date().getDate()).padStart(2, "0") +
      "_" +
      Math.random().toString(36).substr(2, 6).toUpperCase()
    );
  }

  saveOrder(order) {
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Also notify admin (in a real app this would be a server call)
      this.notifyAdmin(order);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  }

  notifyAdmin(order) {
    // In a real application, this would send an email to the admin
    console.log("New order created:", order.id);

    // For demo purposes, add to admin notifications
    const notifications = JSON.parse(
      localStorage.getItem("admin_notifications") || "[]"
    );
    notifications.push({
      id: Math.random().toString(36).substr(2, 9),
      type: "new_order",
      orderId: order.id,
      message: `Nuevo pedido recibido: ${order.id}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("admin_notifications", JSON.stringify(notifications));
  }
}
