import { useEffect, useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'
import { analyzeIngredients } from '../../utils/ingredientAnalysis'
import { cleanIngredientsText } from '../../utils/cleanIngredients'
import { getProfile } from '../../utils/profile'
import {
  cameraErrorMessage,
  cameraUnavailableReason,
  openRearCamera,
  stopStream,
} from '../../utils/camera'
import CameraError from './CameraError'
import GalleryButton from './GalleryButton'
import { fileToCanvas } from './galleryImage'

function LabelScanner({ onResult }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const mountedRef = useRef(true)

  const [unavailable] = useState(cameraUnavailableReason)
  const [cameraError, setCameraError] = useState(null)
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | reading | cleaning | failed
  const [progress, setProgress] = useState(0)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (unavailable) return
    let cancelled = false
    const video = videoRef.current

    openRearCamera()
      .then((stream) => {
        if (cancelled) {
          stopStream(stream)
          return
        }
        streamRef.current = stream
        if (video) {
          video.srcObject = stream
          video.play().catch(() => {})
        }
        setReady(true)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Label scanner camera error:', err)
        setCameraError({ message: cameraErrorMessage(err), retryable: true })
      })

    return () => {
      cancelled = true
      stopStream(streamRef.current)
      streamRef.current = null
      if (video) video.srcObject = null
    }
  }, [retryToken, unavailable])

  function retryCamera() {
    setCameraError(null)
    setReady(false)
    setRetryToken((n) => n + 1)
  }

  const busy = phase === 'reading' || phase === 'cleaning'

  function capture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!ready || !video?.videoWidth || busy) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    runPipeline(canvas)
  }

  async function scanGalleryImage(file) {
    if (busy) return
    setPhase('reading')
    setProgress(0)
    let canvas
    try {
      canvas = await fileToCanvas(file)
    } catch (err) {
      console.error('Gallery image error:', err)
      if (mountedRef.current) setPhase('failed')
      return
    }
    runPipeline(canvas)
  }

  // OCR → AI clean-up → local scoring, for a camera frame or a gallery photo.
  async function runPipeline(source) {
    setPhase('reading')
    setProgress(0)

    let rawText = ''
    let worker
    try {
      worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && mountedRef.current) {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })
      const { data } = await worker.recognize(source)
      rawText = data.text.trim()
    } catch (err) {
      console.error('OCR error:', err)
    } finally {
      await worker?.terminate().catch(() => {})
    }

    if (!mountedRef.current) return
    if (!rawText) {
      setPhase('failed')
      return
    }

    setPhase('cleaning')
    const cleanedText = await cleanIngredientsText(rawText)
    if (!mountedRef.current) return

    const analysis = analyzeIngredients(cleanedText, getProfile())
    if (analysis.ingredients.length === 0) {
      setPhase('failed')
      return
    }

    onResult({
      type: 'label',
      productName: 'Label scan',
      analysis,
      rawText,
      cleanedText,
    })
  }

  const error = unavailable ?? cameraError

  return (
    <>
      <div className="camera-card">
        {error ? (
          <CameraError message={error.message} retryable={error.retryable} onRetry={retryCamera} />
        ) : (
          <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
        )}
        <canvas ref={canvasRef} hidden />

        {!error && !ready && (
          <div className="camera-overlay">
            <div className="spinner" />
            <p>Starting camera…</p>
          </div>
        )}

        {!error && ready && !busy && (
          <>
            <div className="viewfinder viewfinder-label" aria-hidden="true">
              <span /><span /><span /><span />
              <div className="viewfinder-line" />
            </div>
            <p className="camera-hint">
              {phase === 'failed'
                ? 'Couldn’t read that. Try closer, with better light.'
                : 'Fit the ingredient list inside the frame'}
            </p>
          </>
        )}

        {busy && (
          <div className="camera-overlay">
            <div className="spinner" />
            <p>{phase === 'reading' ? `Reading label… ${progress}%` : 'Analysing ingredients…'}</p>
          </div>
        )}

        {/* Works without a camera too — the only option when access is blocked. */}
        {!busy && <GalleryButton onPick={scanGalleryImage} />}
      </div>

      {error && phase === 'failed' && (
        <p className="scan-footnote scan-footnote-error">Couldn’t read that photo. Try a sharper, well-lit one.</p>
      )}
      {error && phase !== 'failed' && (
        <p className="scan-footnote">Or upload a photo of the ingredient list from your gallery.</p>
      )}

      <div className="shutter-row">
        <button
          type="button"
          className="shutter"
          aria-label="Capture ingredient label"
          onClick={capture}
          disabled={!!error || !ready || busy}
        >
          <span />
        </button>
      </div>
    </>
  )
}

export default LabelScanner
