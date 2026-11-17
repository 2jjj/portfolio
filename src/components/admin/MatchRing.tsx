interface MatchRingProps {
  value: number;
  size?: number;
  label?: string;
}

const MatchRing = ({ value, size = 46, label = "match" }: MatchRingProps) => {
  const score = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = size >= 40 ? 4 : 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--career-green)" : score >= 45 ? "var(--cyan)" : "var(--career-amber)";

  return (
    <div
      className="match-ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score}% de ${label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="match-ring-value" style={{ color }}>{score}</span>
    </div>
  );
};

export default MatchRing;
