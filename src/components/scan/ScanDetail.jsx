import { useState } from 'react'
import ScanResult from './ScanResult'
import { getScanById } from '../../utils/history'

function ScanDetail({ id, onBack }) {
  const [record] = useState(() => getScanById(id))

  if (!record) {
    return (
      <div className="tab-screen">
        <button type="button" className="text-button detail-back" onClick={onBack}>
          ← Back
        </button>
        <div className="empty-state">
          <h2 className="empty-title">Scan not found</h2>
          <p className="empty-text">It may have been cleared from this phone.</p>
        </div>
      </div>
    )
  }

  return (
    <ScanResult
      result={record}
      scanId={record.id}
      onBack={onBack}
      backLabel="Back"
      autoSpeak={false}
    />
  )
}

export default ScanDetail
