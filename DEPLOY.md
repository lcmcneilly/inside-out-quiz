# Shipping the quiz

Built to Amanda's brief. The code is done. What is left needs a password, which is
why it is yours and not mine. The environment variable and the result codes are in
[README.md](README.md).

---

## 1 · Push

```bash
cd "/Users/lauramcneilly/Desktop/SOL CODE/Sol Map App/onboarding" && git push -u origin she-is-sol-onboarding
```

If it asks for a password, that is a GitHub personal access token, not your account
password. GitHub → Settings → Developer settings → Personal access tokens.

## 2 · Vercel project

1. vercel.com → Add New → Project → import `lcmcneilly/SHEISSOL`
2. Root directory: the repository root. This repo *is* the quiz
3. Framework preset: Other. No build command, no output directory
4. Deploy

`api/lead.js` is picked up as a serverless function on its own.

## 3 · Environment variable

The one in the README. Production, Preview and Development, then redeploy.

Just one is required: `IVOREY_WEBHOOK_URL`, the Inbound Webhook URL from Amanda's
workflow. Until it is set, `/api/lead` returns an error and the quiz shows its retry
message, so do not send traffic before this step.

## 4 · Domain

1. Vercel → project → Settings → Domains → add `quiz.sheisai.ai`
2. Vercel shows a CNAME. At whoever runs DNS for `sheisai.ai`:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `quiz` | whatever Vercel shows, usually `cname.vercel-dns.com` |

3. Wait for the certificate. Usually minutes.

---

## Amanda's side, in Ivorey

From the brief, with two additions at the end.

- [ ] Workflow with the **Inbound Webhook** trigger. Its URL goes into Vercel as `IVOREY_WEBHOOK_URL`
- [ ] Map the incoming fields. **Two test payloads have already been sent to the webhook**, both returning `Success`, so the sample data is waiting in the workflow: `first_name`, `email`, `consent`, `consent_text`, `result_type`, `result_name`, `door`, `answers`, `source`, `submitted_at`, and the four `utm_` fields
- [ ] Delete the two test contacts: `claude-test-delete-me@sheisai.ai` and `claude-test-delete-me-2@sheisai.ai`
- [ ] **Publish the workflow.** The webhook replies "test request received", which is what a workflow still in Draft says. A live quiz pointed at a draft workflow captures nothing
- [ ] **Create/Update Contact** action, matched on email
- [ ] **Add Contact Tag**: `io-waitlist`, `io-quiz-complete`, `src-quiz`, plus `io-result-<result_type>`
- [ ] **Also add `io-door-<door>`** — the welcome comes from Laura on the SOL door and from Amanda on the AI door, which the brief's four tags cannot express. See the README
- [ ] Settings → Business → Contact Deduplication Preferences set to match on **email**
- [ ] Welcome email workflow triggers on `io-waitlist` added, **send once per contact**
- [ ] **Double opt-in off.** You asked for this and it is not something the code controls. If it is on, the email carrying somebody's result waits on a confirmation click most people never make. This is the likeliest way the whole thing ships quietly broken
- [ ] Landing page form also adds `io-waitlist` and `src-landing`

---

## Test before launch

Phone and desktop, a fresh email each time.

- [ ] **Quiz route.** Finish the quiz. The Ivorey contact exists with all five tags, the welcome arrives with the right result, the button lands on `/welcome`
- [ ] **Direct route.** Sign up on `join.sheisai.ai` with a different email. Contact gets `io-waitlist` and `src-landing`, welcome arrives
- [ ] **Both routes, same email.** One contact, both tags, one welcome
- [ ] **Ivorey down.** Break `IVOREY_WEBHOOK_URL` on purpose. The quiz asks to try once more, then shows the result anyway, and the Vercel log holds the lead
- [ ] **Bad input.** Invalid email and unticked consent are both blocked
- [ ] **Campaign link.** Open `quiz.sheisai.ai/?utm_source=instagram&utm_content=a05`. Both reach Ivorey and the `/welcome` link
- [ ] **Every result.** All four redirect correctly and get their own tag

Everything above is already verified against stubs, and the live webhook has taken two
real test payloads. What is left to prove is only what happens inside Ivorey: whether
the workflow maps the fields and fires the right welcome.

If something does not arrive: Vercel → project → Logs. A failed delivery prints the
whole lead.

---

## What the code does on failure

| What fails | What somebody sees | Where the lead is |
|---|---|---|
| Nothing | Result, straight away | In Ivorey |
| Ivorey, briefly | Result, after about a second | In Ivorey. The function retried and got through |
| Ivorey, once properly | "Press it once more" | Nowhere yet. Their answers are kept |
| Ivorey, twice | Result anyway | Vercel log only. This is the brief's rule: her result is hers |

Without Airtable there is no second copy, so the Vercel log is the last line of
defence and it does not keep things for long. If this starts mattering, a free
Pabbly or Google Sheets hook in `BACKUP_WEBHOOK_URL` closes the gap with no code
change.

## One note on the repo

`index.html` is excluded from the deployment — see `.vercelignore`. It redirects to the
Sol Map, which would beat the rewrite that puts the quiz at `/`. The Sol Map is still
reachable at `/sol-map.html`. When it gets its own subdomain it wants a second Vercel
project, not this one.
