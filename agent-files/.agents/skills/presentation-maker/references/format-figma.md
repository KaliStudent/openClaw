# Figma Slides implementation

Figma Slides is the right format when the deck will live in a design team's workflow, when iteration with a designer is expected, or when the design demands more visual freedom than pptx offers.

## Defer to the Figma skills

For mechanics, **defer to the existing Figma skills**:
- `figma:figma-create-new-file` — for spinning up a new Figma Slides file.
- `figma:figma-use-slides` — for adding/editing slides via the Figma Plugin API.
- `figma:figma-use` — foundational guidance for using the `use_figma` tool.

Always invoke these skills before calling Figma tools — they include critical context that prevents common failures.

This file covers the *extra* concerns specific to building presentation decks in Figma.

## Workflow

1. Use the outline, layout choices, palette, and motif you locked in with the user.
2. **Create the file** via the `figma-create-new-file` skill (it'll trigger `create_new_file` correctly).
3. **Set up shared variables** for the palette and type scale before building slides. This makes iteration vastly faster — change a palette variable and every slide updates.
4. **Build slide-by-slide** using the layouts from `layouts.md`. Use Figma's auto-layout for everything that contains text — manual positioning is brittle.
5. **Visual QA** in Figma's "Present" mode — walk every slide as the audience will see them.

## Variables to define up front

In the file's local variables:
- `color/primary`, `color/secondary`, `color/accent`, `color/bg`, `color/text`, `color/muted` — from the palette spec.
- `size/title`, `size/body`, `size/caption` — type scale.
- `space/gutter`, `space/margin` — layout spacing.

Bind these to text and shape properties throughout. Don't hardcode colors or sizes.

## RTL in Figma Slides

Figma supports RTL at the text-layer level. Set "Text direction → Right to left" on each text layer that contains Hebrew or Arabic. For mixed-direction slides, each text frame holds one direction; create separate frames per direction rather than mixing.

Figma's auto-layout has a direction property — set to "right to left" for frames whose children should flow right-to-left. Note: this doesn't propagate to children automatically; you may need to set it per nested frame.

Constraints don't auto-mirror. If you anchored an element to the left edge of its parent, it stays anchored to the left even after switching direction. After flipping a frame to RTL, walk the children and re-anchor to the right edge where appropriate.

## Component pattern for slides

Make each unique layout a **component** (or component set). Then instances of the component are the actual slides — change the component and every slide using it updates.

Suggested components for a typical deck:
- `Slide/Cover`
- `Slide/Section-divider`
- `Slide/Big-statement`
- `Slide/Big-stat`
- `Slide/Two-column`
- `Slide/Pull-quote`
- `Slide/Grid-of-cards`

Each component should use:
- Auto-layout for the entire frame.
- Variables for colors and type sizes.
- Text properties (component properties) for the editable strings.
- Slot/swap for images where applicable.

This pattern is more work upfront but pays off after slide 5 — every new slide is "use a component instance, change the text", and global changes (palette tweaks, type adjustments) propagate instantly.

## Motif in Figma

Add the motif as a component or a recurring frame structure. If the motif is "accent stripe on left edge", build it into the base `Slide/Base` component that all other slide components extend. Then the motif is in one place.

## Speaker notes

Figma Slides supports speaker notes — use them for talk-along decks. The notes are visible in Present mode.

## Export from Figma

Figma Slides can be exported as PDF for sharing. For PowerPoint export, Figma's native option works but fidelity isn't perfect — complex auto-layouts may flatten oddly. If pptx fidelity is critical, build in pptx instead.

## Final QA

Open Present mode. Walk every slide with the same checks as other formats: overflow, contrast, RTL correctness, layout variety, motif consistency, claim titles.
