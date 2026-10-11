/* ===========================================================================
   POST /api/lead
   The only address the browser ever talks to, so the Ivorey webhook URL stays
   on the server. Anyone holding that URL can write contacts into the account,
   which is the whole reason this function exists.

     1. Check   — email, consent, honeypot.
     2. Send    — POST the fields to Ivorey's Inbound Webhook, retrying a
                  couple of times if the failure looks temporary.
     3. Reply   — 200 once Ivorey has it, and the result shows.

   The brief had Airtable as a backup written before anything else. There is no
   Airtable, so Ivorey is the only destination and the safety net is different:
   retries on this side, a second attempt from the page, and the whole lead
   written to the log if every one of them fails. BACKUP_WEBHOOK_URL is left in
   so a Google Sheet or a Pabbly hook can be added later without a code change.
   =========================================================================== */

/* Deliberately loose. The job is to catch a typo, not to adjudicate RFC 5322. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

/* Three attempts at 4s, with a short wait between. Worst case is about 13s,
   inside the 15s maxDuration set for this function in vercel.json. */
const ATTEMPTS = 3;
const TIMEOUT_MS = 4000;
const BACKOFF_MS = [400, 1000];

const clean = (v, max) => String(v == null ? '' : v).trim().replace(/\s+/g, ' ').slice(0, max);
const wait  = ms => new Promise(r => setTimeout(r, ms));

function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }

async function post(url, payload, ms) {
  const signal = AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal
  });
  const text = await r.text().catch(() => '');
  return { ok: r.ok, status: r.status, text: text.slice(0, 400) };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const b = typeof req.body === 'string' ? (safeParse(req.body) || {}) : (req.body || {});

  /* 1 · CHECK ------------------------------------------------------------- */

  /* Honeypot. A person never fills a field they cannot see. Reply 200 so a bot
     learns nothing from the answer, and send nothing anywhere. */
  if (clean(b.company, 80)) return res.status(200).json({ ok: true });

  const first_name = clean(b.first_name, 60);
  const email      = clean(b.email, 160).toLowerCase();

  if (!first_name)        return res.status(400).json({ ok: false, error: 'first_name' });
  if (!EMAIL.test(email)) return res.status(400).json({ ok: false, error: 'email' });
  if (b.consent !== true) return res.status(400).json({ ok: false, error: 'consent' });

  const lead = {
    first_name,
    email,
    consent: true,
    consent_text: clean(b.consent_text, 400),
    result_type:  clean(b.result_type, 40).toLowerCase(),
    result_name:  clean(b.result_name, 60),
    /* Not in the brief's table. The welcome comes from Laura on the SOL door
       and from Amanda on the AI door, so the door has to travel with the lead
       or the workflow cannot tell them apart. */
    door:         clean(b.door, 10).toLowerCase(),
    answers:      String(b.answers == null ? '' : b.answers).slice(0, 4000),
    source:       'quiz',
    submitted_at: new Date().toISOString()
  };
  for (const k of UTM) lead[k] = clean(b[k], 120);

  /* 2 · SEND -------------------------------------------------------------- */
  const sent = await sendToIvorey(lead);
  if (sent.ok) return res.status(200).json({ ok: true });

  /* Ivorey would not take it. Try the spare destination if one is configured. */
  const spare = await sendToBackup(lead);
  if (spare.ok) {
    console.error('[lead] ivorey failed, backup held it:', sent.why, email);
    return res.status(200).json({ ok: true, ivorey: false });
  }

  /* 3 · NOTHING WORKED ----------------------------------------------------- */
  /* Print the whole lead. The page will offer one more attempt, and if that
     also fails it shows the result anyway — so this log is the last copy. */
  console.error('[lead] NOT DELIVERED', JSON.stringify({ lead, ivorey: sent.why, backup: spare.why }));
  return res.status(502).json({ ok: false, error: 'deliver' });
}

/* ----------------------------------------------------------------- IVOREY */
async function sendToIvorey(lead) {
  const url = process.env.IVOREY_WEBHOOK_URL;
  if (!url) return { ok: false, why: 'IVOREY_WEBHOOK_URL not set' };

  let why = '';
  for (let i = 0; i < ATTEMPTS; i++) {
    if (i) await wait(BACKOFF_MS[i - 1] || 1000);
    try {
      const r = await post(url, lead, TIMEOUT_MS);
      if (r.ok) return { ok: true };
      why = 'ivorey ' + r.status + ' ' + r.text;
      /* A 4xx means the request itself is wrong, and sending it again will not
         fix it. Only a timeout, a network fault, a 5xx or a rate limit is worth
         repeating. */
      if (r.status < 500 && r.status !== 429) break;
    } catch (e) {
      why = 'ivorey ' + String(e && e.name === 'TimeoutError' ? 'timeout' : (e && e.message) || e);
    }
  }
  return { ok: false, why };
}

/* ----------------------------------------------------------------- BACKUP */
/* Optional. Nothing breaks when it is unset; this simply does not run. */
async function sendToBackup(lead) {
  const url = process.env.BACKUP_WEBHOOK_URL;
  if (!url) return { ok: false, why: 'not configured' };
  try {
    const r = await post(url, lead, TIMEOUT_MS);
    return r.ok ? { ok: true } : { ok: false, why: 'backup ' + r.status };
  } catch (e) {
    return { ok: false, why: 'backup ' + ((e && e.message) || e) };
  }
}
