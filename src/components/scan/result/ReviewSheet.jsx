import { useState } from 'react'
import BottomSheet from '../../BottomSheet'
import StarRow from './StarRow'

const MAX_REVIEW_CHARS = 200

// mode "rate" asks for stars only; mode "review" adds a short text review.
function ReviewSheet({ mode, initial, onSubmit, onClose }) {
  const [stars, setStars] = useState(initial?.stars ?? 0)
  const [text, setText] = useState(initial?.text ?? '')
  const isReview = mode === 'review'

  return (
    <BottomSheet
      title={isReview ? 'Write a review' : 'Rate this product'}
      onClose={onClose}
      footer={
        <button
          type="button"
          className="primary-button"
          disabled={stars === 0}
          onClick={() => onSubmit(isReview ? { stars, text: text.trim() } : { stars })}
        >
          Submit
        </button>
      }
    >
      <p className="sheet-hint">Your rating stays on this phone.</p>
      <StarRow value={stars} onChange={setStars} size={34} />
      {isReview && (
        <label className="review-field">
          <span className="visually-hidden">Review</span>
          <textarea
            value={text}
            maxLength={MAX_REVIEW_CHARS}
            rows={4}
            placeholder="What did you think? Taste, ingredients, value…"
            onChange={(e) => setText(e.target.value)}
          />
          <span className="review-count">
            {text.length}/{MAX_REVIEW_CHARS}
          </span>
        </label>
      )}
    </BottomSheet>
  )
}

export default ReviewSheet
