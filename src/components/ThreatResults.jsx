import { useEffect } from 'react'
import { getScoreLevel, SEVERITY_CONFIG } from '../utils/constants'
import EmailHighlighter from './EmailHighlighter'
import ExportReport from './ExportReport'
import styles from './ThreatResults.module.css'

function ScoreGauge({ score }) {
  const level = getScoreLevel(score)
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = ((100 - score) / 100) * circumference

  return (
    <div className={styles.gaugeWrapper}>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={level.color} strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className={styles.gaugeCenter}>
        <span className={styles.gaugeScore} style={{ color: level.color }}>{score}</span>
        <span className={styles.gaugeLabel}>/ 100</span>
      </div>
    </div>
  )
}

function FindingCard({ finding }) {
  const sev = finding.severity?.toLowerCase() || 'low'
  const config = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.low
  return (
    <div className={styles.findingCard} style={{ background: config.bg, borderColor: config.border }}>
      <div className={styles.findingIcon} style={{ background: config.badge }}>
        <i className={`ti ti-${finding.icon || 'alert'}`} aria-hidden="true" style={{ color: config.text, fontSize: 15 }} />
      </div>
      <div className={styles.findingBody}>
        <div className={styles.findingMeta}>
          <span className={styles.findingTitle} style={{ color: config.text }}>{finding.title}</span>
          <span className={styles.findingCategory} style={{ color: config.text, background: config.badge }}>{finding.category}</span>
        </div>
        <p className={styles.findingDetail} style={{ color: config.text }}>{finding.detail}</p>
      </div>
      <span className={styles.severityBadge} style={{ background: config.badge, color: config.badgeText }}>{sev}</span>
    </div>
  )
}

export default function ThreatResults({ result, emailText, entry, onReset, onResultReady }) {
  const score = Math.min(100, Math.max(0, result.score || 0))
  const level = getScoreLevel(score)

  useEffect(() => {
    if (onResultReady) onResultReady(result)
  }, []) // eslint-disable-line

  const sortedFindings = [...(result.findings || [])].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
  })

  const criticalCount = sortedFindings.filter((f) => f.severity === 'critical').length
  const highCount = sortedFindings.filter((f) => f.severity === 'high').length
  const medCount = sortedFindings.filter((f) => f.severity === 'medium').length

  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryLeft}>
          <ScoreGauge score={score} />
        </div>
        <div className={styles.summaryRight}>
          <div className={styles.verdictRow}>
            <span className={styles.verdict} style={{ color: level.color }}>{result.verdict}</span>
            <span className={styles.verdictHint} style={{ color: level.color, background: `${level.color}18` }}>{level.label}</span>
          </div>
          <p className={styles.summary}>{result.summary}</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{sortedFindings.length}</span>
              <span className={styles.statLabel}>findings</span>
            </div>
            {criticalCount > 0 && (
              <div className={styles.stat}>
                <span className={styles.statNum} style={{ color: '#f87171' }}>{criticalCount}</span>
                <span className={styles.statLabel}>critical</span>
              </div>
            )}
            {highCount > 0 && (
              <div className={styles.stat}>
                <span className={styles.statNum} style={{ color: '#fb923c' }}>{highCount}</span>
                <span className={styles.statLabel}>high</span>
              </div>
            )}
            {medCount > 0 && (
              <div className={styles.stat}>
                <span className={styles.statNum} style={{ color: '#fbbf24' }}>{medCount}</span>
                <span className={styles.statLabel}>medium</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export */}
      <ExportReport entry={entry} />

      {/* Email highlighter — only for email scans */}
      {emailText && (
        <EmailHighlighter emailText={emailText} findings={result.findings} />
      )}

      {sortedFindings.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="ti ti-list-search" aria-hidden="true" />
            Findings
          </h2>
          <div className={styles.findings}>
            {sortedFindings.map((f, i) => <FindingCard key={i} finding={f} />)}
          </div>
        </div>
      )}

      {(result.recommendations || []).length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <i className="ti ti-bulb" aria-hidden="true" />
            Recommendations
          </h2>
          <div className={styles.recos}>
            {result.recommendations.map((rec, i) => (
              <div key={i} className={styles.recoItem}>
                <span className={styles.recoNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.recoText}>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className={styles.resetBtn} onClick={onReset}>
        <i className="ti ti-refresh" aria-hidden="true" />
        Scan another
      </button>
    </div>
  )
}
