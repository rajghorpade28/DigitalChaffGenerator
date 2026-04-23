"""
classify_dataset_urls.py
------------------------
Reads malicious_phish.csv, filters benign URLs, classifies them
into personas using two-tier keyword matching (domain-level + path-level),
then writes site_selector.js with real dataset URLs.

Run:  python classify_dataset_urls.py
Re-run any time to refresh the URL pool with a new random sample.
"""

import csv
import re
import random
import os
from urllib.parse import urlparse
from collections import defaultdict

# ── Config ───────────────────────────────────────────────────────────────────
CSV_PATH         = 'malicious_phish.csv'
OUT_JS           = 'site_selector.js'
OUT_SUMMARY      = 'classified_urls_summary.txt'
URLS_PER_PERSONA = 80    # how many URLs to keep per persona
RANDOM_SEED      = 42
random.seed(RANDOM_SEED)

# ── Tier-1: Domain-level hints (high confidence) ─────────────────────────────
DOMAIN_HINTS = {
    'tech': [
        'github', 'stackoverflow', 'techcrunch', 'arstechnica', 'theverge',
        'engadget', 'gizmodo', 'cnet', 'zdnet', 'slashdot', 'venturebeat',
        'thenextweb', 'mozilla', 'android', 'chromium', 'pypi', 'npmjs',
        'sourceforge', 'hackernews', 'computerworld', 'infoworld',
        'developer.', 'developers.', 'wired.com',
    ],
    'health': [
        'webmd', 'mayoclinic', 'healthline', 'medscape', 'medicinenet',
        'rxlist', 'livestrong', 'bodybuilding', 'ratemds', 'vitals',
        'zocdoc', 'healthgrades', 'wellness', 'myfitnesspal', 'nih.gov',
        'cdc.gov', 'who.int', 'fitday', 'sparkpeople',
    ],
    'finance': [
        'bloomberg', 'forbes', 'wsj.com', 'ft.com', 'marketwatch',
        'nasdaq', 'nyse.com', 'morningstar', 'investopedia', 'nerdwallet',
        'moneycontrol', 'bankrate', 'creditkarma', 'schwab', 'fidelity',
        'vanguard', 'etrade', 'bankofamerica', 'wellsfargo', 'chase.com',
        'citibank',
    ],
    'travel': [
        'tripadvisor', 'expedia', 'booking.com', 'airbnb', 'kayak',
        'priceline', 'hotels.com', 'agoda', 'makemytrip', 'skyscanner',
        'momondo', 'lonelyplanet', 'roughguide', 'travelocity', 'orbitz',
        'hotelscombined', 'trivago', 'goibibo', 'cleartrip',
    ],
    'news': [
        'bbc.co', 'bbc.com', 'cnn.com', 'nytimes', 'reuters.com',
        'theguardian', 'washingtonpost', 'npr.org', 'apnews', 'aljazeera',
        'foxnews', 'nbcnews', 'abcnews', 'cbsnews', 'huffpost', 'politico',
        'theatlantic', 'vox.com', 'axios.com', 'thehill',
    ],
}

# ── Tier-2: Path/URL keyword fallback (medium confidence) ────────────────────
PATH_KEYWORDS = {
    'tech': [
        'technology', 'software', 'hardware', 'developer', 'programming',
        'coding', 'linux', 'python', 'javascript', 'cybersecurity',
        'artificial-intelligence', 'machine-learning', 'data-science',
        'open-source', 'blockchain', 'cloud-computing', 'devops',
    ],
    'health': [
        'health', 'medical', 'medicine', 'nutrition', 'fitness', 'diet',
        'wellness', 'hospital', 'disease', 'symptom', 'treatment',
        'mental-health', 'workout', 'yoga', 'supplement', 'diabetes',
        'cancer', 'cardiology', 'dentist', 'pharmacy',
    ],
    'finance': [
        'finance', 'investment', 'stock-market', 'money', 'credit-score',
        'insurance', 'tax-planning', 'trading', 'economy', 'budgeting',
        'retirement', 'mortgage', 'dividend', 'portfolio',
        'mutual-fund', 'personal-finance',
    ],
    'travel': [
        'travel', 'hotel-review', 'flight-booking', 'vacation', 'holiday',
        'resort', 'tourism', 'cruise', 'beach', 'travel-guide',
        'destination', 'backpacking', 'adventure-travel', 'hiking',
    ],
    'news': [
        'breaking-news', 'world-news', 'article', 'editorial', 'politics',
        'science-news', 'sports-news', 'entertainment-news', 'culture',
        'press-release', 'magazine', 'report', 'analysis',
    ],
}

# ── Domains to always skip ───────────────────────────────────────────────────
SKIP_DOMAINS = [
    'torrent', 'casino', 'poker', 'gambling', 'sexy', 'xxx', 'porn',
    'mediafire', 'megaupload', 'warez', 'crack', 'rapidshare', 'hotfile',
    '4shared', 'filestube', 'piratebay', 'extratorrent', 'kickass',
    'azurewebsites.net',   # free hosting often goes dead
    'appspot.com',         # old App Engine apps mostly dead
    'weebly.com', 'wixsite.com', 'blogspot',  # free hosting — often dead
    '000webhostapp.com', '000webhost',
    'geocities', 'tripod.com', 'angelfire.com',
]

SKIP_EXTS = (
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp',
    '.mp3', '.mp4', '.avi', '.mkv', '.mov', '.webm',
    '.zip', '.rar', '.tar', '.gz', '.7z',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.exe', '.dmg', '.iso', '.msi', '.deb', '.apk',
    '.css', '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.xml', '.json', '.rss', '.atom',
)

SKIP_PATTERNS = [
    '@', 'cdn-cgi', 'ajax/libs', '.min.js', 'googleusercontent',
    'fonts.googleapis', 'maps.googleapis', 'fbcdn', 'formkey=',
    'formResponse', '/wp-content/uploads/', '/static/img/',
    'fbexternal', 'twitter.com/intent', '/feed/', '/rss/',
    '/tag/', '/category/', '/page/1/', 'utm_', 'ref=',
    'affiliate', 'tracking', 'redirect',
]


def normalize(url):
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url


def get_hostname(url):
    try:
        return urlparse(url).hostname or ''
    except Exception:
        return ''


def is_ok(url):
    low = url.lower()
    # Skip by file extension
    if any(low.endswith(e) for e in SKIP_EXTS):
        return False
    # Skip very long URLs (usually tracking/CDN)
    if len(url) > 180:
        return False
    # Skip known bad patterns
    if any(pat in low for pat in SKIP_PATTERNS):
        return False
    # Must have a proper hostname
    host = get_hostname(url)
    if not host or '.' not in host:
        return False
    # No raw IP addresses
    if re.match(r'^\d+\.\d+\.\d+\.\d+$', host):
        return False
    # Skip blocked domain keywords
    if any(bad in host for bad in SKIP_DOMAINS):
        return False
    # Prefer HTTPS (HTTP-only is often old/dead)
    # Allow HTTP too but deprioritise — we'll sort below
    # Skip URLs that are root-domain only with no meaningful path
    try:
        parsed = urlparse(url)
        path   = parsed.path.rstrip('/')
        # Skip if path is empty or just a bare / with no query
        # (root-domain pages are fine; bare domain with hash fragments not)
        if parsed.fragment and not path:
            return False
    except Exception:
        return False
    return True


def classify(url, hostname):
    low_url  = url.lower()
    low_host = hostname.lower()

    # Tier 1 — domain-level (high confidence)
    for persona, hints in DOMAIN_HINTS.items():
        if any(h in low_host for h in hints):
            return persona

    # Tier 2 — path/URL keywords (medium confidence)
    for persona, keywords in PATH_KEYWORDS.items():
        if any(kw in low_url for kw in keywords):
            return persona

    return None


# ── Main ─────────────────────────────────────────────────────────────────────
print('Reading dataset...')
buckets = defaultdict(list)

with open(CSV_PATH, 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get('type', '').strip() != 'benign':
            continue
        url  = normalize(row['url'])
        if not is_ok(url):
            continue
        host = get_hostname(url)
        persona = classify(url, host)
        if persona:
            buckets[persona].append(url)

print('Candidate counts:')
for p in ['tech', 'health', 'finance', 'travel', 'news']:
    print(f'  {p:10s}: {len(buckets[p]):,}')

# Sample URLS_PER_PERSONA unique URLs per persona
sampled = {}
for persona, urls in buckets.items():
    unique = list(dict.fromkeys(urls))  # deduplicate
    random.shuffle(unique)
    sampled[persona] = unique[:URLS_PER_PERSONA]

print('\nSampled (final):')
for p in ['tech', 'health', 'finance', 'travel', 'news']:
    print(f'  {p:10s}: {len(sampled.get(p, []))} URLs')

# ── Write site_selector.js ────────────────────────────────────────────────────
persona_order = ['tech', 'health', 'finance', 'travel', 'news']

header = [
    '/**',
    ' * site_selector.js',
    ' * AUTO-GENERATED by classify_dataset_urls.py',
    ' *',
    ' * All URLs are BENIGN entries from malicious_phish.csv, classified',
    ' * into personas by domain + path keyword matching.',
    ' *',
    ' * Re-generate any time:  python classify_dataset_urls.py',
    ' */',
    '',
    'export const SiteSelector = {',
    '    sites: {',
]

body = []
for i, persona in enumerate(persona_order):
    urls  = sampled.get(persona, [])
    sep   = '─' * (48 - len(persona))
    body.append(f'        // ── {persona.upper()} persona {sep}')
    body.append(f'        {persona}: [')
    for url in urls:
        body.append(f"            '{url.replace(chr(39), chr(92)+chr(39))}',")
    body.append('        ],')
    if i < len(persona_order) - 1:
        body.append('')

footer = [
    '    },',
    '',
    '    // Track recently used URLs per persona to prevent immediate repeats',
    '    _recentlyUsed: {},',
    '',
    '    /**',
    '     * Returns a random URL for the given persona category.',
    '     * Anti-repeat window = last 10 picks, so each noise wave opens a fresh page.',
    '     */',
    "    getSiteForCategory(category) {",
    "        const pool   = this.sites[category] || this.sites['news'];",
    "        const recent = this._recentlyUsed[category] || [];",
    '',
    "        let available = pool.filter(u => !recent.includes(u));",
    "        if (available.length === 0) {",
    "            this._recentlyUsed[category] = [];",
    "            available = pool;",
    "        }",
    '',
    "        const chosen = available[Math.floor(Math.random() * available.length)];",
    "        this._recentlyUsed[category] = [...recent, chosen].slice(-10);",
    "        return chosen;",
    "    }",
    '};',
    '',
]

with open(OUT_JS, 'w', encoding='utf-8') as f:
    f.write('\n'.join(header + body + footer))

print('\nWritten: ' + OUT_JS)

# ── Write human-readable summary ──────────────────────────────────────────────
with open(OUT_SUMMARY, 'w', encoding='utf-8') as f:
    f.write('Persona URL Classification Summary\n')
    f.write('=' * 60 + '\n\n')
    for persona in persona_order:
        urls = sampled.get(persona, [])
        f.write(f'-- {persona.upper()} ({len(urls)} URLs) --\n')
        for url in urls:
            f.write(f'  {url}\n')
        f.write('\n')

print('Written: ' + OUT_SUMMARY)
print('Done! Reload Chrome extension to use new URLs.')
