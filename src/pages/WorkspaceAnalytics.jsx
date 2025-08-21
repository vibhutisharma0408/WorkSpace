import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { subscribeWorkspace } from '../data/workspaces'
import { subscribeWorkspaceTasks } from '../data/tasks'
import { subscribeWorkspaceDocuments } from '../data/documents'

export default function WorkspaceAnalytics() {
  const { id } = useParams()
  const [ws, setWs] = useState(null)
  const [tasks, setTasks] = useState([])
  const [docs, setDocs] = useState([])

  useEffect(() => {
    const u1 = subscribeWorkspace({ id, onChange: setWs })
    const u2 = subscribeWorkspaceTasks({ workspaceId: id, onChange: setTasks })
    const u3 = subscribeWorkspaceDocuments({ workspaceId: id, onChange: setDocs })
    return () => { u1 && u1(); u2 && u2(); u3 && u3() }
  }, [id])

  const doneCount = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks])

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Members</div>
          <div className="stat-value">{ws?.memberIds?.length || 0}</div>
          <div className="stat-desc">Roles: admin/member/viewer</div>
        </div>
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Tasks Done</div>
          <div className="stat-value">{doneCount}</div>
          <div className="stat-desc">{Math.round((doneCount/(tasks.length||1))*100)}% completion</div>
        </div>
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Documents</div>
          <div className="stat-value">{docs.length}</div>
          <div className="stat-desc">Workspace documents</div>
        </div>
      </div>
    </div>
  )
}


