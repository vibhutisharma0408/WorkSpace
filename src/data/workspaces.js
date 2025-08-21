import { collection, addDoc, serverTimestamp, onSnapshot, query, where, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../auth/firebase'

const WORKSPACES = 'workspaces'

export async function createWorkspace({ ownerId, name }) {
  if (!ownerId) throw new Error('ownerId required')
  if (!name || !name.trim()) throw new Error('Workspace name required')
  const docRef = await addDoc(collection(db, WORKSPACES), {
    name: name.trim(),
    ownerId,
    memberIds: [ownerId],
    roles: { [ownerId]: 'admin' },
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export function subscribeUserWorkspaces({ userId, onChange }) {
  if (!userId) throw new Error('userId required')
  const q = query(collection(db, WORKSPACES), where('memberIds', 'array-contains', userId))
  const unsubscribe = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(items)
  })
  return unsubscribe
}

export async function getWorkspace(id) {
  const ref = doc(db, WORKSPACES, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function subscribeWorkspace({ id, onChange }) {
  const ref = doc(db, WORKSPACES, id)
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return onChange(null)
    onChange({ id: snap.id, ...snap.data() })
  })
}

export async function addMemberById({ workspaceId, userId, role = 'member' }) {
  const ref = doc(db, WORKSPACES, workspaceId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Workspace not found')
  const data = snap.data()
  const roles = { ...(data.roles || {}), [userId]: role }
  await updateDoc(ref, { memberIds: arrayUnion(userId), roles })
}


