// LocalStorage-backed file store per workspace
// Keys are scoped by workspace: ts_files_{workspaceId}

function getFilesKey(workspaceId) {
  return `ts_files_${workspaceId}`
}

function readFiles(workspaceId) {
  try {
    const raw = localStorage.getItem(getFilesKey(workspaceId))
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (_) {
    return []
  }
}

function writeFiles(workspaceId, files) {
  localStorage.setItem(getFilesKey(workspaceId), JSON.stringify(files))
}

function notifyChange(workspaceId) {
  // Notify same-tab listeners
  const evt = new CustomEvent(`ts_files_change_${workspaceId}`)
  window.dispatchEvent(evt)
}

export function subscribeWorkspaceFiles({ workspaceId, onChange, onError }) {
  try {
    onChange(readFiles(workspaceId))
  } catch (err) {
    if (onError) onError(err)
  }

  function handleCustom() {
    onChange(readFiles(workspaceId))
  }
  function handleStorage(e) {
    if (e.key === getFilesKey(workspaceId)) {
      onChange(readFiles(workspaceId))
    }
  }
  window.addEventListener(`ts_files_change_${workspaceId}`, handleCustom)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(`ts_files_change_${workspaceId}`, handleCustom)
    window.removeEventListener('storage', handleStorage)
  }
}

export async function uploadWorkspaceFile({ workspaceId, file, userId }) {
  // Convert file to Data URL for local storage
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })

  const current = readFiles(workspaceId)
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const item = {
    id,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    url: dataUrl,
    uploadedBy: userId || null,
    createdAt: Date.now(),
  }
  try {
    writeFiles(workspaceId, [item, ...current])
  } catch (err) {
    // Most likely quota exceeded
    throw new Error('Storage full. Try a smaller file or clear browser storage.')
  }
  notifyChange(workspaceId)
  return id
}

export async function deleteWorkspaceFile({ workspaceId, id }) {
  if (!id) return
  const current = readFiles(workspaceId)
  const next = current.filter((f) => f.id !== id)
  writeFiles(workspaceId, next)
  notifyChange(workspaceId)
}


