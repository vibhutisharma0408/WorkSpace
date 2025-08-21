import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { subscribeWorkspaceDocuments } from '../data/documents'
import { subscribeWorkspaceTasks } from '../data/tasks'

export default function WorkspaceSearch() {
  const { id } = useParams()
  const [docs, setDocs] = useState([])
  const [tasks, setTasks] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    const u1 = subscribeWorkspaceDocuments({ workspaceId: id, onChange: setDocs })
    const u2 = subscribeWorkspaceTasks({ workspaceId: id, onChange: setTasks })
    return () => { u1 && u1(); u2 && u2() }
  }, [id])

  const docResults = useMemo(() => docs.filter(d => (d.title || '').toLowerCase().includes(q.toLowerCase())), [docs, q])
  const taskResults = useMemo(() => tasks.filter(t => (t.title || '').toLowerCase().includes(q.toLowerCase())), [tasks, q])

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold">Search</h2>
      <input className="input input-bordered w-full md:w-96 mt-3" placeholder="Find documents" value={q} onChange={(e)=>setQ(e.target.value)} />
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Documents</h3>
          <div className="space-y-2">
            {docResults.map(r => (
              <Link key={r.id} to={`/documents/${r.id}`} className="block link">
                {r.title || 'Untitled'}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Tasks</h3>
          <div className="space-y-2">
            {taskResults.map(t => (
              <div key={t.id} className="text-sm">
                <span className="badge mr-2">{t.status}</span>
                {t.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


