const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Pedro Sakamoto</p>
          <p className="footer-copy">Desenvolvedor Back-End • APIs • Escalabilidade</p>
        </div>

        <div className="footer-links">
          <a href="#home" className="footer-btn">Início</a>
          <a href="#projects" className="footer-btn">Projetos</a>
          <a href="#contact" className="footer-btn">Contato</a>
        </div>
      </div>
      <p className="footer-copy" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        © 2026 Pedro Sakamoto. Feito com foco em performance e servidor.
      </p>
    </footer>
  );
};

export default Footer;
