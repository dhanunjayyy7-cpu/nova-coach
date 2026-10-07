import { useEffect, useRef, useState } from 'react'
import { CloseIcon, SendIcon, SparkleIcon } from './icons'

const SUGGESTIONS = [
  'Is maltodextrin bad for me?',
  'Sugar-free sweetener alternatives?',
  'What does INS 621 mean?',
  'Healthy snacks for diabetics?',
]

const PLACEHOLDER_REPLY =
  "I'm still learning! AI answers are coming soon — for now, try scanning a product to see its score."

function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function send(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: trimmed },
      { id: Date.now() + 1, role: 'assistant', text: PLACEHOLDER_REPLY },
    ])
    setDraft('')
  }

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        aria-label="Ask NOVA AI"
        onClick={() => setOpen(true)}
      >
        <SparkleIcon size={26} />
      </button>

      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Ask AI"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" />
            <div className="sheet-header">
              <h2 className="sheet-title">Ask AI</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="chat-body" ref={listRef}>
              {messages.length === 0 ? (
                <div className="chat-welcome">
                  <div className="chat-avatar">
                    <SparkleIcon size={34} />
                  </div>
                  <h3 className="chat-hello">Hi there!</h3>
                  <p className="chat-intro">
                    I’m your NOVA assistant. Ask me about ingredients, additives or what fits your diet.
                  </p>
                </div>
              ) : (
                <ul className="chat-messages">
                  {messages.map((m) => (
                    <li key={m.id} className={`bubble bubble-${m.role}`}>
                      {m.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {messages.length === 0 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="suggestion" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              className="chat-input-row"
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
            >
              <input
                className="chat-input"
                type="text"
                placeholder="Type here"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Message"
              />
              <button
                type="submit"
                className="chat-send"
                aria-label="Send"
                disabled={!draft.trim()}
              >
                <SendIcon size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatAssistant
