import { useState } from 'react'
import { analyzeThreats } from '../utils/analyzeThreats'
import { getScoreLevel } from '../utils/constants'
import styles from './BatchScanner.module.css'

export default function BatchScanner() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const handleScan = async () => {
    const urls = input
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 10) // max 10

    if (!urls.length) return

    setScanning(true)
    setResults([])
    setProgress({ done: 0, total: urls.length })

    const out = []
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      try {
        const result = await analyzeThreats({ type: 'url', content: url })
        out.push({ url, result, error: null })
      } catch (e) {
        out.push({ url, result: null, error: e.message })
      }
      setProgress({ done: i + 1, total: urls.length })
      setResults([...out])
      // small delay to avoid rate limits
      if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 800))
    }

    setScanning(false)
  }

  const sortedResults = [...results].sort((a, b) => (b.result?.score || 0) - (a.result?.score || 0))

  return (
    <div className={styles.container}>
      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          placeholder={"Paste URLs to scan, one per line (max 10):\nhttps://example.com\nhttps://another.com"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={scanning}
          rows={6}
        />
        <div className={styles.footer}>
          <span className={styles.hint}>
            {input.split('\n').filter((l) => l.trim()).length} / 10 URLs
          </span>
          <button
            className={styles.scanBtn}
            onClick={handleScan}
            disabled={scanning || !input.trim()}
          >
            {scanning ? (
              <>
                <span className={styles.spinner} />
                Scanning {progress.done}/{progress.total}…
              </>
            ) : (
              <>
                <i className="ti ti-radar-2" aria-hidden="true" />
                Scan all URLs
              </>
            )}
          </button>
        </div>
      </div>

      {sortedResults.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <span>Results — sorted by threat score</span>
          </div>
          {sortedResults.map((r, i) => {
            if (r.error) {
              return (
                <div key={i} className={styles.row}>
                  <div className={styles.scoreBox} style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>—</div>
                  <div className={styles.rowBody}>
                    <span className={styles.rowUrl}>{r.url}</span>
                    <span className={styles.rowError}>{r.error}</span>
                  </div>
                </div>
              )
            }
            const level = getScoreLevel(r.result?.score || 0)
            return (
              <div key={i} className={styles.row}>
                <div
                  className={styles.scoreBox}
                  style={{ background: `${level.color}15`, borderColor: `${level.color}40`, color: level.color }}
                >
                  {r.result?.score}
                </div>
                <div className={styles.rowBody}>
                  <div className={styles.rowTop}>
                    <span className={styles.rowVerdict} style={{ color: level.color }}>{r.result?.verdict}</span>
                    <span className={styles.rowCount}>{r.result?.findings?.length || 0} findings</span>
                  </div>
                  <span className={styles.rowUrl}>{r.url}</span>
                  <span className={styles.rowSummary}>{r.result?.summary}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
