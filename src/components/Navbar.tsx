import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projetos" },
  { href: "#contact", label: "Contato" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#home" className="navbar-brand">
          PS.
        </a>

        <div className="nav-links" role="navigation" aria-label="Navegacao principal">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/2jjj"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
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
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/2jjj"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link"
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
