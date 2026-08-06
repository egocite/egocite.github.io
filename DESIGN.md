---
name: EgoCITE
description: A figure-first academic evidence system for long-horizon egocentric memory research.
colors:
  primary-blue: "#1452a3"
  primary-blue-dark: "#0c3b79"
  primary-blue-paper: "#eef5fc"
  temporal-yellow: "#f2bf49"
  temporal-yellow-dark: "#7b5200"
  temporal-yellow-paper: "#fff8df"
  index-teal: "#008b83"
  index-teal-dark: "#006c66"
  index-teal-paper: "#eaf8f7"
  corrective-red: "#bd2f2a"
  evidence-ink: "#171a1f"
  body-text: "#3d4651"
  muted-text: "#66717d"
  rule: "#cbd4df"
  rule-soft: "#e5eaf0"
  evidence-wash: "#f5f8fc"
  paper: "#ffffff"
typography:
  display:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "clamp(1.9rem, 3vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1.32rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Castoro, Georgia, serif"
    fontSize: "1.04rem"
    fontWeight: 400
    lineHeight: 1.78
  ui:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    letterSpacing: "0.065em"
  action:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    lineHeight: 1
  control:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.25
  table:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  square: "0"
  control: "4px"
  circular: "50%"
spacing:
  compact-gap: "0.45rem"
  control-x: "0.72rem"
  field: "0.65rem"
  block: "1rem"
  section: "3.7rem"
  desktop-gutter: "40px"
  mobile-gutter: "28px"
components:
  paper-action:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 0.72rem"
    height: "34px"
  paper-action-hover:
    backgroundColor: "{colors.primary-blue-paper}"
    textColor: "{colors.primary-blue-dark}"
    rounded: "{rounded.control}"
    padding: "0 0.72rem"
    height: "34px"
  method-index-selected:
    backgroundColor: "{colors.index-teal}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "0.55rem 0.8rem"
    height: "54px"
  method-scheme-selected:
    backgroundColor: "{colors.primary-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "0.55rem 0.8rem"
    height: "54px"
  method-retrieval-selected:
    backgroundColor: "{colors.temporal-yellow}"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "0.55rem 0.8rem"
    height: "54px"
  evidence-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.square}"
    padding: "0.65rem 0.75rem"
  trace-question:
    backgroundColor: "{colors.temporal-yellow-paper}"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.square}"
    padding: "0.72rem 0.85rem"
  result-table:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-text}"
    typography: "{typography.table}"
    rounded: "{rounded.square}"
  citation-field:
    backgroundColor: "{colors.evidence-wash}"
    textColor: "{colors.body-text}"
    rounded: "{rounded.square}"
    padding: "1rem"
---

# Design System: EgoCITE

## Overview

**Creative North Star: "The Figure-First Evidence Sheet"**

EgoCITE uses the visual language of a carefully typeset academic project page: the smart-glasses lockup opens the document, the complete system figure appears before long-form explanation, and every later interaction behaves like an inspectable evidence field. The world is restrained, compact, and scholarly rather than promotional.

Its identity comes from disciplined role color, hairline rules, and the contrast between Noto Sans interface text and Castoro explanatory prose. Blue carries the project and EgoScheme, yellow identifies temporal retrieval, and teal identifies EgoIndex. White paper and cool evidence washes keep dense figures, traces, and quantitative tables readable without turning them into floating cards.

**Key Characteristics:**
- Complete overview evidence before detailed exposition
- Open smart-glasses lockup and explicit blue, yellow, and teal method roles
- Flat white-paper surfaces divided by one-pixel rules
- Compact joined selectors and outlined controls
- Scholarly serif prose inside a sans-serif research interface
- Responsive inspection through reflow, contained horizontal scrolling, and keyboard-operable states

## Colors

The palette is an academic blue system sharpened by temporal yellow and index teal, with cool neutral fields keeping evidence dense but legible.

### Primary
- **Institutional Blue:** The project name, links, EgoScheme, selected experiment controls, focus-adjacent emphasis, and primary result statements use this voice.
- **Deep Institutional Blue:** Hovered links, timestamps, and text that needs blue emphasis without a filled surface use the darker companion.
- **Blue Evidence Paper:** EgoCITE rows, result callouts, and other positively identified evidence use the pale blue field.

### Secondary
- **Temporal Yellow:** Temporal cues, EgoRetrv selection, related memory atoms, and ground-truth overlap use yellow as a semantic marker rather than general decoration.
- **Deep Temporal Ochre:** Yellow-surface labels and temporal metrics use the darker companion for readable text.
- **Temporal Paper:** Selected retrieval stages, target rows, and time-aware evidence use the pale yellow field.

### Tertiary
- **Index Teal:** EgoIndex selection and index-pool stages use teal, preserving the method figure's role mapping.
- **Deep Index Teal:** Reserve the darker teal for readable emphasis associated with indexing.
- **Index Paper:** Use the pale teal field when an index-oriented table region needs a low-intensity highlight.
- **Corrective Red:** Reserve red for directional correction, such as a rank-change arrow; it is not a general alert or brand accent.
- **Result Ranking:** Use gold, slate, and bronze only for first-, second-, and third-ranked metric badges. These colors communicate table rank, not method identity.

### Neutral
- **Evidence Ink:** Primary headings, strong labels, and quantitative values.
- **Body Graphite:** Explanatory UI copy and scholarly prose.
- **Muted Slate:** Captions, metadata, secondary labels, and inactive explanation.
- **Structural Rule:** Default one-pixel outlines and strong dividers.
- **Soft Rule:** Row separators and lower-emphasis section boundaries.
- **Evidence Wash:** Alternate sections, chart toolbars, table group rows, and citation fields.
- **Paper:** The base page, figures, controls, and evidence surfaces.

### Named Rules

**The Semantic Color Rule.** Blue means project or scheme, yellow means temporal retrieval, and teal means indexing; do not swap these roles for visual variety.

**The Paper Before Pigment Rule.** Most of every screen remains white or cool neutral; role colors identify evidence and state, not atmosphere.

## Typography

**Display Font:** Noto Sans (with sans-serif fallback)  
**Body Font:** Castoro (with Georgia and serif fallbacks)  
**Label/Mono Font:** Noto Sans for labels; the platform monospace stack is reserved for code and citations

**Character:** Noto Sans makes the research interface compact, direct, and contemporary. Castoro introduces a recognizably scholarly reading texture in abstracts, captions, explanations, and interpretive result copy without making controls feel literary.

### Hierarchy
- **Display:** Bold, tightly tracked sans serif for the publication title; keep it balanced and compact rather than oversized.
- **Headline:** Bold, tightly tracked sans serif for centered section headings.
- **Title:** Bold sans serif for evidence panels, figures, and method subsections.
- **Body:** Regular Castoro for prose at a relaxed reading line height; keep long-form content within the shared prose measure.
- **UI:** Regular or semibold Noto Sans for controls, tables, workflow nodes, and explanatory interface copy.
- **Label:** Bold, letter-spaced Noto Sans, commonly uppercase, for field labels and compact evidence metadata.

### Named Rules

**The Two Registers Rule.** Use Noto Sans to operate and scan the page; use Castoro to explain, caption, and interpret the research.

**The Compact Authority Rule.** Academic authority comes from hierarchy and exact wording, not giant display type or excessive letter spacing.

## Layout

The page has a shared wide evidence measure (1160px) and a narrower prose measure (900px). Desktop containers retain a total 40px horizontal gutter; below 680px that contracts to 28px. Sections usually use 3.7rem vertical padding and are separated by one-pixel rules or a neutral wash, keeping the reading sequence continuous rather than card-based.

The composition is Figure First. A compact publication header and result rail lead directly to the complete overview figure; abstract, motivation, method, results, examples, and citation then proceed as one document. Wide method and result regions may use the full evidence measure while prose stays narrower.

At 980px, long workflow paths compact into five columns. At 820px, paired evidence regions stack and result selectors move from three columns to two. At 680px, method selectors, workflow controls, and trace structures become single-column; charts retain usable height and toolbars stack. At 520px, result selectors become one column and density tightens again.

Figures and tables remain inspectable rather than being scaled into illegibility. On narrow screens the overview image holds an 820px inspection width inside a horizontally scrollable, overscroll-contained frame with a visible mobile note. Quantitative tables use their established minimum widths inside horizontal scroll containers; never compress columns until values or labels become ambiguous.

### Named Rules

**The Complete Overview Rule.** Preserve the full system figure near the top of the page, even when mobile readers must inspect it horizontally.

**The Shared Measure Rule.** New evidence surfaces align to the 1160px wide measure or the 900px prose measure; avoid arbitrary intermediate containers.

## Elevation & Depth

The system is flat. It uses no box shadows, translucent depth effects, or decorative gradients. Hierarchy comes from white paper against cool washes, one-pixel rules, semantic fills, and occasional four-pixel role-color caps on workflow nodes. The five-pixel blue/yellow page-top identity rule is implemented as a hard color split; it is not a blended or atmospheric gradient.

### Named Rules

**The Ruled, Not Raised Rule.** Separate evidence with strokes, spacing, and tonal fields; never make research content float as shadowed cards.

## Shapes

The dominant geometry is square and rectilinear. Evidence panels, tables, selectors, trace fields, figure frames, and citation regions use straight edges and one-pixel outlines. Compact standalone controls may use a restrained 4px radius. Fully rounded pills are reserved for compact first-, second-, and third-place labels. Circles are limited to data-specific marks such as rank badges and legend swatches, while the smart-glasses silhouette remains the identity exception.

### Named Rules

**The Evidence Field Rule.** A bordered rectangle must behave as an information field, selector, figure frame, or table region; do not introduce empty decorative cards.

## Components

### Paper Actions

Compact and outlined, these controls read as academic document utilities rather than product calls to action.

- **Shape:** Restrained 4px corners with a one-pixel structural outline.
- **Primary:** White paper, evidence ink, bold compact label, 34px minimum height on desktop and 38px on small screens.
- **Hover / Focus:** Shift to blue evidence paper, strengthen the blue border, and rise by only one pixel; use the global three-pixel visible focus outline.
- **Disabled:** Preserve the outline but reduce opacity and remove movement.

### Joined Selectors

Method, workflow, trace, and result selectors form one ruled control rather than a row of detached chips.

- **Shape:** Square outer field with internal one-pixel dividers; adjacent controls share edges.
- **State:** Unselected cells remain white and use a neutral wash on hover. Selected method cells use their semantic role color; selected result cells use institutional blue; selected retrieval stages use temporal paper.
- **Responsive:** Reflow from three to two to one columns as content requires, converting vertical dividers into horizontal dividers without breaking the joined silhouette.

### Result Selectors

The six experiment views use separate bordered buttons rather than a joined field so each view reads as an independent interactive destination.

- **State:** Hover, pressed, focus, and selected states must be visually distinct. Selected views use institutional blue and retain a visible state icon.
- **Responsive:** Use three columns on wide screens, two on small screens, and one only at very narrow widths.
- **Chart Controls:** Benchmark controls use a strong selected state. Method visibility controls retain their series color so the control maps directly to the plotted line.

### Result Tables

- **Grouping:** Accuracy and Retrieval Hit Rate use distinct grouped headers and a strong vertical divider. Method families use full-width row labels.
- **Ranking:** First-, second-, and third-ranked values include visible gold, slate, and bronze pill labels in addition to cell emphasis; ranking must not rely on color alone.
- **Responsive:** Table regions scroll horizontally and keep the method column sticky on narrow screens.

### Evidence Fields

Query groups, workflow nodes, rank states, and trace questions expose structured research evidence.

- **Style:** White or role-tinted paper, square corners, one-pixel rules, compact internal padding, and bold uppercase field labels.
- **Role Cues:** Use four-pixel top caps only where workflow stages need semantic role identity. Temporal questions and target rows use temporal paper and yellow borders.
- **Content:** Keep timestamps, equations, metrics, and grounded trace language visible; decoration never displaces the evidence.

### Figures and Charts

- **Container:** Flat paper with border-block rules or a complete one-pixel frame, never a shadowed card.
- **Header:** Title and evaluation text precede the visual so the measure and result are explicit.
- **Inspector:** Controls sit in a cool ruled toolbar; exact values and accessible data tables remain available alongside the chart.
- **Motion:** The opening figure may use the established restrained reveal when reduced motion is not requested; state controls use short 150ms transitions.

### Tables

- **Style:** Dense, center-aligned numeric columns with left-aligned method names, soft row rules, and cool header fills.
- **Emphasis:** EgoCITE rows use blue evidence paper; temporal metric groups may use temporal paper; bold type marks best values.
- **Responsive:** Keep minimum column widths and place the table in a keyboard-focusable horizontal scroll region.

### Citation Field

- **Style:** A full-width ruled evidence wash, with a compact yellow-ochre status label and horizontally scrollable monospace content.
- **Shape:** Square and border-block only; it is a document field, not a card despite legacy class naming.

### Navigation

There is no persistent site navigation. Publication actions and in-page joined selectors provide the page's navigation model; do not add a generic app bar to this academic document.

## Do's and Don'ts

### Do:
- **Do** lead new pages and major research surfaces with complete, paper-grounded visual evidence.
- **Do** preserve the smart-glasses lockup and blue, yellow, and teal method-role mapping.
- **Do** align content to the 1160px evidence measure or 900px prose measure.
- **Do** use one-pixel rules, white paper, and cool washes to organize dense information.
- **Do** keep controls compact, joined where they switch one evidence region, keyboard operable, and visibly focused.
- **Do** keep wide figures and tables inspectable through contained horizontal scrolling on narrow screens.

### Don't:
- **Don't** introduce shadows, glass effects, atmospheric gradients, or floating card grids.
- **Don't** use yellow or teal as interchangeable decoration; every role color carries method meaning.
- **Don't** crop, replace, or shrink the overview figure until its labels are unreadable.
- **Don't** substitute promotional copy, oversized hero typography, or marketing-style calls to action for scholarly evidence.
- **Don't** round evidence containers beyond the restrained control radius or scatter pill-shaped chips through the interface.
- **Don't** hide exact metrics, trace details, or data tables behind hover-only behavior.
