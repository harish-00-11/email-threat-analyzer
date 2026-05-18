import { useState } from 'react'
import { exportAsJson, exportAsText, copyToClipboard } from '../utils/exportReport'
import styles from './ExportReport.module.css'

export default function ExportReport({ entry }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = `${entry.result?.verdict} (${entry.result?.score}/100)\n\n${entry.result?.summary}\n\nFindings:\n${(entry.result?.findings || []).map((f) => `• [${f.severity}] ${f.title}: ${f.detail}`).join('\n')}`
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.row}>
      <span className={styles.label}>Export report:</span>
      <button className={styles.btn} onClick={handleCopy}>
        <i className={`ti ${copied ? 'ti-check' : 'ti-clipboard'}`} aria-hidden="true" />
        {copied ? 'Copied!' : 'Copy summary'}
      </button>
      <button className={styles.btn} onClick={() => exportAsText(entry)}>
        <i className="ti ti-file-text" aria-hidden="true" />
        Download .txt
      </button>
      <button className={styles.btn} onClick={() => exportAsJson(entry)}>
        <i className="ti ti-braces" aria-hidden="true" />
        Download .json
      </button>
    </div>
  )
}
