import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { analyzeIngredients } from '../../utils/ingredientAnalysis'
import { getProfile } from '../../utils/profile'
import {
  cameraErrorMessage,
  cameraUnavailableReason,
  requestCameraPermission,
  stopStream,
} from '../../utils/camera'
import CameraError from './CameraError'

const READER_ID = 'nova-barcode-reader'

const FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
]

// html5-qrcode's stop() can throw partway if React has already removed its
// container, leaving the camera on — so release the tracks ourselves first.
async function stopScanner(scanner, container) {
  stopStream(container?.querySelector('video')?.srcObject)
  if (!scanner) return
  try {
    if (scanner.isScanning) await scanner.stop()
    scanner.clear()
  } catch {
    // already stopped or cleared
  }
}

async function lookUpProduct(code) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`,
  )
  const data = await response.json()
  return data.status === 1 ? data.product : null
}

function BarcodeScanner({ onResult, onSwitchToLabel }) {
  const scannerRef = useRef(null)
  const onResultRef = useRef(onResult)
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  const [unavailable] = useState(cameraUnavailableReason)
  const [cameraError, setCameraError] = useState(null)
  // starting | scanning | looking-up | not-found | no-ingredients | lookup-error
  const [phase, setPhase] = useState('starting')
  const [barcode, setBarcode] = useState('')
  const [productName, setProductName] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    if (unavailable) return
    let cancelled = false
    let handled = false
    const container = document.getElementById(READER_ID)

    async function handleDetected(code) {
      if (handled || cancelled) return
      handled = true
      setBarcode(code)
      setPhase('looking-up')
      await stopScanner(scannerRef.current, container)

      let product
      try {
        product = await lookUpProduct(code)
      } catch (err) {
        console.error('Open Food Facts lookup error:', err)
        if (!cancelled) setPhase('lookup-error')
        return
      }
      if (cancelled) return

      if (!product) {
        setPhase('not-found')
        return
      }

      const ingredientsText = product.ingredients_text_en || product.ingredients_text
      if (!ingredientsText) {
        setProductName(product.product_name || 'This product')
        setPhase('no-ingredients')
        return
      }

      onResultRef.current({
        type: 'barcode',
        productName: product.product_name || 'Unnamed product',
        brand: product.brands || '',
        barcode: code,
        imageUrl: product.image_front_small_url || product.image_url || '',
        nutriments: product.nutriments || {},
        analysis: analyzeIngredients(ingredientsText, getProfile()),
        cleanedText: ingredientsText,
      })
    }

    async function start() {
      const permission = await requestCameraPermission()
      if (cancelled) return
      if (!permission.granted) {
        console.error('Barcode scanner permission error:', permission.error)
        setCameraError({ message: permission.message, retryable: permission.retryable })
        return
      }

      const scanner = new Html5Qrcode(READER_ID, { formatsToSupport: FORMATS, verbose: false })
      scannerRef.current = scanner
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (w, h) => ({
              width: Math.round(Math.min(w * 0.8, 320)),
              height: Math.round(Math.min(h * 0.4, 170)),
            }),
          },
          handleDetected,
          () => {},
        )
        // Unmounted while the camera was still starting — release it now.
        if (cancelled) {
          await stopScanner(scanner, container)
          return
        }
        setPhase('scanning')
      } catch (err) {
        console.error('Barcode scanner start error:', err)
        if (!cancelled) setCameraError({ message: cameraErrorMessage(err), retryable: true })
      }
    }

    start()

    return () => {
      cancelled = true
      stopScanner(scannerRef.current, container)
      scannerRef.current = null
    }
  }, [retryToken, unavailable])

  function restart() {
    setCameraError(null)
    setBarcode('')
    setProductName('')
    setPhase('starting')
    setRetryToken((n) => n + 1)
  }

  const error = unavailable ?? cameraError
  const stopped = ['not-found', 'no-ingredients', 'lookup-error'].includes(phase)

  return (
    <>
      <div className="camera-card">
        {error ? (
          <CameraError
            title="Scanner unavailable"
            message={error.message}
            retryable={error.retryable}
            onRetry={restart}
          />
        ) : (
          <div id={READER_ID} className="barcode-reader" />
        )}

        {!error && phase === 'starting' && (
          <div className="camera-overlay">
            <div className="spinner" />
            <p>Starting camera…</p>
          </div>
        )}

        {!error && phase === 'scanning' && (
          <p className="camera-hint">Line up the barcode inside the box</p>
        )}

        {phase === 'looking-up' && (
          <div className="camera-overlay">
            <div className="spinner" />
            <p>Looking up {barcode}…</p>
          </div>
        )}

        {stopped && (
          <div className="camera-overlay camera-overlay-solid">
            <p className="overlay-title">
              {phase === 'not-found' && 'Product not found'}
              {phase === 'no-ingredients' && 'No ingredient list'}
              {phase === 'lookup-error' && 'Couldn’t look it up'}
            </p>
            <p className="overlay-text">
              {phase === 'not-found' &&
                `We don’t have ${barcode} yet. Scan its ingredient list instead.`}
              {phase === 'no-ingredients' &&
                `${productName} has no ingredients on record. Scan the label instead.`}
              {phase === 'lookup-error' && 'Check your connection and try again.'}
            </p>
            <div className="overlay-actions">
              {phase !== 'lookup-error' && (
                <button type="button" className="overlay-primary" onClick={onSwitchToLabel}>
                  Scan ingredients
                </button>
              )}
              <button type="button" className="overlay-secondary" onClick={restart}>
                {phase === 'lookup-error' ? 'Try again' : 'Scan another barcode'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="scan-footnote">Scanning starts automatically — no need to tap.</p>
    </>
  )
}

export default BarcodeScanner
