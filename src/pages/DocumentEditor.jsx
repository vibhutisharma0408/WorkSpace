import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { subscribeDocument, updateDocumentContent, subscribeDocumentVersions, createDocumentVersion, subscribeDocumentComments, addDocumentComment, restoreDocumentVersion } from '../data/documents'
import { useAuth } from '../auth/AuthContext'

export default function DocumentEditor() {
  const { id } = useParams()
  const { user } = useAuth()
  const [docData, setDocData] = useState(null)
  const [versions, setVersions] = useState([])
  const [comments, setComments] = useState([])
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      if (id && user) {
        updateDocumentContent({ id, content: json, updatedBy: user.uid })
      }
    },
  })

  useEffect(() => {
    const unsub = subscribeDocument({ id, onChange: setDocData })
    return () => unsub && unsub()
  }, [id])

  useEffect(() => {
    if (!editor || !docData) return
    if (docData.content) editor.commands.setContent(docData.content)
  }, [editor, docData])

  useEffect(() => {
    const unsubV = subscribeDocumentVersions({ id, onChange: setVersions })
    const unsubC = subscribeDocumentComments({ id, onChange: setComments })
    return () => { unsubV && unsubV(); unsubC && unsubC() }
  }, [id])

  const selectedText = useMemo(() => {
    try {
      const sel = window.getSelection()
      return sel && sel.toString().trim() ? sel.toString().trim() : ''
    } catch (_) { return '' }
  }, [docData, editor])

  if (!docData) return <div className="card-centered"><span className="loading loading-spinner loading-lg" /></div>

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{docData.title || 'Untitled'}</h2>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => editor && createDocumentVersion({ id, contentSnapshot: editor.getJSON(), createdBy: user?.uid })}>Save version</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 prose max-w-none bg-base-100 rounded-xl shadow p-4">
          <EditorContent editor={editor} />
        </div>
        <div className="space-y-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Versions</h3>
              <div className="space-y-2 max-h-48 overflow-auto">
                {versions.map(v => (
                  <div key={v.id} className="flex items-center justify-between text-sm">
                    <span>{new Date((v.createdAt?.seconds || 0) * 1000).toLocaleString()}</span>
                    <button className="btn btn-xs" onClick={() => restoreDocumentVersion({ id, version: v })}>Restore</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Comments</h3>
              <div className="space-y-2 max-h-48 overflow-auto">
                {comments.map(c => (
                  <div key={c.id} className="text-sm">
                    <span className="opacity-70 mr-2">{new Date((c.createdAt?.seconds || 0) * 1000).toLocaleTimeString()}:</span>
                    {c.selectionText && <span className="badge badge-ghost mr-2" title="Selection">{c.selectionText.slice(0,30)}</span>}
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.elements.namedItem('comment'); const text = input.value.trim(); if (text) { addDocumentComment({ id, text, authorId: user?.uid, selectionText: selectedText || null }); input.value=''; } }} className="mt-2 flex gap-2">
                <input name="comment" className="input input-bordered flex-1" placeholder={selectedText ? `Comment on: ${selectedText.slice(0,30)}…` : 'Add a comment'} />
                <button className="btn btn-primary btn-sm">Add</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


