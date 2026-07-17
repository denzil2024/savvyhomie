import { useParams, Link } from 'react-router-dom'
import { posts, categories } from '../lib/content.js'

export default function Post() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return <section className="hero"><h1>Not found</h1></section>
  const cat = categories.find((c) => c.slug === post.category)
  return (
    <article className="post">
      <div className="crumbs">
        <Link to="/">Home</Link>
        {cat && <> / <Link to={`/category/${cat.slug}/`}>{cat.name}</Link></>}
      </div>
      <h1>{post.title}</h1>
      <div className="byline">By <b>SavvyHomie</b> · Updated {post.updated} · Every pick independently reviewed</div>
      <div className="disclosure">We may earn a commission when you buy through links on this page, at no extra cost to you.</div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
