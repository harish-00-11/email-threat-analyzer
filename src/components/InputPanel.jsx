import styles from './InputPanel.module.css'

export default function InputPanel({
  activeTab,
  emailContent,
  urlContent,
  onEmailChange,
  onUrlChange,
  onLoadEmailExample,
  onLoadUrlExample,
  emailExamples,
  urlExamples,
  disabled,
}) {
  return (
    <div className={styles.panel}>
      {activeTab === 'email' ? (
        <>
          <textarea
            className={styles.textarea}
            placeholder="Paste the full email here — headers, body, and any links included…"
            value={emailContent}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={disabled}
            aria-label="Email content to analyze"
          />
          <div className={styles.examples}>
            <span className={styles.examplesLabel}>Try an example:</span>
            {Object.entries(emailExamples).map(([key, ex]) => (
              <button
                key={key}
                className={styles.exampleBtn}
                onClick={() => onLoadEmailExample(key)}
                disabled={disabled}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.urlWrapper}>
            <i className="ti ti-link" aria-hidden="true" />
            <input
              type="text"
              className={styles.urlInput}
              placeholder="https://example.com/some-link"
              value={urlContent}
              onChange={(e) => onUrlChange(e.target.value)}
              disabled={disabled}
              aria-label="URL to analyze"
            />
          </div>
          <div className={styles.examples}>
            <span className={styles.examplesLabel}>Try an example:</span>
            {Object.entries(urlExamples).map(([key, ex]) => (
              <button
                key={key}
                className={styles.exampleBtn}
                onClick={() => onLoadUrlExample(key)}
                disabled={disabled}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
