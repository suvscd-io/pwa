# Saad's world — visual upgrade

The user requests a substantial redesign using their attached long sky-and-cloud website as the visual reference, with much richer animation and very high visual quality. Existing personal content and English language remain; no projects, portraits, invented accomplishments, or flower icons.

## Direction

An open, continuous world: clear azure sky fades through a mint horizon into soft blue. Original sculptural clouds and a floating miniature landscape add depth. Saad's name leads, with two restrained floating notes connecting the scenery to his engineering and AI interests. The page moves from an expansive opening into a quieter personal introduction, a frosted interest explorer, learning cards, a small personal FAQ, and a garden footer.

Palette: sky #76c5f5, upper sky #42b0ed, mint horizon #e5eed6, white #f8fcff, ink #163f51, cobalt #1766cb. Self-hosted Darker Grotesque provides large expressive display type; Schibsted Grotesk handles body and controls. Center the major statements, use readable left alignment inside explanatory panels, retain generous negative space.

The reference supplies art direction, not copy or branding. No plasma business, testimonials, statistics, or donor forms are copied. '8K' is treated as a visual-quality request; report actual generated asset dimensions rather than claiming native 8K.

## Motion

The opening is a coordinated cloud curtain, unfolding letters, and a rising island. Scrolling changes the island camera and cloud depth. Pointer motion subtly moves the island on desktop. Interactive interest selection and FAQs answer user actions. Cards settle into their positions and the footer landscape rises into view. Use native scrolling, transform-based motion, small mobile effects, system reduced-motion support, and a persistent accessible pause control.

## Implementation and checks

Keep React/TypeScript/Vite/GSAP. Replace the previous layout and stylesheet rather than layering overrides. Preserve contact links and copy-email feedback; preserve accessible interest tabs. Use optimized local WebP images with alpha and responsive variants. Validate build, interaction, keyboard navigation, pause states, and 320px/390px/desktop layouts in a real browser. No deployment target is established; provide the local preview.
