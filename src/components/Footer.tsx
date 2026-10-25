import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-brand">PS.</span>
          <span className="footer-divider">·</span>
          <span className="footer-copy">Back-end &bull; APIs &bull; Dados</span>
        </div>

        <nav className="footer-links" aria-label="Links do rodapé">
          <Link to="/arquitetura" className="footer-link">
            Arquitetura
          </Link>
          <Link to="/curriculo" className="footer-link">
            Currículo
          </Link>
          <a href="/api/docs" target="_blank" rel="noreferrer" className="footer-link">
            API docs
          </a>
        </nav>

        <div className="footer-copy">© 2026 Pedro Sakamoto</div>
      </div>
    </footer>
  );
};

export default Footer;
