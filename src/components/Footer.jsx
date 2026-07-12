export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="navbar__logo-text">
            Sismo<span className="navbar__logo-accent">Safe</span>
          </span>
          <p className="footer__tagline">
            Evaluación preventiva del riesgo sísmico, al alcance de todos.
          </p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h5>Plataforma</h5>
            <a href="#simulador">Simulador</a>
            <a href="#evaluacion">Evaluación</a>
            <a href="#calculadora">Calculadora</a>
            <a href="#mapa">Mapa de riesgo</a>
          </div>
          <div className="footer__col">
            <h5>Proyecto</h5>
            <a href="#acerca">Acerca de</a>
            <a href="#">Metodología</a>
            <a href="#">Norma E.030</a>
          </div>
          <div className="footer__col">
            <h5>Contacto</h5>
            <a href="#">contacto@sismosafe.edu</a>
            <a href="#">Universidad — Facultad de Ingeniería</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2026 SismoSafe — Proyecto universitario con fines académicos.</p>
      </div>
    </footer>
  );
}
