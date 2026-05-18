const HISTORY_KEY = 'threatscan_history'
const MAX_HISTORY = 20

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveToHistory(entry) {
  try {
    const history = loadHistory()
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    }
    const updated = [newEntry, ...history].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

export function deleteFromHistory(id) {
  try {
    const history = loadHistory().filter((e) => e.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return history
  } catch {
    return []
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {}
}
