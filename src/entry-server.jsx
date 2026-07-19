import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'

export { getRoutes, getSitemapEntries, metaFor, posts, realPosts, SITE, SITE_NAME } from './lib/content.js'

export function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  return { html }
}
