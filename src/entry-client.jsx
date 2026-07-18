import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// Prerendered pages ship server HTML inside #root (hydrate).
// The plain `npm run dev` server has no prerender step, so #root starts empty (client render).
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
