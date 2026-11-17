import { useEffect, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { scrollToHash } from "@/lib/scroll";
import { useSiteInfo } from "@/hooks/use-public-api";

const navLinks = [
  { href: "#about", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Trabalhos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contact", label: "Contato" },
];

const routeLinks = [
  { to: "/vagas", label: "Vagas" },
  { to: "/curriculo", label: "Currículo" },
  { to: "/arquitetura", label: "Arquitetura" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { theme, setTheme } = useTheme();
  const { data: site } = useSiteInfo();
  const githubUrl = site?.github_url || "https://github.com/2jjj";
  const linkedinUrl = site?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHashClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToHash(href)) event.preventDefault();
    setMenuOpen(false);
  };

  return (
    <header className="nav">
      <div className="page nav-inner">
        {isHome ? (
          <a href="#home" className="nav-word" onClick={(e) => handleHashClick(e, "#home")}>
            Pedro Sakamoto
          </a>
        ) : (
          <Link to="/" className="nav-word" onClick={() => setMenuOpen(false)}>
            Pedro Sakamoto
          </Link>
        )}

        <nav className="nav-links" aria-label="Navegação principal">
          {navLinks.map((link) =>
            isHome ? (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={(e) => handleHashClick(e, link.href)}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={`/${link.href}`} className="nav-link">
                {link.label}
              </Link>
            )
          )}
          {routeLinks.map((link) => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="nav-link">
            GitHub
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="mailto:pedrosakamoto27@gmail.com"
            className="btn btn-primary btn-sm nav-hire"
          >
            Chamar no e-mail
          </a>
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((c) => !c)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="nav-panel"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="page nav-panel" id="nav-panel">
          {navLinks.map((link) =>
            isHome ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.href)}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={`/${link.href}`} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            )
          )}
          {routeLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
