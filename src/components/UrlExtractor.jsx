import { useMemo } from 'react'
import { extractUrls } from '../utils/extractUrls'
import styles from './UrlExtractor.module.css'

export default function UrlExtractor({ emailText, onScanUrl }) {
  const urls = useMemo(() => extractUrls(emailText || ''), [emailText])

  if (!urls.length) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <i className="ti ti-link" aria-hidden="true" />
        <span>{urls.length} link{urls.length > 1 ? 's' : ''} detected in email</span>
      </div>
      <div className={styles.list}>
        {urls.map((url, i) => (
          <div key={i} className={styles.urlRow}>
            <span className={styles.url} title={url}>{url}</span>
            <button
              className={styles.scanBtn}
              onClick={() => onScanUrl(url)}
              title="Scan this URL"
            >
              <i className="ti ti-radar" aria-hidden="true" />
              Scan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
