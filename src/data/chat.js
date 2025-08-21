import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../auth/firebase'

export function subscribeWorkspaceMessages({ workspaceId, onChange, onError }) {
  const messagesCol = collection(doc(db, 'workspaces', workspaceId), 'messages')
  const q = query(messagesCol, orderBy('createdAt'))
  const unsub = onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      onChange(items)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
  return unsub
}

export async function sendWorkspaceMessage({ workspaceId, userId, text, channel = 'general' }) {
  const messagesCol = collection(doc(db, 'workspaces', workspaceId), 'messages')
  await addDoc(messagesCol, {
    userId,
    text,
    channel,
    createdAt: serverTimestamp(),
  })
}



