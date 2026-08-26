# Sol Map — Privacy Act compliance

What you need to do before the assessment starts collecting anything.

*Not legal advice. This is a practical checklist against the Privacy Act 2020, written
by the person who built the thing, so a lawyer should see it before launch.*

---

## Where things stand right now

**Nothing is being collected.** `FACILITATOR_ENDPOINT` at the top of `sol-map.html` is
empty, so the app computes the reading, shows it, saves it to that one browser, and
stops. No server, no database, no analytics, no cookies.

That means **you currently have no obligations at all** — and the moment you paste an
endpoint in, you have all of them. Everything below is about that moment.

---

## What you'd be collecting

| Field | Why it matters |
|---|---|
| Name, date, time and place of birth | Identifies a specific person, precisely |
| 41 answers about emotional patterns | Emotional and psychological state |
| "Why are you here", in their words | Often discloses far more than the scales do |
| Ten raw scores + three source averages | The baseline you re-measure against |

The Privacy Act has no special "sensitive data" tier the way GDPR does — but the
Privacy Commissioner expects care to scale with the harm a leak would cause. A
spreadsheet of people's emotional states, tied to full names and birth dates, is at
the serious end of that. Treat it that way.

**One line to be careful about.** If this is ever described as assessing mental health,
or if a facilitator uses it to advise on a health issue, it stops being ordinary
personal information and falls under the **Health Information Privacy Code**, which is
stricter. Keep the language on coaching and self-knowledge — which is what it already
does — and don't let the facilitator brief drift into clinical framing.

---

## The seven things to do

### 1 · Name a Privacy Officer

Legally required — every organisation must have one, even a one-person one. They handle
access requests, correction requests, and complaints. Put the name and an email address
in the privacy statement. Realistically this is you.

### 2 · Write the collection notice, and show it *before* the questions

This is **IPP 3**, and it is the one most people get wrong. At the point of collection
you must tell someone:

- that you're collecting it, and what you'll use it for
- who will receive it (facilitators — name them as a group)
- who is holding it, with a real name and address
- that giving it is voluntary, and what happens if they don't
- that they can ask to see it and correct it, and how

Right now the app says one line above the button. That's not enough once data flows.
It needs a short notice **at the top of the assessment**, before question one — not
buried at the end after they've already answered.

Draft wording, yours to change:

> **Before you begin.** Your answers and your birth details are collected by
> [LEGAL ENTITY NAME], [ADDRESS], and used for two things: to generate your Sol Map, and
> so the SHE IS SOL facilitator who works with you has read it before you meet.
> Nobody else sees it. Answering is voluntary — you can skip any question, and you'll
> still get your map. We keep it for [PERIOD]. You can ask to see what we hold, correct
> it, or have it deleted at any time by emailing [PRIVACY OFFICER EMAIL].

### 3 · Decide how long you keep it — and write the number down

**IPP 9**: you can't hold personal information longer than you need it. "Forever" is not
a retention period.

The honest answer here is driven by the baseline: you want a retake comparable at
eighteen weeks, and probably a year on. So something like *"while you are a member, and
24 months after you leave"* is defensible. Whatever you choose, put it in the notice and
actually delete on schedule — a stated policy you don't follow is worse than none.

### 4 · Build the access, correction and delete route

**IPPs 6 and 7.** Someone can ask what you hold about them, and you have **20 working
days** to respond. They can also ask you to correct it.

With a spreadsheet this is manual, which is fine at your scale — but it only works if
rows are findable. Make sure the sheet has name and submission date as the first two
columns, and decide now who does the looking.

### 5 · Check where the data physically goes — this one has teeth

**IPP 12** governs sending personal information overseas, and everything in your stack
is overseas: Vercel (US), and whichever form service you choose. You may only send it if
the recipient is subject to comparable safeguards.

In practice:

- Use a provider that offers a **Data Processing Agreement** and publishes its
  sub-processors. Formspree, Google and Resend all do.
- Prefer one that lets you pick an **EU or Australian region** if it's offered.
- Say plainly in the privacy statement that data is stored overseas. People are entitled
  to know that.

This applies to the *storage* service. Vercel only serves the page — the assessment
answers never touch Vercel's servers unless you route the POST through a Vercel function,
which is worth knowing when you choose the approach.

### 6 · Have a breach plan before you need one

Since December 2020, a privacy breach likely to cause **serious harm** must be reported
to the Office of the Privacy Commissioner *and* to the affected people, as soon as
practicable. Given what this collects, most breaches here would clear that bar.

You need to know, in advance: who notices, who decides, who writes to people. One
paragraph in a document is enough — but write it now, not during.

### 7 · Consent for facilitator access, kept separate from the map

The person is agreeing to two different things: *generate my map* and *show my answers
to a facilitator*. Bundling them means neither is a real choice.

The cleanest fix is a single tick above the button — off by default — saying they're
happy for a facilitator to read it. If they leave it unticked, they still get the map
and the record stays local. That is a genuine consent, and it takes about ten minutes
to build.

---

## What changes in the code

Two things, both small, and I'd do them at the same time as switching the endpoint on:

1. **A collection notice at the top of the assessment** — the wording in §2, in a card
   before the first question.
2. **A consent tick above the button**, unticked by default, gating `sendToFacilitators()`.
   The record simply isn't sent if it's unticked.

The privacy line under the button already switches its wording depending on whether an
endpoint is configured, so it will never claim data stays local while it's being sent.

---

## The short version

Before you paste an endpoint in, you need: a named privacy officer · a collection notice
shown *before* the questions · a retention period you'll actually honour · a way to
answer access and delete requests · a provider with a DPA · a breach plan · and a
separate, unticked consent for facilitator access.

Six of those seven are writing, not code. The two code changes take an afternoon.
