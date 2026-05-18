import { useState } from 'react'
import { clearHistory, deleteFromHistory } from '../utils/storage'
import { getScoreLevel } from '../utils/constants'
import styles from './ScanHistory.module.css'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ScanHistory({ history, setHistory, onRestore }) {
  const [open, setOpen] = useState(false)

  const handleDelete = (id, e) => {
    e.stopPropagation()
    setHistory(deleteFromHistory(id))
  }

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <>
      <button className={styles.trigger} onClick={() => setOpen(true)} aria-label="Open scan history">
        <i className="ti ti-history" aria-hidden="true" />
        History
        {history.length > 0 && <span className={styles.badge}>{history.length}</span>}
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} role="dialog" aria-label="Scan history">
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>
                <i className="ti ti-history" aria-hidden="true" />
                Scan history
              </h2>
              <div className={styles.drawerActions}>
                {history.length > 0 && (
                  <button className={styles.clearBtn} onClick={handleClear}>Clear all</button>
                )}
                <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className={styles.empty}>
                <i className="ti ti-inbox" aria-hidden="true" />
                <p>No scans yet. Results will appear here after each analysis.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {history.map((entry) => {
                  const level = getScoreLevel(entry.result?.score || 0)
                  const input = entry.input || ''
                  const preview = input.substring(0, 80).replace(/\n/g, ' ')
                  return (
                    <div key={entry.id} className={styles.item} onClick={() => { onRestore(entry); setOpen(false) }}>
                      <div className={styles.itemLeft}>
                        <div className={styles.itemScore} style={{ color: level.color, borderColor: `${level.color}33` }}>
                          {entry.result?.score ?? '?'}
                        </div>
                      </div>
                      <div className={styles.itemBody}>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemVerdict} style={{ color: level.color }}>
                            {entry.result?.verdict}
                          </span>
                          <span className={styles.itemType}>
                            <i className={`ti ${entry.type === 'email' ? 'ti-mail' : 'ti-link'}`} aria-hidden="true" />
                            {entry.type}
                          </span>
                          <span className={styles.itemTime}>{timeAgo(entry.timestamp)}</span>
                        </div>
                        <p className={styles.itemPreview}>{preview || '—'}</p>
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => handleDelete(entry.id, e)}
                        aria-label="Delete this scan"
                      >
                        <i className="ti ti-trash" aria-hidden="true" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
