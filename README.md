# Plataforma de Chapas - Sistema de Venta de Chapas Metálicas

Una plataforma web moderna para la venta y gestión de chapas metálicas que actúa como intermediario entre clientes finales y proveedores.

## Características Principales

### Para Clientes

- **Compra sin registro**: Los clientes pueden realizar pedidos como invitados
- **Carrito temporal**: Se mantiene por 12 horas sin necesidad de crear cuenta
- **Catálogo completo**: Navegación fácil con filtros por categoría y búsqueda
- **Proceso simplificado**: Checkout rápido con datos mínimos requeridos

### Para Administradores

- **Panel de administración**: Gestión completa de productos y pedidos
- **Gestión de inventario**: Añadir, editar y eliminar productos del catálogo
- **Gestión de pedidos**: Seguimiento del estado de pedidos y comunicación con proveedores
- **Reportes**: Vista de clientes y historial de pedidos

## Tecnologías Utilizadas

- **Frontend**: Vanilla JavaScript con Vite
- **Styling**: CSS customizado con variables CSS
- **Arquitectura**: Patrón de componentes modular
- **Storage**: LocalStorage para datos temporales
- **Routing**: Sistema de routing personalizado

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.js
│   ├── Footer.js
│   └── CartSidebar.js
├── pages/              # Páginas de la aplicación
│   ├── HomePage.js
│   ├── CatalogPage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── ConfirmationPage.js
├── admin/              # Panel de administración
│   ├── AdminLoginPage.js
│   ├── AdminDashboard.js
│   ├── AdminProductsPage.js
│   ├── AdminOrdersPage.js
│   └── AdminClientsPage.js
├── services/           # Servicios de la aplicación
│   ├── Router.js
│   └── CartService.js
├── data/               # Datos y servicios de API
│   └── products.js
├── app.js              # Configuración principal de la app
├── main.js             # Punto de entrada
└── styles.css          # Estilos globales
```

## Instalación y Desarrollo

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

3. **Construir para producción**:

   ```bash
   npm run build
   ```

4. **Preview de producción**:
   ```bash
   npm run preview
   ```

## Flujo de Negocio

### Proceso del Cliente

1. Navegar catálogo sin registro
2. Añadir productos al carrito (temporal)
3. Proceder al checkout como invitado
4. Ingresar datos de envío y contacto
5. Confirmar pedido
6. Recibir email con estado "Pendiente de Confirmación"

### Proceso del Administrador

1. Login al panel de administración
2. Revisar nuevos pedidos
3. Generar resumen para consultar con proveedor
4. Confirmar stock y precio con proveedor
5. Actualizar estado del pedido
6. Cliente recibe notificación automática

## Características Técnicas

- **Diseño Responsivo**: Funciona en desktop, tablet y móvil
- **Performance**: Carga rápida con lazy loading de componentes
- **SEO Friendly**: URLs amigables y meta tags apropiados
- **Accesibilidad**: Cumple con estándares de accesibilidad web
- **Progressive Web App**: Capacidad de instalación y uso offline

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_EMAIL_SERVICE_URL=http://localhost:3000/email
VITE_ADMIN_EMAIL=admin@plataformachapas.com
```

### Configuración de Email

Para que funcionen las notificaciones por email, necesitarás configurar un servicio de email como:

- SendGrid
- Mailgun
- Amazon SES
- SMTP personalizado

## Deployment

### Netlify/Vercel

1. Conectar repositorio
2. Configurar comando de build: `npm run build`
3. Configurar directorio de output: `dist`
4. Añadir variables de entorno

### Hosting tradicional

1. Ejecutar `npm run build`
2. Subir contenido de la carpeta `dist/`
3. Configurar redirects para SPA

## Próximas Funcionalidades

- [ ] Sistema de usuarios registrados (opcional)
- [ ] Integración con pasarelas de pago
- [ ] Sistema de tracking de envíos
- [ ] Integración con ERP/CRM
- [ ] API REST completa
- [ ] Aplicación móvil
- [ ] Sistema de reviews y ratings
- [ ] Chat en vivo

## Soporte

Para soporte técnico o consultas sobre el proyecto:

- Email: soporte@plataformachapas.com
- Documentación: [Link a docs]
- Issues: [GitHub Issues]

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
