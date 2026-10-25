# Saad Chahid — personal website

A responsive, English-language personal website with an original floating-island scene, continuous pastel sky, GSAP choreography, accessible interest tabs, a personal FAQ, and direct contact links.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The generated `dist/` directory is suitable for static hosting. The site is deployed on Vercel, which rebuilds it automatically from the `main` branch of [suvscd-io/pwa](https://github.com/suvscd-io/pwa).

## Content and design

- Main content: `src/App.tsx`
- Interactive interests: `src/components/Interests.tsx`
- Styling: `src/styles.css`
- GSAP lifecycle: `src/hooks/useSceneMotion.ts`
- Interest sculptures: `src/components/InterestArt.tsx` and `src/interest-art.css`
- Current image-generation prompts and asset details: `docs/sky-assets.md`
- Current design: `docs/superpowers/specs/2026-10-23-sky-world-design.md`

Motion respects the operating system's reduced-motion preference. The floating pause button was removed at the user's request. Contact links are Instagram and X (`suvscd`), GitHub (`suvscd-io`), and email (`suvscd@gmail.com`).

The floating island is 1536 × 1024, with a 960 × 640 mobile version; the cloud WebP is 1600 × 533. Both preserve transparency. The earlier landscape used in the footer is 1672 × 941. These assets are not native 8K; typography and SVG illustrations scale independently. Original new sources and inspection images are retained in `assets/source/` and excluded from Vercel uploads.

Fonts are Darker Grotesque and Schibsted Grotesk, self-hosted in `public/fonts/` with their Open Font License files and system fallbacks. Motion includes an unfolding name, cloud opening, island rise, pointer depth on desktop, scroll-linked scenery, and responsive card/orbit choreography. Sources consulted: [GSAP matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>) and [Vite guide](https://vite.dev/guide/).
