import { Link } from "react-router-dom";
import { useState, type CSSProperties } from "react";
import { useSiteInfo } from "@/hooks/use-public-api";
import { scrollToTop } from "@/lib/scroll";

/**
 * Footer — o nome volta em largura total. Rodapé fechado, não sitemap.
 */
const STAR_COUNT = 14;

const Footer = () => {
  const { data: site } = useSiteInfo();
  const [burstId, setBurstId] = useState(0);

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
            <Link to="/servicos">Serviços</Link>
            <Link to="/arquitetura">Arquitetura</Link>
            <Link to="/admin">Gerenciar</Link>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>Ribeirão Preto, SP · Remoto em todo o Brasil</span>
          <span className="footer-bottom-right">
            <span className="num">© 2026 Pedro Sakamoto</span>
            <Link
              to="/"
              className="footer-top-link"
              aria-label="Voltar ao topo da página"
              onClick={() => {
                scrollToTop();
                setBurstId((b) => b + 1);
              }}
            >
              {burstId > 0 && (
                <span className="burst" key={burstId} aria-hidden="true">
                  {Array.from({ length: STAR_COUNT }, (_, i) => {
                    const angle = (i / STAR_COUNT) * Math.PI * 2 - Math.PI / 2;
                    const dist = 42 + ((i * 37) % 34);
                    const x = (Math.cos(angle) * dist).toFixed(1);
                    const y = (Math.sin(angle) * dist - 16).toFixed(1);
                    const rot = `${((i * 53) % 180) - 90}deg`;
                    return (
                      <span
                        key={i}
                        className="burst-star"
                        style={{ "--x": `${x}px`, "--y": `${y}px`, "--rot": rot } as CSSProperties}
                      />
                    );
                  })}
                </span>
              )}
              Voltar ao topo ↑
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
