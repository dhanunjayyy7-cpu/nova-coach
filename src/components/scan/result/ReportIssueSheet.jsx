import { useState } from 'react'
import BottomSheet from '../../BottomSheet'

const REASONS = ['Wrong product info', 'Incorrect score', 'Missing ingredients', 'Other']

function ReportIssueSheet({ productName, onSubmit, onClose }) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')

  return (
    <BottomSheet
      title="Report an issue"
      onClose={onClose}
      footer={
        <button
          type="button"
          className="primary-button"
          disabled={!reason}
          onClick={() => onSubmit({ productName, reason, details: details.trim() })}
        >
          Submit
        </button>
      }
    >
      <p className="sheet-hint">What’s wrong with “{productName}”?</p>
      <div className="report-options" role="radiogroup" aria-label="Issue type">
        {REASONS.map((r) => (
          <label key={r} className={`report-option ${reason === r ? 'report-option-on' : ''}`}>
            <input type="radio" name="report-reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
            <span>{r}</span>
          </label>
        ))}
      </div>
      <label className="review-field">
        <span className="visually-hidden">More details</span>
        <textarea
          value={details}
          maxLength={300}
          rows={3}
          placeholder="Anything else we should know? (optional)"
          onChange={(e) => setDetails(e.target.value)}
        />
      </label>
    </BottomSheet>
  )
}

export default ReportIssueSheet
