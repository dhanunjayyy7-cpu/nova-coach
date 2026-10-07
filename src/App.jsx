import { lazy, Suspense, useMemo, useState } from 'react'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import BottomTabBar from './components/BottomTabBar'
import ChatAssistant from './components/ChatAssistant'
import HomeTab from './components/tabs/HomeTab'
import ShelfTab from './components/tabs/ShelfTab'
import BlogsTab from './components/tabs/BlogsTab'
import ProfileTab from './components/tabs/ProfileTab'
import ScanDetail from './components/scan/ScanDetail'
import ArticleScreen from './components/blogs/ArticleScreen'
import { getBlogById } from './data/blogs'
import { isOnboarded, markOnboarded } from './utils/onboarding'
import { getScanById } from './utils/history'
import { toChatProduct } from './utils/chatContext'
import './App.css'

// Tesseract + html5-qrcode are heavy; only load them when Scan is opened.
const ScanTab = lazy(() => import('./components/tabs/ScanTab'))

const SCREENS = {
  home: HomeTab,
  shelf: ShelfTab,
  scan: ScanTab,
  blogs: BlogsTab,
  profile: ProfileTab,
}

const CHAT_TABS = new Set(['home', 'shelf', 'blogs'])

// Shared article links look like /?article=<id>.
function articleFromUrl() {
  const id = new URLSearchParams(window.location.search).get('article')
  if (!id) return null
  window.history.replaceState(null, '', window.location.pathname)
  return getBlogById(id) ? { kind: 'blog', id } : null
}

function App() {
  const [onboarded, setOnboarded] = useState(isOnboarded)
  const [initialDetail] = useState(articleFromUrl)
  const [tab, setTab] = useState(initialDetail ? 'blogs' : 'home')
  const [detail, setDetail] = useState(initialDetail) // { kind: 'scan' | 'blog', id } | null
  const [scanProduct, setScanProduct] = useState(null) // product on the Scan tab's result screen

  const nav = useMemo(() => {
    function show(nextDetail) {
      setDetail(nextDetail)
      window.scrollTo(0, 0)
    }
    return {
      goTab(t) {
        setTab(t)
        show(null)
      },
      openScan: (id) => show({ kind: 'scan', id }),
      openBlog: (id) => show({ kind: 'blog', id }),
      back: () => show(null),
    }
  }, [])

  function finishOnboarding() {
    markOnboarded()
    setOnboarded(true)
  }

  if (!onboarded) {
    return (
      <div className="app-frame">
        <OnboardingFlow onFinish={finishOnboarding} />
      </div>
    )
  }

  const Screen = SCREENS[tab]
  let content
  let chatProduct = null
  let blogTitle = null
  if (detail?.kind === 'scan') {
    content = <ScanDetail id={detail.id} onBack={nav.back} />
    chatProduct = toChatProduct(getScanById(detail.id))
  } else if (detail?.kind === 'blog') {
    content = <ArticleScreen id={detail.id} onBack={nav.back} />
    blogTitle = getBlogById(detail.id)?.title ?? null
  } else {
    content = <Screen nav={nav} onProductChange={setScanProduct} />
    if (tab === 'scan') chatProduct = scanProduct
  }
  // Chat shows on Home/Shelf/Blogs, and anywhere a product or article is open.
  const showChat = Boolean(detail) || CHAT_TABS.has(tab) || Boolean(chatProduct)

  return (
    <div className="app-frame">
      <main className="app-main" key={detail ? `${detail.kind}-${detail.id}` : tab}>
        <Suspense fallback={null}>{content}</Suspense>
      </main>
      {showChat && (
        <ChatAssistant
          key={detail ? `${detail.kind}-${detail.id}` : `${tab}-${chatProduct?.name ?? ''}`}
          currentTab={tab}
          currentProduct={chatProduct}
          blogTitle={blogTitle}
        />
      )}
      <BottomTabBar active={tab} onChange={nav.goTab} />
    </div>
  )
}

export default App
