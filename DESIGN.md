# Portfolio design system

Service portfolio for an IT support candidate. Primary audience: recruiters and hiring managers. Main actions: review project evidence, read the resume and make contact.

## Direction

Calm, practical and technically competent. Flat graphite surfaces with a muted green tint, warm white text and one mint accent. Actual project screenshots carry the visual identity. No decorative canvas, simulated terminal, stock photos or animated background.

The existing dark theme was retained intentionally. A custom split hero accommodates a readable role statement and the existing JKT screenshot. Generic template layout deals were evaluated but not used: preserving the portfolio’s own material and natural content height takes priority over fixed-screen recipes.

## Tokens

| Token              | Value     | Purpose                      |
| ------------------ | --------- | ---------------------------- |
| `--bg`             | `#101714` | Page and header              |
| `--surface`        | `#17221c` | Secondary sections and cards |
| `--surface-raised` | `#1d2c23` | Featured project             |
| `--text`           | `#f1f3eb` | Main text                    |
| `--muted`          | `#acb7ac` | Secondary text               |
| `--accent`         | `#c4ed99` | Primary actions and focus    |
| `--border`         | `#334138` | Dividers and card edges      |
| `--radius`         | `12px`    | Cards; controls use 6px      |
| `--max-width`      | `1264px`  | Shared content width         |

Font: Segoe UI, Arial, sans-serif. No external font requests; native fallbacks cover Cyrillic, Japanese, Thai and Vietnamese. Body 16px; compact content 14px; metadata 10–13px. Desktop hero up to 72px, section headings up to 48px. Long translations wrap rather than being clipped.

## Composition

- Equal outer content edges; 56px desktop gutters, 36px tablet, 20px phone.
- Hero: role statement, two actions, featured project and three existing experience indicators.
- Projects: two columns on desktop, one on mobile. Labels and description precede the image.
- About: biography plus structured experience, education and languages.
- Skills: three columns, then two, then one. Filters remove nonmatching groups from view and keyboard navigation.
- Resume: document card plus remote, relocation and visa conditions.
- Contact: primary email and four direct contact routes.
- Project: title, screenshot gallery, overview, role, tasks, outcome and technologies.

Sections use natural heights. Extra empty space is not added to force a section into a viewport. Screenshots are cropped only in previews; the project gallery and expanded viewer preserve the full image.

## Interaction and accessibility

Linked cards lift by 2px; images zoom slightly within their frame; buttons respond on hover and press. No automatic slides, scroll reveals or continuous motion. Reduced-motion preferences disable transitions and smooth scrolling.

All controls have visible focus. Native dialogs provide modal focus containment, Escape handling and focus restoration. Navigation state and selected filters use ARIA attributes. The mobile menu makes underlying content inert. Language selection supports arrow keys, Home, End and Escape. Content remains readable without JavaScript; project details include a no-JavaScript fallback.

## Assets

Only the user's existing material is used. `assets/images` contains WebP derivatives for previews and galleries; `Screenshots` retains full-resolution originals. The provided workbench illustration remains a project asset and is not described as a verified photograph of the author's workplace.

Validation results and known limits are recorded in `AUDIT.md`.
