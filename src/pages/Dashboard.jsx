import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const trackRef = useRef(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let i = 0
    const cards = Array.from(el.querySelectorAll('[data-card]'))
    const step = () => {
      if (!el) return
      i = (i + 1) % cards.length
      const width = cards[0]?.getBoundingClientRect().width || 0
      el.scrollTo({ left: i * (width + 16), behavior: 'smooth' })
    }
    const id = setInterval(step, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="navbar bg-base-100 rounded-xl shadow-sm">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl">TeamSpace</span>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="avatar" src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.displayName || user?.email || 'User')}`} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><span>{user?.displayName || user?.email}</span></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navy slider */}
      <div className="mt-6 rounded-2xl bg-[#0a1438] text-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Quick Access</h2>
          <div className="text-xs opacity-70">Swipe →</div>
        </div>
        <div className="relative">
          <div ref={trackRef} className="hide-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth">
            <Link data-card to="/documents" className="min-w-[260px] snap-start">
              <div className="card bg-[#112055] hover:bg-[#142a6b] transition">
                <div className="card-body">
                  <h3 className="card-title">Documents</h3>
                  <p className="opacity-80">Real-time editor, versions and comments.</p>
                </div>
              </div>
            </Link>
            <Link data-card to="/workspaces" className="min-w-[260px] snap-start">
              <div className="card bg-[#112055] hover:bg-[#142a6b] transition">
                <div className="card-body">
                  <h3 className="card-title">Workspaces</h3>
                  <p className="opacity-80">Create, manage and invite teammates.</p>
                </div>
              </div>
            </Link>
            <Link data-card to="/workspaces" className="min-w-[260px] snap-start">
              <div className="card bg-[#112055] hover:bg-[#142a6b] transition">
                <div className="card-body">
                  <h3 className="card-title">Chat</h3>
                  <p className="opacity-80">Channels and mentions per workspace.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sample Workspaces */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Sample Workspaces</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{name:'Design Team'},{name:'Engineering Hub'},{name:'Marketing Sprint'}].map((w) => (
            <Link key={w.name} to="/workspaces" className="card bg-base-100 shadow hover:shadow-md">
              <div className="card-body">
                <h4 className="card-title">{w.name}</h4>
                <p className="text-sm opacity-70">Explore tasks, docs and chat</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


