import { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ProductTable from './components/ProductTable'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('home')
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={`app-shell${isDark ? ' theme-dark' : ''}`}>
      <Navbar
        activePage={activePage}
        isDark={isDark}
        onNavigate={setActivePage}
        onToggleTheme={() => setIsDark((previousValue) => !previousValue)}
      />
      <main className="main-content">
        {activePage === 'home' && <Dashboard />}
        {activePage === 'products' && <ProductTable />}
      </main>
    </div>
  )
}

export default App
