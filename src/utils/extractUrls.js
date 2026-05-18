const URL_REGEX = /https?:\/\/[^\s"'<>)\]]+/gi

export function extractUrls(text) {
  const matches = text.match(URL_REGEX) || []
  // deduplicate
  return [...new Set(matches)]
}

export function highlightThreats(text, findings) {
  if (!findings?.length) return null

  // Collect suspicious terms from finding details
  const terms = []
  for (const f of findings) {
    if (f.severity === 'critical' || f.severity === 'high') {
      // Extract quoted strings from detail
      const quoted = f.detail?.match(/"([^"]+)"/g) || []
      quoted.forEach((q) => terms.push({ term: q.replace(/"/g, ''), severity: f.severity }))

      // Extract domains / URLs
      const urls = f.detail?.match(URL_REGEX) || []
      urls.forEach((u) => terms.push({ term: u, severity: f.severity }))
    }
    if (f.severity === 'medium') {
      const quoted = f.detail?.match(/"([^"]+)"/g) || []
      quoted.forEach((q) => terms.push({ term: q.replace(/"/g, ''), severity: f.severity }))
    }
  }

  return terms.filter((t) => t.term.length > 3)
}
