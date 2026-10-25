# Saad Chahid — personal website design

Status: implemented locally, with a visual revision requested by Saad during preview.

## Live design revision

Saad explicitly rejected flower icons and the initial typography and requested much more expressive, original animation. Replace all flower iconography with a faceted paper-glider motif and compass/orbit details. Use Darker Grotesque display type and Schibsted Grotesk body type instead of the initial Manrope/Instrument Serif pairing. Add a character-level name entrance, a paper glider that banks along a scroll-driven flight, pointer response, and coordinated section choreography. Preserve content, contact details, landscape, English language, and reduced-motion/manual pause behavior. The flowers within the landscape photograph are scenery, not interface icons.

## Purpose and confirmed preferences

Create a personal website that helps people get to know Saad Chahid, discover his interests, and connect with him. The experience should feel welcoming, imaginative, and polished, with expressive scenery and high-quality animation.

Confirmed by Saad:

- Display name: Saad Chahid. All website copy is in English.
- He is an engineering student at EMSI in Casablanca, Morocco.
- His interests include technology, AI, software engineering, and cybersecurity.
- He uses OpenAI Codex and Claude for AI-assisted development and learning.
- He is developing his programming fundamentals, software engineering, cybersecurity, Linux, networking, and software architecture knowledge.
- His hands-on hobby is troubleshooting and repairing computers, toys, and everyday devices.
- The visual focus is his name and scenery; a personal photograph is not part of the design.
- Instagram and X username: suvscd. Public contact email: suvscd@gmail.com.
- Do not include a projects section or discuss projects in the public copy.
- His five visual references feature blue skies, clouds, green landscapes, immersive illustrations, large typography, floating elements, and translucent navigation. He wants motion and emotion, with a high-quality finish.

## Proposed choices made by the designer

These choices are recommendations, not preferences already confirmed by Saad:

- A single scrolling page with sections for introduction, about, interests, skills, and connection.
- A pastoral landscape as the main visual world: blue sky, softly lit clouds, layered green hills, and sparse flowers. The first and third references guide the scenery; the fourth guides depth and floating motion.
- A palette of sky blue, cloud white, fresh green, and small lavender accents.
- Large, expressive typography for Saad's name, paired with a clean, highly readable font for body text.
- A small translucent navigation bar, with only a few floating labels. Keep the landscape and content legible, avoiding a crowded collection of cards.
- A spacious opening scene followed by quieter reading sections that retain visual continuity with the sky and landscape.
- A static frontend using React, TypeScript, Vite, CSS, and a motion library where useful. There is no existing application or Git repository in the workspace. Exact packages and versions are implementation decisions.
- Original generated scenery or original layered artwork informed by the references. Do not reuse the supplied screenshots as website backgrounds or reproduce their branding.

## Content and visitor experience

### 1. Introduction

The first screen makes the name the visual focal point in an expansive landscape. The name must remain readable without waiting for an animation. On narrow screens, stack the name naturally rather than shrinking it excessively.

Proposed copy:

> Hi, I'm
>
> Saad Chahid
>
> Engineering student. Curious mind. Hands-on problem solver.
>
> Exploring technology, artificial intelligence, and the possibilities of human creativity — from Casablanca, Morocco.

Use two clear links: “Get to know me” scrolls to About; “Let's connect” scrolls to Connect. A subtle scroll cue indicates that more content follows.

### 2. About

Proposed copy:

> I'm an engineering student at EMSI in Casablanca, Morocco, with a curiosity for how technology works and what we can create with it.
>
> I enjoy exploring artificial intelligence, software engineering, and cybersecurity. With tools like OpenAI Codex and Claude, I experiment, turn ideas into working software, and keep learning along the way.
>
> I'm strengthening my technical foundations while learning how to collaborate thoughtfully with AI. Curiosity, creativity, and practical problem-solving guide how I learn.

Keep the tone personal and approachable. Do not invent employment, credentials, awards, availability, or years of experience.

### 3. Interests and hobbies

Give the interests space through a small number of expressive illustrations or floating labels, with concise text. The builder can choose the exact composition to suit desktop and mobile.

- Artificial intelligence: exploring how people and AI can create and solve problems together.
- Software engineering: understanding how useful software is designed and built.
- Cybersecurity: learning how systems work and how to protect them.
- Hands-on repair and troubleshooting: “I enjoy understanding how things work, identifying problems, and repairing computers, toys, and everyday devices. This hobby combines my curiosity with practical problem-solving and the satisfaction of making something work again.”

### 4. Skills and learning

Present the distinctions honestly, without proficiency percentages or claims of expert status.

- AI-assisted development: Codex, Claude, collaborating with AI agents, prompt engineering, technical task planning, and rapid prototyping.
- Practical software development: planning features and experiences, frontend and backend exploration, testing, debugging, and iterative improvement.
- Technologies used: React, Django, Node.js, Express, PostgreSQL, MongoDB, Git, GitHub, Docker, Cloudflare, Vercel, and Supabase.
- Currently learning: programming fundamentals, software engineering, cybersecurity, Linux, networking, and software architecture.

### 5. Connect

Finish with a warm invitation: “Let's connect.” Supporting copy can invite conversation about technology, shared interests, or learning.

- Instagram: https://www.instagram.com/suvscd/
- X: https://x.com/suvscd
- Email: mailto:suvscd@gmail.com

Show readable labels and the handle or email, not icons alone. Email uses a working mailto link. A contact form and backend are outside the first version. Do not imply that the account ownership or deliverability has been independently verified.

## Motion and emotional direction

The page should feel alive through a few coordinated motions rather than constant movement everywhere:

- A short, staged introduction of the greeting, name, and supporting copy.
- Slow cloud drift and gentle depth between scenery layers.
- Subtle scroll-linked scenery movement on capable devices; keep the reading experience stable.
- Calm entrances for sections and interests as they enter view.
- Small hover and focus responses for links and buttons. Any pointer-based depth is optional and never required to access content.
- A visually coherent transition from the landscape introduction into the personal content and closing invitation.

Use native scrolling without scroll hijacking, forced loading sequences, or autoplay audio. Animate transform and opacity where possible. Avoid expensive continuous rendering when offscreen. Mobile layouts should use lighter motion and no dependency on hover. Respect prefers-reduced-motion by stopping ambient drift and parallax and making content immediately available.

## Quality requirements

- Check desktop, tablet, and small-phone layouts, including 320–390px widths.
- Maintain readable text contrast against scenery, using carefully placed shading or solid surfaces where necessary.
- Use semantic sections, a logical heading order, keyboard-accessible links, visible focus, and descriptive accessible names.
- Mark purely decorative scenery as decorative; do not render meaningful text into background imagery.
- Use responsive, compressed visual assets and reserve their layout space. Keep the key introduction visible while assets load.
- Verify navigation anchors, social destinations, the email link, responsive overflow, and reduced-motion behavior.
- Inspect the rendered page at desktop and mobile sizes; check animation in an actual browser, not just screenshots.
- Include page title, description, and basic social preview metadata. Canonical domain details can be added when a domain is selected.

## Boundaries and choices left to implementation

No projects, portfolio case studies, blog, portrait, invented testimonials, fake statistics, or fabricated achievements. Do not include the source designs' branding or business copy.

The builder can choose exact fonts, spacing, illustrations, animation timings, component structure, and icon treatment within this direction. Domain purchase, hosting selection, and public deployment remain separate decisions and do not block a local implementation. No deployment is part of this brief.

## Success criteria

A visitor quickly understands who Saad is, what interests him, and how to connect. The page feels personal and memorable, matches the bright landscape references, and offers polished motion while remaining readable, accessible, and usable on a phone.
