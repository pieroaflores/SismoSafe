import FeatureCard from './FeatureCard';

const FEATURES = [
  {
    iconColor: '#FF6B35',
    title: 'Simulación de ondas sísmicas',
    text: 'Visualiza cómo se propagan las ondas P y S a través del suelo y cómo llegan a la base de tu vivienda según la distancia al epicentro.',
    linkHref: '#simulador',
    linkLabel: 'Explorar simulador',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path
          d="M4 30h7l4-14 6 24 6-20 4 10h13"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    iconColor: '#4FA8E0',
    title: 'Evaluación estructural',
    text: 'Responde un cuestionario técnico sobre materiales, año de construcción y configuración para obtener tu nivel de vulnerabilidad.',
    linkHref: '#evaluacion',
    linkLabel: 'Iniciar evaluación',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M10 40V18l14-10 14 10v22" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M19 40V26h10v14" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path
          d="M14 22l5 4 5-6 5 4 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    iconColor: '#FF6B35',
    title: 'Calculadora sísmica',
    text: 'Calcula fuerza cortante, periodo fundamental y coeficiente sísmico de tu edificación según parámetros de la norma E.030.',
    linkHref: '#calculadora',
    linkLabel: 'Abrir calculadora',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="9" y="6" width="30" height="36" rx="3" stroke="currentColor" strokeWidth="2.4" />
        <line x1="14" y1="14" x2="34" y2="14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="15.5" cy="23" r="1.8" fill="currentColor" />
        <circle cx="24" cy="23" r="1.8" fill="currentColor" />
        <circle cx="32.5" cy="23" r="1.8" fill="currentColor" />
        <circle cx="15.5" cy="30" r="1.8" fill="currentColor" />
        <circle cx="24" cy="30" r="1.8" fill="currentColor" />
        <circle cx="32.5" cy="30" r="1.8" fill="currentColor" />
        <circle cx="15.5" cy="37" r="1.8" fill="currentColor" />
        <circle cx="24" cy="37" r="1.8" fill="currentColor" />
        <circle cx="32.5" cy="37" r="1.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    iconColor: '#4FA8E0',
    title: 'Mapa de riesgo',
    text: 'Ubica tu vivienda sobre la cartografía de zonas sísmicas E.030 y consulta sismos reales recientes en el Perú vía USGS.',
    linkHref: '#mapa',
    linkLabel: 'Ver mapa',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path
          d="M24 4C15 4 8 11 8 20c0 12 16 24 16 24s16-12 16-24c0-9-7-16-16-16z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="2.4" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="features" id="caracteristicas">
      <div className="section-head">
        <p className="eyebrow eyebrow--center">
          <span className="eyebrow__dot"></span>Qué mide la plataforma
        </p>
        <h2 className="section-title">
          Cuatro maneras de leer el riesgo
          <br />
          antes de que se vuelva daño
        </h2>
        <p className="section-subtitle">
          Cada herramienta observa tu vivienda desde un ángulo distinto del comportamiento sísmico.
        </p>
      </div>

      <div className="features__grid">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} index={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
