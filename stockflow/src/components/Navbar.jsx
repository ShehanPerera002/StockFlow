import logo from '../assets/logo.webp'
import './Navbar.css'

function Navbar({ isDark, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="brand">
        <img src={logo} alt="StockFlow logo" className="brand-logo" />
        <span className="brand-title">StockFlow</span>
      </div>

      <button
        type="button"
        className="theme-switch"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
        aria-pressed={isDark}
      >
        <span className="switch-track">
          <span className="switch-thumb">
            <span className="switch-icon sun-icon">☀</span>
            <span className="switch-icon moon-icon">☾</span>
          </span>
        </span>
      </button>
    </header>
  )
}

export default Navbar
