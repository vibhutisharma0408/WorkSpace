import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { subscribeWorkspaceTasks, createWorkspaceTask, updateWorkspaceTask } from '../data/tasks'
import { useAuth } from '../auth/AuthContext'

export default function WorkspaceTasks() {
  const { id } = useParams()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const unsub = subscribeWorkspaceTasks({ workspaceId: id, onChange: setTasks })
    return () => unsub && unsub()
  }, [id])

  const columns = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo'),
    doing: tasks.filter(t => t.status === 'doing'),
    done: tasks.filter(t => t.status === 'done'),
  }), [tasks])

  async function addTask() {
    if (!title.trim()) return
    await createWorkspaceTask({ workspaceId: id, title: title.trim(), status: 'todo', dueDate: dueDate || null, assigneeId: user?.uid || null })
    setTitle('')
    setDescription('')
    setDueDate('')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input className="input input-bordered w-full sm:w-56" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input className="input input-bordered w-full sm:w-40" type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} />
          <button className="btn btn-primary sm:w-auto" onClick={addTask}>Add</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([col, items]) => (
          <div key={col} className="bg-base-100 rounded-xl shadow p-3">
            <h3 className="font-medium capitalize mb-2">{col}</h3>
            <div className="space-y-2">
              {items.map(t => (
                <div key={t.id} className="card bg-base-200">
                  <div className="card-body py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs opacity-70">{t.dueDate ? `Due: ${t.dueDate}` : ''}</div>
                    </div>
                    <div className="join">
                      {['todo','doing','done'].map(s => (
                        <button key={s} className={`btn btn-xs join-item ${t.status===s?'btn-active':''}`} onClick={() => updateWorkspaceTask({ workspaceId: id, id: t.id, data: { status: s } })}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


