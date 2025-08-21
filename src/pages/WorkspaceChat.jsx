import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { subscribeWorkspaceMessages, sendWorkspaceMessage } from '../data/chat'
import { useAuth } from '../auth/AuthContext'

export default function WorkspaceChat() {
  const { id } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [channel, setChannel] = useState('general')
  const [error, setError] = useState('')
  const scrollerRef = useRef(null)

  useEffect(() => {
    const unsub = subscribeWorkspaceMessages({ workspaceId: id, onChange: setMessages, onError: (e) => setError(e?.message || 'Failed to load messages') })
    return () => unsub && unsub()
  }, [id])

  async function onSend(e) {
    e.preventDefault()
    if (!text.trim() || !user) return
    setError('')
    try {
      await sendWorkspaceMessage({ workspaceId: id, userId: user.uid, text: text.trim(), channel })
      setText('')
    } catch (err) {
      setError(err?.message || 'Failed to send')
    }
  }

  const filtered = useMemo(() => messages.filter(m => (m.channel || 'general') === channel), [messages, channel])

  function renderText(t) {
    const parts = t.split(/(@\w+)/g)
    return parts.map((p, idx) => p.startsWith('@') ? <span key={idx} className="text-primary font-medium">{p}</span> : <span key={idx}>{p}</span>)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [filtered])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Chat</h2>
        {/* Desktop/tablet channel tabs */}
        <div className="hidden sm:flex join">
          {['general','dev','design'].map(c => (
            <button key={c} className={`btn btn-sm join-item ${channel===c?'btn-active':''}`} onClick={()=>setChannel(c)}>#{c}</button>
          ))}
        </div>
        {/* Mobile channel buttons */}
        <div className="flex sm:hidden gap-2">
          {['general','dev','design'].map(c => (
            <button key={c} className={`btn btn-xs ${channel===c?'btn-active':''}`} onClick={()=>setChannel(c)}>#{c}</button>
          ))}
        </div>
      </div>
      {error && <div className="alert alert-error text-sm mb-2">{error}</div>}
      <div ref={scrollerRef} className="bg-base-100 rounded-xl shadow p-4 h-[60vh] overflow-y-auto">
        {filtered.map(m => (
          <div key={m.id} className="mb-3">
            <span className="font-medium mr-2">{m.userId?.slice(0,6) || 'user'}</span>
            <span>{renderText(m.text)}</span>
          </div>
        ))}
      </div>
      <form onSubmit={onSend} className="mt-3 flex flex-col sm:flex-row gap-2">
        <input className="input input-bordered flex-1 w-full" placeholder={`Message #${channel}`} value={text} onChange={(e)=>setText(e.target.value)} />
        <button className="btn btn-primary sm:w-auto">Send</button>
      </form>
    </div>
  )
}


