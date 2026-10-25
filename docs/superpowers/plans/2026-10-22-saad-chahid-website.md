# Saad Chahid Website Implementation Plan

> **For agentic workers:** Use executing-plans for the main implementation, with bounded asset creation and an independent final review.

**Goal:** Build a memorable, animated English-language personal website centered on Saad's name, scenery, interests, and connections.

**Architecture:** A client-side React page with semantic sections, original landscape art, CSS scene details, and GSAP choreography. Static production output; no backend or data collection. Build in the current new workspace and deliver a local preview.

**Tech Stack:** React, TypeScript, Vite, GSAP, Lucide SVG icons, CSS.

**Spec:** ../specs/2026-10-22-saad-chahid-website-design.md, plus Saad's latest request for exceptional visual and motion quality.

## Global constraints

- English only; use Saad Chahid, EMSI, Casablanca, Morocco, and supplied factual content.
- Do not include projects, case studies, a portrait, testimonials, or invented achievements.
- Social handle suvscd on Instagram and X; email suvscd@gmail.com.
- Name and scenery lead the design. Crisp assets, responsive layout, native scrolling, and reduced-motion support.
- Interpret 8K as a visual-quality request; do not claim generated imagery is 8K or ship an unnecessarily large background.

## Art direction

- Colors: sky #087FCC, deep blue #12394B, paper #F8FAF5, grass #B8DD78, lavender #DED3FB, white #FFFFFF.
- Typography: self-hosted Darker Grotesque for display type and Schibsted Grotesk for navigation and body. This reflects Saad's request for a different typographic direction.
- Layout: expansive centered landscape hero; asymmetric, editorial about section; interest explorer; open learning grid; landscape connection footer.
- Signature moment: a folded-paper glider launches through the landscape and follows the scroll, with a staged letter reveal and camera-like scene movement. The glider responds to the pointer on desktop and stays small at the edge on mobile. Continuous decorative animation can be paused.
- Critique against brief: avoid generic SaaS feature cards and fake statistics; prioritize real personal content, landscape, optical type sizing, and useful interaction.

## Files and tasks

### Task 1: Establish the page and visual foundation

Files: package.json, index.html, tsconfig.json, vite.config.ts, src/main.tsx, src/App.tsx, src/styles.css, public/favicon.svg.

- [x] Create the React/TypeScript build and semantic page with all provided content and real contact links.
- [x] Implement responsive tokens, type, navigation, hero, about, skills, and footer compositions.
- [x] Integrate original optimized landscape imagery from public/images/.
- [x] Verify TypeScript and production build.

### Task 2: Choreograph motion and interaction

Files: src/components/Interests.tsx, src/components/InterestArt.tsx, src/hooks/useSceneMotion.ts, src/App.tsx, src/styles.css.
Interfaces: Interests renders an accessible keyboard-operable set of interest tabs; useSceneMotion(rootRef, paused) owns GSAP lifecycle and returns no value.

- [x] Make interest selection update visible illustration and copy; arrow, Home, and End keys navigate tabs.
- [x] Add coordinated entrance animation, responsive scene depth, and selective scroll choreography.
- [x] Add a labeled pause-motion control and honor reduced-motion changes at runtime.
- [x] Check navigation, tab switching, keyboard interaction, motion pause, and contact links in a real browser.

### Task 3: Visual review and delivery

Files: README.md, docs/verification.md, scripts/prepare-assets.mjs if necessary.

- [x] Inspect desktop and mobile rendered pages, including 320px width; fix observed layout failures.
- [x] Review reduced-motion logic, exercise manual-pause final states, and verify no horizontal overflow.
- [x] Obtain an independent code review and address material issues.
- [x] Re-run production build after final changes and document checks and asset resolution honestly.
- [x] Open the working local preview and provide the URL and short handoff.

## Review focus

1. Narrow screens: name, navigation, contact labels, and tabs must not overflow.
2. Reduced motion or manual pause: content remains visible and all ongoing decoration stops.
3. Keyboard: tabs and anchor links remain usable with visible, unobscured focus.
4. Asset delay/failure: hero copy remains readable against the fallback sky.
5. External destinations: actual supplied handles and email; no fake form success or placeholder links.

## Implementation record

- Workspace is new and not a Git repository; worktree and branch operations do not apply.
- Native implementation with a separate image-generation task and final independent reviewer avoids conflicting edits.
- Browser interaction and rendering checks are the meaningful verification for this presentation site; no tests that merely mirror copy or CSS.

