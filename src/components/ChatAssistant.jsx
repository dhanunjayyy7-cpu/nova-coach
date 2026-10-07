import { useEffect, useRef, useState } from 'react'
import { CloseIcon, SendIcon, SparkleIcon } from './icons'
import { postAi } from '../utils/aiRequest'
import { getHistory } from '../utils/history'
import { verdictForScore } from '../utils/scoreLabels'

const SUGGESTIONS = [
  'Is this product safe for me?',
  'What does this additive do?',
  'Suggest a healthier alternative',
  'Explain this ingredient',
]

// Covers the server's 8s Gemini attempt plus time for the Vercel Groq fallback.
const CHAT_BUDGET_MS = 16000
const FALLBACK_REPLY = 'Sorry — I can’t reach my AI brain right now. Please try again in a moment.'

function buildContext(currentTab, currentProduct, blogTitle) {
  const recentScans = getHistory()
    .slice(0, 3)
    .map((r) => ({ name: r.productName.slice(0, 200), score: r.score, verdict: verdictForScore(r.score) }))
  return {
    tab: currentTab,
    ...(currentProduct && { product: currentProduct }),
    ...(recentScans.length > 0 && { recentScans }),
    ...(blogTitle && { blogTitle }),
  }
}

function emptyStateText(currentTab, currentProduct, blogTitle) {
  if (currentProduct) return `Ask about ${currentProduct.name}`
  if (blogTitle) return `Ask about “${blogTitle}” or anything food-related`
  if (currentTab === 'home') return 'Ask me anything about food or your scans'
  return 'Ask me about ingredients, additives or what fits your diet'
}

function ChatAssistant({ currentTab, currentProduct = null, blogTitle = null }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
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
  }, [messages, thinking])

  async function send(text) {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    const history = messages
      .filter((m) => !m.error)
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.text }))
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }])
    setDraft('')
    setThinking(true)

    const data = await postAi(
      'chat',
      { message: trimmed, context: buildContext(currentTab, currentProduct, blogTitle), history },
      CHAT_BUDGET_MS,
    )
    const reply = data?.reply?.trim()
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: 'assistant', text: reply || FALLBACK_REPLY, error: !reply },
    ])
    setThinking(false)
  }

  return (
    <>
      <button type="button" className="chat-fab" aria-label="Ask NOVA AI" onClick={() => setOpen(true)}>
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
              <button type="button" className="icon-button" aria-label="Close" onClick={() => setOpen(false)}>
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="chat-body" ref={listRef} aria-live="polite">
              {messages.length === 0 ? (
                <div className="chat-welcome">
                  <div className="chat-avatar">
                    <SparkleIcon size={34} />
                  </div>
                  <h3 className="chat-hello">Hi, I’m Nova!</h3>
                  <p className="chat-intro">{emptyStateText(currentTab, currentProduct, blogTitle)}</p>
                </div>
              ) : (
                <ul className="chat-messages">
                  {messages.map((m) => (
                    <li key={m.id} className={`bubble bubble-${m.role} ${m.error ? 'bubble-error' : ''}`}>
                      {m.text}
                    </li>
                  ))}
                  {thinking && <li className="bubble bubble-assistant bubble-thinking">Nova is thinking…</li>}
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
                placeholder={thinking ? 'Nova is thinking…' : 'Type here'}
                value={draft}
                maxLength={1000}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Message"
              />
              <button type="submit" className="chat-send" aria-label="Send" disabled={!draft.trim() || thinking}>
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
