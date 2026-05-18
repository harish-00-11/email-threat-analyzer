import { SCAN_STEPS } from '../utils/constants'
import styles from './ScanProgress.module.css'

export default function ScanProgress({ currentStep, isDone }) {
  return (
    <div className={styles.card} role="status" aria-live="polite" aria-label="Scan progress">
      <div className={styles.header}>
        <i className="ti ti-radar" aria-hidden="true" />
        <span>{isDone ? 'Scan complete' : 'Scanning…'}</span>
      </div>
      <div className={styles.steps}>
        {SCAN_STEPS.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep && !isDone
          return (
            <div key={i} className={`${styles.step} ${done || isDone ? styles.done : ''} ${active ? styles.active : ''}`}>
              <div className={styles.dot}>
                {(done || isDone) ? (
                  <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 10 }} />
                ) : active ? (
                  <span className={styles.pulse} />
                ) : null}
              </div>
              <i className={`ti ${step.icon}`} aria-hidden="true" style={{ fontSize: 13, opacity: 0.5 }} />
              <span className={styles.label}>{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
