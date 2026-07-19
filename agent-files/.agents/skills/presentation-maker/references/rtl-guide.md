# RTL guide: Hebrew, Arabic, and mixed-direction decks

RTL is not "the same deck mirrored." It changes alignment, list bullet position, icon-to-text relationship, page-turn affordances, chart axis flow, and a dozen smaller details. This guide covers what to do per format and how to handle mixed-direction content correctly.

If any RTL content is involved, read this *before* placing the first text box. Retrofitting RTL after the fact is significantly more work.

---

## The 6 universal rules

Apply these regardless of output format.

### 1. Pick the dominant direction per slide

A slide has *one* base direction. If the slide is Hebrew-primary with a few English words, the base is RTL. If it's English-primary with one Hebrew quote, the base is LTR. The base direction determines:
- Where titles align (right edge in RTL, left in LTR)
- Which side icons sit on relative to text
- Where the "first" column of a multi-column layout is (right in RTL, left in LTR)
- Where bullet markers go (right of text in RTL)
- Where page numbers go (often left in RTL — but follow the deck's chosen convention)

### 2. Use a font that supports the script — really

Many "internationalization-ready" fonts have weak or missing Hebrew/Arabic. Visually verify glyphs render correctly. See the design-system reference for vetted font pairings.

### 3. Numbers, dates, English brand names, code, URLs stay LTR

Even inside an RTL sentence, numerals and English words flow left-to-right. The text engine should handle this automatically *if* you've set the base direction correctly. If you see numbers reversing (e.g., "2024" appearing as "4202"), you've forced LTR digit ordering or used a buggy font — fix the direction setting, not the digits.

### 4. Mirror layouts, but not all assets

Mirror:
- Text alignment (left → right in RTL)
- Column order (column 1 sits on the right in RTL)
- Icon position relative to its text label
- Bullet markers and numbered list markers
- Page turn arrows ("next" points left in RTL)

Do *not* mirror:
- Photographs (people would face wrong way, brand logos would reverse)
- Brand logos and trademarks
- Charts where the X-axis is time-based with English/numeric labels (typically left-to-right even in RTL — but the chart *placement* on the slide moves to the right side)
- Code blocks (always LTR)
- Math equations (always LTR)

### 5. Punctuation belongs to its script

A Hebrew sentence ending in a period: the period sits at the *left* end of the sentence (since Hebrew reads right-to-left). Same for Arabic. Don't manually swap punctuation — the text engine does this if you've set direction correctly.

Specific Hebrew/Arabic punctuation marks:
- Hebrew uses the Latin period, comma, etc.
- Arabic uses its own comma `،` (U+060C) and question mark `؟` (U+061F) — use them in Arabic text, not Latin equivalents.

### 6. Test with a real native speaker before shipping

Auto-rendering catches the obvious failures. Native speakers catch the subtle ones: awkward line breaks, off-feeling kerning, words that technically display but read strangely. If the deck is going to a Hebrew/Arabic audience, get a native-speaker review.

---

## Per-format RTL handling

### PowerPoint (.pptx)

- Set the **slide language** to Hebrew or Arabic before adding text (File → Options → Language, or set per text box).
- For mixed-language slides, set the base direction at the **text box** level: right-click → Paragraph → Direction → "Right-to-left" for RTL text boxes.
- When generating with **pptxgenjs**: pass `rtlMode: true` on text objects that should be RTL. For mixed slides, create separate text boxes per direction rather than mixing in one paragraph.
- **Bullet lists**: in pptx, bullets auto-flip when paragraph direction is RTL. If they don't, you've set direction at the wrong level.
- **Tables in RTL**: column order should be reversed (column "1" is rightmost). Set the table's RTL property.
- **Footers and slide numbers**: pptx applies these per master. Update the master's footer placeholder direction.

### HTML slides

- Set `<html dir="rtl" lang="he">` (or `ar`) at the document level if the whole deck is RTL.
- For mixed-direction decks, keep document direction LTR and set `dir="rtl"` on individual slide or text container elements as needed.
- Use **logical CSS properties**: `margin-inline-start`, `padding-inline-end`, `text-align: start` — these automatically flip based on direction. Avoid `margin-left`, `padding-right`, `text-align: left`.
- For **flex layouts**, use `flex-direction: row` (it auto-reverses in RTL) and *not* `row-reverse`.
- For **icons next to text**: use logical positioning (icon "before" text), so the icon naturally moves to the right in RTL.
- For **mixed-language text inside one paragraph**: use the `<bdi>` element around foreign-script substrings, or wrap them in `<span dir="ltr">English</span>`. This isolates the bidi algorithm and prevents weird reordering.
- For **animations**: arrow-in animations from the "right" should come from the *left* in RTL. Use `start`/`end` keywords if your animation framework supports them; otherwise conditionally swap.

### PDF

- Generate PDF from an RTL-aware source (HTML with proper `dir`, or pptx). Don't try to "build PDF directly" without a layout engine that understands bidi — you'll fight the text engine the whole way.
- If using a Python PDF library: `reportlab` has limited RTL support; prefer `weasyprint` (renders from HTML/CSS, handles bidi correctly) for any RTL content.
- Embed fonts that include Hebrew/Arabic glyphs — don't rely on viewer fallbacks; readers may see boxes (`□□□`) if the font isn't embedded.

### Figma Slides

- Figma supports RTL text per-frame. Set text direction on each text layer that needs RTL.
- Figma auto-layout has a "direction" property — set it to right-to-left for RTL frames so children flow correctly.
- Mirror constraints don't auto-flip — if you've anchored elements to the left, they stay anchored to the left even if you switch direction. Re-anchor manually after switching.

---

## Mixed LTR/RTL: the tricky cases

### A single paragraph mixing Hebrew and English

The bidi algorithm handles this *if* you set the paragraph's base direction correctly. Examples:

- Hebrew sentence with one English brand name: paragraph base = RTL. The English word will be rendered LTR inline, but the surrounding Hebrew flows right-to-left. Punctuation goes on the Hebrew side.
- English sentence quoting Hebrew: paragraph base = LTR. The Hebrew word flows RTL within the LTR sentence. This works automatically.

If the result looks scrambled — words in wrong order, punctuation in the wrong place — the base direction is wrong, not the words. Don't try to manually rearrange characters.

### Side-by-side LTR and RTL on the same slide

E.g. an English original quote next to its Hebrew translation. This is fine — give each its own text box with its own direction. Treat them as two layout elements, not one paragraph.

The visual question: which side is "first"? If the slide's base direction is RTL, the Hebrew goes on the right (read first). If the slide is bilingual with no clear primary, either order works — pick one and apply it consistently across all such slides.

### Numbers and dates inside RTL text

These stay LTR automatically. But pay attention to:
- **Date format**: Hebrew/Arabic locales often use DD/MM/YYYY rather than MM/DD/YYYY. Confirm with the user.
- **Currency symbols**: `$100` or `100₪`? Arabic typically writes the symbol after the number with a non-breaking space. Hebrew is more flexible.
- **Percentages**: `25%` or `%25`? Both occur. Default to placing `%` after the number unless the user prefers otherwise.

### Mixing Arabic and Hebrew

If a single deck has both, treat them as separate scripts requiring separate font choices (or use a Noto family that covers both with harmonized metrics). They generally don't appear in the same paragraph; if they do, isolate each language in its own element with explicit direction.

---

## Checklist before shipping an RTL or mixed-direction deck

- [ ] Every Hebrew/Arabic text box has correct direction set (not relying on auto-detection).
- [ ] Numbers and dates render in the correct direction (LTR within RTL).
- [ ] Bullet markers and list numbers appear on the correct side.
- [ ] Icons sit on the correct side of their labels.
- [ ] First column of multi-column layouts is on the correct side (right for RTL).
- [ ] Punctuation appears at the correct end of each sentence.
- [ ] The font renders Hebrew/Arabic glyphs at full quality — no boxes, no obvious fallback fonts.
- [ ] If mixed: Hebrew/Arabic text boxes and Latin text boxes are at consistent visual sizes (Hebrew/Arabic often needs +10% over Latin at the same nominal pt).
- [ ] A native speaker has reviewed the actual rendered output, not just the source text.

---

## Common failure modes and fixes

**"My numbers are showing backwards" (`2024` → `4202`)**
You've forced LTR character ordering or used a font with broken RTL digit handling. Fix the direction setting at the text box / paragraph level. Don't manually reverse the digits.

**"Hebrew text is way smaller than the English next to it at the same pt"**
Hebrew x-height is often visually smaller than Latin at the same pt. Bump Hebrew up 10-15% in size, or use a font with larger Hebrew x-height (like Heebo or Assistant).

**"The whole slide looks mirrored — including the photo"**
You've applied a global transform (`scaleX(-1)` or similar) instead of using bidi-aware layout. Remove the transform and use proper RTL direction settings.

**"Bullets are on the wrong side"**
The list's paragraph direction is set to LTR but the text is Hebrew/Arabic. Set the paragraph direction to RTL.

**"The English brand name inside Hebrew text is on the wrong side"**
The bidi engine puts foreign-script substrings inline. If the base direction is correct, this is *right* — the English word visually appears where it would naturally land given the right-to-left reading order. If you want to force a specific position, wrap it in a directional isolate (`<bdi>` in HTML, manual character insertion U+2068/U+2069 in pptx text).

**"The Hebrew/Arabic text disappeared / shows as boxes when I converted to PDF"**
The font wasn't embedded. Embed Hebrew/Arabic-capable fonts in the PDF generation step. If using LibreOffice's `soffice` to convert, ensure the font is system-installed.
