# PDF deck implementation

PDF is the most predictable output: it renders identically across every device and viewer, embeds fonts, and is the safest format for read-on-your-own consumption. The catch: you don't build PDFs directly — you build in another tool and export.

## Two paths

### Path A: HTML → PDF (recommended for design-heavy or RTL decks)

Build the deck as an HTML file following the [format-html.md](format-html.md) guide. Then export via **weasyprint**:

```bash
pip install weasyprint --break-system-packages
weasyprint deck.html deck.pdf
```

Why weasyprint:
- Renders HTML/CSS with full bidi support (best-in-class RTL).
- Embeds fonts automatically.
- Respects `@media print` styles so you can hide presentation chrome.
- Outputs one slide per page if the HTML uses `page-break-after: always`.

Add to the HTML's CSS for clean PDF export:
```css
@media print {
  body { background: white; }
  .deck { gap: 0; padding: 0; }
  .slide {
    box-shadow: none;
    page-break-after: always;
    width: 100vw;
    height: 100vh;
    aspect-ratio: auto;
  }
  /* Hide nav UI, fullscreen hints, etc. */
  .presentation-only { display: none; }
}
```

For finer control over page size, set in CSS:
```css
@page { size: 13.333in 7.5in; margin: 0; }  /* 16:9 aspect at 1280×720 → scaled */
```

### Path B: PowerPoint → PDF

Build the deck as `.pptx` (see [format-pptx.md](format-pptx.md)) and export via LibreOffice:

```bash
python <pptx-skill>/scripts/office/soffice.py --headless --convert-to pdf deck.pptx
```

Or open in PowerPoint and File → Export → PDF.

Why this path:
- Already covered by the pptx skill's tooling.
- Gives the user both a .pptx (editable) and a .pdf (shareable) from one source.

The PowerPoint → PDF conversion is generally reliable, but watch for:
- Custom font fallback if fonts aren't embedded.
- RTL text alignment that looked right in PowerPoint can shift slightly on export.

### Avoid: building PDF directly with `reportlab` or `pypdf`

These libraries are fine for forms, simple text documents, and one-off labels. For a multi-slide visual deck, building directly in `reportlab` means manually managing every coordinate and font binding — slow and brittle. Especially painful with RTL. Always prefer building in HTML or pptx and exporting.

## Choosing between path A and path B

| Situation | Use |
|---|---|
| Custom typography, complex layouts, design-first deck | Path A (HTML) |
| RTL-heavy or mixed-direction deck | Path A (HTML, via weasyprint) |
| User also wants an editable file for colleagues | Path B (pptx → PDF) |
| Deck must look identical to a `.pptx` someone else has | Path B |
| The "PDF" is really an archival format of a deck used live | Path B |
| One-time, polished, final-only deliverable | Either; Path A gives more design control |

## Fonts in PDFs

PDF embeds the subset of glyphs actually used. This is automatic in both weasyprint and PowerPoint-via-soffice paths *if* the fonts are accessible at conversion time:

- **HTML/weasyprint path**: weasyprint downloads Google Fonts on demand if the HTML references them via CDN. For offline-portable PDFs, install the fonts on the conversion machine or use `@font-face` with local files.
- **PowerPoint path**: ensure the fonts are installed on the machine running `soffice`. In a sandboxed environment, install via the system package manager or by copying `.ttf`/`.otf` files into `~/.fonts/` and running `fc-cache -f`.

For Hebrew/Arabic decks specifically, confirm fonts are installed before converting — otherwise the PDF will show boxes (`□□□`) where the glyphs should be.

## Page size

Default to 16:9 widescreen (1280×720 or 1920×1080) unless the user asks otherwise. Common alternatives:
- 16:10 — older projectors.
- 4:3 — legacy / specific corporate templates.
- US Letter (8.5×11) or A4 — only if the deck is really a *document* with slides as pages (rare).

In weasyprint:
```css
@page { size: 1280px 720px; margin: 0; }
```

## Final QA on PDFs

- Open the PDF in at least two viewers (Preview/Acrobat, and a browser like Chrome). Some viewers handle bidi differently.
- Zoom in to small text — confirm it's sharp (font embedded as vector, not rasterized).
- For RTL: confirm direction held through the export. Common failure: alignment looks right in source but flips back to LTR in the PDF when fonts aren't properly embedded.
- Check page count matches expected slide count. An off-by-one usually means a stray `page-break-after` or a slide template that's outputting blank pages.
- File size sanity-check: a 20-slide deck with embedded fonts and a few images should land in the 1-5 MB range. >20 MB usually means images aren't compressed; >50 MB means something's wrong.

## Compressing PDFs if needed

```bash
# Reduce file size by re-rendering at lower image DPI
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=deck-small.pdf deck.pdf
```

`/ebook` is a reasonable middle ground; `/screen` is more aggressive; `/printer` is high quality.
