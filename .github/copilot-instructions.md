# Copilot Instructions - Plataforma de Chapas

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto del Proyecto

Esta es una plataforma web para la venta y gestión de chapas metálicas que actúa como intermediario entre clientes finales y proveedores.

## Características Principales

- **Compra como invitado**: Los clientes NO necesitan registrarse
- **Carrito temporal**: Se mantiene por 12 horas sin registro
- **Gestión de administradores**: Panel para gestionar productos y pedidos
- **Flujo de intermediación**: Los pedidos requieren confirmación con proveedores

## Estructura de la Aplicación

- **Frontend**: Vanilla JavaScript con Vite, diseño responsivo
- **Interfaz dual**: Pública para clientes, privada para administradores
- **Base de datos**: Estructura conceptual con productos, variantes, pedidos y administradores

## Casos de Uso Clave

1. **Cliente**: Navegar catálogo → Añadir al carrito → Comprar como invitado → Recibir confirmación
2. **Administrador**: Login → Gestionar productos → Revisar pedidos → Contactar proveedor → Actualizar estado

## Consideraciones Especiales

- NO gestionar stock en tiempo real (depende del proveedor)
- Emails automáticos para confirmaciones y actualizaciones
- Interfaz intuitiva y accesible 24/7
- Proceso de compra sin fricción

## Tecnologías Utilizadas

- Vite + JavaScript vanilla
- CSS responsivo
- Sistema de módulos ES6
- LocalStorage para carrito temporal
