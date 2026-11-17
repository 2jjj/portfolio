import { useEffect, useMemo, useRef, useState } from "react";

const SAMPLES = [
  "const pedidos = await db.query('SELECT * FROM pedidos');",
  "const { data } = await supabase.from('projects').select('*');",
  "router.post('/api/checkout', checkoutHandler);",
  "const session = await stripe.checkout.sessions.create({ mode: 'payment' });",
  "npm run build && npm run dev",
  "git commit -m 'feat: pix na hora'",
  "type User = { id: string; name: string; role: 'admin' | 'user' };",
  "go run main.go",
  "curl -X POST https://api.exemplo.com/orders -d @pedido.json",
  "useEffect(() => { fetch('/api/projects').then(r => r.json()); }, []);",
];

const GRADE_META: Record<string, { label: string; title: string }> = {
  S: { label: "S", title: "Pró-tier" },
  A: { label: "A", title: "Entrega rápida" },
  B: { label: "B", title: "Ainda vai longe" },
  C: { label: "C", title: "Tem potencial" },
  D: { label: "D", title: "Vai de café" },
};

function gradeFor(wpm: number) {
  if (wpm >= 85) return "S";
  if (wpm >= 65) return "A";
  if (wpm >= 45) return "B";
  if (wpm >= 25) return "C";
  return "D";
}

/**
 * Teste de digitação de código — minigame do rodapé.
 * Digita um trecho real por vez: WPM, precisão e recorde no localStorage.
 */
const CodeChallenge = () => {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [best, setBest] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("ps-challenge-best") || 0);
    } catch {
      return 0;
    }
  });

  const sample = SAMPLES[sampleIndex % SAMPLES.length];
  const inputRef = useRef<HTMLInputElement | null>(null);

  const expected = sample;
  const done = typed.length >= expected.length;
  const elapsedMs = startedAt
    ? (finishedAt ?? Date.now()) - startedAt
    : 0;
  const minutes = elapsedMs > 0 ? elapsedMs / 60000 : 0;
  const words = typed.length / 5;
  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;

  const correct = expected.split("").filter((ch, i) => typed[i] === ch).length;
  const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

  useEffect(() => {
    if (done && !finishedAt) {
      const t = Date.now();
      setFinishedAt(t);
      const wpmNow =
        startedAt && t - startedAt > 0
          ? Math.round((expected.length / 5) / ((t - startedAt) / 60000))
          : 0;
      if (wpmNow > best) {
        setBest(wpmNow);
        try {
          localStorage.setItem("ps-challenge-best", String(wpmNow));
        } catch {
          /* noop */
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const reset = (advance = false) => {
    if (advance) setSampleIndex((i) => (i + 1) % SAMPLES.length);
    setTyped("");
    setStartedAt(null);
    setFinishedAt(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const elapsedLabel = Math.floor(elapsedMs / 1000);
  const isBest = best > 0 && wpm >= best && done;

  const ghost = useMemo(
    () =>
      expected.split("").map((ch, i) => {
        let cls = "ghost-pending";
        if (i < typed.length) cls = typed[i] === ch ? "ghost-ok" : "ghost-err";
        return (
          <span key={i} className={cls}>
            {ch === " " ? " " : ch}
          </span>
        );
      }),
    [expected, typed]
  );

  return (
    <section className="challenge" aria-labelledby="challenge-title">
      <p className="band-kicker">
        <span className="num">07</span>Teste
      </p>
      <h2 id="challenge-title" className="challenge-title">
        Você aguenta código ao vivo?
      </h2>
      <p className="challenge-sub">
        Um trecho real por vez. Digita, o relógio conta. Se passar do meu recorde, eu te dou o painel do seu próprio snippet.
      </p>

      <div className="challenge-panel" onClick={() => inputRef.current?.focus()}>
        <div className="challenge-chrome" aria-hidden="true">
          <span className="challenge-dot" />
          <span className="challenge-dot" />
          <span className="challenge-dot" />
          <span className="challenge-file">pedro-challenge.ts</span>
        </div>

        <div className="challenge-screen" role="region" aria-label="Área de digitação">
          <input
            ref={inputRef}
            className="challenge-input"
            value={typed}
            onChange={(e) => {
              const next = e.target.value;
              if (!startedAt && next.length > 0) setStartedAt(Date.now());
              if (finishedAt) return;
              if (next.length <= expected.length) setTyped(next);
            }}
            aria-label="Digite o trecho de código acima"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder=""
          />
          <p className="challenge-ghost" aria-hidden="true">
            {ghost}
            <span className="challenge-caret" />
          </p>
        </div>

        <div className="challenge-stats" aria-live="polite">
          <div>
            <span className="challenge-stat-label">WPM</span>
            <span className="challenge-stat-value num">{done ? wpm : 0}</span>
          </div>
          <div>
            <span className="challenge-stat-label">Precisão</span>
            <span className="challenge-stat-value num">{accuracy}%</span>
          </div>
          <div>
            <span className="challenge-stat-label">Tempo</span>
            <span className="challenge-stat-value num">{elapsedLabel}s</span>
          </div>
          <div>
            <span className="challenge-stat-label">Recorde</span>
            <span className="challenge-stat-value num">{best > 0 ? best : "—"}</span>
          </div>
        </div>

        <div className="challenge-foot">
          <button className="btn btn-primary btn-sm challenge-cta" onClick={() => reset(true)} type="button">
            {done ? "Próximo trecho →" : "Trocar trecho"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => reset(false)} type="button">
            Zerar
          </button>
          {isBest && <span className="challenge-badge">Novo recorde</span>}
        </div>
      </div>

      {done && (
        <div className="challenge-result" role="status">
          <span className="challenge-grade">{gradeFor(wpm)}</span>
          <div>
            <p className="challenge-grade-title">{GRADE_META[gradeFor(wpm)].title}</p>
            <p className="challenge-grade-sub">
              {wpm} WPM · {accuracy}% precisão{isBest ? " · novo recorde!" : ""}
            </p>
            <a
              className="challenge-send"
              href={`mailto:pedrosakamoto27@gmail.com?subject=${encodeURIComponent(
                `Teste de código no seu portfólio — ${wpm} wpm`
              )}`}
            >
              Enviar resultado para o Pedro →
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default CodeChallenge;
