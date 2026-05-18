export const EMAIL_EXAMPLES = {
  phish: {
    label: 'Phishing email',
    content: `From: security-alert@paypa1.com
Subject: URGENT: Your account has been suspended!

Dear Valued Customer,

We have detected suspicious activity on your PayPal account. Your account has been temporarily limited.

To restore full access and avoid permanent suspension, you MUST verify your information immediately:

Click here to verify: http://paypa1-secure.account-login.xyz/verify?token=a8f2k

If you do not verify within 24 hours, your account and all funds will be permanently closed.

Do NOT share this email with anyone.

PayPal Security Team`,
  },
  legit: {
    label: 'Legitimate email',
    content: `From: notifications@github.com
Subject: [GitHub] A third-party OAuth application has been authorized

Hi there,

A third-party OAuth application (VS Code) was recently authorized to access your account.

Visit https://github.com/settings/applications if you did not perform this action.

Thanks,
The GitHub Team`,
  },
  promo: {
    label: 'Promotional email',
    content: `From: offers@newsletter.spotify.com
Subject: 3 months of Premium for $0.99

Hi there,

For a limited time, get 3 months of Spotify Premium for just $0.99. Enjoy ad-free music, offline downloads, and more.

Claim your offer at spotify.com/offer — expires Dec 31.

Happy listening,
Spotify`,
  },
}

export const URL_EXAMPLES = {
  safe: {
    label: 'Safe URL',
    content: 'https://github.com/anthropics/anthropic-sdk-python/releases/tag/v0.40.0',
  },
  phish: {
    label: 'Suspicious URL',
    content: 'http://amaz0n-secure.login-account-verify.xyz/reset-password?user=victim&token=xK9mP2',
  },
  short: {
    label: 'Shortened link',
    content: 'https://bit.ly/3xK8mPz',
  },
}

export const SCAN_STEPS = [
  { icon: 'ti-world-search', label: 'Analyzing domain reputation & lookalike patterns…' },
  { icon: 'ti-vocabulary', label: 'Scanning for urgency, fear, and social engineering language…' },
  { icon: 'ti-link', label: 'Inspecting URLs for redirect chains and malicious patterns…' },
  { icon: 'ti-id', label: 'Checking sender identity and header anomalies…' },
  { icon: 'ti-brain', label: 'Generating threat assessment…' },
]

export const SEVERITY_CONFIG = {
  critical: {
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
    text: '#f87171',
    badge: 'rgba(239,68,68,0.2)',
    badgeText: '#fca5a5',
  },
  high: {
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.25)',
    text: '#fb923c',
    badge: 'rgba(249,115,22,0.2)',
    badgeText: '#fdba74',
  },
  medium: {
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
    text: '#fbbf24',
    badge: 'rgba(245,158,11,0.2)',
    badgeText: '#fde68a',
  },
  low: {
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.25)',
    text: '#4ade80',
    badge: 'rgba(34,197,94,0.2)',
    badgeText: '#86efac',
  },
}

export const SCORE_LEVELS = [
  { max: 15, verdict: 'Clean', color: '#22c55e', label: 'No significant threats detected.' },
  { max: 35, verdict: 'Low Risk', color: '#3b82f6', label: 'Minor signals present, likely safe.' },
  { max: 65, verdict: 'Suspicious', color: '#f59e0b', label: 'Treat this with caution.' },
  { max: 85, verdict: 'High Risk', color: '#f97316', label: 'Strong indicators of malicious intent.' },
  { max: 100, verdict: 'Critical Threat', color: '#ef4444', label: 'Do not interact with this content.' },
]

export function getScoreLevel(score) {
  return SCORE_LEVELS.find((l) => score <= l.max) || SCORE_LEVELS[SCORE_LEVELS.length - 1]
}
