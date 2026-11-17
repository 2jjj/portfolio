# Pedro Sakamoto â€” Editorial Premium (DESIGN.md)

## The world
The portfolio as a printed broadsheet: paper, ink, ruled columns, a serif display voice, one oxblood accent, and the discipline of print â€” every glyph earning its keep. The code/builder identity shows up as hairlines, tabular numerals and fold-mark details, never as neon. Dark mode is "ink the printer didn't cover", not a different brand: same paper, flipped.

## Tokens (override in `src/premium.css`)

```css
--paper:        #f4efe4  (aged sheet, warm off-white)
--paper-2:      #eae4d5  (cut paper for recessed blocks)
--paper-3:      #dfd8c8  (deeper cut)
--ink:          #171410  (warm black)
--ink-2:        #57503f  (set-in-ink secondary, â‰¥4.5:1 on paper)
--ink-3:        #8f8672  (fade/tertiary text)
--oxblood:      #9d2b1e  (accent; used sparingly: one rule per fold, one word per heading)
--brass:        #b3965a  (metallic detail: rules, links on ink)
--olive:        #3d4a2d  (secondary depth, occasional chip)
--line:         rgba(23,20,16,.18)  (rule)
--line-soft:    rgba(23,20,16,.10)
--serif:        'Bodoni Moda', reveal-opt
--body:         'Newsreader', Georgia, serif
--mono:         'JetBrains Mono' (labels, data, numerals; never costume)
```

Light = the printed page. Dark (`data-theme="dark"`) = same file under "night print":
`--paper: #171410; --paper-2:#1f1c16; --paper-3:#27231c; --ink:#efe9dd; --ink-2:#b8af9d (â‰¥4.5 on paper); --oxblood:#d4755f; --brass:#d2b477;`

## Signature
- Bodoni Moda with optical size and `SOFT`/`WONK` axes; body slashed `'`â€“apostrophe easings; `font-variant-numeric: tabular-nums` everywhere there are numbers.
- Oxblood used as a **rule** (a narrow 4px slab on the left margin or a folded corner), never as a surface.
- One rotated "PS." in the hero like a printer's fold mark; kicker replaced entirely by a ruled label (right-aligned page number in mono), not a coloured chip.
- Every reveal animates *in from below with a mask* (`clip-path` or `translateY` inside `overflow:hidden` wrapper). One authored moment per fold: hero takes the mask reveal, metrics count up, vaga cards stagger.
- Grain is not feTurbulence-as-decoration. Texture comes from ruled lines, hairlines and drop caps only.
- Links underline with a 2px oxblood line that slides out from center on hover; focus-visible gets a 2px brass outline with offset.

## Vagas â€” the flagship
Print-the-score layout: the match score is a **tab**, not a badge â€” large mono numeral half-struck by the card edge, rule above it across the card like a page header. Cards order by `score` desc and reveal in stagger; `job.why` excerpts sit under a thin rule. Hover: card lifts (soft shadow offset, not glow), numeral flips to oxblood. Empty state is set as a typeset page section, not a dashed box. All count-up numbers animate with `IntersectionObserver` on mount; match ring is an SVG `stroke-dasharray` filling under 1s ease-out-expo.

## Ban list (honoured)
No hero-metric template, no gradient text, no glass, no eyebrow kickers above headings â€” every heading carries its own weight, no left-coloured card borders, no monospace-as-costume, no repeating-linear-gradient paper texture.
