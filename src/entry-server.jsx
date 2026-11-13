import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { allPosts, realPosts, pageData } from './lib/posts-server.js'
import { setPosts } from './lib/content.js'
import App from './App.jsx'

// Fill the shared post store before anything renders. On the server this is
// every post with full bodies; the client gets a per-page subset (see pageData).
setPosts(allPosts)

export { getRoutes, getSitemapEntries, metaFor, posts, SITE, SITE_NAME } from './lib/content.js'
export { realPosts, pageData }

export function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  return { html }
}
