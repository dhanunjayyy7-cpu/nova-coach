import { useCallback, useState } from 'react'
import { formatViews, getBlogById, sectionFor } from '../../data/blogs'
import { isBlogFlagged, toggleBlogFlag } from '../../utils/blogPrefs'
import { BackIcon, BookmarkIcon, HeartIcon, ShareIcon } from '../icons'
import Toast from '../Toast'
import BlogCover from './BlogCover'
import '../../styles/blogs.css'

function ArticleScreen({ id, onBack }) {
  const article = getBlogById(id)
  const [liked, setLiked] = useState(() => isBlogFlagged('liked', id))
  const [bookmarked, setBookmarked] = useState(() => isBlogFlagged('bookmarked', id))
  const [toast, setToast] = useState('')
  const clearToast = useCallback(() => setToast(''), [setToast])

  if (!article) {
    return (
      <div className="tab-screen">
        <button type="button" className="text-button detail-back" onClick={onBack}>
          ← Back
        </button>
        <div className="empty-state">
          <h2 className="empty-title">Article not found</h2>
        </div>
      </div>
    )
  }

  async function share() {
    const url = `${window.location.origin}/?article=${article.id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.summary, url })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setToast('Link copied')
    } catch {
      setToast('Couldn’t copy the link')
    }
  }

  return (
    <article className="article-screen">
      <div className="article-topbar">
        <button type="button" className="icon-button" aria-label="Back to blogs" onClick={onBack}>
          <BackIcon size={22} />
        </button>
        <div className="article-actions">
          {article.views > 0 && (
            <span className="article-views" aria-label={`${article.views} views`}>
              👁 {formatViews(article.views)}
            </span>
          )}
          <button
            type="button"
            className={`icon-button ${liked ? 'article-liked' : ''}`}
            aria-label={liked ? 'Unlike' : 'Like'}
            aria-pressed={liked}
            onClick={() => setLiked(toggleBlogFlag('liked', article.id))}
          >
            <HeartIcon size={20} filled={liked} />
          </button>
          <button
            type="button"
            className={`icon-button ${bookmarked ? 'article-bookmarked' : ''}`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            aria-pressed={bookmarked}
            onClick={() => {
              const on = toggleBlogFlag('bookmarked', article.id)
              setBookmarked(on)
              setToast(on ? 'Bookmarked' : 'Bookmark removed')
            }}
          >
            <BookmarkIcon filled={bookmarked} size={20} />
          </button>
          <button type="button" className="icon-button" aria-label="Share" onClick={share}>
            <ShareIcon size={20} />
          </button>
        </div>
      </div>

      <div className="article-brand">
        <span className="article-brand-logo">N</span>
        <span>NOVA</span>
      </div>

      <p className="article-category">{sectionFor(article).label}</p>
      <h1 className="article-title">{article.title}</h1>
      <p className="article-meta">{article.readTime} read</p>

      <BlogCover article={article} className="article-cover" />

      <div className="article-body">
        {article.sections.map((section) => (
          <section key={section.heading} className="article-section">
            <h2>{section.heading}</h2>
            {section.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </section>
        ))}
      </div>

      <aside className="article-disclaimer">
        <span aria-hidden="true">⚠</span>
        <p>{article.disclaimer}</p>
      </aside>

      <footer className="article-footer">
        <span className="article-check">✓</span> Checked with NOVA
      </footer>

      <Toast message={toast} onDone={clearToast} />
    </article>
  )
}

export default ArticleScreen
