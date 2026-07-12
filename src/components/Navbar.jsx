import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['inicio', 'caracteristicas', 'evaluacion', 'calculadora', 'mapa', 'acerca'];

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#evaluacion', label: 'Evaluación' },
  { href: '#calculadora', label: 'Calculadora' },
  { href: '#mapa', label: 'Mapa' },
  { href: '#acerca', label: 'Acerca de' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('inicio');
  const navbarRef = useRef(null);

  // Navbar elevado al hacer scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Resalta el link de la sección visible
  useEffect(() => {
    const sectionEls = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sectionEls.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavLinkClick = () => setIsOpen(false);

  const handleCtaClick = () => {
    document.getElementById('evaluacion')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`navbar${isScrolled ? ' is-scrolled' : ''}${isOpen ? ' is-open' : ''}`}
      id="navbar"
      ref={navbarRef}
    >
      <div className="navbar__inner">
        <a href="#inicio" className="navbar__logo">
          <span className="navbar__logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <path
                d="M2 18 L9 18 L12 9 L16 24 L19 14 L22 18 L30 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="navbar__logo-text">
            Sismo<span className="navbar__logo-accent">Safe</span>
          </span>
        </a>

        <nav className="navbar__links" id="navLinks">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${activeId === link.href.slice(1) ? ' active' : ''}`}
              onClick={handleNavLinkClick}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button className="navbar__cta" id="navCta" onClick={handleCtaClick}>
          Comenzar evaluación
        </button>

        <button
          className="navbar__toggle"
          id="navToggle"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
