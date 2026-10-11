# Inside Out quiz

Built to Amanda's brief of 11 October 2026. Eight questions at `quiz.sheisai.ai`,
details taken once before the result, sent straight to Ivorey, then on to the
landing page already signed up.

```
quiz.sheisai.ai  →  intro  →  8 questions  →  your details  →  POST /api/lead
                 →  Ivorey inbound webhook  →  result on screen
                 →  join.sheisai.ai/welcome?result=…&utm_…
```

Plain static HTML and one serverless function. No build step, no `package.json`,
nothing to install. Nothing claude.ai-only: no `window.storage`, no `window.claude`,
no Claude API. The only browser storage is `sessionStorage`, holding the campaign
parameters so a refresh mid-quiz does not lose attribution.

---

## Environment variables

Set these in Vercel → Settings → Environment Variables, for Production, Preview
and Development, then redeploy.

| Variable | Who provides it | Required |
|---|---|---|
| `IVOREY_WEBHOOK_URL` | Amanda, from the Ivorey workflow's Inbound Webhook trigger | yes |
| `BACKUP_WEBHOOK_URL` | Anything that accepts a POST, if one is ever added | no |

There is no Airtable, so Ivorey is the only destination and the safety net is
three things instead. The function retries a temporary failure up to three
times over about a second and a half. The page then offers one more attempt.
If every attempt fails, the whole lead is printed to the Vercel log, which is
the last copy of it.

A 4xx is never retried, because a request Ivorey has already rejected will be
rejected again. Only a timeout, a network fault, a 5xx or a rate limit repeats.

`BACKUP_WEBHOOK_URL` is optional and unset. If a Google Sheet or a Pabbly hook
is added later, putting its URL here is the only change needed.

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
so the Ivorey contact records what was actually on screen rather than what it
says today. Change it here and both move together.

## Files

| | |
|---|---|
| `inside-out-quiz.html` | The quiz. Questions, scoring, details step, result |
| `api/lead.js` | The only endpoint. Validates, then sends to Ivorey with retries |
| `privacy.html` | Collection notice the consent box links to |
| `DEPLOY.md` | The browser steps, the Ivorey setup, the launch tests |
| `vercel.json` | Rewrites `/` to the quiz, security headers |
| `.vercelignore` | Keeps working documents off the public domain |

The rest are working notes — the questions, the four results, the twenty that were
written to choose from — and they are excluded from the deployment.

The Sol Map and the Foundation Workbook are a separate project and are not in this
repo.
