import { useMemo } from 'react'
import { highlightThreats } from '../utils/extractUrls'
import styles from './EmailHighlighter.module.css'

const SEVERITY_COLORS = {
  critical: { bg: 'rgba(239,68,68,0.25)', border: 'rgba(239,68,68,0.5)', color: '#fca5a5' },
  high:     { bg: 'rgba(249,115,22,0.2)',  border: 'rgba(249,115,22,0.4)', color: '#fdba74' },
  medium:   { bg: 'rgba(245,158,11,0.2)',  border: 'rgba(245,158,11,0.4)', color: '#fde68a' },
}

function buildHighlightedHtml(text, terms) {
  if (!terms.length) return escHtml(text)

  // Sort by length descending to match longer strings first
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length)

  let result = escHtml(text)
  const seen = new Set()

  for (const { term, severity } of sorted) {
    if (seen.has(term)) continue
    seen.add(term)
    const c = SEVERITY_COLORS[severity] || SEVERITY_COLORS.medium
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(${escaped})`, 'gi')
    result = result.replace(
      re,
      `<mark style="background:${c.bg};border-bottom:1.5px solid ${c.border};color:${c.color};border-radius:2px;padding:0 2px" title="${severity} severity">$1</mark>`
    )
  }
  return result
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default function EmailHighlighter({ emailText, findings }) {
  const terms = useMemo(() => highlightThreats(emailText, findings) || [], [emailText, findings])
  const html = useMemo(() => buildHighlightedHtml(emailText || '', terms), [emailText, terms])

  const legend = [
    { severity: 'critical', label: 'Critical' },
    { severity: 'high', label: 'High' },
    { severity: 'medium', label: 'Medium' },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <i className="ti ti-highlight" aria-hidden="true" />
          <span>Annotated email</span>
        </div>
        <div className={styles.legend}>
          {legend.map((l) => (
            <span
              key={l.severity}
              className={styles.legendItem}
              style={{
                background: SEVERITY_COLORS[l.severity].bg,
                borderColor: SEVERITY_COLORS[l.severity].border,
                color: SEVERITY_COLORS[l.severity].color,
              }}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <pre
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {terms.length === 0 && (
        <p className={styles.noHighlights}>No specific phrases could be highlighted for this result.</p>
      )}
    </div>
  )
}
