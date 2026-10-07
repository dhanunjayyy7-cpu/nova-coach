function CameraError({ title = 'Camera unavailable', message, retryable, onRetry }) {
  return (
    <div className="camera-error" role="alert">
      <div className="camera-error-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h2.2l1.6-2h7.4l1.6 2h2.2A1.5 1.5 0 0 1 21 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-10Z" />
          <path d="M4 4l16 16" />
        </svg>
      </div>
      <p className="camera-error-title">{title}</p>
      <p className="camera-error-text">{message}</p>
      {retryable && (
        <button type="button" className="camera-retry" onClick={onRetry}>
          Retry camera
        </button>
      )}
    </div>
  )
}

export default CameraError
