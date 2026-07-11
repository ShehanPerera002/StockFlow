import logo from '../assets/logo.webp'
import './Navbar.css'

function Navbar({ activePage, isDark, onNavigate, onToggleTheme }) {
  return (
    <header className="app-header">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        <img src={logo} alt="StockFlow logo" className="brand-logo" />
        <span className="brand-title">StockFlow</span>
      </button>

      <nav className="main-nav" aria-label="Primary navigation">
        <button
          type="button"
          className={activePage === 'home' ? 'active' : ''}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={activePage === 'products' ? 'active' : ''}
          onClick={() => onNavigate('products')}
        >
          Products
        </button>
      </nav>

      <button
        type="button"
        className="theme-switch"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
      >
        <span className="switch-track">
          <span className="switch-thumb">
            <span className="switch-icon sun-icon">L</span>
            <span className="switch-icon moon-icon">D</span>
          </span>
        </span>
      </button>
    </header>
  )
}

export default Navbar
