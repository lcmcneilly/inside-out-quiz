/* ===========================================================================
   POST /api/lead
   The only address the browser ever talks to, so the Airtable token and the
   Ivorey webhook stay on the server.

   Order matters, and it is the order in the brief:
     1. Check      — email, consent, honeypot.
     2. Back up    — write the row to Airtable with ivorey_status "pending",
                     before anything else, so no lead is ever lost.
     3. Ivorey     — POST the same fields to the Inbound Webhook.
     4. Record     — patch the row to "sent" or "failed" with the error, so a
                     failure is visible and re-sendable rather than silent.
     5. Reply      — success as soon as the backup is saved, even if Ivorey
                     failed. The result then shows.
   =========================================================================== */

const AIRTABLE = 'https://api.airtable.com/v0';

/* Deliberately loose. The job is to catch a typo, not to adjudicate RFC 5322. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

const clean = (v, max) => String(v == null ? '' : v).trim().replace(/\s+/g, ' ').slice(0, max);

async function call(url, opts, ms = 8000) {
  const signal = AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined;
  const r = await fetch(url, { ...opts, signal });
  const text = await r.text().catch(() => '');
  return { ok: r.ok, status: r.status, text, json: safeParse(text) };
}
function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const b = typeof req.body === 'string' ? (safeParse(req.body) || {}) : (req.body || {});

  /* 1 · CHECK ------------------------------------------------------------- */

  /* Honeypot. A person never fills a field they cannot see. Reply 200 so a bot
     learns nothing from the answer, and write nothing anywhere. */
  if (clean(b.company, 80)) return res.status(200).json({ ok: true });

  const first_name = clean(b.first_name, 60);
  const email      = clean(b.email, 160).toLowerCase();

  if (!first_name)          return res.status(400).json({ ok: false, error: 'first_name' });
  if (!EMAIL.test(email))   return res.status(400).json({ ok: false, error: 'email' });
  if (b.consent !== true)   return res.status(400).json({ ok: false, error: 'consent' });

  const lead = {
    first_name,
    email,
    consent: true,
    consent_text: clean(b.consent_text, 400),
    result_type:  clean(b.result_type, 40).toLowerCase(),
    result_name:  clean(b.result_name, 60),
    /* Not in the brief's table. The welcome emails come from Laura on the SOL
       door and from Amanda on the AI door, so the door has to travel with the
       lead or the workflow cannot tell them apart. */
    door:         clean(b.door, 10).toLowerCase(),
    answers:      String(b.answers == null ? '' : b.answers).slice(0, 4000),
    source:       'quiz',
    submitted_at: new Date().toISOString()
  };
  for (const k of UTM) lead[k] = clean(b[k], 120);

  /* 2 · BACK UP FIRST ----------------------------------------------------- */
  const saved = await airtableCreate(lead);

  if (!saved.ok) {
    /* The one case the browser is told about. Log the whole lead so it is
       recoverable from the function log even on the worst day. */
    console.error('[lead] AIRTABLE FAILED, nothing stored:', saved.why, JSON.stringify(lead));
    return res.status(502).json({ ok: false, error: 'store' });
  }

  /* 3 · IVOREY ------------------------------------------------------------ */
  const sent = await toIvorey(lead);

  /* 4 · RECORD THE OUTCOME ------------------------------------------------ */
  await airtablePatch(saved.id, sent.ok
    ? { ivorey_status: 'sent',   ivorey_error: '' }
    : { ivorey_status: 'failed', ivorey_error: String(sent.why).slice(0, 900) }
  ).catch(e => console.error('[lead] could not patch status:', e && e.message));

  if (!sent.ok) console.error('[lead] ivorey failed, row saved as failed:', sent.why, email);

  /* 5 · REPLY ------------------------------------------------------------- */
  return res.status(200).json({ ok: true, ivorey: sent.ok });
}

/* --------------------------------------------------------------- AIRTABLE */
function airtableCfg() {
  const token = process.env.AIRTABLE_TOKEN;
  const base  = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || 'Leads';
  if (!token || !base) return null;
  return {
    url: AIRTABLE + '/' + base + '/' + encodeURIComponent(table),
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  };
}

async function airtableCreate(lead) {
  const c = airtableCfg();
  if (!c) return { ok: false, why: 'airtable not configured' };

  /* typecast lets Airtable coerce a value into a single-select or checkbox
     rather than rejecting the whole row, which matters when Amanda adds a new
     result tag before this code knows about it. */
  const r = await call(c.url, {
    method: 'POST',
    headers: c.headers,
    body: JSON.stringify({
      typecast: true,
      fields: { ...lead, ivorey_status: 'pending', ivorey_error: '' }
    })
  });
  if (!r.ok) return { ok: false, why: 'airtable ' + r.status + ' ' + r.text.slice(0, 400) };
  return { ok: true, id: r.json && r.json.id };
}

async function airtablePatch(id, fields) {
  const c = airtableCfg();
  if (!c || !id) return;
  await call(c.url + '/' + id, {
    method: 'PATCH',
    headers: c.headers,
    body: JSON.stringify({ typecast: true, fields })
  });
}

/* ----------------------------------------------------------------- IVOREY */
async function toIvorey(lead) {
  const url = process.env.IVOREY_WEBHOOK_URL;
  if (!url) return { ok: false, why: 'IVOREY_WEBHOOK_URL not set' };
  const r = await call(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead)
  });
  return r.ok ? { ok: true } : { ok: false, why: 'ivorey ' + r.status + ' ' + r.text.slice(0, 400) };
}
