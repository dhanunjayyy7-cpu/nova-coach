export const INSECURE_CAMERA_MESSAGE =
  'Camera needs a secure connection. Open the deployed HTTPS link.'

// Browsers hide navigator.mediaDevices entirely on insecure origins, so this
// must be checked before "is getUserMedia supported" or phones on a plain-http
// LAN URL get a misleading "unsupported browser" message.
export function cameraUnavailableReason() {
  if (!window.isSecureContext) {
    return { message: INSECURE_CAMERA_MESSAGE, retryable: false }
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return { message: 'This browser does not support camera access.', retryable: false }
  }
  return null
}

export function openRearCamera() {
  return navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false,
  })
}

export function stopStream(stream) {
  if (!stream) return
  for (const track of stream.getTracks()) {
    try {
      track.stop()
    } catch {
      // track already ended
    }
  }
}

// Explicitly requests camera permission and immediately releases the stream —
// for flows (the barcode scanner) that hand the camera to a third-party library.
export async function requestCameraPermission() {
  const unavailable = cameraUnavailableReason()
  if (unavailable) return { granted: false, error: null, ...unavailable }

  try {
    stopStream(await openRearCamera())
    return { granted: true }
  } catch (err) {
    return { granted: false, error: err, message: cameraErrorMessage(err), retryable: true }
  }
}

export function cameraErrorMessage(err) {
  const unavailable = cameraUnavailableReason()
  if (unavailable) return unavailable.message

  const name = err?.name || ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
    return 'Camera access was blocked. Allow the camera in your browser settings, then retry.'
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No camera found on this device.'
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Camera is already in use by another app. Close it and retry.'
  }
  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
    return 'No rear camera available on this device.'
  }
  return err?.message || 'Unable to access camera.'
}

export function isPermissionError(err) {
  const name = err?.name || ''
  return name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError'
}
