import { useCallback, useState } from 'react'
import { getBlogById } from '../../data/blogs'
import { ShareIcon } from '../icons'
import Toast from '../Toast'
import '../../styles/blogs.css'

function ArticleScreen({ id, onBack }) {
  const article = getBlogById(id)
  const [toast, setToast] = useState('')
  const clearToast = useCallback(() => setToast(''), [])

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
        <button type="button" className="text-button detail-back" onClick={onBack}>
          ← Blogs
        </button>
        <button type="button" className="share-button" onClick={share}>
          <ShareIcon size={18} />
          <span>Share</span>
        </button>
      </div>

      <span className="blog-tag">{article.category}</span>
      <h1 className="article-title">{article.title}</h1>
      <p className="article-meta">{article.readTime} read</p>

      <div className="article-body">
        {article.body.map((para) => (
          <p key={para.slice(0, 32)}>{para}</p>
        ))}
      </div>

      <footer className="article-footer">
        <span className="article-check">✓</span> Checked with NOVA
      </footer>

      <Toast message={toast} onDone={clearToast} />
    </article>
  )
}

export default ArticleScreen
