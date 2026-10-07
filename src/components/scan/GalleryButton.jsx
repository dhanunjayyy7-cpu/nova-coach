import { useRef } from 'react'

function GalleryButton({ onPick, disabled }) {
  const inputRef = useRef(null)

  return (
    <>
      <button
        type="button"
        className="gallery-btn"
        aria-label="Upload from gallery"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="m20.5 16-4.5-4.5L7 19.5" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = '' // allow picking the same file again
          if (file) onPick(file)
        }}
      />
    </>
  )
}

export default GalleryButton
