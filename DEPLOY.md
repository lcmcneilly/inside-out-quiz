# Shipping the quiz

Everything in this repo is ready. What is left is four things in a browser that
need a password, which is why they are yours and not mine. Budget twenty minutes.

The flow once it is live:

```
quiz.sheisai.ai  →  8 questions  →  result on screen  →  name + email
                 →  POST /api/join  →  Ivorey contact + tags
                 →  redirect to join.sheisai.ai
                 →  Ivorey workflow sends the welcome email with their result
```

---

## 1 · Push this repo

Already committed on `she-is-sol-onboarding`. You need to push it, because I cannot
authenticate as you:

```bash
cd "/Users/lauramcneilly/Desktop/SOL CODE/Sol Map App/onboarding" && git push -u origin she-is-sol-onboarding
```

If it asks for a password, that is a GitHub personal access token, not your account
password. GitHub → Settings → Developer settings → Personal access tokens.

## 2 · Create the Vercel project

1. vercel.com → Add New → Project → import `lcmcneilly/SHEISSOL`
2. Root directory: leave as the repository root — this repo *is* the quiz
3. Framework preset: Other. No build command, no output directory
4. Deploy

Vercel picks up `api/join.js` as a serverless function on its own. There is no
`package.json` and nothing to install — the function uses built-in `fetch`.

## 3 · Add the Ivorey credentials

In Vercel → the project → Settings → Environment Variables. Add these to
**Production, Preview and Development**, then redeploy.

| Name | Value | Required |
|---|---|---|
| `IVOREY_TOKEN` | Your Ivorey Private Integration Token | yes |
| `IVOREY_LOCATION_ID` | Your Ivorey location / sub-account id | yes |
| `IVOREY_API_BASE` | Only if Ivorey's API guide gives a different host | no |
| `BACKUP_WEBHOOK_URL` | Any URL that accepts a POST | no, but do it |

**Getting the token:** Ivorey → Settings → Private Integrations (or ask their support
chat for "a Private Integration Token with contacts write access"). It needs the
**contacts write** scope. Nothing else.

**One thing I could not verify.** Ivorey's own API guide is behind their login, so I
could not read the exact endpoint. The code calls
`https://services.leadconnectorhq.com/contacts/upsert`, which is the standard endpoint
for a platform issuing "Private Integration Tokens". If Ivorey's guide names a
different host, put it in `IVOREY_API_BASE` and nothing else has to change. This is
exactly why `BACKUP_WEBHOOK_URL` is worth setting before you send traffic.

**The backup.** Set `BACKUP_WEBHOOK_URL` to a Zapier or Pabbly catch-hook, or anything
that accepts a POST. The function writes to Ivorey and the backup independently, and
only tells somebody it failed if *both* fail. Five minutes now means a wrong token
costs you a retry instead of a day of leads.

## 4 · Point the domain

1. Vercel → project → Settings → Domains → add `quiz.sheisai.ai`
2. Vercel shows you a CNAME. At whoever runs DNS for `sheisai.ai`, add:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `quiz` | `cname.vercel-dns.com` (use whatever Vercel shows) |

3. Wait for the certificate. Usually minutes.

---

## In Ivorey, before you send traffic

**Turn off double opt-in.** You asked for this and it is not something the code
controls — it is an Ivorey setting. If it is on, the welcome email carrying somebody's
result does not send until they click a confirmation, and most will not. This is the
most likely way the whole thing ships quietly broken.

**Build the welcome workflow.** Trigger on contact tag added. The copy is already
written in `05-Funnel/Waitlist emails/Inside Out waitlist emails — copy for Flodesk.md`
— the same copy works, it is just built in Ivorey instead.

Every contact arrives with these tags:

| Tag | On every contact |
|---|---|
| `inside-out-waitlist` | yes |
| `founding-member` | yes |
| `source-quiz` | yes |
| `quiz-judgement` / `quiz-jealousy` / `quiz-neediness` / `quiz-fear` | one of the four |
| `door-sol` / `door-ai` | one of the two |

So the welcome is: trigger on `source-quiz` added, then branch on the four
`quiz-*` tags to pick which of the four emails sends. The `door-*` tag decides whether
it comes from Laura or from Amanda.

Anyone who joins from the landing page instead of the quiz has no `quiz-*` tag, which
is your "no quiz" welcome — the fifth version already written.

---

## What to test once it is live

1. Take the quiz on your phone, end to end, with a real email
2. Confirm the contact lands in Ivorey with five tags
3. Confirm the welcome arrives, and that it is the right one of the four
4. Confirm you land on `join.sheisai.ai`
5. Take it again with the same email — it should update the contact, not duplicate it
6. Take it again picking different answers, and confirm the tags change

If something does not arrive: Vercel → project → Logs. A failure prints the whole lead,
so nothing is lost even on the worst day.

---

## Notes on what was decided

**The result is not gated.** Somebody can take all eight questions and read their whole
result without typing anything. The form sits underneath it. Gating costs more
completions on cold ad traffic than it gains addresses, and it reads badly on a quiz
whose first line is "nothing is scored and nothing is compared".

**The answers are never sent.** Scoring happens in the browser. What reaches the server
is a first name, an email, and two words. That is a deliberately small amount of
personal information to be holding, and `privacy.html` says so plainly.

**`index.html` is excluded from the deployment** — see `.vercelignore`. It redirects to
the Sol Map, which would beat the rewrite that puts the quiz at `/`. The Sol Map is
still reachable at `/sol-map.html`. When the Sol Map gets its own subdomain it wants a
second Vercel project, not this one.
