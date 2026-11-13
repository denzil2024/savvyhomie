import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { setPosts } from './lib/content.js'
import App from './App.jsx'

// Prerendered pages inline their data as JSON (light index of every post plus
// the full record for this page's post), written by scripts/prerender.mjs. The
// browser bundle therefore carries no markdown and no parser. `npm run dev`
// has no prerender step, so dev loads the server module directly; the
// `import.meta.env.DEV` guard is a build-time constant, so that import (and
// every post body) is dropped from the production bundle.
const dataEl = document.getElementById('sh-data')
if (dataEl) {
  setPosts(JSON.parse(dataEl.textContent).posts)
} else if (import.meta.env.DEV) {
  const mod = await import('./lib/posts-server.js')
  setPosts(mod.allPosts)
}

const root = document.getElementById('root')
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// Prerendered pages ship server HTML inside #root (hydrate).
// The plain `npm run dev` server has no prerender step, so #root holds only the
// `<!--app-html-->` placeholder comment (client render). Check for an element,
// not any child node: the comment node alone used to trigger a hydration attempt
// against empty markup in dev, with a wall of mismatch warnings.
if (root.firstElementChild) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
