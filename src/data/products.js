// Mock data for development - In production this would come from a database
export const mockProducts = [
  {
    id: "chapa-001",
    name: "Chapa Acanalada Galvanizada",
    description:
      "Chapa acanalada galvanizada ideal para techos y cobertizos. Resistente a la corrosión y fácil instalación.",
    type: "Acanalada",
    caliber: "24",
    material: "Acero Galvanizado",
    image: "/images/placeholder.jpg",
    images: ["/images/placeholder.jpg"],
    variants: [
      {
        id: "var-001-1",
        size: "2.00m x 1.10m",
        dimensions: { length: 2.0, width: 1.1 },
        price: 25.5,
        available: true,
      },
      {
        id: "var-001-2",
        size: "3.00m x 1.10m",
        dimensions: { length: 3.0, width: 1.1 },
        price: 38.25,
        available: true,
      },
      {
        id: "var-001-3",
        size: "4.00m x 1.10m",
        dimensions: { length: 4.0, width: 1.1 },
        price: 51.0,
        available: true,
      },
    ],
    features: [
      "Resistente a la corrosión",
      "Fácil instalación",
      "Larga durabilidad",
      "Bajo mantenimiento",
    ],
    category: "techos",
    inStock: true,
    featured: true,
  },
  {
    id: "chapa-002",
    name: "Chapa Lisa Prepintada",
    description:
      "Chapa lisa prepintada de alta calidad para aplicaciones arquitectónicas. Disponible en varios colores.",
    type: "Lisa",
    caliber: "26",
    material: "Acero Prepintado",
    image: "/images/placeholder.jpg",
    images: ["/images/placeholder.jpg"],
    variants: [
      {
        id: "var-002-1",
        size: "2.00m x 1.00m",
        dimensions: { length: 2.0, width: 1.0 },
        price: 32.75,
        available: true,
      },
      {
        id: "var-002-2",
        size: "2.50m x 1.00m",
        dimensions: { length: 2.5, width: 1.0 },
        price: 40.95,
        available: true,
      },
      {
        id: "var-002-3",
        size: "3.00m x 1.00m",
        dimensions: { length: 3.0, width: 1.0 },
        price: 49.15,
        available: true,
      },
    ],
    features: [
      "Acabado prepintado",
      "Múltiples colores disponibles",
      "Superficie lisa",
      "Ideal para fachadas",
    ],
    category: "fachadas",
    inStock: true,
    featured: true,
  },
  {
    id: "chapa-003",
    name: "Chapa Trapezoidal",
    description:
      "Chapa trapezoidal de alto rendimiento para cubiertas industriales y comerciales.",
    type: "Trapezoidal",
    caliber: "22",
    material: "Acero Galvanizado",
    image: "/images/placeholder.jpg",
    images: ["/images/placeholder.jpg"],
    variants: [
      {
        id: "var-003-1",
        size: "3.00m x 1.00m",
        dimensions: { length: 3.0, width: 1.0 },
        price: 45.8,
        available: true,
      },
      {
        id: "var-003-2",
        size: "4.00m x 1.00m",
        dimensions: { length: 4.0, width: 1.0 },
        price: 61.05,
        available: true,
      },
      {
        id: "var-003-3",
        size: "6.00m x 1.00m",
        dimensions: { length: 6.0, width: 1.0 },
        price: 91.6,
        available: true,
      },
    ],
    features: [
      "Alta resistencia estructural",
      "Ideal para grandes luces",
      "Excelente drenaje",
      "Fácil montaje",
    ],
    category: "industrial",
    inStock: true,
    featured: false,
  },
  {
    id: "chapa-004",
    name: "Chapa Grecada",
    description:
      "Chapa grecada ideal para cerramientos y divisiones. Resistente y económica.",
    type: "Grecada",
    caliber: "25",
    material: "Acero Galvanizado",
    image: "/images/placeholder.jpg",
    images: ["/images/placeholder.jpg"],
    variants: [
      {
        id: "var-004-1",
        size: "2.00m x 1.10m",
        dimensions: { length: 2.0, width: 1.1 },
        price: 28.9,
        available: true,
      },
      {
        id: "var-004-2",
        size: "2.50m x 1.10m",
        dimensions: { length: 2.5, width: 1.1 },
        price: 36.15,
        available: true,
      },
      {
        id: "var-004-3",
        size: "3.00m x 1.10m",
        dimensions: { length: 3.0, width: 1.1 },
        price: 43.35,
        available: true,
      },
    ],
    features: [
      "Diseño grecado tradicional",
      "Versátil aplicación",
      "Buena relación precio-calidad",
      "Fácil manipulación",
    ],
    category: "cerramientos",
    inStock: true,
    featured: false,
  },
  {
    id: "chapa-005",
    name: "Chapa Microperforada",
    description:
      "Chapa microperforada para aplicaciones acústicas y decorativas.",
    type: "Microperforada",
    caliber: "20",
    material: "Acero Galvanizado",
    image: "/images/placeholder.jpg",
    images: ["/images/placeholder.jpg"],
    variants: [
      {
        id: "var-005-1",
        size: "1.20m x 2.40m",
        dimensions: { length: 1.2, width: 2.4 },
        price: 95.5,
        available: true,
      },
      {
        id: "var-005-2",
        size: "1.50m x 3.00m",
        dimensions: { length: 1.5, width: 3.0 },
        price: 149.75,
        available: true,
      },
    ],
    features: [
      "Propiedades acústicas",
      "Diseño decorativo",
      "Múltiples aplicaciones",
      "Acabado especializado",
    ],
    category: "decorativa",
    inStock: true,
    featured: false,
  },
  {
    id: "chapa-006",
    name: "Chapa Ondulada Fibrocemento",
    description:
      "Chapa ondulada de fibrocemento para techados económicos y duraderos.",
    type: "Ondulada",
    caliber: "6mm",
    material: "Fibrocemento",
    image: "/images/placeholder.jpg",
    images: ["/images/placeholder.jpg"],
    variants: [
      {
        id: "var-006-1",
        size: "1.83m x 1.10m",
        dimensions: { length: 1.83, width: 1.1 },
        price: 22.8,
        available: true,
      },
      {
        id: "var-006-2",
        size: "2.44m x 1.10m",
        dimensions: { length: 2.44, width: 1.1 },
        price: 30.4,
        available: true,
      },
      {
        id: "var-006-3",
        size: "3.05m x 1.10m",
        dimensions: { length: 3.05, width: 1.1 },
        price: 38.0,
        available: true,
      },
    ],
    features: [
      "Material económico",
      "Resistente a la intemperie",
      "Fácil instalación",
      "Aislante térmico natural",
    ],
    category: "economica",
    inStock: true,
    featured: false,
  },
];

export const categories = [
  { id: "all", name: "Todos los productos", count: mockProducts.length },
  {
    id: "techos",
    name: "Chapas para Techos",
    count: mockProducts.filter((p) => p.category === "techos").length,
  },
  {
    id: "fachadas",
    name: "Chapas para Fachadas",
    count: mockProducts.filter((p) => p.category === "fachadas").length,
  },
  {
    id: "industrial",
    name: "Uso Industrial",
    count: mockProducts.filter((p) => p.category === "industrial").length,
  },
  {
    id: "cerramientos",
    name: "Cerramientos",
    count: mockProducts.filter((p) => p.category === "cerramientos").length,
  },
  {
    id: "decorativa",
    name: "Decorativas",
    count: mockProducts.filter((p) => p.category === "decorativa").length,
  },
  {
    id: "economica",
    name: "Línea Económica",
    count: mockProducts.filter((p) => p.category === "economica").length,
  },
];

// API simulation functions
export class ProductService {
  static async getAllProducts() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockProducts];
  }

  static async getProductById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return { ...product };
  }

  static async getProductsByCategory(category) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (category === "all") {
      return [...mockProducts];
    }
    return mockProducts.filter((p) => p.category === category);
  }

  static async getFeaturedProducts() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockProducts.filter((p) => p.featured);
  }

  static async searchProducts(query) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.type.toLowerCase().includes(lowercaseQuery) ||
        product.material.toLowerCase().includes(lowercaseQuery)
    );
  }

  static getCategories() {
    return [...categories];
  }
}
