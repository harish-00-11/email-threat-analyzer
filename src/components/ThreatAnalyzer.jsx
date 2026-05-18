import { useState, useEffect } from 'react'
import { useAnalysis } from '../hooks/useAnalysis'
import { EMAIL_EXAMPLES, URL_EXAMPLES } from '../utils/constants'
import { loadHistory, saveToHistory } from '../utils/storage'
import InputPanel from './InputPanel'
import UrlExtractor from './UrlExtractor'
import ScanProgress from './ScanProgress'
import ThreatResults from './ThreatResults'
import ScanHistory from './ScanHistory'
import BatchScanner from './BatchScanner'
import styles from './ThreatAnalyzer.module.css'

const TABS = [
  { id: 'email', label: 'Email', icon: 'ti-mail' },
  { id: 'url', label: 'URL / link', icon: 'ti-link' },
  { id: 'batch', label: 'Batch URLs', icon: 'ti-list-check' },
]

export default function ThreatAnalyzer() {
  const [activeTab, setActiveTab] = useState('email')
  const [emailContent, setEmailContent] = useState('')
  const [urlContent, setUrlContent] = useState('')
  const [history, setHistory] = useState(() => loadHistory())
  const [bulkScanError, setBulkScanError] = useState(null)
  const { status, result, error, currentStep, analyze, reset } = useAnalysis()

  // Listen for attachment scan events triggered directly from the Gmail DOM buttons
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      const handleExtensionMessages = (request, sender, sendResponse) => {
        if (request.action === 'SCAN_ATTACHMENT') {
          setActiveTab('email')
          const simulatedEmailContext = `Attachment Scan Request:\nFile Name: ${request.fileName}\nContext: Triggered directly via Gmail Attachment UI overlay.`;
          setEmailContent(simulatedEmailContext)
          reset()
          
          // Trigger immediate analysis using the context strings
          setTimeout(() => {
            analyze({ type: 'email', content: simulatedEmailContext })
          }, 50)
          
          sendResponse({ success: true })
        }
      }
      
      chrome.runtime.onMessage.addListener(handleExtensionMessages)
      return () => chrome.runtime.onMessage.removeListener(handleExtensionMessages)
    }
  }, [analyze, reset])

  const handleScan = (overrideType, overrideContent) => {
    const type = overrideType || activeTab
    const content = overrideContent || (activeTab === 'email' ? emailContent : urlContent)
    if (!content.trim()) return
    setBulkScanError(null)
    analyze({ type, content })
  }

  const handleScanUnreadGmail = () => {
    setBulkScanError(null)
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      setBulkScanError('Extension environment not detected.')
      return
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab || !activeTab.url.includes('mail.google.com')) {
        setBulkScanError('Please switch tabs to your active Gmail page to run this scanner.')
        return
      }

      chrome.tabs.sendMessage(activeTab.id, { action: 'GET_UNREAD_EMAILS' }, (response) => {
        if (chrome.runtime.lastError) {
          setBulkScanError('Could not communicate with Gmail. Try reloading the Gmail page.')
          return
        }

        if (response && response.emails && response.emails.length > 0) {
          // Format all unread messages into a clean block for Claude to ingest
          const formattedContent = response.emails
            .map((email, idx) => `--- EMAIL #${idx + 1} ---\nFROM: ${email.sender}\nSUBJECT: ${email.subject}\nPREVIEW: ${email.snippet}\n`)
            .join('\n')

          setActiveTab('email')
          setEmailContent(formattedContent)
          reset()
          
          // Dispatch block directly to the AI analyzer engine
          setTimeout(() => {
            analyze({ type: 'email', content: formattedContent })
          }, 50)
        } else {
          setBulkScanError('No unread emails detected on the active screen grid.')
        }
      })
    })
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setBulkScanError(null)
    if (status !== 'idle') reset()
  }

  const handleScanUrlFromEmail = (url) => {
    setActiveTab('url')
    setUrlContent(url)
    reset()
    setTimeout(() => analyze({ type: 'url', content: url }), 50)
  }

  const loadEmailExample = (key) => {
    setEmailContent(EMAIL_EXAMPLES[key].content)
    if (status !== 'idle') reset()
  }

  const loadUrlExample = (key) => {
    setUrlContent(URL_EXAMPLES[key].content)
    if (status !== 'idle') reset()
  }

  const handleRestore = (entry) => {
    setActiveTab(entry.type === 'url' ? 'url' : 'email')
    if (entry.type === 'url') setUrlContent(entry.input || '')
    else setEmailContent(entry.input || '')
    reset()
  }

  const isScanning = status === 'scanning'
  const isDone = status === 'done'
  const currentInput = activeTab === 'email' ? emailContent : urlContent
  const isBatch = activeTab === 'batch'

  const handleResultReady = (res) => {
    const input = activeTab === 'email' ? emailContent : urlContent
    const updated = saveToHistory({ type: activeTab, input, result: res })
    setHistory(updated)
  }

  return (
    <div className={styles.container}>
      {/* Gmail Inbox Fast Scan Utility Module */}
      {activeTab === 'email' && !isScanning && !isDone && (
        <div style={{
          background: 'var(--bg-card)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          border: '1px solid var(--border-default)',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ti ti-mail-fast" style={{ color: 'var(--accent-blue-text)' }} /> Live Gmail Integration
          </h3>
          <button
            onClick={handleScanUnreadGmail}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--accent-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <i className="ti ti-mail" /> Scan Unread Inbox Rows
          </button>
          {bulkScanError && (
            <div style={{ color: 'var(--accent-red-text)', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="ti ti-alert-circle" /> {bulkScanError}
            </div>
          )}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.topBar}>
          <div className={styles.tabs} role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => handleTabSwitch(tab.id)}
                disabled={isScanning}
              >
                <i className={`ti ${tab.icon}`} aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>
          <ScanHistory history={history} setHistory={setHistory} onRestore={handleRestore} />
        </div>

        {isBatch ? (
          <div className={styles.batchWrap}>
            <BatchScanner />
          </div>
        ) : (
          <>
            {!isDone && (
              <InputPanel
                activeTab={activeTab}
                emailContent={emailContent}
                urlContent={urlContent}
                onEmailChange={setEmailContent}
                onUrlChange={setUrlContent}
                onLoadEmailExample={loadEmailExample}
                onLoadUrlExample={loadUrlExample}
                emailExamples={EMAIL_EXAMPLES}
                urlExamples={URL_EXAMPLES}
                disabled={isScanning}
              />
            )}

            {!isDone && activeTab === 'email' && emailContent && (
              <UrlExtractor emailText={emailContent} onScanUrl={handleScanUrlFromEmail} />
            )}

            {error && (
              <div className={styles.errorBox} role="alert">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {error}
              </div>
            )}

            {!isDone && (
              <button
                className={styles.scanBtn}
                onClick={() => handleScan()}
                disabled={isScanning || !currentInput.trim()}
              >
                {isScanning ? (
                  <><span className={styles.spinner} aria-hidden="true" /> Analyzing...</>
                ) : (
                  <><i className="ti ti-radar" aria-hidden="true" /> Scan manual input</>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {!isBatch && (isScanning || isDone) && (
        <ScanProgress currentStep={currentStep} isDone={isDone} />
      )}

      {!isBatch && isDone && result && (
        <ThreatResults
          result={result}
          emailText={activeTab === 'email' ? emailContent : null}
          entry={{ type: activeTab, input: currentInput, result, timestamp: new Date().toISOString(), id: Date.now() }}
          onReset={reset}
          onResultReady={handleResultReady}
        />
      )}
    </div>
  )
}
