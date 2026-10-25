import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Orbit, Code2, ShieldCheck, Wrench } from "lucide-react";
import InterestArt from "./InterestArt";

const interests = [
  {
    id: "ai",
    title: "Artificial intelligence",
    icon: Orbit,
    note: "Human imagination. New possibilities.",
    text: "I’m fascinated by what happens when human creativity meets AI. I explore tools like Codex and Claude to turn ideas into working software, experiment, and learn along the way.",
    tags: ["Codex", "Claude", "AI collaboration"],
  },
  {
    id: "software",
    title: "Software engineering",
    icon: Code2,
    note: "Ideas are only the beginning.",
    text: "I enjoy understanding how the pieces fit together—from the first sketch of an idea to the systems behind a working application. Every new challenge is a reason to learn something new.",
    tags: ["Problem-solving", "Architecture", "Programming"],
  },
  {
    id: "security",
    title: "Cybersecurity",
    icon: ShieldCheck,
    note: "Curiosity, with a protective instinct.",
    text: "I’m learning how systems work, where their weaknesses can be, and how to make them safer. Linux, networking, and cybersecurity are becoming an important part of my engineering journey.",
    tags: ["Linux", "Networking", "Security fundamentals"],
  },
  {
    id: "repair",
    title: "Making things work again",
    icon: Wrench,
    note: "A hands-on kind of happiness.",
    text: "I enjoy understanding how things work, identifying problems, and repairing computers, toys, and everyday devices. There’s something satisfying about a little patience turning a broken thing into a working one.",
    tags: ["Troubleshooting", "Repair", "Practical curiosity"],
  },
];

export default function Interests() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % interests.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index + interests.length - 1) % interests.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = interests.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return (
    <section
      id="interests"
      className="interests-section section-wrap"
      aria-labelledby="interests-title"
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">What keeps me curious</p>
          <h2 id="interests-title">
            There’s a whole world
            <br />
            to figure out.
          </h2>
        </div>
        <p className="section-aside">
          Different interests.
          <br />
          The same desire to understand.
        </p>
      </div>
      <div className="interest-explorer">
        <div
          className="interest-tabs"
          role="tablist"
          aria-label="Explore my interests"
          aria-orientation="vertical"
        >
          {interests.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                role="tab"
                aria-selected={selected === index}
                aria-controls={`panel-${item.id}`}
                tabIndex={selected === index ? 0 : -1}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => handleKey(event, index)}
                className={
                  selected === index ? "interest-tab active" : "interest-tab"
                }
              >
                <span className="interest-tab-icon">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <span>{item.title}</span>
                <ArrowUpRight className="tab-arrow" size={20} />
              </button>
            );
          })}
          <p className="interest-footnote">
            A few things I could talk about for hours.
          </p>
        </div>
        {interests.map((item, index) => (
          <div
            className={`interest-panel panel-${item.id}`}
            role="tabpanel"
            id={`panel-${item.id}`}
            aria-labelledby={`tab-${item.id}`}
            tabIndex={0}
            key={item.id}
            hidden={selected !== index}
          >
            <InterestArt kind={item.id} />
            <div className="interest-panel-copy">
              <h3>{item.note}</h3>
              <p>{item.text}</p>
              <div className="interest-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
