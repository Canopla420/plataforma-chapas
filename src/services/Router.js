export class Router {
  constructor() {
    this.routes = new Map()
    this.currentPage = null
  }

  addRoute(path, handler) {
    this.routes.set(path, handler)
  }

  init() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute()
    })

    // Handle initial route
    this.handleRoute()
  }

  async handleRoute() {
    const path = window.location.pathname
    console.log('Handling route:', path)
    console.log('Available routes:', Array.from(this.routes.keys()))
    const route = this.findRoute(path)
    
    if (route) {
      try {
        // Clean up previous page
        if (this.currentPage && this.currentPage.cleanup) {
          this.currentPage.cleanup()
        }

        // Load new page - the handler already returns an instance
        this.currentPage = await route.handler()
        
        // Render page
        if (this.currentPage && this.currentPage.render) {
          await this.currentPage.render()
        } else {
          console.error('Page does not have a render method')
          this.show404()
        }
        
      } catch (error) {
        console.error('Error loading page:', error)
        this.show404()
      }
    } else {
      console.log('No route found for:', path)
      this.show404()
    }
  }

  findRoute(path) {
    // First try exact match
    if (this.routes.has(path)) {
      return { handler: this.routes.get(path), params: {} }
    }

    // Then try parameterized routes
    for (const [routePath, handler] of this.routes) {
      const params = this.matchRoute(routePath, path)
      if (params) {
        return { handler, params }
      }
    }

    return null
  }

  matchRoute(routePath, actualPath) {
    const routeParts = routePath.split('/')
    const pathParts = actualPath.split('/')

    if (routeParts.length !== pathParts.length) {
      return null
    }

    const params = {}
    
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i]
      const pathPart = pathParts[i]

      if (routePart.startsWith(':')) {
        // Parameter
        const paramName = routePart.slice(1)
        params[paramName] = pathPart
      } else if (routePart !== pathPart) {
        // No match
        return null
      }
    }

    return params
  }

  navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path)
      this.handleRoute()
    }
  }

  show404() {
    const appElement = document.getElementById('app')
    appElement.innerHTML = `
      <div class="container p-4 text-center">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <a href="/" class="btn btn-primary">Volver al inicio</a>
      </div>
    `
  }
}
