const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

if (!API_KEY) {
  console.warn(
    '[ThreatScan] VITE_ANTHROPIC_API_KEY is not set. ' +
    'Copy .env.example to .env and add your key from https://console.anthropic.com'
  )
}

export async function analyzeThreats({ type, content }) {
  if (!API_KEY) {
    throw new Error(
      'API key not configured. Please copy .env.example to .env and add your VITE_ANTHROPIC_API_KEY.'
    )
  }

  const prompt = `You are a cybersecurity threat analysis engine. Analyze the following ${type === 'email' ? 'email content' : 'URL'} for security threats.

Input:
\`\`\`
${content.substring(0, 3000)}
\`\`\`

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just JSON):
{
  "score": <integer 0-100, where 0=clean and 100=definite threat>,
  "verdict": "<one of: Clean, Low Risk, Suspicious, High Risk, Critical Threat>",
  "summary": "<2-sentence plain-language explanation of the overall risk>",
  "findings": [
    {
      "severity": "<one of: critical, high, medium, low>",
      "category": "<one of: Domain Spoofing, Alarming Language, Suspicious URL, Sender Fraud, Phishing Pattern, Social Engineering, Malicious Redirect, Data Harvesting, Lookalike Brand, Safe Signal>",
      "title": "<short 4-7 word finding title>",
      "detail": "<1-2 sentence specific detail about this finding, quoting specific text or domains when relevant>",
      "icon": "<a tabler icon name without the ti- prefix, e.g.: alert-triangle, link, mail, shield, eye, user-x, clock, lock, world, fish>"
    }
  ],
  "recommendations": [
    "<actionable recommendation string>"
  ]
}

Rules:
- findings array: 2-6 items. Include at least one "Safe Signal" finding if the input has trustworthy signals.
- recommendations array: 2-4 specific, actionable items.
- Score: 0-15=Clean, 16-35=Low Risk, 36-65=Suspicious, 66-85=High Risk, 86-100=Critical Threat.
- Be precise and specific, quoting exact suspicious text/domains from the input.
- For safe content, give it a low score and note legitimate signals.
- Do NOT include any text outside the JSON.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content.map((b) => b.text || '').join('')
  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse analysis response. Please try again.')
  }
}
