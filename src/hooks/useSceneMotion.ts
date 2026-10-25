import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindScenePointer, observeSceneLayout } from "./sceneLifecycle";

gsap.registerPlugin(ScrollTrigger);

export default function useSceneMotion(
  root: RefObject<HTMLDivElement | null>,
  paused: boolean,
) {
  const introduced = useRef(false);

  useLayoutEffect(() => {
    const page = root.current;
    if (!page || paused) return;

    const mm = gsap.matchMedia(page);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 800px)",
        finePointer: "(hover: hover) and (pointer: fine)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = Boolean(context.conditions.desktop);
        const select = <T extends Element = HTMLElement>(selector: string) =>
          Array.from(page.querySelectorAll<T>(selector));
        const hero = select<HTMLElement>(".hero")[0];
        const island = select(".hero-island");
        const islandImage = select(".hero-island img");
        const notes = select<HTMLElement>(".floating-note");
        const nearCloud = select(".hero-cloud.cloud-near");
        const farCloud = select(".hero-cloud.cloud-far");
        const glyphs = select(".hero-name .name-glyph");
        const heroCopy = select(".hero-copy");

        // The image rises inside the island's scroll wrapper. Pointer depth
        // belongs to .island-hover, so those three motions never overwrite.
        if (
          hero &&
          !introduced.current &&
          window.scrollY < hero.offsetHeight * 0.65
        ) {
          const entrance = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              introduced.current = true;
            },
          });

          if (nearCloud.length) {
            entrance.from(
              nearCloud,
              {
                xPercent: (index: number) => (index % 2 ? -27 : 27),
                scale: 1.12,
                duration: desktop ? 2.4 : 1.7,
                ease: "power2.inOut",
              },
              0,
            );
          }
          if (farCloud.length) {
            entrance.from(
              farCloud,
              {
                xPercent: (index: number) => (index % 2 ? 14 : -14),
                scale: 1.08,
                duration: desktop ? 2.7 : 1.9,
                ease: "power2.inOut",
              },
              0,
            );
          }
          if (islandImage.length) {
            entrance.from(
              islandImage,
              {
                y: desktop ? 115 : 58,
                rotation: desktop ? -6 : -3,
                scale: desktop ? 0.83 : 0.91,
                transformOrigin: "50% 65%",
                duration: desktop ? 2.1 : 1.65,
                ease: "back.out(1.05)",
              },
              0.12,
            );
          }
          if (glyphs.length) {
            entrance.from(
              glyphs,
              {
                yPercent: desktop ? 65 : 43,
                rotationX: desktop ? -66 : -42,
                rotationZ: (index: number) => (index % 2 ? 4 : -4),
                transformPerspective: 850,
                transformOrigin: "50% 100%",
                duration: desktop ? 1.35 : 1.05,
                stagger: desktop ? 0.055 : 0.037,
                ease: "back.out(1.25)",
              },
              0.18,
            );
          }
          const greeting = select(".hero-intro");
          if (greeting.length)
            entrance.from(
              greeting,
              {
                x: -20,
                opacity: 0.6,
                duration: 0.9,
              },
              0.2,
            );
          const description = select(".hero-description");
          if (description.length)
            entrance.from(
              description,
              {
                y: 20,
                opacity: 0.65,
                duration: 1,
              },
              0.55,
            );
          const action = select(".hero-action");
          if (action.length)
            entrance.from(
              action,
              {
                yPercent: 20,
                scale: 0.9,
                duration: 1,
                ease: "back.out(1.6)",
              },
              0.7,
            );
          if (notes.length)
            entrance.from(
              notes,
              {
                yPercent: desktop ? 45 : 22,
                rotation: (index: number) => (index % 2 ? 9 : -9),
                scale: desktop ? 0.82 : 0.92,
                duration: 1.35,
                stagger: 0.15,
                ease: "back.out(1.15)",
              },
              0.6,
            );
        }

        if (hero) {
          if (island.length)
            gsap.to(island, {
              yPercent: desktop ? -15 : -6,
              rotation: desktop ? 4 : 1.6,
              scale: desktop ? 1.08 : 1.035,
              transformOrigin: "50% 60%",
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: desktop ? 1.3 : 0.65,
              },
            });

          // Entrance uses cloud x/scale; scroll depth uses y/rotation only.
          if (nearCloud.length)
            gsap.to(nearCloud, {
              yPercent: desktop ? -32 : -14,
              rotation: desktop ? -3 : -1,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: desktop ? 1.1 : 0.65,
              },
            });
          if (farCloud.length)
            gsap.to(farCloud, {
              yPercent: desktop ? 18 : 8,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: desktop ? 1.6 : 0.8,
              },
            });

          if (desktop && heroCopy.length)
            gsap.to(heroCopy, {
              y: 70,
              scale: 0.94,
              transformOrigin: "50% 25%",
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "12% top",
                end: "bottom top",
                scrub: 1,
              },
            });
        }

        const about = select<HTMLElement>(".about-section")[0];
        if (about) {
          const heading = Array.from(about.querySelectorAll(".about-heading"));
          if (heading.length)
            gsap.from(heading, {
              y: desktop ? 44 : 26,
              rotationX: desktop ? -18 : -8,
              transformPerspective: 1000,
              transformOrigin: "0% 100%",
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: about, start: "top 86%", once: true },
            });
          const lines = Array.from(
            about.querySelectorAll<HTMLElement>(".about-line"),
          );
          if (lines.length) {
            lines.forEach((line, index) => {
              gsap.from(line, {
                y: desktop ? 24 : 16,
                x: desktop ? 10 : 0,
                opacity: 0.6,
                duration: 0.9,
                delay: desktop ? Math.min(index * 0.06, 0.18) : 0,
                ease: "power2.out",
                scrollTrigger: { trigger: line, start: "top 91%", once: true },
              });
            });
          } else {
            const body = Array.from(about.querySelectorAll(".about-body"));
            if (body.length)
              gsap.from(body, {
                y: desktop ? 32 : 20,
                opacity: 0.7,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: body[0],
                  start: "top 91%",
                  once: true,
                },
              });
          }
        }

        select<HTMLElement>(".interest-explorer").forEach((explorer) => {
          gsap.from(explorer, {
            y: desktop ? 54 : 30,
            rotationX: desktop ? -13 : -5,
            scale: desktop ? 0.96 : 0.985,
            transformPerspective: 1200,
            transformOrigin: "50% 100%",
            duration: 1.35,
            ease: "power3.out",
            scrollTrigger: { trigger: explorer, start: "top 91%", once: true },
          });
        });

        select<HTMLElement>(".learning-section .learning-card").forEach(
          (card, index) => {
            gsap.from(card, {
              y: desktop ? 58 : 32,
              rotation: index % 2 ? (desktop ? 3 : 1.5) : desktop ? -3 : -1.5,
              rotationY: desktop ? (index % 2 ? -10 : 10) : 0,
              scale: desktop ? 0.94 : 0.97,
              transformPerspective: 1000,
              transformOrigin: "50% 100%",
              duration: 1.2,
              delay: desktop ? index * 0.1 : (index % 2) * 0.07,
              ease: "back.out(1.05)",
              scrollTrigger: { trigger: card, start: "top 93%", once: true },
            });
          },
        );

        select<HTMLElement>(".world-section").forEach((world) => {
          const orbit = world.querySelector<HTMLElement>(".world-orbit");
          if (!orbit) return;
          const objects = Array.from(orbit.querySelectorAll(".orbit-object"));
          gsap.fromTo(
            orbit,
            { rotation: desktop ? -16 : -10 },
            {
              rotation: desktop ? 24 : 14,
              transformOrigin: "50% 50%",
              ease: "none",
              scrollTrigger: {
                trigger: world,
                start: "top bottom",
                end: "bottom top",
                scrub: desktop ? 1.5 : 0.8,
              },
            },
          );
          if (objects.length)
            gsap.fromTo(
              objects,
              { rotation: desktop ? 16 : 10 },
              {
                rotation: desktop ? -24 : -14,
                transformOrigin: "50% 50%",
                ease: "none",
                scrollTrigger: {
                  trigger: world,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: desktop ? 1.5 : 0.8,
                },
              },
            );
        });

        select<HTMLElement>(".connect-section").forEach((connect) => {
          const copy = Array.from(connect.querySelectorAll(".connect-copy"));
          if (copy.length)
            gsap.from(copy, {
              y: desktop ? 52 : 28,
              rotationX: desktop ? -12 : -4,
              scale: 0.97,
              transformPerspective: 1000,
              transformOrigin: "50% 100%",
              duration: 1.3,
              ease: "power3.out",
              scrollTrigger: { trigger: copy[0], start: "top 91%", once: true },
            });
          const landscape = Array.from(
            connect.querySelectorAll(".footer-landscape"),
          );
          if (landscape.length)
            gsap.fromTo(
              landscape,
              { scale: desktop ? 1.09 : 1.045, yPercent: desktop ? 7 : 3 },
              {
                scale: 1,
                yPercent: 0,
                transformOrigin: "50% 100%",
                ease: "none",
                scrollTrigger: {
                  trigger: connect,
                  start: "top bottom",
                  end: "bottom bottom",
                  scrub: desktop ? 1.25 : 0.7,
                },
              },
            );
        });

        // quickTo tweens are created inside matchMedia's context, not inside
        // event callbacks. Reverting the context restores every inline style.
        if (!hero || !desktop || !context.conditions.finePointer) return;
        const hover = hero.querySelector<HTMLElement>(".island-hover");
        const followers = [
          ...(hover ? [{ element: hover, strength: 1, tilt: true }] : []),
          ...notes.map((element, index) => ({
            element,
            strength: index % 2 ? -0.5 : 0.65,
            tilt: false,
          })),
        ];
        const controls = followers.map(({ element, strength, tilt }) => {
          const initialX = Number(gsap.getProperty(element, "x")) || 0;
          const initialY = Number(gsap.getProperty(element, "y")) || 0;
          // Capture the position before quickTo writes, including any static
          // transform used by the layout.
          gsap.set(element, { x: initialX, y: initialY });
          const x = gsap.quickTo(element, "x", {
            duration: 1.15,
            ease: "power3.out",
          });
          const y = gsap.quickTo(element, "y", {
            duration: 1.15,
            ease: "power3.out",
          });
          let rotateX: ReturnType<typeof gsap.quickTo> | undefined;
          let rotateY: ReturnType<typeof gsap.quickTo> | undefined;
          if (tilt) {
            gsap.set(element, {
              rotationX: 0,
              rotationY: 0,
              transformPerspective: 1000,
              transformOrigin: "50% 55%",
            });
            rotateX = gsap.quickTo(element, "rotationX", {
              duration: 1.3,
              ease: "power3.out",
            });
            rotateY = gsap.quickTo(element, "rotationY", {
              duration: 1.3,
              ease: "power3.out",
            });
          }
          return { x, y, rotateX, rotateY, initialX, initialY, strength };
        });
        const move = (x: number, y: number) => {
          controls.forEach((control) => {
            control.x(control.initialX + x * 28 * control.strength);
            control.y(control.initialY + y * 20 * control.strength);
            control.rotateX?.(-y * 5);
            control.rotateY?.(x * 7);
          });
        };
        const settle = () =>
          controls.forEach((control) => {
            control.x(control.initialX);
            control.y(control.initialY);
            control.rotateX?.(0);
            control.rotateY?.(0);
          });
        const pointer = bindScenePointer(hero, move, settle);
        ScrollTrigger.addEventListener("refresh", pointer.invalidate);
        return () => {
          ScrollTrigger.removeEventListener("refresh", pointer.invalidate);
          pointer.dispose();
          controls.forEach(({ x, y, rotateX, rotateY }) => {
            x.tween.kill();
            y.tween.kill();
            rotateX?.tween.kill();
            rotateY?.tween.kill();
          });
        };
      },
    );
    const stopObserving = observeSceneLayout(page, () => ScrollTrigger.refresh());

    return () => {
      stopObserving();
      mm.revert();
    };
  }, [root, paused]);
}
