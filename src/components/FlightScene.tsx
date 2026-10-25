import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../flight.css";

gsap.registerPlugin(ScrollTrigger);

// Coordinates are viewport fractions. After launch the glider stays in the
// page margin, leaving the reading and interaction areas clear.
const course = [
  { x: 0.84, y: 0.24, bank: -12, scale: 1 },
  { x: 0.957, y: 0.65, bank: 24, scale: 0.76 },
  { x: 0.96, y: 0.28, bank: -28, scale: 0.72 },
  { x: 0.956, y: 0.73, bank: 22, scale: 0.76 },
  { x: 0.96, y: 0.3, bank: -24, scale: 0.73 },
  { x: 0.89, y: 0.37, bank: -8, scale: 1 },
];

function courseAt(progress: number) {
  const position = gsap.utils.clamp(0, 1, progress) * (course.length - 1);
  const index = Math.min(Math.floor(position), course.length - 2);
  const amount = position - index;
  const eased = amount * amount * (3 - 2 * amount);
  const from = course[index];
  const to = course[index + 1];
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased,
    bank: from.bank + (to.bank - from.bank) * eased,
    scale: from.scale + (to.scale - from.scale) * eased,
  };
}

export default function FlightScene({ paused }: { paused: boolean }) {
  const scene = useRef<HTMLDivElement>(null);
  const hasLaunched = useRef(false);
  const identifier = useId().replace(/:/g, "");

  useLayoutEffect(() => {
    const element = scene.current;
    if (!element || paused) return;
    const page = element.closest(".site");
    const hero = page?.querySelector<HTMLElement>(".hero");
    if (!page || !hero) return;
    const mm = gsap.matchMedia(element);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 800px)",
        pointer: "(hover: hover) and (pointer: fine)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const anchor = element.querySelector<HTMLElement>(".flight-anchor")!;
        const bank = element.querySelector<HTMLElement>(".flight-bank")!;
        const pointer = element.querySelector<HTMLElement>(".flight-pointer")!;
        const trail = element.querySelector<SVGElement>(".flight-trail")!;
        const desktop = Boolean(context.conditions.desktop);
        const atOpening = window.scrollY < hero.offsetHeight * 0.25;
        const shouldLaunch = !hasLaunched.current && atOpening;

        const state = { progress: 0, launch: shouldLaunch ? 1 : 0 };
        gsap.set(element, { autoAlpha: 1 });
        gsap.set(anchor, {
          left: 0,
          top: 0,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 1,
        });
        gsap.set(bank, { rotation: 0 });
        gsap.set(pointer, { x: 0, y: 0, rotation: 0 });
        const setX = gsap.quickSetter(anchor, "x", "px");
        const setY = gsap.quickSetter(anchor, "y", "px");
        // quickSetter resolves "scale" to the composite alias "scaleX,scaleY";
        // explicit axes use CSSPlugin's transform renderer in GSAP 3.14.
        const setScaleX = gsap.quickSetter(anchor, "scaleX");
        const setScaleY = gsap.quickSetter(anchor, "scaleY");
        const setBank = gsap.quickSetter(bank, "rotation", "deg");
        const renderFlight = () => {
          const point = courseAt(state.progress);
          // The smaller phone glider follows the far margin. It only renders
          // while scrolling/launching, with no idle animation or pointer work.
          setX(
            window.innerWidth *
              ((desktop ? point.x : 0.969) -
                state.launch * (desktop ? 1.02 : 1.2)),
          );
          setY(
            window.innerHeight *
              (point.y + state.launch * (desktop ? 0.37 : 0.2)),
          );
          const scale =
            (desktop ? point.scale : 0.73) -
            state.launch * (desktop ? 0.24 : 0.13);
          setScaleX(scale);
          setScaleY(scale);
          setBank(
            (desktop ? point.bank : point.bank * 0.6 - 22) - state.launch * 16,
          );
        };
        renderFlight();
        gsap.to(state, {
          progress: 1,
          duration: 1,
          ease: "none",
          onUpdate: renderFlight,
          scrollTrigger: {
            trigger: page,
            start: "top top",
            end: "bottom bottom",
            scrub: desktop ? 1.15 : 0.75,
            invalidateOnRefresh: true,
            onRefresh: renderFlight,
          },
        });
        if (shouldLaunch) {
          gsap.to(state, {
            launch: 0,
            duration: desktop ? 2.6 : 2.1,
            ease: "power2.out",
            onUpdate: renderFlight,
            onComplete: () => {
              hasLaunched.current = true;
            },
          });
          gsap.from(trail, { opacity: 0, duration: 1.2, delay: 0.3 });
        }

        if (!desktop || !context.conditions.pointer) return;
        const moveX = gsap.quickTo(pointer, "x", {
          duration: 0.9,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(pointer, "y", {
          duration: 0.9,
          ease: "power3.out",
        });
        const tilt = gsap.quickTo(pointer, "rotation", {
          duration: 1.1,
          ease: "power3.out",
        });
        const onPointer = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const bounds = hero.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          moveX(x * 28);
          moveY(y * 22);
          tilt(x * 15);
        };
        const settle = () => {
          moveX(0);
          moveY(0);
          tilt(0);
        };
        hero.addEventListener("pointermove", onPointer, { passive: true });
        hero.addEventListener("pointerleave", settle);
        return () => {
          hero.removeEventListener("pointermove", onPointer);
          hero.removeEventListener("pointerleave", settle);
          moveX.tween.kill();
          moveY.tween.kill();
          tilt.tween.kill();
        };
      },
    );
    return () => mm.revert();
  }, [paused]);

  return (
    <div
      ref={scene}
      className={`flight-scene${paused ? " flight-paused" : ""}`}
      aria-hidden="true"
    >
      <div className="flight-anchor">
        <div className="flight-pointer">
          <div className="flight-bank">
            <svg className="flight-trail" viewBox="0 0 380 140" fill="none">
              <defs>
                <linearGradient
                  id={`${identifier}-trail`}
                  x1="0"
                  y1="90"
                  x2="380"
                  y2="60"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#83afb8" stopOpacity="0" />
                  <stop offset="0.65" stopColor="#9cbfc4" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#d9eaf0" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M2 91C65 134 133 117 139 79C146 35 78 36 91 82C107 137 224 107 374 49"
                stroke={`url(#${identifier}-trail)`}
                strokeWidth="1.2"
                strokeDasharray="2 7"
                strokeLinecap="round"
              />
            </svg>
            <svg className="flight-paper" viewBox="0 0 280 180" fill="none">
              <defs>
                <linearGradient
                  id={`${identifier}-wing`}
                  x1="51"
                  y1="44"
                  x2="155"
                  y2="111"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffffff" />
                  <stop offset="0.62" stopColor="#f3f7f7" />
                  <stop offset="1" stopColor="#b6cdd5" />
                </linearGradient>
                <linearGradient
                  id={`${identifier}-fold`}
                  x1="160"
                  y1="64"
                  x2="136"
                  y2="141"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#e6eff0" />
                  <stop offset="1" stopColor="#c7d9df" />
                </linearGradient>
                <linearGradient
                  id={`${identifier}-keel`}
                  x1="120"
                  y1="111"
                  x2="243"
                  y2="29"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#81a5b4" />
                  <stop offset="1" stopColor="#e7eff0" />
                </linearGradient>
              </defs>
              <path
                d="M21 65L251 25L115 99L21 65Z"
                fill={`url(#${identifier}-wing)`}
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <path
                d="M115 99L132 130L251 25L115 99Z"
                fill={`url(#${identifier}-keel)`}
              />
              <path
                d="M251 25L150 153L137 100L251 25Z"
                fill={`url(#${identifier}-fold)`}
                stroke="#f9ffff"
                strokeWidth="0.7"
                strokeLinejoin="round"
              />
              <path d="M137 100L132 130L150 153L137 100Z" fill="#94b2bf" />
              <path
                d="M22 65L251 25L137 100"
                stroke="#ffffff"
                strokeOpacity="0.95"
                strokeWidth="1.2"
              />
              <path
                d="M115 99L251 25"
                stroke="#acbec8"
                strokeOpacity="0.5"
                strokeWidth="0.7"
              />
              <path
                d="M137 100L150 153"
                stroke="#ffffff"
                strokeOpacity="0.8"
                strokeWidth="0.9"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
