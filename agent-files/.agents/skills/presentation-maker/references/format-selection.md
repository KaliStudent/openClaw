# Choosing the right output format

Don't pick this for the user. Ask them, and recommend based on what they'll do with the deck. Each format has a sweet spot.

---

## HOW TO ASK — The format question

**Always ask the format question BEFORE building** — and ask it with full pros & cons in Hebrew, not just names. The three main formats are not just different files; they are completely different experiences: PPTX = עריכה, HTML = wow-factor, PDF = סופיות. A user who doesn't know the differences may pick the wrong one. The question itself should teach them while they choose.

### הנוסח המדויק לשאול (use this verbatim)

> לפני שאני בונה — באיזה פורמט תרצה את המצגת? לכל אחד יש אופי אחר:
>
> **🟧 PowerPoint (.pptx) — הפורמט לעריכה ולמצגת חיה**
> *יתרונות:*
> - אתה יכול לערוך הכל בעצמך אחר כך — טקסט, צבעים, סדר שקפים
> - תאימות מלאה לכל מקרן וחדר ישיבות
> - תצוגת מצגת עם הערות למרצה (speaker notes)
> - הכי טוב לשיתוף עם צוות שיערוך יחד
> - אפשר לייצא ממנו PDF בכל רגע
> *חסרונות:*
> - הפונטים עלולים להיראות מעט שונה במחשב שאין בו את הפונט המקורי
> - אנימציות מתקדמות פחות חלקות מאשר ב-HTML
>
> **🟦 HTML — הפורמט עם ה-wow, לאתר ולמצגת אינטראקטיבית**
> *יתרונות:*
> - אפקטים, אנימציות ומעברים חלקים שאי אפשר לקבל בשום פורמט אחר
> - נפתח בכל דפדפן בלי להתקין כלום — רק לינק
> - רספונסיבי, נראה מצוין גם בנייד
> - אפשר להטמיע תוכן חי (וידאו, גרפים אינטראקטיביים, iframe)
> - הכי מרשים לפתיחת presentation אונליין
> *חסרונות:*
> - קשה לערוך אחר כך אם אתה לא מתכנת
> - הרינדור עשוי להשתנות מעט בין דפדפנים
> - פחות מתאים להגשה רשמית או הדפסה
>
> **🟥 PDF — הפורמט הסופי, להגשה ולשליחה**
> *יתרונות:*
> - נראה זהה לחלוטין בכל מכשיר ובכל מערכת — אפס הפתעות
> - לא צריך שום תוכנה לפתוח
> - מושלם לשליחה להנהלה / דירקטוריון / לקוח
> - הכי טוב לארכוב ולהדפסה
> *חסרונות:*
> - אי אפשר לערוך אחרי שזה נוצר
> - אין אנימציות או תוכן אינטראקטיבי כלל
> - לא מתאים למצגת חיה עם מעברים
>
> *(אם רלוונטי, אפשר גם Google Slides לעריכה משותפת בדפדפן, או Figma Slides למסירה למעצב.)*
>
> ההמלצה שלי כברירת מחדל: **PowerPoint ואז ייצוא PDF** — בונים פעם אחת, מקבלים את שניהם.

### Why ask this way
- The user makes an **informed** decision instead of guessing from a format name.
- The pros/cons are **specific and true**, not generic — they map to what the user will actually do with the deck.
- It surfaces the core distinction early: **PPTX = edit, HTML = wow, PDF = final.**

---

### Full reference

Detailed descriptions, the platform-capability rule, decision tree, and tradeoff tables follow below. Use the recommendation table next for a fast use-case → format mapping.

## Quick recommendation by use case

| Use case | Recommended format | Why |
|---|---|---|
| Email it to people who'll skim it | PDF | Renders identically everywhere, no software needed |
| Present live in a meeting room | PowerPoint (.pptx) | Universal projector compatibility, presenter view, speaker notes |
| Share with a team that will edit it | PowerPoint (.pptx) | Best for collaborative editing across devices |
| Publish on a website | HTML | Web-native, responsive, can embed live content |
| Hand off to a designer for polish | Figma Slides | Designer's native tool, easy to iterate visually |
| Send to executives / board | PDF | Final, polished, no risk of broken rendering |
| Investor pitch | PowerPoint (.pptx) + PDF export | Pitch live in pptx, send PDF as follow-up |
| Internal training material | HTML or PDF | HTML for interactivity, PDF for archival |
| Conference talk | PowerPoint (.pptx) or Figma Slides | Speaker setup compatibility |
| Edit collaboratively in browser | Google Slides (built natively via API) | Full animations, shareable link, no installs |

---

## ⚠ PLATFORM CAPABILITY RULE — Always use the best native capabilities for the requested format

**When asked to produce output in a specific format, use the deepest native capabilities of that platform. Never take shortcuts.**

### What this means per format:

| Format requested | What to do | What NOT to do |
|---|---|---|
| Google Slides | Build natively via Google Slides API with full layout, colors, fonts, and animations (via Apps Script injection or pptx-with-animations upload). Use every API feature available. | Do NOT just upload a pptx. Do NOT skip animations. |
| PowerPoint (.pptx) | Build via pptxgenjs with full animations, transitions, custom layouts. | Do NOT produce a flat static deck when animations are possible. |
| HTML | Build with CSS animations, transitions, GSAP or similar. Responsive layout. | Do NOT produce static HTML without animation. |
| PDF | Inform user: no animations possible. Deliver perfect layout and color fidelity. | Do NOT silently strip animations without telling the user. |
| Figma Slides | Use Figma REST API or hand off a structured spec. | Do NOT approximate — Figma is a designer tool, treat it that way. |

**If the platform has a limitation** (e.g. Google Slides REST API does not support animations natively), do the following:
1. State the limitation clearly and briefly.
2. Offer the best available workaround (e.g. Apps Script, pptx with animations uploaded, etc.).
3. Never just silently deliver less than what was asked.

---

## ⚠ Format replacement rule — animations must be preserved or rebuilt

**When the user asks to replace or convert a format (e.g. "make a Google Slides version"), do NOT simply upload the source file.**
Each format has its own animation engine. Uploading a pptx to Google Slides silently strips all animations.

### The rule:
- **pptx → Google Slides**: Build natively using the Google Slides API. Do NOT upload the pptx. For animations, either: (a) upload a pptx that has animations baked in — Google Slides preserves pptx animations on import, or (b) inject via Apps Script.
- **pptx → HTML**: Build natively in HTML/CSS/JS. Animations via CSS transitions or GSAP.
- **pptx → PDF**: PDF has no animations. Tell the user before converting.
- **Google Slides → pptx**: Export via Drive API, then re-add pptx animations using pptxgenjs.

**Key insight: pptx animations ARE preserved when opened in Google Slides.** So the best workflow for Google Slides with animations is:
1. Build the deck in pptxgenjs with full animations.
2. Upload the pptx to Google Drive and convert to Google Slides format.
3. The animations survive the conversion and are fully editable in Google Slides.

**Never deliver a converted deck without addressing animations.**

---

## ⚠ Mandatory QA on every format conversion

**Any time the output format changes, run a full layout QA before delivering.**

### QA checklist:

**Layout:**
- [ ] No element overflows the slide boundary (right or bottom edge)
- [ ] All slide counters show the correct total
- [ ] No text overlapping another element
- [ ] Accent bar / motif present on every slide

**Animations:**
- [ ] All entrance animations present and correctly sequenced
- [ ] Slide transitions applied consistently
- [ ] Sequential builds (cards, stats, list items) work in order
- [ ] pptx animations survived the Google Slides import (open the link and verify in Animations panel)

**Format-specific:**

| Conversion | What to check |
|---|---|
| pptx → Google Slides | pptx animations must be baked in BEFORE upload. Verify font availability in Google Fonts. |
| pptx → PDF | Inform user: no animations in PDF. Layout and color fidelity only. |
| pptx → HTML | Responsive layout, CSS/JS animations, no off-screen elements |
| Any → any | Slide count matches source, no blank slides introduced |

### pptx bounding box audit script:

```python
from pptx import Presentation
import re

prs = Presentation('deck.pptx')
W = prs.slide_width.inches
H = prs.slide_height.inches
issues = []

for i, slide in enumerate(prs.slides):
    for shape in slide.shapes:
        if not shape.has_text_frame: continue
        x = shape.left.inches if shape.left else 0
        y = shape.top.inches if shape.top else 0
        w = shape.width.inches if shape.width else 0
        h = shape.height.inches if shape.height else 0
        text = shape.text_frame.text.strip()

        if (x + w) > W + 0.05:
            issues.append(f"Slide {i+1}: '{text[:30]}' RIGHT overflow +{(x+w)-W:.2f}in")
        if (y + h) > H + 0.05:
            issues.append(f"Slide {i+1}: '{text[:30]}' BOTTOM overflow +{(y+h)-H:.2f}in")

        m = re.match(r'^(\d+) / (\d+)$', text)
        if m and int(m.group(2)) != len(prs.slides):
            issues.append(f"Slide {i+1}: counter '{text}' should be /{len(prs.slides)}")

if issues:
    for iss in issues: print("!", iss)
else:
    print(f"Clean. {len(prs.slides)} slides, {W:.2f}x{H:.2f}, no issues.")
```

---

## Google Slides — building natively via API

When the target format is Google Slides:
1. Build the deck first in pptxgenjs with **full animations** baked in.
2. Run QA (bounding box + slide counter audit).
3. Upload the pptx to Google Drive using `mimeType: application/vnd.google-apps.presentation` — this converts it to Google Slides format AND preserves all pptx animations.
4. Return the Google Slides URL.

This is the canonical workflow. It uses the best of both worlds: pptxgenjs for precise layout control, Google Slides for browser-based presentation and collaboration.

### pptxgenjs animation patterns (for Google Slides-bound decks):

```js
// Entrance animation on a text/shape element
slide.addText("Headline", {
  x: 0.73, y: 1.2, w: 9, h: 0.9,
  ...styleOpts,
  animType: "fade",        // "appear", "fade", "zoom", "fly"
  animDur: 0.5,            // seconds
  animDelay: 0,            // delay in seconds
  animDirection: "NONE",   // "left", "right", "top", "bottom" for fly
  animTrigger: "onClick"   // "onClick" or "afterPrev"
});

// Slide transition
slide.addTransition({ type: "fade", dur: 0.4 });
```

### Animation design rules:
- **Cover slide**: headline fades in onClick, subtitle afterPrev 0.3s, footer metadata afterPrev 0.2s.
- **Stat/number slides**: eyebrow onClick, headline afterPrev, each stat card flies in from bottom afterPrev with 0.15s stagger.
- **Body/text slides**: headline onClick, body text afterPrev 0.4s, any callout afterPrev.
- **Dark closing slides**: headline zooms in onClick, CTA/contact fades in afterPrev.
- **Transitions**: FADE between dark↔light slides, PUSH between same-tone slides.
- Max 2 seconds total animation per slide. Don't slow the presenter.

---

## Decision tree

1. **Will the audience open this on their own time, or will you present it?**
   - On their own time → PDF.
   - You present → PowerPoint or Google Slides or HTML.
2. **Will anyone edit it after you?**
   - Yes, colleagues → Google Slides (build in pptx with animations, upload as Google Slides).
   - Yes, a designer → Figma Slides.
   - No → PDF or HTML.
3. **Does the deck need animations?**
   - Yes → pptx (pptxgenjs) or Google Slides (via pptx upload). Never PDF.
4. **Does the deck need to embed live content?**
   - Yes, heavily → HTML.
5. **RTL is involved?**
   - Best: PowerPoint and HTML. Google Slides has limited RTL support.

## Tradeoffs at a glance

| Dimension | PowerPoint | Google Slides (via pptx) | HTML | PDF |
|---|---|---|---|---|
| Animations | Strong | Strong (pptx animations preserved) | Strong (CSS/JS) | None |
| Presentation mode | Strong | Strong | Good | Read-only |
| Editability | Strong | Strong | Weak | None |
| Fidelity across devices | Medium | Medium (font fallback) | Variable | Strong |
| RTL support | Strong | Medium | Strong | Depends |
| Sharing | File attachment | URL link | URL / file | File attachment |
| Speaker notes | Native | Native | Possible | None |

## When the user is unsure

Default: **PowerPoint, then export PDF**. Build once; export both.

If the user needs Google Slides → build in pptx with animations, upload to Drive as Google Slides. Best of both worlds.
