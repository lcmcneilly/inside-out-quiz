/* ===========================================================================
   POST /api/join
   The quiz hands this four things: a first name, an email, and the two words
   that came out of the answers — the pattern and the door. It writes them to
   Ivorey as a contact with tags, and Ivorey's own workflow sends the welcome.

   Nothing else is sent. The eight answers stay in the browser and are never
   transmitted, so what this holds is a name, an email and two labels.

   The Ivorey token lives in an environment variable and never reaches the
   page, which is the whole reason this function exists.
   =========================================================================== */

/* Ivorey issues a "Private Integration Token", which is the LeadConnector
   convention, so that is the base this defaults to. If Ivorey's API guide
   gives a different host, set IVOREY_API_BASE and nothing else changes. */
const DEFAULT_BASE = 'https://services.leadconnectorhq.com';
const API_VERSION  = '2021-07-28';

/* Allowed values, so nothing arbitrary can be written into a tag. */
const PATTERNS = ['judgement', 'jealousy', 'neediness', 'fear'];
const DOORS    = ['sol', 'ai'];

/* Deliberately loose. The job is to catch a typo, not to adjudicate RFC 5322. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v, max) => String(v == null ? '' : v).trim().replace(/\s+/g, ' ').slice(0, max);

async function postJSON(url, headers, body, ms = 8000) {
  const stop = AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: stop
  });
  const text = await r.text().catch(() => '');
  return { ok: r.ok, status: r.status, text: text.slice(0, 600) };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});

  /* Honeypot. A real person never fills a field they cannot see. Answer 200 so
     a bot learns nothing from the response, and write nothing. */
  if (clean(body.company, 80)) return res.status(200).json({ ok: true });

  const name    = clean(body.name, 60);
  const email   = clean(body.email, 160).toLowerCase();
  const pattern = clean(body.pattern, 20).toLowerCase();
  const door    = clean(body.door, 10).toLowerCase();

  if (!name)                    return res.status(400).json({ ok: false, error: 'name' });
  if (!EMAIL.test(email))       return res.status(400).json({ ok: false, error: 'email' });
  if (body.consent !== true)    return res.status(400).json({ ok: false, error: 'consent' });

  const tags = ['inside-out-waitlist', 'founding-member', 'source-quiz'];
  if (PATTERNS.includes(pattern)) tags.push('quiz-' + pattern);
  if (DOORS.includes(door))       tags.push('door-' + door);

  const lead = {
    name,
    email,
    pattern: PATTERNS.includes(pattern) ? pattern : null,
    door: DOORS.includes(door) ? door : null,
    tags,
    source: 'Inside Out quiz',
    at: new Date().toISOString()
  };

  /* Two destinations, tried independently. Ivorey is the real one. The backup
     webhook is there so that a wrong token or a changed endpoint costs us a
     retry, not a lead. Set BACKUP_WEBHOOK_URL to anything that accepts a POST. */
  const results = await Promise.allSettled([
    sendToIvorey(lead),
    sendToBackup(lead)
  ]);

  const ivorey = settled(results[0]);
  const backup = settled(results[1]);

  if (ivorey.ok || backup.ok) {
    if (!ivorey.ok) console.error('[join] ivorey failed, backup held the lead:', ivorey.why, email);
    return res.status(200).json({ ok: true });
  }

  /* Both failed. Log the whole lead so it is recoverable from the function log,
     and tell the page plainly rather than pretending it worked. */
  console.error('[join] NOTHING STORED', { lead, ivorey: ivorey.why, backup: backup.why });
  return res.status(502).json({ ok: false, error: 'store' });
}

function settled(r) {
  if (r.status === 'rejected') return { ok: false, why: String(r.reason && r.reason.message || r.reason) };
  return r.value;
}

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }

async function sendToIvorey(lead) {
  const token      = process.env.IVOREY_TOKEN;
  const locationId = process.env.IVOREY_LOCATION_ID;
  const base       = (process.env.IVOREY_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');
  if (!token || !locationId) return { ok: false, why: 'not configured' };

  /* Upsert rather than create: somebody retaking the quiz should have their
     tags updated, not produce a duplicate contact or a 400. */
  const [first, ...rest] = lead.name.split(' ');
  const r = await postJSON(
    base + '/contacts/upsert',
    { Authorization: 'Bearer ' + token, Version: API_VERSION, Accept: 'application/json' },
    {
      locationId,
      firstName: first,
      lastName: rest.join(' ') || undefined,
      name: lead.name,
      email: lead.email,
      tags: lead.tags,
      source: lead.source
    }
  );
  return r.ok ? { ok: true } : { ok: false, why: 'ivorey ' + r.status + ' ' + r.text };
}

async function sendToBackup(lead) {
  const url = process.env.BACKUP_WEBHOOK_URL;
  if (!url) return { ok: false, why: 'not configured' };
  const r = await postJSON(url, {}, lead);
  return r.ok ? { ok: true } : { ok: false, why: 'backup ' + r.status };
}
