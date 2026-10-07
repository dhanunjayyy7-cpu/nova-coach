import { useState } from 'react'

// Uses `coverImage` when one is set and loads; otherwise a gradient with the article's emoji.
function BlogCover({ article, className = '', children }) {
  const [failed, setFailed] = useState(false)
  const { cover } = article
  const useImage = article.coverImage && !failed

  return (
    <div
      className={`blog-cover ${className}`}
      style={useImage ? undefined : { background: `linear-gradient(135deg, ${cover.from}, ${cover.to})` }}
    >
      {useImage ? (
        <img src={article.coverImage} alt={article.title} onError={() => setFailed(true)} />
      ) : (
        <span className="blog-cover-emoji" aria-hidden="true">
          {cover.emoji}
        </span>
      )}
      {children}
    </div>
  )
}

export default BlogCover
