# Portfolio Redesign — Design Spec

**Date:** 2026-05-18
**Owner:** Aman Chhetri
**Scope:** Visual + motion + interaction redesign of the existing single-page portfolio. Copy and project data preserved verbatim.

---

## 1. Goal

Transform the existing React/Vite portfolio into a cinematic, premium "senior AI engineer / creative technologist" portfolio while preserving 100% of the existing copy and project data.

**Non-goals:**
- Rewriting copy or repositioning identity (user chose to keep all text verbatim).
- Adding new sections beyond a small footer.
- Wiring a real contact backend (mailto: replaces emailjs form).
- Repositioning as an AI engineer in copy.

---

## 2. Constraints & decisions (locked)

| Decision | Choice |
| --- | --- |
| Copy | 100% verbatim from existing portfolio |
| Theme | Dark |
| 3D assets (three.js balls, world map bg) | Remove |
| Custom fonts (Arenq, Beckman, Mova, Overcame) | Remove |
| Sections | Keep the existing 6 (Hero, About, Skills, Projects, Experience, Contact) + small footer |
| Contact form | Replace emailjs form with magnetic mailto: button |
| Design direction | "Quiet Cinematic" — minimal premium, one signature visual per section, restrained palette |
| 21st.dev MCP | Use for hero grid, aurora beams, marquee, bento tiles, glow effects |

---

## 3. Design system

### 3.1 Palette

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#05060A` | Page background |
| `surface` | `#0B0D14` | Card / panel base |
| `border` | `rgba(255,255,255,0.08)` | Glass borders |
| `text` | `#F5F5F7` | Primary text |
| `muted` | `#A1A1AA` | Body / muted text |
| `accent-from` | `#7C5CFF` (violet) | Gradient start |
| `accent-to` | `#22D3EE` (cyan) | Gradient end |

Glass surface recipe: `bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]`.

Accent gradient used sparingly: hero name shimmer, CTA fills, project hover rings, timeline beads, footer hairlines.

### 3.2 Typography

- **Display:** Space Grotesk (variable, geometric)
- **Body / UI:** Inter (variable)
- **Mono:** JetBrains Mono — kicker labels, monogram, footer
- **Scale:**
  - Hero headline: `clamp(2.75rem, 8vw, 7rem)`, weight 700, tracking-tight
  - Section heading: `clamp(2rem, 5vw, 4rem)`, weight 600
  - Body: 1rem / 1.7
  - Kicker: 0.75rem mono, uppercase, tracking-wider, muted

### 3.3 Motion language

- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for all entrances
- **Stagger:** 0.06s for children, 0.12s for grouped cards
- **Hero entrance:** opacity 0→1, y 24→0, blur 8→0, char-by-char on the name
- **Scroll reveals:** `whileInView` with `viewport={{ once: true, amount: 0.3 }}`
- **Reduced motion:** respect `prefers-reduced-motion` — fall back to opacity-only transitions
- **Smooth scroll:** Lenis (lightweight, GPU-friendly)

### 3.4 Reusable motion wrappers (`src/motion/`)

| Wrapper | Purpose |
| --- | --- |
| `<Reveal direction y\|x stagger>` | Scroll-triggered fade-up |
| `<Magnetic>` | Mouse-attracted button wrapper (~80px radius spring) |
| `<TiltCard>` | 3D mouse-tilt card (replaces react-tilt) |
| `<GlowOnHover>` | Soft accent-gradient glow ring on hover |
| `<TextShimmer>` | Gradient text sweep for hero name |

### 3.5 Layout

- Content max width: `max-w-6xl` (1152px)
- Section vertical rhythm: `py-32 sm:py-40`
- Sticky glass nav with thin scroll-progress bar underneath
- Section break: thin gradient hairline that animates `scaleX 0→1` on scroll-in

---

## 4. Section designs

### 4.1 Navbar
- Fixed top, glass strip
- Left: monogram "AC" in JetBrains Mono, gradient stroke on hover
- Center/right links: About · Projects · Contact, underline `scaleX` from left on hover
- Right edge: scroll-progress bar via `useScroll` → `scaleX`
- Mobile: full-screen overlay, staggered link reveal

### 4.2 Hero
Layered (back to front):
1. 21st.dev animated grid (faint, slow drift) — full bleed
2. Aurora light beams (21st.dev) — violet/cyan, crossing center-right
3. Mouse-reactive orb — soft blob, spring-damped, ~12% opacity, blur-3xl
4. SVG fractalNoise grain, 4% opacity
5. Foreground:
   - Eyebrow: `// 01 — Introduction` (mono, muted)
   - Headline: `Hi, I'm AMAN` (AMAN gets `<TextShimmer>`)
   - Subtitle: `Frontend Developer` / `I build meaningful experiences.` (verbatim)
   - CTAs: `<Magnetic>` "View Projects" (gradient fill + glow) + "Get in touch" (glass outline)
   - Scroll cue (existing dot animation, restyled)

Load choreography (~1.2s): eyebrow → headline (char blur clear) → subtitle → CTAs → scroll cue.

### 4.3 About
- Split layout on lg+: 40% / 60%
- Left: kicker `// 02 — About`, heading "Overview.", existing two-paragraph copy (verbatim)
- Right: 2×2 bento of 4 service cards (Frontend, Backend, UI/UX, Software Testing). Each card is `<TiltCard>` glass surface with icon in a soft-glow circle, title below. Hover lifts + adds gradient border ring. Cards `<Reveal>` staggered.

### 4.4 Skills (Technologies)
- Kicker `// 03 — Skills`, heading "Technologies."
- Top: animated logo marquee, all 12 logos drift left, pause on hover, edges fade
- Below: 3-col responsive grid of glass cards (logo + name). Lift + `<GlowOnHover>` on hover.

### 4.5 Projects
- Kicker `// 04 — Projects`, heading "Projects.", existing description verbatim
- Bento layout: 12-col CSS grid, asymmetric. Project 1 (Lepton Maps) = 8 cols × 2 rows. Remaining 4 projects fill 4/6-col tiles.
- Card: project image grayscale → color on hover (0.6s), dark bottom→top gradient overlay, existing tag pills as glass with color-matched borders, title bottom-left, animated arrow bottom-right, optional small GitHub icon top-right.
- Whole card is `<TiltCard>` + `<GlowOnHover>` accent ring. Click opens demo.
- Bento tiles `<Reveal>` staggered on scroll.

### 4.6 Experience
- Kicker `// 05 — Experience`, heading "Work Experience."
- Custom glowing rail (no `react-vertical-timeline-component`):
  - Vertical gradient line (violet→cyan), left on lg+, centered on mobile
  - Each experience: pulsing bead on the rail + glass card to the right with company icon, role, company name, date pill
  - Cards: animated border ring on hover
  - Beads brighten as the user scrolls past, via `useScroll` → bead-index mapping

### 4.7 Contact
- Centered, max-width 720px, glass panel with soft inner glow
- Kicker `// 06 — Get in touch`, oversized heading "Let's build something."
- One short tagline line below
- Single `<Magnetic>` CTA: "Email me →" → `mailto:` (replaces emailjs form)
- Inline socials row beneath (reuse existing `assets/icons` if available)

### 4.8 Footer (new, minimal)
- Thin top border, glass tint
- Left: `© 2026 Aman Chhetri` in JetBrains Mono
- Right: socials row
- Single line

---

## 5. Architecture

### 5.1 File structure (post-redesign)

```
src/
  App.jsx                          // section composition
  main.jsx
  index.css                        // tailwind + custom CSS vars + fonts
  styles.js                        // shared layout/typography classes (rewritten)
  components/
    Navbar.jsx
    Footer.jsx                     // new
    Hero.jsx
    About.jsx
    Skills.jsx                     // renamed from Tech.jsx
    Projects.jsx
    Experience.jsx
    Contact.jsx
    ui/
      Magnetic.jsx                 // hover-attract wrapper
      TiltCard.jsx                 // 3D tilt card
      GlowOnHover.jsx              // gradient glow ring wrapper
      TextShimmer.jsx              // animated gradient text
      Reveal.jsx                   // scroll-triggered fade wrapper
      GradientHairline.jsx         // section break
      ScrollProgress.jsx           // top progress bar
    fx/
      AnimatedGrid.jsx             // 21st.dev animated grid bg
      AuroraBeams.jsx              // 21st.dev light beams
      MouseOrb.jsx                 // cursor-tracking soft blob
      Noise.jsx                    // SVG grain overlay
  constants/index.js               // unchanged data (services, technologies, experiences, projects)
  hoc/
    SectionWrapper.jsx             // updated for new layout/IDs
  utils/
    motion.js                      // updated variants library
    cn.js                          // clsx + tailwind-merge helper
  assets/                          // existing assets kept, world map & 3D icons unused
```

### 5.2 Component boundaries

- **Section components** (`Hero`, `About`, etc.) own their layout + content composition. They consume motion wrappers and fx components but do not implement motion math themselves.
- **`ui/` wrappers** are presentation-only, no section-specific logic.
- **`fx/` components** are background visuals, decoupled from content.
- **`constants/index.js`** is the only source of section data — copy/projects/experiences/services unchanged from current file.

### 5.3 Dependencies

**Add:**
- `lenis` (smooth scroll)
- `clsx`
- `tailwind-merge`

**Remove:**
- `@react-three/drei`
- `@react-three/fiber`
- `three`
- `maath`
- `react-vertical-timeline-component`
- `react-tilt`
- `react-router-dom` (overkill for one-page site)
- `@emailjs/browser`
- `use`

**Keep:**
- `framer-motion` (upgrade if a newer minor is available)
- `react`, `react-dom`
- `tailwindcss`, `vite`

### 5.4 Tailwind config changes

- Replace existing custom palette with the new design tokens (Section 3.1)
- Add `Space Grotesk`, `Inter`, `JetBrains Mono` (Google Fonts via `index.css` `@import`, or local)
- Remove the existing `backgroundImage` recipes (`about`, `experience*`, `hero*`, `tech`) — replaced by component-driven visuals
- Keep screen breakpoints

---

## 6. Accessibility

- Semantic landmarks: `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`
- Keyboard focus: visible focus rings using accent gradient
- Color contrast: text on bg ≥ 7:1, muted ≥ 4.5:1
- `prefers-reduced-motion`: disable parallax/orb/shimmer; keep opacity reveals only
- All interactive elements reachable by keyboard
- ARIA labels on icon-only buttons (GitHub link, socials)

---

## 7. Performance

- No three.js / no large bundle deps
- Use `framer-motion` `LayoutGroup` sparingly; prefer transform/opacity-only animations
- Lazy-load below-the-fold images (projects)
- Use `will-change: transform` only on actively animating elements
- Preload one display font weight to avoid FOUT on hero
- Target Lighthouse mobile performance ≥ 90

---

## 8. Responsive behavior

- **xs (≤640px):** single column everywhere; bento collapses to stacked; experience rail centered; nav becomes hamburger overlay
- **md (≥768px):** About goes 2-col, projects bento goes 2-col
- **lg (≥1024px):** full bento (12-col), experience rail left-aligned, about 40/60 split
- **xl (≥1280px):** max content width caps at 1152px (`max-w-6xl`)

---

## 9. Out of scope

- Resume download button (currently commented out — stays out)
- Light theme variant
- Actual emailjs / form backend wiring
- New copy / AI repositioning
- New project entries
- Blog or case-study deep links
- i18n

---

## 10. Open follow-ups (not blocking)

- Real domain + deploy target — user to confirm at launch
- Favicon + OG image — current logo asset to be reused unless replaced
- **Exact 21st.dev component variants** for animated grid, aurora beams, and marquee — selected at implementation time via 21st.dev MCP from the available premium options; spec locks the *effect*, not the exact source URL.

## 11. Contact info (locked at spec time)

- **Email** (mailto target): `gattiflab@gmail.com`
- **GitHub**: `https://github.com/amanchhetri`
- **LinkedIn**: `https://www.linkedin.com/in/aman-chhetri/`
- **LeetCode**: `https://leetcode.com/u/gattiflab/`
