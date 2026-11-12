import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { useSiteInfo } from "@/hooks/use-public-api";

const Footer = () => {
  const { data: site } = useSiteInfo();
  const githubUrl = site?.github_url || "https://github.com/2jjj";
  const linkedinUrl = site?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";
  const email = site?.public_email || "pedrosakamoto27@gmail.com";

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
          <Link to="/admin" className="footer-link">
            Gerenciar
          </Link>
          <a href="/api/docs" target="_blank" rel="noreferrer" className="footer-link">
            API docs
          </a>
          <a href={githubUrl} target="_blank" rel="noreferrer" className="footer-link footer-link-icon">
            <Github size={14} /> GitHub
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="footer-link footer-link-icon">
            <Linkedin size={14} /> LinkedIn
          </a>
          <a href={`mailto:${email}`} className="footer-link footer-link-icon">
            <Mail size={14} /> E-mail
          </a>
        </nav>

        <div className="footer-copy">© 2026 Pedro Sakamoto</div>
      </div>
    </footer>
  );
};

export default Footer;
