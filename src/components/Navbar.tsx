import { useEffect, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { scrollToHash } from "@/lib/scroll";
import { useSiteInfo } from "@/hooks/use-public-api";

const navLinks = [
  { href: "#home", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projetos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contact", label: "Contato" },
];

const routeLinks = [
  { to: "/vagas", label: "Vagas" },
  { to: "/arquitetura", label: "Arquitetura" },
  { to: "/curriculo", label: "Currículo" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { theme, setTheme } = useTheme();
  const { data: site } = useSiteInfo();
  const githubUrl = site?.github_url || "https://github.com/2jjj";
  const linkedinUrl = site?.linkedin_url || "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleHashClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollToHash(href)) {
      event.preventDefault();
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} aria-label="Navegação principal">
      <div className="navbar-inner">
        {isHome ? (
          <a href="#home" className="navbar-brand" onClick={(event) => handleHashClick(event, "#home")}>
            PS.
          </a>
        ) : (
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            PS.
          </Link>
        )}

        <div className="nav-links">
          {navLinks.map((link) =>
            isHome ? (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={(event) => handleHashClick(event, link.href)}
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
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            LinkedIn
          </a>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          {navLinks.map((link) =>
            isHome ? (
              <a
                key={link.href}
                href={link.href}
                className="mobile-link"
                onClick={(event) => handleHashClick(event, link.href)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={`/${link.href}`}
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          {routeLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link"
          >
            GitHub
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link"
          >
            LinkedIn
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
