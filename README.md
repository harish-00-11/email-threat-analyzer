# Email & URL Threat Analyzer

An AI-powered security tool that scans emails and URLs for phishing signals, lookalike domains, alarming language, and harmful patterns — built with React, Vite, and the Anthropic Claude API.

![ThreatScan Screenshot](https://via.placeholder.com/900x500/0a0e1a/22c55e?text=ThreatScan+Screenshot)

## Features

- **Email analysis** — paste full email content (headers, body, links) to detect phishing patterns, spoofed senders, urgency tactics, and social engineering
- **URL scanning** — detect lookalike domains, suspicious redirect patterns, brand impersonation, and known malicious URL structures
- **Threat scoring** — AI-generated 0–100 threat score with verdict (Clean → Critical Threat)
- **Detailed findings** — severity-categorized findings with specific evidence from the input
- **Actionable recommendations** — concrete next steps for each scan
- **Example inputs** — built-in phishing, legitimate, and promotional examples to try instantly

## Threat Score Levels

| Score | Verdict |
|---|---|
| 0–15 | ✅ Clean |
| 16–35 | 🔵 Low Risk |
| 36–65 | 🟡 Suspicious |
| 66–85 | 🟠 High Risk |
| 86–100 | 🔴 Critical Threat |

## Tech Stack

- **React 18** + **Vite 5** — fast, modern frontend
- **Anthropic Claude API** (`claude-sonnet-4-20250514`) — AI threat analysis
- **CSS Modules** — scoped, maintainable styles
- **IBM Plex Mono** + **Syne** — purpose-built font pairing
- **Tabler Icons** — consistent icon set

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/email-url-threat-analyzer.git
cd email-url-threat-analyzer

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your VITE_ANTHROPIC_API_KEY

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ThreatAnalyzer.jsx      # Main orchestrator component
│   ├── InputPanel.jsx          # Email/URL input with examples
│   ├── ScanProgress.jsx        # Animated scan step indicator
│   └── ThreatResults.jsx       # Score gauge, findings, recommendations
├── hooks/
│   └── useAnalysis.js          # Analysis state management hook
├── utils/
│   ├── analyzeThreats.js       # Anthropic API call + prompt
│   └── constants.js            # Examples, scan steps, severity config
├── App.jsx                     # Layout, header, footer
└── index.css                   # Global CSS variables & reset
```

## Security Note

This tool uses the Anthropic API **directly from the browser** via `VITE_ANTHROPIC_API_KEY`. This is fine for local development and personal use, but for production deployment you should:

1. Create a backend proxy (Node.js/Express, Next.js API route, etc.) that holds the API key server-side
2. Have your frontend call your proxy instead of the Anthropic API directly
3. Add rate limiting and authentication to your proxy

Never commit your `.env` file or expose your API key publicly.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com) |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT
