import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { createDocument, subscribeUserDocuments } from '../data/documents'
import { Link } from 'react-router-dom'

export default function Documents() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [docs, setDocs] = useState([])

  useEffect(() => {
    if (!user) return
    const unsub = subscribeUserDocuments({ userId: user.uid, onChange: setDocs })
    return () => unsub && unsub()
  }, [user])

  const filtered = useMemo(() => docs.filter(d => (d.title || '').toLowerCase().includes(query.toLowerCase())), [docs, query])

  async function handleCreate() {
    const title = prompt('Document title?')
    if (!title || !user) return
    try {
      setCreating(true)
      await createDocument({ ownerId: user.uid, title })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h2 className="text-2xl font-semibold">Documents</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input className="input input-bordered w-full sm:w-64" placeholder="Search" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button className="btn btn-primary sm:w-auto" onClick={handleCreate} disabled={creating}>
            {creating ? <span className="loading loading-spinner loading-sm" /> : 'New'}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map(d => (
          <Link to={`/documents/${d.id}`} key={d.id} className="card bg-base-100 shadow hover:shadow-md">
            <div className="card-body">
              <h3 className="card-title">{d.title || 'Untitled'}</h3>
              <p className="text-sm opacity-70">Last updated</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


