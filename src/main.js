import './styles.css'
import { App } from './app.js'

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

function initApp() {
  try {
    console.log('Initializing app...')
    const app = new App()
    app.init()
    console.log('App initialized successfully')
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}
