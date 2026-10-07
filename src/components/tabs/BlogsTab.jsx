import { useState } from 'react'
import { BLOG_SECTIONS, BLOGS } from '../../data/blogs'
import BlogTile from '../blogs/BlogTile'
import { CloseIcon, SearchIcon } from '../icons'
import '../../styles/blogs.css'

function ArrowIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function BlogsTab({ nav }) {
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(null) // section key shown as a full list

  const q = query.trim().toLowerCase()
  const results = q
    ? BLOGS.filter((b) => `${b.title} ${b.summary} ${b.tag}`.toLowerCase().includes(q))
    : []

  function closeSearch() {
    setSearching(false)
    setQuery('')
  }

  return (
    <div className="tab-screen blogs-screen">
      <header className="blogs-topbar">
        {searching ? (
          <label className="search-bar blogs-search">
            <SearchIcon size={20} />
            <input
              type="search"
              autoFocus
              placeholder="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search articles"
            />
          </label>
        ) : (
          <h1 className="tab-title">Blogs</h1>
        )}
        <button
          type="button"
          className="icon-button blogs-search-toggle"
          aria-label={searching ? 'Close search' : 'Search articles'}
          onClick={() => (searching ? closeSearch() : setSearching(true))}
        >
          {searching ? <CloseIcon size={20} /> : <SearchIcon size={20} />}
        </button>
      </header>

      {searching && q ? (
        <section className="blog-section">
          <p className="blog-section-subtitle">
            {results.length} result{results.length === 1 ? '' : 's'} for “{query.trim()}”
          </p>
          <div className="blog-grid">
            {results.map((a) => (
              <BlogTile key={a.id} article={a} onOpen={nav.openBlog} wide />
            ))}
          </div>
        </section>
      ) : (
        BLOG_SECTIONS.map((section) => {
          const articles = BLOGS.filter((b) => b.category === section.key)
          const isOpen = expanded === section.key
          return (
            <section key={section.key} className="blog-section">
              <div className="blog-section-head">
                <div>
                  <h2 className="blog-section-title">{section.title}</h2>
                  <p className="blog-section-subtitle">{section.subtitle}</p>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={isOpen ? `Collapse ${section.title}` : `Show all ${section.title}`}
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : section.key)}
                >
                  <ArrowIcon open={isOpen} />
                </button>
              </div>
              <div className={isOpen ? 'blog-grid' : 'blog-row'}>
                {articles.map((a) => (
                  <BlogTile key={a.id} article={a} onOpen={nav.openBlog} wide={isOpen} />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

export default BlogsTab
