import { BlogsIcon, HomeIcon, ProfileIcon, ScanIcon, ShelfIcon } from './icons'

const TABS = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'shelf', label: 'Shelf', Icon: ShelfIcon },
  { key: 'scan', label: 'Scan', Icon: ScanIcon, primary: true },
  { key: 'blogs', label: 'Blogs', Icon: BlogsIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
]

function BottomTabBar({ active, onChange }) {
  return (
    <nav className="tab-bar" aria-label="Main">
      {TABS.map(({ key, label, Icon, primary }) => {
        const isActive = active === key

        if (primary) {
          return (
            <button
              key={key}
              type="button"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`tab-scan ${isActive ? 'tab-scan-active' : ''}`}
              onClick={() => onChange(key)}
            >
              <Icon size={28} />
            </button>
          )
        }

        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`tab ${isActive ? 'tab-active' : ''}`}
            onClick={() => onChange(key)}
          >
            <Icon size={22} />
            {isActive && <span className="tab-label">{label}</span>}
          </button>
        )
      })}
    </nav>
  )
}

export default BottomTabBar
