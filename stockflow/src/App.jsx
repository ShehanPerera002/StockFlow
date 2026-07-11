import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ProductTable from './components/ProductTable'
import useLocalStorage from './hooks/useLocalStorage'
import { ACTIVE_PAGE_STORAGE_KEY, THEME_STORAGE_KEY } from './utils/inventory'
import './App.css'

function App() {
  const [activePage, setActivePage] = useLocalStorage(ACTIVE_PAGE_STORAGE_KEY, 'home')
  const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, 'light')
  const isDark = theme === 'dark'

  return (
    <div className={`app-shell${isDark ? ' theme-dark' : ''}`}>
      <Navbar
        activePage={activePage}
        isDark={isDark}
        onNavigate={setActivePage}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      />
      <main className="main-content">
        {activePage === 'home' && <Dashboard />}
        {activePage === 'products' && <ProductTable />}
      </main>
    </div>
  )
}

export default App
