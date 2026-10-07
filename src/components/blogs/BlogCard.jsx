function BlogCard({ article, onOpen, compact = false }) {
  return (
    <button
      type="button"
      className={`blog-card ${compact ? 'blog-card-compact' : ''}`}
      onClick={() => onOpen(article.id)}
    >
      <span className="blog-card-top">
        <span className="blog-tag">{article.category}</span>
        <span className="blog-read">{article.readTime}</span>
      </span>
      <span className="blog-card-title">{article.title}</span>
      <span className="blog-card-summary">{article.summary}</span>
    </button>
  )
}

export default BlogCard
