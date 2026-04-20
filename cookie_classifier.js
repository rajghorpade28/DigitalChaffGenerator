// ─── Known tracker/ad/analytics domains ────────────────────────────────────
export const TRACKER_DOMAINS = new Set([
    // Google
    'google-analytics.com', 'analytics.google.com', 'doubleclick.net',
    'googleadservices.com', 'googlesyndication.com', 'googletagmanager.com',
    'googletagservices.com', 'google.com', 'adsense.google.com',

    // Meta / Facebook
    'facebook.net', 'connect.facebook.net', 'graph.facebook.com',
    'pixel.facebook.com', 'an.facebook.com',

    // Microsoft / Bing
    'bat.bing.com', 'ads.microsoft.com', 'clarity.ms',

    // Twitter / X
    'ads.twitter.com', 'analytics.twitter.com', 't.co',

    // Amazon Advertising
    'amazon-adsystem.com', 'adsymptotic.com',

    // Programmatic / DSP
    'criteo.com', 'criteo.net', 'adnxs.com', 'appnexus.com',
    'rubiconproject.com', 'pubmatic.com', 'openx.net', 'casalemedia.com',
    'mookie1.com', 'zedo.com', 'advertising.com', 'adform.net',
    'taboola.com', 'outbrain.com',

    // Data / Identity
    'scorecardresearch.com', 'quantserve.com', 'quantcount.com',
    'demdex.net', 'omtrdc.net', 'liveramp.com', 'liveramp.net',

    // Social sharing
    'addthis.com', 'sharethis.com',

    // Analytics
    'hotjar.com', 'mouseflow.com', 'fullstory.com', 'logrocket.com',
    'segment.com', 'segment.io', 'mixpanel.com', 'amplitude.com',
    'heapanalytics.com', 'heap.io', 'chartbeat.com', 'newrelic.com',

    // A/B testing
    'optimizely.com', 'abtasty.com', 'vwo.com', 'convertexperiments.com',

    // Affiliate
    'awin1.com', 'impact.com', 'shareasale.com', 'commission-junction.com',

    // TikTok, Pinterest, Snap
    'analytics.tiktok.com', 'ads.pinterest.com', 'tr.snapchat.com',
]);

// ─── Cookie name patterns that signal tracking ──────────────────────────────
const TRACKING_PATTERNS = [
    /^_ga($|_)/, /^_gid$/, /^_gat/, /^_gcl_/,             // Google Analytics
    /^_fbp$/, /^_fbc$/, /^fr$/, /^datr$/, /^sb$/, /^c_user$/,  // Facebook
    /^__utm/,                                               // Legacy GA
    /^IDE$/, /^DSID$/, /^1P_JAR/, /^NID$/, /^SIDCC/,      // Google Ads
    /^APISID$/, /^SAPISID$/, /^__Secure-3PAPISID/,
    /^muid$/i, /^msclkid/,                                 // Microsoft
    /^_hjid$/, /^_hjSession/, /^_hjTLDTest/, /^_hjAbsoluteSessionInProgress/,
    /^__hstc$/, /^hubspotutk$/, /^__hssc$/, /^__hssrc$/,  // HubSpot
    /^mp_/, /^ajs_/,                                       // Mixpanel / Segment
    /^intercom-/,                                          // Intercom
    /^_ttp$/, /^_tt_enable_cookie$/,                       // TikTok
    /^_pin_unauth$/, /^_pinterest_/,                       // Pinterest
    /^_dc_gtm_/,                                           // GTM firing
    /^AnalyticsSyncHistory$/,
    /^lidc$/, /^bcookie$/,                                 // LinkedIn
    /^cto_bundle/, /^cto_bidid/,                           // Criteo
];

// ─── Cookie names that are almost certainly auth/session — NEVER auto-delete ─
const SAFE_PATTERNS = [
    /session/i, /^sess/i, /^auth/i, /token/i,
    /csrf/i, /xsrf/i, /^_csrf/, /^XSRF-TOKEN/,
    /login/i, /logged/i, /^user_id$/i, /userid/i, /^account/i,
    /remember/i, /^jwt$/i, /^sid$/i, /^PHPSESSID$/i,
    /^ASP\.NET_SessionId$/i, /^connect\.sid$/i,
    /^wordpress_logged_in/i, /^wp-settings/,
    /^JSESSIONID$/i, /^laravel_session$/i,
    /^_rails_session$/i, /^__stripe_(mid|sid)$/,
    /^cart/i, /^checkout/i,
];

// ─── Expiry thresholds ───────────────────────────────────────────────────────
const DAYS_365 = 365 * 24 * 3600 * 1000;
const DAYS_180 = 180 * 24 * 3600 * 1000;

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function isTrackerDomain(domain) {
    const d = domain.replace(/^\./, '');
    if (TRACKER_DOMAINS.has(d)) return true;
    for (const t of TRACKER_DOMAINS) {
        if (d.endsWith('.' + t)) return true;
    }
    return false;
}

export function isTrackingName(name) {
    return TRACKING_PATTERNS.some(p => p.test(name));
}

export function isSafeName(name) {
    return SAFE_PATTERNS.some(p => p.test(name));
}

export function isSession(cookie) {
    return !cookie.expirationDate; // no expiry = session cookie
}

/**
 * Returns true if the cookie looks like an auth/session/essential cookie
 * that must NEVER be auto-deleted.
 */
export function isEssentialCookie(cookie) {
    const name = cookie.name.toLowerCase();

    // Common auth / session name patterns
    if (
        name.includes('session') ||
        name.includes('auth')    ||
        name.includes('token')   ||
        name.includes('sid')     ||
        name.includes('jwt')
    ) {
        console.log('[DCG] Skipping essential cookie (name pattern):', cookie.name);
        return true;
    }

    // httpOnly cookies are set server-side and are almost always auth/session
    if (cookie.httpOnly) {
        console.log('[DCG] Skipping essential cookie (httpOnly):', cookie.name);
        return true;
    }

    // No expiry → session cookie (browser-lifetime only)
    if (!cookie.expirationDate) {
        console.log('[DCG] Skipping essential cookie (session / no expiry):', cookie.name);
        return true;
    }

    // Matches the broader safe-name patterns already defined above
    if (isSafeName(cookie.name)) {
        console.log('[DCG] Skipping essential cookie (safe pattern):', cookie.name);
        return true;
    }

    return false;
}

/**
 * Returns true when the cookie belongs to the current site's domain
 * (first-party) and should be preserved in safe / balanced modes.
 */
export function isFirstParty(cookie, currentDomain) {
    if (!currentDomain) return false;
    const cookieDomain = cookie.domain.replace(/^\./, '');
    return cookieDomain.includes(currentDomain) || currentDomain.includes(cookieDomain);
}

export function msUntilExpiry(cookie) {
    if (!cookie.expirationDate) return 0;
    return cookie.expirationDate * 1000 - Date.now();
}

// ─── Core classification ──────────────────────────────────────────────────────
export function classifyCookie(cookie) {
    const domain = cookie.domain.replace(/^\./, '');
    const tracker = isTrackerDomain(domain);
    const trackingName = isTrackingName(cookie.name);
    const safeName = isSafeName(cookie.name);
    const session = isSession(cookie);
    const essential = isEssentialCookie(cookie); // httpOnly + auth patterns + session
    const expMs = msUntilExpiry(cookie);
    const longLived = expMs > DAYS_365;
    const medLived  = expMs > DAYS_180;

    let risk;
    const tags = [];

    if (session)       tags.push('session');
    if (cookie.httpOnly) tags.push('httpOnly');
    if (safeName)      tags.push('auth/session name');
    if (tracker)       tags.push('tracker domain');
    if (trackingName)  tags.push('tracking name');
    if (!session && longLived)  tags.push('long-lived >1yr');
    if (!session && medLived && !longLived) tags.push('med-lived >6mo');

    // Determine risk — essential/session cookies are always safe
    if (essential || safeName || session) {
        risk = 'safe';
    } else if (tracker || trackingName) {
        risk = 'high';
    } else if (longLived) {
        risk = 'high';
    } else if (medLived) {
        risk = 'medium';
    } else {
        risk = 'safe';
    }

    return { cookie, domain, tracker, trackingName, safeName, session, essential, expMs, longLived, medLived, risk, tags };
}

export function classifyAll(cookies) {
    return cookies.map(classifyCookie);
}

// ─── Cleanup filter ───────────────────────────────────────────────────────────
/**
 * mode: 'safe'       → trackers only
 *       'balanced'   → trackers + long-lived third-party (high risk)
 *       'aggressive' → everything except auth/session names
 */
export function getCleanupTargets(classified, mode, protectFirstParty = true, currentDomain = null) {
    return classified.filter(item => {
        // NEVER touch essential / auth / session / httpOnly cookies
        if (item.essential || item.safeName || item.session || item.cookie.httpOnly) {
            console.log('[DCG] Skipping essential cookie:', item.cookie.name);
            return false;
        }

        // In safe + balanced modes, preserve first-party cookies unless opted out
        if (protectFirstParty && currentDomain && isFirstParty(item.cookie, currentDomain)) {
            console.log('[DCG] Skipping first-party cookie:', item.cookie.name);
            return false;
        }

        if (mode === 'safe')       return item.tracker || item.trackingName;
        if (mode === 'balanced')   return item.risk === 'high';
        if (mode === 'aggressive') return item.risk !== 'safe'; // still won't touch essential (filtered above)
        return false;
    });
}
