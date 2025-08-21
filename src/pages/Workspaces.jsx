import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link } from 'react-router-dom'
import { createWorkspace, subscribeUserWorkspaces } from '../data/workspaces'

function WorkspaceCard({ workspace }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">{workspace.name}</h3>
        <p className="text-sm opacity-80">Role: {workspace.role}</p>
        <div className="card-actions justify-end">
          <Link className="btn btn-sm" to={`/workspaces/${workspace.id}`}>Open</Link>
        </div>
      </div>
    </div>
  )
}

export default function Workspaces() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [workspaces, setWorkspaces] = useState([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeUserWorkspaces({ userId: user.uid, onChange: setWorkspaces })
    return () => unsub && unsub()
  }, [user])

  const filtered = useMemo(() => workspaces.filter(w => w.name.toLowerCase().includes(query.toLowerCase())), [query, workspaces])

  async function handleCreateWorkspace() {
    const name = prompt('Workspace name?')
    if (!name || !user) return
    try {
      setCreating(true)
      await createWorkspace({ ownerId: user.uid, name })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h2 className="text-2xl font-semibold">Your Workspaces</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input className="input input-bordered w-full sm:w-64" placeholder="Search workspaces" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button className="btn btn-primary sm:w-auto" onClick={handleCreateWorkspace} disabled={creating}>
            {creating ? <span className="loading loading-spinner loading-sm" /> : 'New'}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map(ws => <WorkspaceCard key={ws.id} workspace={{...ws, role: ws.roles?.[user?.uid] || 'member'}} />)}
      </div>

      <div className="mt-10 text-sm opacity-70">
        Signed in as <span className="font-medium">{user?.displayName || user?.email}</span>
      </div>
    </div>
  )
}


