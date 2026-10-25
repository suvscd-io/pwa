import {
  Code2,
  ShieldCheck,
  Wrench,
  BrainCircuit,
  Cpu,
  Terminal,
} from "lucide-react";

export default function InterestArt({ kind }: { kind: string }) {
  return (
    <div className={`interest-art art-${kind}`} aria-hidden="true">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      {kind === "ai" && (
        <>
          <div className="glass-orb">
            <BrainCircuit size={88} strokeWidth={1} />
          </div>
          <div className="satellite satellite-one">
            <span>Human</span>
          </div>
          <div className="satellite satellite-two">
            <span>Possibility</span>
          </div>
          <div className="tiny-orb" />
        </>
      )}
      {kind === "software" && (
        <>
          <div className="mini-window">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>
            <Code2 size={78} strokeWidth={1.3} />
            <span className="code-line" />
            <span className="code-line short" />
          </div>
          <div className="floating-symbol">
            <Terminal size={28} />
          </div>
        </>
      )}
      {kind === "security" && (
        <>
          <div className="shield-sculpture">
            <ShieldCheck size={124} strokeWidth={0.9} />
          </div>
          <div className="security-dot dot-a" />
          <div className="security-dot dot-b" />
        </>
      )}
      {kind === "repair" && (
        <>
          <div className="repair-sculpture">
            <Wrench size={117} strokeWidth={1.2} />
          </div>
          <div className="floating-symbol">
            <Cpu size={33} />
          </div>
          <div className="tiny-orb" />
        </>
      )}
      <div className="art-floor" />
    </div>
  );
}
