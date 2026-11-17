import { Link } from "react-router-dom";
import { useSiteInfo } from "@/hooks/use-public-api";

/**
 * Footer — o nome volta em largura total. Rodapé fechado, não sitemap.
 */
const Footer = () => {
  const { data: site } = useSiteInfo();
  const githubUrl = site?.github_url || "https://github.com/2jjj";
  const linkedinUrl = site?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";
  const email = site?.public_email || "pedrosakamoto27@gmail.com";

  return (
    <footer className="footer">
      <div className="page">
        <div className="footer-top">
          <p className="footer-word">Pedro Sakamoto</p>
          <nav className="footer-links" aria-label="Links do rodapé">
            <a href={`mailto:${email}`}>E-mail</a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <Link to="/curriculo">Currículo</Link>
            <Link to="/vagas">Vagas</Link>
            <Link to="/servicos">Serviços</Link>
            <Link to="/arquitetura">Arquitetura</Link>
            <Link to="/admin">Gerenciar</Link>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>Ribeirão Preto, SP · Remoto em todo o Brasil</span>
          <span className="num">© 2026 Pedro Sakamoto</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
