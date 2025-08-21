import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

export default function WorkspaceMeeting() {
  const { id } = useParams()
  const room = useMemo(() => `teamspace-${id}`, [id])
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Meeting</h2>
      <div className="alert">
        <span>Embedded Jitsi Meet room. Use headphones; screen share available from controls.</span>
      </div>
      <div className="bg-base-100 rounded-xl shadow overflow-hidden">
        <iframe
          title="Jitsi Meet"
          className="w-full"
          style={{ height: '70vh', border: '0' }}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          src={`https://meet.jit.si/${encodeURIComponent(room)}`}
        />
      </div>
    </div>
  )
}


