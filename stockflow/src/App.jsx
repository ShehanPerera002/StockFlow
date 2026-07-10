import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(true)

  const themeClassName = isDark ? 'theme-dark' : 'theme-light'
  const toggleTheme = () => setIsDark((previousValue) => !previousValue)

  return (
    <div className={`app-shell ${themeClassName}`}>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  )
}

export default App
