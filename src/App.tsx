import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Mail,
  Copy,
  Check,
  Instagram,
  Orbit,
  Code2,
  ShieldCheck,
  Wrench,
  GraduationCap,
  Plus,
  Compass,
} from "lucide-react";
import FlightMark from "./components/FlightMark";
import Interests from "./components/Interests";
import useSceneMotion from "./hooks/useSceneMotion";
import useSceneActivity from "./hooks/useSceneActivity";
import useReducedMotion from "./hooks/useReducedMotion";

const skillGroups = [
  {
    name: "Creating with AI",
    subtitle: "Imagination, with a little extra possibility.",
    icon: Orbit,
    items: [
      "OpenAI Codex",
      "Claude",
      "AI collaboration",
      "Prompt engineering",
      "Rapid prototyping",
    ],
  },
  {
    name: "Tools of the trade",
    subtitle: "Technologies I’ve explored along the way.",
    icon: Code2,
    items: [
      "React & Node.js",
      "Django & Express",
      "PostgreSQL & MongoDB",
      "Git & Docker",
      "Vercel & Supabase",
    ],
  },
  {
    name: "A thoughtful approach",
    subtitle: "Small improvements. Better ways forward.",
    icon: Compass,
    items: [
      "Problem-solving",
      "User experiences",
      "Frontend & backend",
      "Testing & debugging",
      "Iteration",
    ],
  },
  {
    name: "Always learning",
    subtitle: "Building foundations that go a little deeper.",
    icon: GraduationCap,
    items: [
      "Programming",
      "Software architecture",
      "Cybersecurity",
      "Linux",
      "Networking",
    ],
  },
];
const questions = [
  {
    question: "What am I studying?",
    answer:
      "I’m an engineering student at EMSI in Casablanca, Morocco. Alongside my studies, I’m strengthening my programming fundamentals and exploring software engineering, Linux, networking, and cybersecurity.",
  },
  {
    question: "What do I enjoy beyond software?",
    answer:
      "Hands-on troubleshooting and repair. Whether it’s a computer, a toy, or an everyday device, I enjoy understanding the problem and finding a way to make it work again.",
  },
  {
    question: "What could we talk about?",
    answer:
      "AI, technology, learning something new, or the satisfaction of figuring something out. If we share an interest—or you just want to say hello—I’d love to connect.",
  },
];
function Cloud({ className = "", eager = false }: { className?: string; eager?: boolean }) {
  return (
    <div className={`scene-cloud ${className}`} aria-hidden="true">
      <img
        src="/images/soft-cloud.webp"
        srcSet="/images/soft-cloud-720.webp 720w, /images/soft-cloud-1200.webp 1200w, /images/soft-cloud.webp 1600w"
        sizes="(max-width: 799px) 360px, 530px"
        alt=""
        width="1600"
        height="533"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}
function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.3l7.2-8.3L1.8 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
    </svg>
  );
}
export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const mounted = useRef(false);
  const paused = reduced;
  useSceneMotion(root, paused);
  useSceneActivity(root);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(copiedTimer.current);
    };
  }, []);
  async function copyEmail() {
    clearTimeout(copiedTimer.current);
    try {
      await navigator.clipboard.writeText("suvscd@gmail.com");
      if (!mounted.current) return;
      setCopied(true);
      setCopyMessage("Email address copied.");
    } catch {
      if (!mounted.current) return;
      setCopied(false);
      setCopyMessage(
        "Copy unavailable. You can select the email address below.",
      );
    }
    copiedTimer.current = setTimeout(() => {
      setCopied(false);
      setCopyMessage("");
    }, 3500);
  }
  return (
    <div ref={root} className={`site${paused ? " motion-paused" : ""}`}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <main>
        <section className="hero" id="home" aria-labelledby="name">
          <header className="site-header">
            <a className="wordmark" href="#home" aria-label="Saad Chahid, home">
              <FlightMark />
              <span>saad chahid.</span>
            </a>
            <nav className="nav-pill" aria-label="Main navigation">
              <a href="#about">About me</a>
              <a href="#interests">My interests</a>
              <a href="#learning">Always learning</a>
            </nav>
            <a className="header-contact" href="#connect">
              Let’s connect <ArrowUpRight size={16} />
            </a>
          </header>
          <Cloud className="hero-cloud cloud-near" eager />
          <Cloud className="hero-cloud cloud-far" eager />
          <div className="hero-copy">
            <p className="hero-intro">
              <span className="status-dot" /> A curious mind, an open world.
            </p>
            <h1 className="hero-name" id="name" aria-label="Saad Chahid">
              {["Saad", "Chahid."].map((word) => (
                <span className="name-word" aria-hidden="true" key={word}>
                  {Array.from(word).map((letter, index) => (
                    <span className="name-glyph" key={index}>
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="hero-description">
              Engineering student. AI explorer. Hands-on thinker.
              <br />
              Finding possibility in how things work.
            </p>
            <a className="hero-action pill-button" href="#about">
              Step into my world{" "}
              <span>
                <ArrowDown size={17} />
              </span>
            </a>
          </div>
          <div className="hero-stage">
            <div className="island-aura" aria-hidden="true" />
            <div className="hero-island" aria-hidden="true">
              <div className="island-hover">
                <picture>
                  <img
                    src="/images/floating-island.webp"
                    srcSet="/images/floating-island-640.webp 640w, /images/floating-island-960.webp 960w, /images/floating-island-1280.webp 1280w, /images/floating-island.webp 1536w"
                    sizes="(max-width: 480px) 122vw, (max-width: 799px) 96vw, (max-width: 1100px) 84vw, (min-width: 1700px) 930px, (max-width: 1128px) 78vw, 880px"
                    alt=""
                    width="1536"
                    height="1024"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
            <div className="floating-note note-study">
              <div className="note-symbol">
                <GraduationCap size={28} strokeWidth={1.5} />
              </div>
              <span>
                A little about me<strong>Engineering student</strong>
                <small>EMSI · Casablanca</small>
              </span>
              <div className="note-stamp">
                <Compass size={22} strokeWidth={1.2} />
              </div>
            </div>
            <div className="floating-note note-code">
              <div className="code-top">
                <i />
                <i />
                <i />
                <span>A curious mind at work</span>
              </div>
              <div className="code-thought">
                <span>human</span> imagination
                <br />
                <b>+</b> AI possibilities
                <span className="code-caret" />
              </div>
              <div className="code-bottom">
                <span className="status-dot" /> Always exploring
              </div>
            </div>
            <Cloud className="stage-cloud" eager />
          </div>
          <div className="hero-bottom">
            <span>
              <MapPin size={14} /> Based in Casablanca, Morocco
            </span>
            <a href="#about">
              Keep wandering <ArrowDown size={14} />
            </a>
          </div>
        </section>
        <section
          className="about-section section-wrap"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-heading">
            <span className="section-caption">A little introduction</span>
            <h2 id="about-title">
              Curiosity is where
              <br />
              everything begins.
            </h2>
          </div>
          <div className="about-body">
            <p className="about-lead about-line">
              Hi, I’m Saad. I like asking “what if?”
              <br />
              And then finding out.
            </p>
            <p className="about-line">
              I’m an engineering student at EMSI in Casablanca, drawn to
              technology, artificial intelligence, and the way things work
              beneath the surface.
            </p>
            <p className="about-line">
              With Codex and Claude as my coding companions, I explore ideas and
              learn by doing. I’m growing my foundations in software engineering
              and cybersecurity, one discovery at a time.
            </p>
            <a className="text-link" href="#interests">
              Here’s what keeps me curious <ArrowDown size={16} />
            </a>
          </div>
          <Cloud className="about-cloud" />
        </section>
        <Interests />
        <section
          id="learning"
          className="learning-section section-wrap"
          aria-labelledby="learning-title"
        >
          <div className="section-heading centered">
            <span className="section-caption">The joy is in the journey</span>
            <h2 id="learning-title">
              A little more curious.
              <br />
              Every single day.
            </h2>
            <p>
              Tools I use, skills I’m growing,
              <br />
              and things I’m figuring out.
            </p>
          </div>
          <div className="learning-grid">
            {skillGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <article
                  className={`learning-card learning-card-${index}`}
                  key={group.name}
                >
                  <div className="skill-object" aria-hidden="true">
                    <Icon strokeWidth={1.4} />
                  </div>
                  <div className="learning-copy">
                    <h3>{group.name}</h3>
                    <p>{group.subtitle}</p>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="learning-note">
            <span className="status-dot" /> No finish line. Just the next thing
            to understand.
          </p>
          <Cloud className="learning-cloud" />
        </section>
        <section
          className="world-section section-wrap"
          aria-labelledby="world-title"
        >
          <div className="world-copy">
            <span className="section-caption">
              A hands-on kind of curiosity
            </span>
            <h2 id="world-title">
              Some things just
              <br />
              need a curious mind.
            </h2>
            <p>
              I enjoy taking a closer look, understanding the problem, and
              finding a way forward. On a screen. Inside a computer. Or in
              something that deserves a second life.
            </p>
          </div>
          <div className="world-orbit" aria-hidden="true">
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-center">
              <Compass strokeWidth={0.85} />
            </div>
            <div className="orbit-object object-wrench">
              <Wrench strokeWidth={1.3} />
            </div>
            <div className="orbit-object object-code">
              <Code2 strokeWidth={1.3} />
            </div>
            <div className="orbit-object object-shield">
              <ShieldCheck strokeWidth={1.3} />
            </div>
            <span className="orbit-sphere" />
          </div>
          <div className="personal-details">
            <h3>A little more about me.</h3>
            <div className="faq-list">
              {questions.map((item, index) => (
                <div
                  className={`faq-item${openQuestion === index ? " is-open" : ""}`}
                  key={item.question}
                >
                  <button
                    id={`question-${index}`}
                    aria-expanded={openQuestion === index}
                    aria-controls={`answer-${index}`}
                    onClick={() =>
                      setOpenQuestion(openQuestion === index ? null : index)
                    }
                  >
                    {item.question}
                    <Plus size={18} />
                  </button>
                  <div
                    id={`answer-${index}`}
                    role="region"
                    aria-labelledby={`question-${index}`}
                    hidden={openQuestion !== index}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="connect"
          className="connect-section"
          aria-labelledby="connect-title"
        >
          <Cloud className="connect-cloud" />
          <div className="connect-copy">
            <span className="section-caption">
              Good things start with a hello
            </span>
            <h2 id="connect-title">
              Different worlds.
              <br />A shared curiosity.
            </h2>
            <p>
              Have a thought, a question, or an interest in common?
              <br />
              I’d love to hear from you.
            </p>
            <div className="email-actions">
              <a
                className="pill-button email-link"
                href="mailto:suvscd@gmail.com"
              >
                Let’s talk{" "}
                <span>
                  <ArrowUpRight size={18} />
                </span>
              </a>
              <button
                className="copy-email"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="contact-address">suvscd@gmail.com</p>
            <p className="copy-status" role="status">
              {copyMessage}
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/suvscd/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
                Instagram
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://x.com/suvscd"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon />
                Find me on X<ArrowUpRight size={14} />
              </a>
              <a href="mailto:suvscd@gmail.com">
                <Mail size={18} />
                Email
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <div className="footer-landscape" aria-hidden="true">
            <img
              src="/images/saad-landscape-1920.webp"
              srcSet="/images/saad-landscape-960.webp 960w, /images/saad-landscape-1920.webp 1672w"
              sizes="(max-width: 480px) 650px, (max-width: 799px) 747px, (max-width: 942px) 942px, 100vw"
              alt=""
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
          </div>
          <footer className="site-footer">
            <a className="footer-name" href="#home">
              saad chahid.
            </a>
            <div className="footer-bottom">
              <span>A little corner of my world.</span>
              <span>Made of curiosity. Rooted in Casablanca.</span>
              <a href="#home">
                Back to the sky <ArrowUp size={14} />
              </a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
