const ITEMS = [
  "ABERTO A FREELA",
  "ESTÁGIO · JÚNIOR",
  "RIBEIRÃO PRETO, SP",
  "DISPONIBILIDADE IMEDIATA",
  "DO PRIMEIRO COMMIT AO GO-LIVE",
];

const Ticker = () => {
  const line = [...ITEMS, ...ITEMS];

  return (
    <div className="ticker" role="presentation" aria-hidden="true">
      <div className="ticker-track">
        {line.map((item, index) => (
          <span key={`${item}-${index}`} className="ticker-item">
            {item}
            <span className="ticker-dot">●</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
