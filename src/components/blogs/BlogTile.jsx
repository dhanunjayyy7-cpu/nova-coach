import { useState } from 'react'
import { formatViews } from '../../data/blogs'
import { isBlogFlagged, toggleBlogFlag } from '../../utils/blogPrefs'
import BlogCover from './BlogCover'
import { BookmarkIcon } from '../icons'

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function BlogTile({ article, onOpen, wide = false }) {
  const [bookmarked, setBookmarked] = useState(() => isBlogFlagged('bookmarked', article.id))

  return (
    <article className={`blog-tile ${wide ? 'blog-tile-wide' : ''}`}>
      <button type="button" className="blog-tile-open" onClick={() => onOpen(article.id)}>
        <BlogCover article={article} className="blog-tile-cover">
          {article.views > 0 && (
            <span className="blog-views">
              <EyeIcon /> {formatViews(article.views)} Views
            </span>
          )}
        </BlogCover>
        <span className="blog-tile-title">{article.title}</span>
      </button>
      <button
        type="button"
        className={`blog-tile-bookmark ${bookmarked ? 'is-on' : ''}`}
        aria-label={bookmarked ? `Remove bookmark: ${article.title}` : `Bookmark: ${article.title}`}
        aria-pressed={bookmarked}
        onClick={() => setBookmarked(toggleBlogFlag('bookmarked', article.id))}
      >
        <BookmarkIcon filled={bookmarked} size={18} />
      </button>
    </article>
  )
}

export default BlogTile
