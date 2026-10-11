# Inside Out quiz

Built to Amanda's brief of 11 October 2026. Eight questions at `quiz.sheisai.ai`,
details taken once before the result, saved to Airtable and then Ivorey, then on to
the landing page already signed up.

```
quiz.sheisai.ai  →  intro  →  8 questions  →  your details  →  POST /api/lead
                 →  Airtable row (pending)  →  Ivorey inbound webhook
                 →  Airtable row (sent)     →  result on screen
                 →  join.sheisai.ai/welcome?result=…&utm_…
```

Plain static HTML and one serverless function. No build step, no `package.json`,
nothing to install. Nothing claude.ai-only: no `window.storage`, no `window.claude`,
no Claude API. The only browser storage is `sessionStorage`, holding the campaign
parameters so a refresh mid-quiz does not lose attribution.

---

## Environment variables

Set all five in Vercel → Settings → Environment Variables, for Production, Preview
and Development, then redeploy.

| Variable | Who provides it | Required |
|---|---|---|
| `IVOREY_WEBHOOK_URL` | Amanda, from the Ivorey workflow's Inbound Webhook trigger | yes |
| `AIRTABLE_TOKEN` | Amanda, a personal access token limited to the leads base | yes |
| `AIRTABLE_BASE_ID` | Amanda, looks like `appXXXXXXXXXXXXXX` | yes |
| `AIRTABLE_TABLE_NAME` | `Leads` | no, defaults to `Leads` |

## Airtable columns

Base "Inside Out leads". One column per field, all plain text unless noted.

`first_name` · `email` · `consent` (checkbox) · `consent_text` · `result_type` ·
`result_name` · `door` · `answers` (long text) · `source` · `utm_source` ·
`utm_medium` · `utm_campaign` · `utm_content` · `submitted_at` ·
`ivorey_status` · `ivorey_error` (long text)

The write uses `typecast`, so Airtable coerces values into single-selects or
checkboxes rather than rejecting the whole row.

## Result codes

The four results. Amanda needs one Ivorey tag per code.

| `result_type` | `result_name` | Ivorey tag |
|---|---|---|
| `judgement` | Judgement | `io-result-judgement` |
| `jealousy` | Jealousy | `io-result-jealousy` |
| `neediness` | Neediness | `io-result-neediness` |
| `fear` | Fear | `io-result-fear` |

**There is a second axis the brief does not have.** Every result also carries a
door — `sol` or `ai` — and it is sent as `door`. It decides who the welcome email
comes from: the SOL door is Laura's, the AI door is Amanda's, which is how the copy
in `05-Funnel/Waitlist emails` is already written. Two more tags are needed:

| `door` | Ivorey tag | Welcome from |
|---|---|---|
| `sol` | `io-door-sol` | Laura |
| `ai` | `io-door-ai` | Amanda |

The AI door is rare by design — it needs no loud answer anywhere plus all three AI
answers at the strong end — so most contacts will be `io-door-sol`.

## Tags Ivorey should add

`io-waitlist` · `io-quiz-complete` · `src-quiz` · `io-result-<result_type>` ·
`io-door-<door>`

The function sends the fields; the tags are added by the Ivorey workflow, not here.

---

## Things Laura decides

**`CONFIG.privacyUrl`**, top of `inside-out-quiz.html`. Currently `/privacy.html`,
the page in this repo, so the consent link is never broken. Swap it for the SHE IS AI
privacy policy when that address exists.

**`CONFIG.welcomeUrl`**. Currently `https://join.sheisai.ai/welcome`. Amanda to
confirm once the no-form page is live.

**`CONFIG.autoRedirectSeconds`**. `0`, so the result sits there until the button is
pressed. Set it to `12` for the optional auto-redirect with a countdown somebody can
cancel. Amanda's call.

**`CONFIG.consentText`**. The exact wording, written once and sent with every lead,
so the Airtable row records what was actually on screen rather than what it says
today. Change it here and both move together.

## Files

| | |
|---|---|
| `inside-out-quiz.html` | The quiz. Questions, scoring, details step, result |
| `api/lead.js` | The only endpoint. Airtable, then Ivorey, then the status |
| `privacy.html` | Collection notice the consent box links to |
| `DEPLOY.md` | The browser steps, the Ivorey setup, the launch tests |
| `vercel.json` | Rewrites `/` to the quiz, security headers |
| `.vercelignore` | Keeps working documents off the public domain |

Everything else in this repo is the Sol Map and its working notes, and is excluded
from the deployment.
