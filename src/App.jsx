import ThreatAnalyzer from './components/ThreatAnalyzer'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#0f172a"/>
              <path d="M16 6L8 10v7c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5v-7L16 6z" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 16l2.5 2.5L20 13" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>ThreatScan</span>
          </div>
          <nav className={styles.nav}>
            <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.navLink}>
              <i className="ti ti-brand-github" aria-hidden="true" />
              GitHub
            </a>
            <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className={styles.navLink}>
              <i className="ti ti-key" aria-hidden="true" />
              Get API key
            </a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            AI-powered threat analysis
          </div>
          <h1 className={styles.title}>
            Email &amp; URL<br />Threat Analyzer
          </h1>
          <p className={styles.subtitle}>
            Scan emails and links for phishing signals, lookalike domains,<br />
            alarming language, and harmful URL patterns — powered by Claude.
          </p>
        </div>

        <ThreatAnalyzer />
      </main>

      <footer className={styles.footer}>
        <p>Built with <a href="https://anthropic.com" target="_blank" rel="noreferrer">Anthropic Claude</a> · <a href="https://github.com" target="_blank" rel="noreferrer">View on GitHub</a></p>
      </footer>
    </div>
  )
}
