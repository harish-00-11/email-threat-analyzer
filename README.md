
# ThreatScan: Gmail AI Security Extension

An AI-powered Chrome Extension that integrates directly into Gmail to scan unread emails, attachments, and URLs for phishing signals, lookalike domains, alarming language, and harmful patterns — built with React, Vite, and the Anthropic Claude API.

---

## ✨ Features

- **Live Inbox Integration** — instantly extract and scan all unread email rows currently visible in your Gmail inbox.
- **Attachment Scanning** — injects a secure "🔍 Scan File" button directly next to Gmail attachments to analyze context without downloading.
- **Manual Email & URL Analysis** — paste raw email content, headers, or suspicious URLs directly into the extension panel.
- **Threat Scoring** — AI-generated 0–100 threat score with a severity verdict (Clean → Critical Threat).
- **Detailed Findings** — categorized findings with supporting evidence from scanned content.
- **Actionable Recommendations** — concrete, step-by-step security advice based on detected threats.
- **Modern UI** — lightweight popup interface optimized for Gmail workflows.
- **Example Inputs** — built-in phishing and legitimate examples for instant testing.

---

## 📊 Threat Score Levels

| Score | Verdict |
|---|---|
| 0–15 | ✅ Clean |
| 16–35 | 🔵 Low Risk |
| 36–65 | 🟡 Suspicious |
| 66–85 | 🟠 High Risk |
| 86–100 | 🔴 Critical Threat |

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** — fast, modern frontend framework
- **CRXJS Vite Plugin** — Chrome Extension bundling support
- **Anthropic Claude API** (`claude-sonnet-4-20250514`) — advanced AI threat analysis
- **CSS Modules** — scoped and maintainable styling
- **Tabler Icons** — consistent icon system
- **Chrome Extension APIs** — Gmail content interaction and injection

---

# 🚀 Local Development & Setup

## 📋 Prerequisites

- Node.js 18+
- Google Chrome or Chromium-based browser
- Anthropic API Key

Get your API key from:

https://console.anthropic.com

---

# 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/email-url-threat-analyzer.git

# Navigate into the project
cd email-url-threat-analyzer

# Install dependencies
# NOTE:
# --legacy-peer-deps is required because
# CRXJS and Vite versions may trigger peer warnings
npm install --legacy-peer-deps
````

---

# 🔑 Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

OR:

```bash
cp .env.example .env
```

Then edit:

```env
VITE_ANTHROPIC_API_KEY=your_api_key
```

---

# 🏗️ Build the Extension

Chrome Extensions require a production build.

Run:

```bash
npm run build
```

After completion, a `dist/` folder will be generated.

---

# 🌐 Load Extension into Chrome

## Step 1 — Open Extensions Page

Navigate to:

```text
chrome://extensions/
```

---

## Step 2 — Enable Developer Mode

Toggle:

```text
Developer Mode → ON
```

(top-right corner)

---

## Step 3 — Load the Extension

Click:

```text
Load unpacked
```

Then select:

```text
dist/
```

folder from your project.

---

## Step 4 — Pin the Extension

Optional but recommended:

* Click Extensions icon
* Pin ThreatScan

---

# 🧪 How to Use

---

## 📥 Inbox Scan

1. Open Gmail
2. Ensure unread emails are visible
3. Open ThreatScan popup
4. Click:

```text
Scan Unread Inbox Rows
```

ThreatScan will:

* Extract visible unread emails
* Analyze phishing indicators
* Generate threat scores
* Display recommendations

---

## 📎 Attachment Scan

1. Open an email containing attachments
2. ThreatScan injects:

```text
🔍 Scan File
```

button beside the attachment.

3. Click the button to analyze attachment context.

---

## 🔗 URL Scan

Paste:

* suspicious URLs
* shortened links
* redirect URLs
* spoofed domains

into the analyzer panel.

ThreatScan checks for:

* lookalike domains
* phishing structures
* suspicious redirects
* malicious patterns

---

## ✉️ Manual Email Analysis

Paste:

* raw email headers
* sender info
* email body
* suspicious messages

ThreatScan analyzes:

* spoofing attempts
* urgency language
* impersonation
* social engineering
* malicious intent

---

# 📂 Project Structure

```text
email-url-threat-analyzer/
│
├── public/
│   ├── manifest.json
│   └── icon.png
│
├── screenshots/
│   ├── dashboard.png
│   ├── inbox-scan.png
│   ├── attachment-scan.png
│   └── demo.gif
│
├── src/
│   ├── components/
│   │   ├── ThreatAnalyzer.jsx
│   │   ├── InputPanel.jsx
│   │   ├── ScanProgress.jsx
│   │   └── ThreatResults.jsx
│   │
│   ├── hooks/
│   │   └── useAnalysis.js
│   │
│   ├── utils/
│   │   ├── analyzeThreats.js
│   │   └── constants.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── content.js
│
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

# 🔐 Chrome Extension Permissions

ThreatScan requires the following permissions:

| Permission         | Purpose                        |
| ------------------ | ------------------------------ |
| `activeTab`        | Access the active Gmail tab    |
| `tabs`             | Detect Gmail tabs              |
| `scripting`        | Inject attachment scan buttons |
| `storage`          | Save local preferences/history |
| `host_permissions` | Access `mail.google.com`       |

ThreatScan does NOT:

* sell user data
* track browsing history
* collect analytics
* store emails remotely

---

# 🏗️ Architecture Flow

```text
Gmail Inbox
     ↓
Content Script Injection
     ↓
Email / URL Extraction
     ↓
Threat Parsing Engine
     ↓
Claude AI Analysis
     ↓
Threat Score Generation
     ↓
Security Recommendations
```

---

# 🎥 Demo

![ThreatScan Demo](./screenshots/demo.gif)

---

# 🌐 Browser Compatibility

| Browser        | Support    |
| -------------- | ---------- |
| Google Chrome  | ✅          |
| Brave          | ✅          |
| Microsoft Edge | ✅          |
| Opera          | ✅          |
| Firefox        | ⚠️ Planned |

---

# 🔒 Privacy

ThreatScan processes email and URL content strictly for threat analysis purposes.

## Privacy Principles

* No user data stored remotely
* No tracking scripts
* No telemetry
* No analytics
* No email resale or sharing
* Analysis only sent to configured AI provider

For maximum privacy:

* Use a self-hosted backend proxy
* Avoid direct browser API keys in production

---

# ⚠️ Security Note

This extension currently uses:

```text
VITE_ANTHROPIC_API_KEY
```

directly from the browser extension.

This is acceptable for:

* local development
* testing
* personal use

However:

❌ DO NOT publish publicly in this form.

Anyone can inspect extension traffic and potentially extract your API key.

---

# ✅ Recommended Production Architecture

## Use a Backend Proxy

Recommended options:

* Node.js + Express
* Next.js API Routes
* Cloudflare Workers
* FastAPI
* AWS Lambda

---

## Production Flow

```text
Chrome Extension
      ↓
Secure Backend Proxy
      ↓
Anthropic API
```

---

## Additional Production Security

Add:

* authentication
* rate limiting
* logging
* abuse prevention
* encrypted secrets management

---

# 📁 Recommended .gitignore

```gitignore
node_modules
dist
.env
.vscode
.DS_Store
```

---

# 🧭 Roadmap

* [ ] Outlook integration
* [ ] Real-time URL auto scanning
* [ ] VirusTotal integration
* [ ] PDF OCR scanning
* [ ] AI attachment classification
* [ ] SIEM export support
* [ ] Offline LLM support
* [ ] Enterprise dashboard
* [ ] Threat intelligence feeds
* [ ] SOC alert workflows

---

# 🏷️ Topics

```text
cybersecurity
phishing-detection
chrome-extension
gmail-extension
email-security
url-scanner
threat-intelligence
soc-analyst
ai-security
claude-api
react
vite
```

---

# 🤝 Contributing

Pull requests are welcome.

For major changes:

1. Open an issue
2. Discuss proposed changes
3. Submit PR after approval

Contributions are welcome for:

* Outlook support
* Better phishing heuristics
* Threat intelligence integrations
* UI improvements
* Detection optimizations

---

# 📄 License

MIT License

---

# ⭐ Acknowledgements

* Anthropic Claude API
* React Team
* Vite
* CRXJS
* Tabler Icons
* Open-source cybersecurity community

---

# ⚡ Disclaimer

ThreatScan is designed for:

* educational purposes
* research
* defensive cybersecurity workflows

It should not be solely relied upon for enterprise-grade email security decisions.

Always validate critical findings with additional security tools and human review.

