# Shipping the quiz

Built to Amanda's brief. The code is done. What is left needs a password, which is
why it is yours and not mine. Environment variables and Airtable columns are in
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

## 3 · Environment variables

The four in the README. Production, Preview and Development, then redeploy.

Amanda provides all of them: the Ivorey Inbound Webhook URL, and the three Airtable
values. Until they are set, `/api/lead` returns an error and the quiz shows its retry
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
- [ ] Send one test lead from the quiz, then map the fields: `first_name`, `email`, `result_type`, `door`, `consent`, and the four `utm_` fields
- [ ] **Create/Update Contact** action, matched on email
- [ ] **Add Contact Tag**: `io-waitlist`, `io-quiz-complete`, `src-quiz`, plus `io-result-<result_type>`
- [ ] **Also add `io-door-<door>`** — the welcome comes from Laura on the SOL door and from Amanda on the AI door, which the brief's four tags cannot express. See the README
- [ ] Settings → Business → Contact Deduplication Preferences set to match on **email**
- [ ] Welcome email workflow triggers on `io-waitlist` added, **send once per contact**
- [ ] **Double opt-in off.** You asked for this and it is not something the code controls. If it is on, the email carrying somebody's result waits on a confirmation click most people never make. This is the likeliest way the whole thing ships quietly broken
- [ ] Landing page form also adds `io-waitlist` and `src-landing`
- [ ] Airtable base "Inside Out leads" with the columns in the README, and a token limited to it

---

## Test before launch

Phone and desktop, a fresh email each time.

- [ ] **Quiz route.** Finish the quiz. Airtable row says `sent`, the Ivorey contact exists with all five tags, the welcome arrives with the right result, the button lands on `/welcome`
- [ ] **Direct route.** Sign up on `join.sheisai.ai` with a different email. Contact gets `io-waitlist` and `src-landing`, welcome arrives
- [ ] **Both routes, same email.** One contact, both tags, one welcome
- [ ] **Ivorey down.** Break `IVOREY_WEBHOOK_URL` on purpose. The result still shows, Airtable records `failed` with the error in `ivorey_error`
- [ ] **Bad input.** Invalid email and unticked consent are both blocked
- [ ] **Campaign link.** Open `quiz.sheisai.ai/?utm_source=instagram&utm_content=a05`. Both reach Airtable, Ivorey and the `/welcome` link
- [ ] **Every result.** All four redirect correctly and get their own tag

Everything above except the two live-service checks is already verified against stubs.
What cannot be tested without real credentials is whether Airtable accepts the column
names and whether Ivorey's webhook maps the fields — which is what the first test lead
is for.

If something does not arrive: Vercel → project → Logs. An Airtable failure prints the
whole lead, so nothing is unrecoverable even on the worst day.

---

## What the code does on failure

| What fails | What somebody sees | Where the lead is |
|---|---|---|
| Nothing | Result, straight away | Airtable `sent`, contact in Ivorey |
| Ivorey | Result, straight away | Airtable `failed` with the error. Re-send from Airtable |
| Airtable, once | "Press it once more" | Nowhere yet. Their answers are kept |
| Airtable, twice | Result anyway | Vercel log only. This is the brief's rule: her result is hers |

---

## One note on the repo

`index.html` is excluded from the deployment — see `.vercelignore`. It redirects to the
Sol Map, which would beat the rewrite that puts the quiz at `/`. The Sol Map is still
reachable at `/sol-map.html`. When it gets its own subdomain it wants a second Vercel
project, not this one.
