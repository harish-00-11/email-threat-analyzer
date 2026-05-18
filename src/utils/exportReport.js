export function exportAsJson(entry) {
  const blob = new Blob([JSON.stringify(entry, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `threatscan-${entry.id || Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAsText(entry) {
  const { type, input, result, timestamp } = entry
  const lines = [
    `THREATSCAN REPORT`,
    `Generated: ${new Date(timestamp).toLocaleString()}`,
    `Type: ${type === 'email' ? 'Email' : 'URL'}`,
    `Verdict: ${result.verdict} (Score: ${result.score}/100)`,
    ``,
    `SUMMARY`,
    result.summary,
    ``,
    `INPUT`,
    `---`,
    (input || '').substring(0, 500) + (input?.length > 500 ? '\n[truncated]' : ''),
    ``,
    `FINDINGS (${result.findings?.length || 0})`,
    `---`,
    ...(result.findings || []).map(
      (f, i) =>
        `${i + 1}. [${f.severity?.toUpperCase()}] ${f.title}\n   ${f.detail}`
    ),
    ``,
    `RECOMMENDATIONS`,
    `---`,
    ...(result.recommendations || []).map((r, i) => `${i + 1}. ${r}`),
  ]

  const text = lines.join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `threatscan-${entry.id || Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text)
}
