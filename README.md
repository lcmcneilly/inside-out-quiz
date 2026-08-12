# Onboarding Assessment · Sol Map · Foundation Workbook

The package every new member completes when they join. Two static HTML files, no
backend, no build step. Double-click to run, or drop the folder on any static host.

| File | What it is |
|---|---|
| `sol-map.html` | Birth details → the assessment → the Sol Map → the consciousness mirror → how to use the room → the coach's overview. One continuous page. |
| `foundation-workbook.html` | The Foundations workbook. Wording exactly as the printed edition, personalised from the map. |
| `serve.py` | `python3 serve.py` → a local preview on port 8788. |

The birth-chart engine is carried over unchanged from `../sol-map.html` (kept as
the archive) and still matches astrotheme — validated against 11 Aug 1996, 08:43,
Tauranga.

---

## 1 · The assessment

Built from Wayne's *Two Doors, One Room* and *Diagnostic Extension* (Aug 2026),
pulled forward onto the course spine. **33 inputs, about twelve minutes.**

| Part | What it asks | Course home |
|---|---|---|
| One · the four | Judgement · Jealousy · Neediness · Fear — 4 items each, plus *which was hardest to answer honestly* | Week 6 (Red), again Week 17 |
| Two · the pyramid | Trust · Belief · Emotion · Thought — 2 items each | Week 3 (Green) |
| Three · the line | Self-responsibility — 4 items | Week 16 (Orange) |
| Four · in your words | Capacity, care, the free text | — |

**No score, total, band, type or grade is ever shown.** Intensity is computed
internally for exactly two decisions — which pattern is loudest, which pyramid
layer is asking — and both are named as *weather*, never as character.

The load-bearing move: she names which Horseman was hardest to answer honestly,
and her answers point at one independently. Where they differ the page says so —
*"Judgement is the one you can already see. Fear is the one doing the work while
you watch the other."*

Wayne's Settled/Equipped quadrant and the four positions are **not** here. That
instrument is Stage 1, before someone joins, and it decides which door.

---

## 2 · The Sol Map — two pages, and not a chart reading

Structured as three questions on the Soul → Mind → Body spine:

- **Who are you? · Soul** — the sun's exact degree as a *position on a circle*,
  the sign given as a principle of nature (*the centre*, *the vessel*, *the
  dissolving*), then the ten degrees it sits in.
- **What are you? · Mind** — the element as a **state of matter** (fire holds no
  shape and converts; water becomes its container and wears stone down by
  returning), and the mode as a **phase of a season** (the four turning points
  are literally the solstices and equinoxes).
- **Where are you? · Body** — the moon's phase as the actual angle between the
  two lights, whether the sun was above or below the horizon, and the Ascendant
  named for what it is: *an angle*, the slope at which light was entering the
  world at that place.

Then **the map of your light** — one SVG: the 360° circle divided into 36, the
horizon line, and the two lights where they stood, the moon drawn at the fraction
actually lit that night. Followed by a short factual table.

### The rules this section holds

No astrology vocabulary on screen. No houses, nodes, aspects, rulers,
modalities-by-name, temperaments, tissue salts or medical language. Nothing a
skeptic has to accept on faith. Sun and rising are named because they have to be;
everything else is expressed as geometry, matter, season and light.

### Lineage, and the one call I made

The degree layer uses the **traditional decans** — the circle divided by
thirty-six rather than twelve, in the Chaldean planetary order (Aries I Mars,
Aries II Sun, Aries III Venus, and round). It is named on the page as *tradition*,
never as fact: "the older maps use both."

I chose decans over Sabian symbols or single-degree monomeries because they are
genuinely lineage-bearing (the Bonacci line uses them), they subdivide without
inventing anything, and they can be explained fundamentally — *the sign is the
season, the decan is the ten days inside it.* The 36 lines are original writing,
not reproduced from any source. **If Wayne's intent was a different degree
system, this is the layer to swap** — it is one data table (`DECAN_LINE`) and one
paragraph.

---

## 3 · Navigating the room

Mapped onto the real Ivorey structure (community operating spec, 27 Jul 2026):
five open channels, one post a day, a monthly open call, Foundations open to
every member, the mastermind unpitched.

Five steps, personalised: where to post first · **which channel to use next and
why**, chosen from her pattern (Judgement → *Ask anything*; Jealousy → *Wins and
shares*; Neediness → *Clarity conversation*; Fear → *Welcome and start here*) ·
the workbook, paced to the minutes and time of day she said she had · the weekly
rhythm · and the mastermind as the honest answer to *"so what do I do with this?"*

---

## 4 · The workbook

Rebuilt from **`~/Desktop/NewModules/Sol Modules Workbook Brand Redesign.pdf`**.
Every word of the welcome and the six modules is the printed wording, unchanged —
dark module covers, light interiors, gold serif numerals, *Sit with this* on ruled
write-on lines that save to the device.

The only addition is one **In your map** block per module: two or three lines
drawn from her chart and her answers, closing on a question. Prompting, never
diagnosing — nothing in it tells anyone what they are.

| Module | Draws on |
|---|---|
| Purple | Sun sign as principle · how her pattern shows up in the head |
| Blue | Mercury |
| Green | Venus + Moon · the pyramid layer her answers named |
| Orange | Element as state of matter · body zone · the self-responsibility carry |
| Turquoise | Element + Mars |
| Red | Ascendant + Saturn · the Horseman and its counter |

Opened without a map it offers a star-sign picker and fills what it honestly can
(Purple, Orange, Turquoise), leaving the rest blank rather than guessing.

---

## 5 · What the coach gets

A generated **consciousness overview**, written *about* her. No numbers —
intensity appears as rank order only. Nothing is transmitted: the page ends with a
*For your coach* card (copy / download / read it first) that tells her plainly it
reads blunter than the page above. Items 33 and 34 pass through **verbatim**.

The care rule is intact: "I am in something hard at the moment" surfaces **Need to
Talk 1737** on her own page and flags it for the coach. NZ support only.

---

## Before launch — set the links

`LINKS.skool` and `LINKS.cohort` (a CONFIG block near the top of each file), plus
optional `FORM_ENDPOINT` in `sol-map.html`. Blank-link buttons hide themselves.
Access is never gated on email.

## Testing

The preview panel inside Claude sandboxes cross-page navigation and the clipboard
— check the real thing in Safari or Chrome. The sandboxed preview process also
cannot `getcwd()` inside `~/Desktop`, so `serve.py` may need to be run from a
normal terminal.

## Still open — Laura's and Wayne's, not mine

1. **The decan layer** — see §2. Confirm decans are the right degree system, or
   name the one that is.
2. **Fear → Empathy.** Wayne's counters are positional and the other three are
   self-evident. This one is written here as *attention that leaves your own
   head*, which holds, but it is my sentence rather than the course's.
3. **The chart × answer mapping** — the coach's `WHERE TO WATCH` line is
   provisional until the six-point mapping is confirmed.
4. **Retake cadence.** Recommendation: once per cycle (18 weeks). The workbook
   already invites a re-look at the end of round one.
5. **Privacy line**, and **the care flag** — confirm Laura is willing to receive
   and hold item 33. If not, cut both rather than collect-and-ignore.

---

*Soul → Mind → Body. The order never reverses.*
*The work was never about becoming, it was always about returning.*
