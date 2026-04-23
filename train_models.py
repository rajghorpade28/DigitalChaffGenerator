"""
train_models.py — Phishing URL Classifier v4  (Better Dataset Edition)
=======================================================================
Uses THREE real, publicly available datasets:

  1. PhiUSIIL Phishing URL Dataset (2023) — 235,795 URLs
     UCI ML Repository:
     https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset
     Download CSV → save as: phiusiil_dataset.csv

  2. ISCX-URL-2016 (Kaggle) — 1.2 million URLs
     https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset
     Download CSV → save as: iscx_url_dataset.csv

  3. Tranco Top-1M Legitimate Domains (auto-downloaded from internet)
     https://tranco-list.eu/

  The script auto-downloads Tranco.  For the others, download manually
  from the links above and place the CSV files in this folder.

Usage:
    pip install pandas scikit-learn xgboost lightgbm requests
    python train_models.py

The script will:
  - Load whichever dataset files are present
  - Clean + balance the data
  - Train XGBoost & LightGBM
  - Export best model → best_model.json
  - Auto-patch phishing_detector.js
"""

import pandas as pd
import numpy as np
import re, math, json, os, zipfile, io, sys
from urllib.parse import urlparse, parse_qs
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False
    print("LightGBM not installed — skipping.")

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    print("requests not installed — Tranco auto-download disabled.")

# ── Country-code second-level TLDs (so pizzahut.co.in → base = pizzahut.co.in)
CC_SLDS = {
    'co.in','co.uk','co.au','co.nz','co.za','co.jp','co.kr','co.id',
    'co.il','co.th','co.zw','co.tz','co.ke','co.bw','co.mz','co.zm',
    'com.au','com.br','com.ar','com.mx','com.pk','com.sg','com.my',
    'com.hk','com.ph','com.tr','com.ng','com.eg','com.sa','com.kw',
    'net.in','net.au','org.in','org.uk','org.au',
    'gov.in','gov.uk','gov.au','gov.ca','gov.sg','gov.za',
    'ac.in','ac.uk','ac.jp','nic.in','edu.in','edu.au',
}

def get_base_domain(hostname):
    """Return the registered domain, handling .co.in / .com.au style TLDs."""
    parts = hostname.lower().split('.')
    if len(parts) >= 3:
        sld = '.'.join(parts[-3:])      # e.g. pizzahut.co.in
        tld3 = '.'.join(parts[-2:])     # e.g. co.in
        if tld3 in CC_SLDS:
            return sld                  # ← correct registered domain
    if len(parts) >= 2:
        return '.'.join(parts[-2:])     # e.g. pizzahut.com
    return hostname

# ── Static lookups ─────────────────────────────────────────────────────────────
BRANDS = [
    'paypal','apple','google','amazon','microsoft','facebook','instagram',
    'netflix','twitter','linkedin','dropbox','ebay','bankofamerica','chase',
    'wellsfargo','citibank','hsbc','barclays','dhl','fedex','ups','usps',
    'irs','whatsapp','telegram','yahoo','outlook','office365','steam',
    'dominos','pizzahut','kfc','mcdonalds','starbucks','subway',
    'uber','airbnb','booking','spotify','tiktok','snapchat',
]

SUSPICIOUS_TLDS = {
    '.top','.xyz','.click','.ru','.tk','.ml','.ga','.cf','.gq',
    '.pw','.cc','.biz','.info','.online','.site','.website','.space',
    '.icu','.live','.fun','.world','.press','.today','.win','.loan',
    '.party','.club','.link','.gdn','.bid','.stream','.download',
}

TRUSTED_TLDS = {
    '.gov','.edu','.mil','.gov.in','.gov.uk','.gov.au','.gov.ca',
    '.ac.uk','.ac.in','.nic.in','.edu.in','.edu.au','.go.jp','.ac.jp',
}

PHISHING_KEYWORDS = [
    'login','signin','verify','secure','bank','update','account',
    'confirm','password','credential','billing','suspended','unusual',
    'authenticate','authorize','alert','warning','limited','expire',
    'recover','unlock','reset','validate','identity',
]

LEGIT_DOMAINS = {
    'paypal.com','apple.com','google.com','amazon.com','microsoft.com',
    'facebook.com','instagram.com','netflix.com','twitter.com','x.com',
    'linkedin.com','dropbox.com','ebay.com','chase.com','wellsfargo.com',
    'github.com','stackoverflow.com','geeksforgeeks.org','youtube.com',
    'reddit.com','wikipedia.org','mozilla.org','python.org','npmjs.com',
    'w3schools.com','medium.com','dev.to','hotstar.com','disneyplus.com',
    'spotify.com','primevideo.com','tiktok.com','twitch.tv',
    'flipkart.com','zomato.com','swiggy.com','paytm.com','phonepe.com',
    'razorpay.com','naukri.com','makemytrip.com','irctc.co.in',
    'myntra.com','ajio.com','zerodha.com','groww.in','bookmyshow.com',
    'dominos.com','dominos.co.in','pizzahut.com','pizzahut.co.in',
    'kfc.com','mcdonalds.com','uber.com','olacabs.com','jio.com',
    'airtel.in','airtel.com','hdfcbank.com','icicibank.com','sbi.co.in',
    'walmart.com','target.com','etsy.com','shopify.com','aliexpress.com',
    'coursera.org','udemy.com','khanacademy.org','leetcode.com',
    'zoom.us','discord.com','slack.com','notion.so','figma.com',
    'bbc.com','cnn.com','nytimes.com','reuters.com','bloomberg.com',
    'who.int','nih.gov','cdc.gov','practo.com','1mg.com',
    'booking.com','airbnb.com','expedia.com','cleartrip.com',
}

URL_SHORTENERS = {
    'bit.ly','tinyurl.com','goo.gl','t.co','ow.ly','buff.ly',
    'short.link','tiny.cc','is.gd','tr.im','su.pr',
}

SUSPICIOUS_EXTS = {'.exe','.php','.bat','.sh','.vbs','.zip','.rar','.jar'}


def calc_entropy(s):
    if not s: return 0.0
    freq = {}
    for c in s: freq[c] = freq.get(c, 0) + 1
    n = len(s)
    return -sum((v/n) * math.log2(v/n) for v in freq.values())


def extract_features(url):
    """26-feature vector — must stay in sync with extractFeatures() in phishing_detector.js."""
    url = url.strip()
    raw = url
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    try:
        p      = urlparse(url)
        host   = (p.hostname or '').lower()
        path   = (p.path or '')
        query  = (p.query or '')
        scheme = (p.scheme or 'http').lower()
        port   = p.port
    except Exception:
        host, path, query, scheme, port = '', '', '', 'http', None

    lhost  = host.lower()
    lpath  = path.lower()
    parts  = lhost.split('.')

    # Smart base domain — handles .co.in, .com.au etc.
    base_domain = get_base_domain(lhost)

    def is_legit(h):
        return (h in LEGIT_DOMAINS or
                get_base_domain(h) in LEGIT_DOMAINS)

    f1  = len(raw)
    f2  = len(host)
    f3  = raw.count('.')
    f4  = path.count('/')
    f5  = max(0, lhost.count('.') - 1)
    f6  = 1 if '@' in raw else 0
    f7  = lhost.count('-')
    f8  = sum(c.isdigit() for c in raw) / len(raw) if raw else 0.0
    # Keywords only in hostname — NOT query string
    f9  = sum(lhost.count(kw) for kw in PHISHING_KEYWORDS)
    f10 = 1 if any(lhost.endswith(t) for t in SUSPICIOUS_TLDS) else 0
    f11 = calc_entropy(raw)
    f12 = 1 if scheme == 'http' else 0
    brand_in_host = any(b in lhost for b in BRANDS)
    f13 = 1 if (brand_in_host and not is_legit(lhost)) else 0
    redirect_kws = ['redirect','return','next','goto','target','redir']
    f14 = 1 if any(kw in lpath for kw in redirect_kws) else 0
    f15 = len(path)
    f16 = len(query)
    f17 = sum(raw.count(c) for c in ['%','&','=','+','#',';','!'])
    f18 = 1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', host) else 0
    f19 = 1 if any(lhost.endswith(t) for t in TRUSTED_TLDS) else 0
    f20 = f7 * f9
    f21 = 1 if (port and port not in (80, 443, 8080, 8443)) else 0
    f22 = 1 if base_domain in URL_SHORTENERS else 0
    f23 = sum(lpath.count(kw) for kw in PHISHING_KEYWORDS)
    f24 = len(parse_qs(query))
    path_lower = lpath.rstrip('/')
    f25 = 1 if any(path_lower.endswith(ext) for ext in SUSPICIOUS_EXTS) else 0
    f26 = 1 if is_legit(lhost) else 0

    return [f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,
            f11,f12,f13,f14,f15,f16,f17,f18,f19,f20,
            f21,f22,f23,f24,f25,f26]


FEATURE_NAMES = [
    'url_length','hostname_length','dot_count','slash_count',
    'subdomain_depth','has_at','hyphen_count_hostname','digit_ratio',
    'keyword_in_hostname','suspicious_tld','url_entropy','is_http',
    'brand_impersonation','redirect_in_path','path_length',
    'query_length','special_char_count','is_ip_address',
    'trusted_tld','hyphen_x_hostname_keywords',
    'has_nonstandard_port','is_url_shortener','path_keyword_count',
    'query_param_count','suspicious_file_ext','is_legit_domain',
]
assert len(FEATURE_NAMES) == 26

# ── Sanity checks ──────────────────────────────────────────────────────────────
TEST_URLS = [
    ("https://www.geeksforgeeks.org/courses?keyword=geeksforgeeks", "BENIGN"),
    ("https://www.pizzahut.co.in/order", "BENIGN"),
    ("https://m.dominos.co.in/postorder-ui/login", "BENIGN"),
    ("http://paypal-securelogin-verify.top/signin?redirect=bank", "PHISHING"),
    ("https://google.com", "BENIGN"),
    ("http://192.168.1.1/login/account/verify", "PHISHING"),
    ("https://github.com/user/repo", "BENIGN"),
    ("https://m.kfc.com/menu", "BENIGN"),
]
print("=== Sanity checks (feature extraction) ===")
for u, label in TEST_URLS:
    f = extract_features(u)
    print(f"  [{label}] kw_host={f[8]} legit={f[25]}  {u[:70]}")

# ── Dataset loading ────────────────────────────────────────────────────────────
frames = []

# 1. PhiUSIIL Phishing URL Dataset (2023) — 235,795 URLs — PRESENT ✅
PHIUSIIL_FILE = 'PhiUSIIL_Phishing_URL_Dataset.csv'
if os.path.exists(PHIUSIIL_FILE):
    print(f"\nLoading {PHIUSIIL_FILE} ...")
    pds = pd.read_csv(PHIUSIIL_FILE, usecols=['URL', 'label'], low_memory=False)
    pds = pds.rename(columns={'URL': 'url'})
    # label: 1 = phishing, 0 = legitimate
    pds['label'] = pd.to_numeric(pds['label'], errors='coerce').fillna(0).astype(int)
    pds = pds[['url', 'label']].dropna()
    frames.append(pds)
    print(f"  Loaded {len(pds):,} rows  |  Phishing: {pds['label'].sum():,}  Benign: {(pds['label']==0).sum():,}")
else:
    print(f"  [{PHIUSIIL_FILE}] NOT FOUND — skipping")

# 2. Legacy malicious_phish.csv — PRESENT ✅
if os.path.exists('malicious_phish.csv'):
    print("\nLoading malicious_phish.csv ...")
    mds = pd.read_csv('malicious_phish.csv')
    mds = mds[mds['type'] != 'defacement']   # drop defacement — causes false positives
    mds['label'] = (mds['type'] != 'benign').astype(int)
    mds = mds[['url', 'label']]
    frames.append(mds)
    print(f"  Loaded {len(mds):,} rows  |  Phishing: {mds['label'].sum():,}  Benign: {(mds['label']==0).sum():,}")
else:
    print("  [malicious_phish.csv] NOT FOUND — skipping")

# 3. ISCX dataset (optional — download from Kaggle if you want)
if os.path.exists('iscx_url_dataset.csv'):
    print("\nLoading iscx_url_dataset.csv ...")
    ids = pd.read_csv('iscx_url_dataset.csv')
    url_col   = next((c for c in ids.columns if 'url' in c.lower()), None)
    label_col = next((c for c in ids.columns if 'type' in c.lower() or 'label' in c.lower()), None)
    if url_col and label_col:
        ids = ids[[url_col, label_col]].rename(columns={url_col:'url', label_col:'label'})
        ids['label'] = ids['label'].apply(
            lambda x: 0 if str(x).strip().lower() in ('benign','0','legitimate') else 1)
        frames.append(ids)
        print(f"  Loaded {len(ids):,} rows")

if not frames:
    print("\nERROR: No dataset file found!")
    print("Please download one of:")
    print("  PhiUSIIL → https://archive.ics.uci.edu/dataset/967 → save as phiusiil_dataset.csv")
    print("  ISCX     → https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset → save as iscx_url_dataset.csv")
    sys.exit(1)

# 4. Tranco top-1M legitimate domains (auto-download)
if HAS_REQUESTS:
    print("\nDownloading Tranco top-1M list for additional benign examples...")
    try:
        r = requests.get('https://tranco-list.eu/top-1m.csv.zip', timeout=30)
        z = zipfile.ZipFile(io.BytesIO(r.content))
        tranco_raw = z.read(z.namelist()[0]).decode()
        tranco_urls = [f"https://{line.split(',')[1].strip()}"
                       for line in tranco_raw.split('\n')[:50000] if ',' in line]
        trdf = pd.DataFrame({'url': tranco_urls, 'label': 0})
        frames.append(trdf)
        print(f"  Added {len(trdf):,} Tranco benign domains")
    except Exception as e:
        print(f"  Tranco download failed ({e}) — skipping")

# ── Combine + clean ────────────────────────────────────────────────────────────
df = pd.concat(frames, ignore_index=True)
df = df.dropna(subset=['url'])
df = df.drop_duplicates(subset=['url'])
df['url'] = df['url'].astype(str).str.strip()
df = df[df['url'].str.len() > 5]
print(f"\nTotal unique URLs after merge: {len(df):,}")
print(f"Benign: {(df['label']==0).sum():,}  |  Malicious: {(df['label']==1).sum():,}")

# Balance: cap benign at 3× malicious to avoid extreme imbalance
n_mal = (df['label']==1).sum()
n_ben = (df['label']==0).sum()
if n_ben > 3 * n_mal:
    ben_df = df[df['label']==0].sample(n=3*n_mal, random_state=42)
    df = pd.concat([df[df['label']==1], ben_df], ignore_index=True).sample(frac=1, random_state=42)
    print(f"Balanced to: {len(df):,} rows (benign capped at 3× malicious)")

# ── Feature extraction ─────────────────────────────────────────────────────────
print("\nExtracting features (may take a few minutes)...")
X = np.array([extract_features(u) for u in df['url']], dtype=float)
y = df['label'].values
print(f"Feature matrix: {X.shape}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Train: {len(X_train):,}  |  Test: {len(X_test):,}")

imbalance_ratio = max(1.0, (y == 0).sum() / max(1, (y == 1).sum()))
print(f"Class imbalance ratio (neg/pos): {imbalance_ratio:.2f}")

# ── Train models ───────────────────────────────────────────────────────────────
models = {}
print("\n=== Training ===")

print("1. XGBoost (200 trees)...")
xgb = XGBClassifier(
    n_estimators=200, max_depth=6, learning_rate=0.1,
    subsample=0.8, colsample_bytree=0.8,
    scale_pos_weight=imbalance_ratio,
    eval_metric='auc', use_label_encoder=False,
    random_state=42, n_jobs=-1, verbosity=0,
)
xgb.fit(X_train, y_train)
xgb_prob = xgb.predict_proba(X_test)[:,1]
xgb_pred = xgb.predict(X_test)
models['XGBoost'] = {
    'model': xgb, 'pred': xgb_pred, 'prob': xgb_prob,
    'acc': accuracy_score(y_test, xgb_pred),
    'auc': roc_auc_score(y_test, xgb_prob), 'type': 'xgboost',
}
print(f"   Accuracy={models['XGBoost']['acc']:.4f}  AUC={models['XGBoost']['auc']:.4f}")

if HAS_LGBM:
    print("2. LightGBM (200 trees)...")
    lgbm = LGBMClassifier(
        n_estimators=200, max_depth=6, learning_rate=0.1,
        subsample=0.8, colsample_bytree=0.8,
        scale_pos_weight=imbalance_ratio,
        random_state=42, n_jobs=-1, verbose=-1,
    )
    lgbm.fit(X_train, y_train)
    lgbm_prob = lgbm.predict_proba(X_test)[:,1]
    lgbm_pred = lgbm.predict(X_test)
    models['LightGBM'] = {
        'model': lgbm, 'pred': lgbm_pred, 'prob': lgbm_prob,
        'acc': accuracy_score(y_test, lgbm_pred),
        'auc': roc_auc_score(y_test, lgbm_prob), 'type': 'lgbm',
    }
    print(f"   Accuracy={models['LightGBM']['acc']:.4f}  AUC={models['LightGBM']['auc']:.4f}")

# ── Leaderboard ────────────────────────────────────────────────────────────────
print("\n=== LEADERBOARD ===")
ranked = sorted(models.items(), key=lambda x: x[1]['auc'], reverse=True)
for name, r in ranked:
    print(f"  {name:<14}  Acc={r['acc']:.4f}  AUC={r['auc']:.4f}")

# Pick best compact model
best_name, best_info = ranked[0]
best_model = best_info['model']
print(f"\n[SELECTED] {best_name}  Acc={best_info['acc']:.4f}  AUC={best_info['auc']:.4f}")

print(f"\nClassification report — {best_name}:")
print(classification_report(y_test, best_info['pred'], target_names=['benign','malicious']))

# ── Sanity check on known URLs ─────────────────────────────────────────────────
print(f"\n=== Sanity check ({best_name}) ===")
for u, expected in TEST_URLS:
    feats = np.array([extract_features(u)])
    prob  = best_model.predict_proba(feats)[0][1]
    label = "PHISHING" if prob >= 0.5 else "BENIGN"
    status = "[OK]" if label == expected else "[FAIL]"
    print(f"  {status} {label} ({prob:.3f}) expected={expected}")
    print(f"       {u[:80]}")

# ── Feature importance ─────────────────────────────────────────────────────────
try:
    imps = best_model.feature_importances_
    if best_info['type'] == 'lgbm':
        imps = imps / imps.sum()
    print(f"\nTop 10 features ({best_name}):")
    for fname, imp in sorted(zip(FEATURE_NAMES, imps), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {fname:<35}: {imp:.4f}  {'#'*int(imp*40)}")
except Exception as e:
    print(f"  (importances unavailable: {e})")

# ── Export model ───────────────────────────────────────────────────────────────
print(f"\nExporting {best_name} -> best_model.json ...")

def export_xgb_node(node):
    if 'leaf' in node:
        return {'feature': -2, 'threshold': -2.0, 'leaf': float(node['leaf'])}
    feat_idx = int(node['split'].replace('f', ''))
    children = node.get('children', [])
    return {
        'feature':   feat_idx,
        'threshold': float(node['split_condition']),
        'left':  export_xgb_node(children[0]) if children else {'feature':-2,'threshold':-2.0,'leaf':0.0},
        'right': export_xgb_node(children[1]) if len(children)>1 else {'feature':-2,'threshold':-2.0,'leaf':0.0},
    }

trees_exported = []
model_type = best_info['type']

if model_type in ('xgboost', 'lgbm'):
    # Always export as XGBoost JSON (LightGBM fallback)
    if model_type == 'lgbm':
        print("  LightGBM: falling back to XGBoost export")
        best_name  = 'XGBoost'
        best_info  = models['XGBoost']
        best_model = best_info['model']
        model_type = 'xgboost'
    raw_dump = best_model.get_booster().get_dump(dump_format='json')
    trees_exported = [export_xgb_node(json.loads(t)) for t in raw_dump]
    base_score = float(best_model.get_params().get('base_score') or 0.5)

model_data = {
    'type':          best_name,
    'model_family':  model_type,
    'n_trees':       len(trees_exported),
    'n_features':    len(FEATURE_NAMES),
    'feature_names': FEATURE_NAMES,
    'accuracy':      round(best_info['acc'], 4),
    'auc':           round(best_info['auc'], 4),
    'base_score':    base_score if model_type == 'xgboost' else 0.5,
    'trees':         trees_exported,
}

with open('best_model.json', 'w') as f:
    json.dump(model_data, f, separators=(',', ':'))
size_mb = os.path.getsize('best_model.json') / 1_000_000
print(f"Saved best_model.json  ({size_mb:.1f} MB, {len(trees_exported)} trees)")

# ── Patch phishing_detector.js ─────────────────────────────────────────────────
JS_FILE = 'phishing_detector.js'
if os.path.exists(JS_FILE):
    print(f"\nPatching {JS_FILE} ...")
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()
    model_json_str = json.dumps(model_data, separators=(',', ':'))
    pattern     = r'const ML_MODEL\s*=\s*\{[\s\S]*?\}(?=\s*;)'
    new_js, n   = re.subn(pattern, f'const ML_MODEL = {model_json_str}', js, count=1)
    if n == 1:
        with open(JS_FILE, 'w', encoding='utf-8') as f:
            f.write(new_js)
        print(f"  [OK] ML_MODEL patched in {JS_FILE}")
    else:
        print(f"  [WARN] Could not find ML_MODEL constant — patch skipped")
else:
    print(f"  [WARN] {JS_FILE} not found")

print(f"\n[DONE] Reload the extension to apply the new model.")
print(f"   Model : {best_name}")
print(f"   Acc   : {best_info['acc']:.4f}")
print(f"   AUC   : {best_info['auc']:.4f}")
