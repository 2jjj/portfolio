/**
 * Seção "em números": stats grandes, banda creme — prova visual de que
 * os sistemas estão em produção, não em slide.
 */
const STATS = [
  { value: "219", label: "produtos no catálogo do bot vendido pra Kamikaze Sports" },
  { value: "3", label: "sistemas em produção hoje: bot WhatsApp, SaaS importflow, este site" },
  { value: "63", label: "testes automatizados antes de cada deploy" },
  { value: "100%", label: "pedidos pagos no Pix na hora — nada de prazo de espera" },
];

const Numbers = () => {
  return (
    <section id="numeros" className="numbers" aria-label="Em números">
      <div className="page">
        <p className="numbers-kicker">( em números )</p>
        <div className="numbers-grid">
          {STATS.map((stat) => (
            <div className="number-cell" key={stat.value}>
              <span className="number-value num">{stat.value}</span>
              <span className="number-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Numbers;
