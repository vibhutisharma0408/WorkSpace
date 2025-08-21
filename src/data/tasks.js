import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'

export function subscribeWorkspaceTasks({ workspaceId, onChange }) {
  const tasksCol = collection(doc(db, 'workspaces', workspaceId), 'tasks')
  const q = query(tasksCol, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(items)
  })
}

export async function createWorkspaceTask({ workspaceId, title, status = 'todo', dueDate = null, assigneeId = null }) {
  const tasksCol = collection(doc(db, 'workspaces', workspaceId), 'tasks')
  await addDoc(tasksCol, { title, status, dueDate, assigneeId, createdAt: serverTimestamp() })
}

export async function updateWorkspaceTask({ workspaceId, id, data }) {
  const taskRef = doc(db, 'workspaces', workspaceId, 'tasks', id)
  await updateDoc(taskRef, data)
}



