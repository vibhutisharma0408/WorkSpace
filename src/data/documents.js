import { collection, addDoc, serverTimestamp, onSnapshot, query, where, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'

const DOCUMENTS = 'documents'

export async function createDocument({ ownerId, title, workspaceId = null }) {
  if (!ownerId) throw new Error('ownerId required')
  const docRef = await addDoc(collection(db, DOCUMENTS), {
    title: title?.trim() || 'Untitled',
    ownerId,
    editorIds: [ownerId],
    workspaceId,
    content: null, // TipTap JSON
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export function subscribeUserDocuments({ userId, onChange }) {
  if (!userId) throw new Error('userId required')
  const q = query(collection(db, DOCUMENTS), where('editorIds', 'array-contains', userId))
  const unsubscribe = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(items)
  })
  return unsubscribe
}

export function subscribeWorkspaceDocuments({ workspaceId, onChange }) {
  const q = query(collection(db, DOCUMENTS), where('workspaceId', '==', workspaceId))
  const unsubscribe = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(items)
  })
  return unsubscribe
}

export function subscribeDocument({ id, onChange }) {
  const ref = doc(db, DOCUMENTS, id)
  const unsubscribe = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return onChange(null)
    onChange({ id: snap.id, ...snap.data() })
  })
  return unsubscribe
}

export async function updateDocumentContent({ id, content, updatedBy }) {
  const ref = doc(db, DOCUMENTS, id)
  await updateDoc(ref, { content, updatedBy, updatedAt: serverTimestamp() })
}

// Versions
export async function createDocumentVersion({ id, contentSnapshot, createdBy }) {
  const versionsCol = collection(doc(db, DOCUMENTS, id), 'versions')
  await addDoc(versionsCol, { content: contentSnapshot || null, createdAt: serverTimestamp(), createdBy })
}

export function subscribeDocumentVersions({ id, onChange }) {
  const versionsCol = collection(doc(db, DOCUMENTS, id), 'versions')
  const unsubscribe = onSnapshot(versionsCol, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    // sort newest first (client side)
    items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    onChange(items)
  })
  return unsubscribe
}

export async function restoreDocumentVersion({ id, version }) {
  const ref = doc(db, DOCUMENTS, id)
  await updateDoc(ref, { content: version.content, updatedAt: serverTimestamp() })
}

// Comments
export async function addDocumentComment({ id, text, authorId, selectionText = null }) {
  const commentsCol = collection(doc(db, DOCUMENTS, id), 'comments')
  await addDoc(commentsCol, { text, authorId, selectionText, createdAt: serverTimestamp() })
}

export function subscribeDocumentComments({ id, onChange }) {
  const commentsCol = collection(doc(db, DOCUMENTS, id), 'comments')
  const unsubscribe = onSnapshot(commentsCol, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    items.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
    onChange(items)
  })
  return unsubscribe
}


