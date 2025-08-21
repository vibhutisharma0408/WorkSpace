import { useEffect, useState } from 'react'

const THEMES = ['light', 'dark', 'cupcake']

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ts-theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ts-theme', theme)
  }, [theme])

  return (
    <div className="join">
      {THEMES.map((t) => (
        <button
          key={t}
          className={`btn btn-xs join-item ${theme === t ? 'btn-active' : ''}`}
          onClick={() => setTheme(t)}
          aria-label={`Use ${t} theme`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}


