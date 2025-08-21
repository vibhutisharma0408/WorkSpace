import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { subscribeWorkspace, addMemberById } from '../data/workspaces'
import { useAuth } from '../auth/AuthContext'

export default function WorkspaceHub() {
  const { id } = useParams()
  const { user } = useAuth()
  const [ws, setWs] = useState(null)
  const [inviteUserId, setInviteUserId] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')
  const isAdmin = ws?.roles?.[user?.uid] === 'admin'

  useEffect(() => {
    const unsub = subscribeWorkspace({ id, onChange: setWs })
    return () => unsub && unsub()
  }, [id])

  async function handleInvite(e) {
    e.preventDefault()
    if (!inviteUserId) return
    setInviteError('')
    setInviteLoading(true)
    try {
      await addMemberById({ workspaceId: id, userId: inviteUserId, role: 'member' })
      setInviteUserId('')
      setInviteSuccess('Invitation sent')
      setTimeout(() => setInviteSuccess(''), 2000)
    } catch (err) {
      setInviteError(err?.message || 'Failed to invite')
    } finally {
      setInviteLoading(false)
    }
  }

  if (!ws) return <div className="card-centered"><span className="loading loading-spinner loading-lg" /></div>

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-semibold">{ws.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Link className="btn btn-sm" to={`/workspaces/${id}/documents`}>Documents</Link>
          <Link className="btn btn-sm" to={`/workspaces/${id}/chat`}>Chat</Link>
          <Link className="btn btn-sm" to={`/workspaces/${id}/tasks`}>Tasks</Link>
          <Link className="btn btn-sm" to={`/workspaces/${id}/analytics`}>Analytics</Link>
          <Link className="btn btn-sm" to={`/workspaces/${id}/meeting`}>Meeting</Link>
          <Link className="btn btn-sm" to={`/workspaces/${id}/search`}>Search</Link>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Members</h3>
            <div className="flex flex-wrap gap-2">
              {(ws.memberIds || []).map((uid) => (
                <div key={uid} className="badge">
                  {uid.slice(0,6)} • {ws.roles?.[uid]}
                </div>
              ))}
            </div>
            {isAdmin && (
              <>
                <form onSubmit={handleInvite} className="mt-3 flex gap-2">
                  <input className="input input-bordered flex-1" placeholder="Invite userId" value={inviteUserId} onChange={(e)=>setInviteUserId(e.target.value)} />
                  <button className="btn btn-primary" disabled={inviteLoading}>
                    {inviteLoading ? <span className="loading loading-spinner loading-sm" /> : 'Invite'}
                  </button>
                </form>
                {inviteError && <div className="alert alert-error text-xs mt-2">{inviteError}</div>}
                {inviteSuccess && <div className="alert alert-success text-xs mt-2">{inviteSuccess}</div>}
              </>
            )}
          </div>
        </div>

        <Link to={`/workspaces/${id}/documents`} className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Documents</h3>
            <p>Share and edit in real-time</p>
          </div>
        </Link>

        <Link to={`/workspaces/${id}/tasks`} className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Tasks</h3>
            <p>Kanban with due dates</p>
          </div>
        </Link>
      </div>
    </div>
  )
}


