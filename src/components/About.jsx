export default function About() {
  return (
    <section className="about" id="acerca">
      <div className="about__inner">
        <div className="about__text">
          <p className="eyebrow">
            <span className="eyebrow__dot"></span>Acerca del proyecto
          </p>
          <h2 className="section-title section-title--left">
            Un proyecto académico con vocación de herramienta real
          </h2>
          <p className="about__paragraph">
            SismoSafe nace como proyecto universitario para acercar el análisis estructural
            sismorresistente a personas sin formación en ingeniería civil. Combina principios de
            la norma E.030, datos sísmicos históricos y visualización interactiva para que
            cualquier propietario entienda el comportamiento de su vivienda ante un sismo.
          </p>
          <p className="about__paragraph">
            El objetivo no es reemplazar una evaluación profesional, sino dar un primer
            diagnóstico accesible que motive la prevención antes de que ocurra el evento.
          </p>
        </div>
        <div className="about__card">
          <h4 className="about__card-title">Stack del proyecto</h4>
          <ul className="about__list">
            <li>
              <span>React</span> + Vite
            </li>
            <li>
              <span>CSS3</span> con animaciones nativas
            </li>
            <li>
              <span>Leaflet</span> y API pública de USGS
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
