const STACK = [
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Go",
  "React",
  "Playwright",
  "Supabase",
  "Stripe",
  "Linux",
  "SQLite",
  "Java",
  "Python",
  "GitHub Actions",
];

const TechMarquee = () => {
  return (
    <div className="tech-marquee" aria-hidden="true">
      <div className="tech-marquee-track">
        {[0, 1].map((group) => (
          <div className="tech-marquee-group" key={group}>
            {STACK.map((item) => (
              <span className="tech-marquee-item" key={`${group}-${item}`}>
                {item}
                <i className="tech-marquee-sep">◆</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;
