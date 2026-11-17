import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  phrases: string[];
  className?: string;
};

const TYPE_MS = 58;
const ERASE_MS = 28;
const HOLD_MS = 1700;

/**
 * Linha que digita e apaga as frases do hero.
 * Texto sempre no mesmo espaco: a caixa tem altura fixa, nada pula.
 */
const Typewriter = ({ phrases, className = "" }: Props) => {
  const safe = useMemo(
    () => (phrases.length > 0 ? phrases : ["Desenvolvedor full stack"]),
    [phrases]
  );

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"type" | "hold" | "erase">("type");
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setText(safe[0]);
      setPhase("hold");
    }
  }, [safe]);

  useEffect(() => {
    if (reduced.current) return;
    const current = safe[index % safe.length];

    if (phase === "type") {
      if (text.length < current.length) {
        const t = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          TYPE_MS
        );
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setPhase("hold"), HOLD_MS);
      return () => window.clearTimeout(t);
    }

    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("erase"), 320);
      return () => window.clearTimeout(t);
    }

    if (text.length > 0) {
      const t = window.setTimeout(() => setText(text.slice(0, -1)), ERASE_MS);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setIndex((i) => i + 1);
      setPhase("type");
    }, 220);
    return () => window.clearTimeout(t);
  }, [text, phase, index, safe]);

  return (
    <p className={`hero-type ${className}`} aria-live="polite">
      <span className="hero-type-text">{text}</span>
      <span className="hero-type-caret" aria-hidden="true" />
    </p>
  );
};

export default Typewriter;
