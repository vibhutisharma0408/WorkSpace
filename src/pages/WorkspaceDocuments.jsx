import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { createDocument, subscribeWorkspaceDocuments } from '../data/documents'
import { subscribeWorkspaceFiles, uploadWorkspaceFile, deleteWorkspaceFile } from '../data/files'

export default function WorkspaceDocuments() {
  const { id } = useParams()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [docs, setDocs] = useState([])
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id) return
    const unsub = subscribeWorkspaceDocuments({ workspaceId: id, onChange: setDocs })
    const unsubFiles = subscribeWorkspaceFiles({ workspaceId: id, onChange: setFiles, onError: (e) => setError(e?.message || 'Failed to load files') })
    return () => { unsub && unsub(); unsubFiles && unsubFiles() }
  }, [id])

  const filtered = useMemo(() => docs.filter(d => (d.title || '').toLowerCase().includes(query.toLowerCase())), [docs, query])

  async function handleCreate() {
    const title = prompt('Document title?')
    if (!title || !user) return
    try {
      setCreating(true)
      const docId = await createDocument({ ownerId: user.uid, title, workspaceId: id })
      // Note: For simplicity we don’t store workspaceId; could add later
      location.assign(`/documents/${docId}`)
    } finally {
      setCreating(false)
    }
  }

  async function onUploadChange(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      await uploadWorkspaceFile({ workspaceId: id, file, userId: user.uid })
      setSuccess('File uploaded')
      setTimeout(() => setSuccess(''), 2000)
    } finally {
      setUploading(false)
      e.target.value = ''
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
            </div>
          </Link>
        ))}
      </div>

      <div className="divider mt-10">Files</div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h3 className="text-lg font-medium">Shared files</h3>
        <label className={`btn btn-sm ${uploading? 'btn-disabled': ''}`}>
          {uploading ? 'Uploading…' : 'Upload'}
          <input disabled={uploading} type="file" className="hidden" onChange={onUploadChange} />
        </label>
      </div>
      {error && <div className="alert alert-error text-sm mb-2">{error}</div>}
      {success && <div className="alert alert-success text-sm mb-2">{success}</div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.id} className="card bg-base-100 shadow">
            <div className="card-body">
              <a href={f.url} target="_blank" rel="noreferrer" className="card-title truncate" title={f.name}>{f.name}</a>
              <div className="text-xs opacity-70">{Math.round((f.size||0)/1024)} KB</div>
              {user && user.uid === f.uploadedBy && (
                <button className="btn btn-xs mt-2" onClick={() => deleteWorkspaceFile({ workspaceId: id, id: f.id })}>Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


