# SOL MAP — WORKING BRIEF

*Paste this whole file into ChatGPT before asking it to help. It contains everything
needed to rewrite the reading sections without breaking the build.*

I am working on the **reading section** of the Sol Map — specifically the three
**Who / What / Where** sections and the **Map of your light** section. I want them
deeper and clearer. Everything below is context. Please don't rewrite anything until
you've read the constraints in §6 and §7, because copy that ignores them can't be built.

---

## 1 · What SHE IS SOL is

A self-led personal development system. Six colours of light, seven nights each, three
times round — 126 nights, a nightly three-to-five-minute visualisation before sleep.
There's a free community (Lumina, on Ivorey) and a paid eighteen-week cohort.

**The founding contrarian idea, and everything hangs off it:**

> The whole wellness industry runs on *you are not enough yet*. This runs on the
> opposite: **you are not deficient, you have forgotten.**
> The work was never about becoming, it was always about returning.

**Two anchor lines, verbatim, never paraphrased:**
- *We are all Source. You already have everything inside you.*
- *The work was never about becoming, it was always about returning.*

**The sequence is load-bearing: Soul → Mind → Body. Never reversed.**

---

## 2 · What the Sol Map is

A free web page. Someone enters their birth details, answers a 41-question assessment,
and gets a report. It's the entry point to the community and the thing a facilitator
reads before meeting them.

The report has two halves:

1. **The reading** — drawn from the birth chart. *This is what I'm working on.*
2. **The mirror** — drawn from their assessment answers. Not what I'm working on.

It's a static HTML page. No AI at runtime, no server. Every sentence is either fixed
copy or assembled from lookup tables, so **whatever we write has to work for all 12
signs and any chart**, not just one example.

---

## 3 · The structure I'm working on

Three sections, in this order, each mapped to one part of the Soul / Mind / Body trinity:

| Section | Maps to | Read from |
|---|---|---|
| **Who are you?** | Soul | The Sun |
| **What are you?** | Mind | The Moon, feeling, and how thought runs |
| **Where are you?** | Body | The rising sign read into the physical body |

Then a fourth: **The map of your light** — one diagram of the actual sky geometry, plus
a summary table.

**The word "trinity" is never used on the page.** The structure has to stay congruent
with Soul / Mind / Body without ever naming it as a framework.

---

## 4 · The current copy, in full

### Who are you? (Soul · the Sun)

> There are three parts to a person, and everything in this map is arranged on them. The
> first is the part that was there before anything happened to you and is still there
> underneath all of it. The sun marks where it stood.
>
> **[generated]** Leo is fire kept burning. Heat that has settled into a steady flame —
> it warms a room rather than flaring, and it goes out if it is not fed.
>
> Inside every sign there are three ten-day stretches, and they belong to the three signs
> that share its element — so the element holds steady across a sign and only the phase
> turns. **[generated]** Yours is the second ten days, which belongs to Sagittarius:
> fire spreading.
>
> *Does any of that describe the part of you that has never really changed? Nobody can
> answer that from the outside, and this map is not going to try. It marks a position.
> What you are is yours to work out.*

### What are you? (Mind · the Moon)

> The second part is the one that moves — thought and feeling, which are closer to each
> other than they are usually allowed to be. The moon marks it.
>
> **[generated]** Yours stood in Cancer — water gathering. Feeling arrives whole and
> unannounced, often before there is any reason attached to it. It moves in tides rather
> than events.
>
> **[generated]** Of the moon itself, a thin edge was left, almost back to dark. That is
> simply the angle the two lights were standing at, and it is the same for everyone born
> that night.
>
> **[generated]** Thought runs on a different current again: yours is earth, which tends
> to move slowly, and stays where it lands.
>
> *Is that how feeling actually moves in you — and is it the same thing as how you think?
> Most people find those two are not on speaking terms. Noticing the gap is more useful
> than agreeing with the description.*

### Where are you? (Body · the rising sign)

> The third part is the one you can put your hand on. Feeling doesn't stay in the mind —
> it lands somewhere physical, and when it isn't allowed to move it tends to stay in the
> same place each time.
>
> **[generated]** The eastern horizon at your birth cut the circle at 24° of Virgo —
> earth being sorted. That line is read down into the body, and it points at the abdomen,
> intestines and spleen. That is where the map would expect you to feel something before
> you have thought it, and where it would collect if you sat on it.
>
> **[generated]** The place the map marks as tightening is the head, face, brain and eyes
> — where holding on has somewhere to go. Held long enough, that is usually the first
> place to complain.
>
> *Where does it actually go in you, when something is not dealt with? You already know
> the answer to that one — it is the place you would have named before reading any of
> this.*

*(If there's no birth time, this section says so plainly and explains what's missing,
rather than guessing.)*

### The map of your light

Intro:

> This is the whole of it. A circle of three hundred and sixty degrees, divided into
> thirty-six; the line where the sky met the ground in the east; and the two lights,
> where they actually stood. Everything above was read off this.

Then an SVG diagram: the 360° circle, 36 tick marks, their own ten-day stretch picked out
in gold, the horizon line, and the Sun and Moon at their true positions — with the Moon
drawn at the exact fraction that was lit.

Then a summary list, labels fixed and values generated:

- **The part that doesn't change** — the sun in Leo — fire kept burning
- **Its ten days** — Sagittarius's stretch of Leo — fire spreading
- **The part that moves** — the moon in Cancer — water gathering
- **The moon that night** — a thin last edge, 10% lit
- **The part you can touch** — Virgo rising — read to the abdomen, intestines and spleen
- **Born** — in daylight, the sun above the horizon
- **Most of your chart sits in** — water

---

## 5 · The astrology underneath (so you know what's available)

The engine is real and validated against astrotheme.com. **Tropical zodiac, Placidus
houses, true node.** Every one of these is computed and available to use:

**Positions** (exact degree): Sun · Moon · Mercury · Venus · Mars · Jupiter · Saturn ·
North Node · Ascendant · Midheaven · all twelve house cusps
**Derived**: which house each planet is in · whether the Sun was above or below the
horizon (day/night birth) · the exact Moon phase angle and illuminated fraction ·
whether the Moon changed sign that day (if birth time unknown) · the dominant element
and dominant mode of the whole chart · the sign on the 6th cusp · the chart ruler

### The thirty-six — the mechanism, since it matters

The circle is cut two ways. **Twelve** gives the signs, 30° each. **Thirty-six** gives
ten-day stretches — and that's where the number 360 came from: the Egyptian calendar ran
on thirty-six ten-day weeks, each marked by the star that rose at dawn in it.

Each ten-day stretch inside a sign belongs to **one of the three signs sharing that
sign's element**, in order. So across any sign the element never changes — only its
phase does. Leo's three tens belong to Leo, Sagittarius, Aries: all fire, moving from
holding to spreading to striking.

That's why the thirty-six says something the twelve can't — it tells you *which part of
your element's cycle you arrived in*.

### The twelve element × phase descriptions (the core lookup table)

Every sign resolves to exactly one of these. Any rewrite of the Who/What sections will
probably want to rewrite these too — they do most of the work.

| | Starting | Holding | Spreading |
|---|---|---|---|
| **Fire** | fire at the strike | fire kept burning | fire spreading |
| **Earth** | earth being shaped | earth at rest | earth being sorted |
| **Air** | air finding its balance | air holding a pattern | air moving |
| **Water** | water gathering | water under pressure | water dispersing |

Each has a one-or-two-sentence physical description. Example — *fire kept burning*:
"Heat that has settled into a steady flame — it warms a room rather than flaring, and it
goes out if it is not fed."

### How feeling moves (from the Moon's element)

- **Fire** — arrives fast, shows before you've decided anything, burns off as quickly
- **Earth** — arrives slowly, settles in the body rather than the voice
- **Air** — gets thought about immediately; naming it is how it moves
- **Water** — arrives whole and unannounced, in tides rather than events

### Body zones (from the rising sign, and from Saturn)

Traditional melothesia. Aries = head and eyes · Taurus = neck and throat · Gemini =
shoulders, hands, lungs · Cancer = chest and stomach · Leo = heart and spine · Virgo =
gut · Libra = lower back and kidneys · Scorpio = pelvis · Sagittarius = hips and thighs ·
Capricorn = knees and bones · Aquarius = ankles and circulation · Pisces = feet and lymph.

The rising sign gives *where feeling lands*. Saturn gives *where it tightens and holds*.

---

## 6 · The rules — non-negotiable

1. **Never tell someone who they are.** Every section ends by handing the question back.
   Sol holds up a mirror; it never delivers a verdict. "You are X" is banned. "The chart
   marks a position; what you are is yours to work out" is the posture.
2. **No astrology jargon on screen.** No houses, no nodes, no aspects, no rulers, no
   cardinal/fixed/mutable by name, no temperaments, no Latin. Sun, Moon and rising sign
   can be named because they have to be. Everything else becomes plain physical language.
3. **A skeptic has to get value.** Someone with no interest in astrology should still
   find it clear and worth reading. Nothing asks them to believe anything.
4. **Nothing medical.** Body language is "where you tend to notice it" and "where it
   collects" — never diagnosis, never a health claim, never a protocol.
5. **Soul → Mind → Body, in that order, always.** Never named as a framework on the page.
6. **Voice:** observation, then invitation. First or second person. Plain, direct,
   occasionally blunt. Italics for emphasis, never bold. No emoji. Short sentences beside
   longer ones. Mid-process, never from the summit.
7. **Banned words:** high vibe · tapestry · delve · dive in · unpack · game-changer ·
   unlock or ignite as filler · manifest · journey · mindset · vibes · toxic positivity ·
   anything that reads as AI filler or generic wellness.
8. **Gender-neutral throughout.** Second person, or they/them.

---

## 7 · What I want help with

Make the **Who / What / Where** sections and the **Map of your light** section deeper and
clearer, without breaking anything above.

Specifically:

- The three sections should feel like one continuous idea — three parts of one structure
  — rather than three separate readings that happen to be next to each other.
- **Who** should go further into what the Sun actually signifies at the soul level:
  fundamentally, energetically, universally. Not personality traits.
- **What** should be clearer about the Moon and the emotional body, and about the
  relationship between feeling and thought.
- **Where** should be more concrete about how the chart shows up physically — where
  emotion lands, where it gets stuck, where it shows first.
- **The map of your light** should make the geometry genuinely legible to someone who has
  never looked at a chart.

**The hard constraint:** anything you write has to be buildable from the variables in §5
using lookup tables. Fixed sentences plus generated fragments. If a sentence would need
12 or 36 or 4 variants, say so and write them all — don't write one beautiful example
that only works for Leo.

Keep roughly the current length. Depth, not volume.
