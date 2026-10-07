import { useState } from 'react'
import { BLOG_CATEGORIES, BLOGS } from '../../data/blogs'
import BlogCard from '../blogs/BlogCard'
import '../../styles/blogs.css'

const FILTERS = ['All', ...BLOG_CATEGORIES]

function BlogsTab({ nav }) {
  const [filter, setFilter] = useState('All')
  const articles = filter === 'All' ? BLOGS : BLOGS.filter((b) => b.category === filter)

  return (
    <div className="tab-screen">
      <header className="tab-header">
        <h1 className="tab-title">Blogs</h1>
        <p className="tab-subtitle">Quick reads for smarter choices</p>
      </header>

      <div className="filter-chips" role="tablist" aria-label="Categories">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`filter-chip ${filter === f ? 'filter-chip-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="blog-feed">
        {articles.map((a) => (
          <BlogCard key={a.id} article={a} onOpen={nav.openBlog} />
        ))}
      </div>
    </div>
  )
}

export default BlogsTab
