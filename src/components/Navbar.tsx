import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#home" className="navbar-brand" data-hover>
          Pedro Sakamoto
        </a>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link" data-hover>
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/2jjj"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn"
            data-hover
          >
            GitHub
          </a>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Abrir menu"
          data-hover
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
              data-hover
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/2jjj"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn"
            data-hover
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;