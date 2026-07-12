import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const WIDTH = 600;
const HEIGHT = 220;
const MID_Y = HEIGHT / 2;
const POINTS = 140;
const STEP = WIDTH / POINTS;

// Traza sísmica pseudo-aleatoria pero suave, mediante senoides superpuestas
function valueAt(x, time) {
  const a = Math.sin(x * 0.04 + time) * 22;
  const b = Math.sin(x * 0.11 + time * 1.8) * 12;
  const c = Math.sin(x * 0.27 + time * 0.6) * 6;
  const burst =
    Math.sin(time * 0.4) > 0.6
      ? Math.sin(x * 0.5 + time * 6) * 18 * Math.max(0, Math.sin(time * 0.4))
      : 0;
  return a + b + c + burst;
}

function buildPath(t) {
  let d = `M 0 ${MID_Y}`;
  for (let i = 0; i <= POINTS; i++) {
    const x = i * STEP;
    const y = MID_Y + valueAt(x, t);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export default function Hero() {
  const pathRef = useRef(null);
  const [magValue, setMagValue] = useState('4.8 Mw');
  const [accValue, setAccValue] = useState('0.32 g');
  const [riskValue, setRiskValue] = useState('Moderado');
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let t = 0;
    let frame = 0;
    let rafId = null;

    function updateReadout() {
      const mag = (4.2 + Math.sin(t * 0.5) * 0.9).toFixed(1);
      const acc = (0.22 + Math.abs(Math.sin(t * 0.5)) * 0.18).toFixed(2);
      setMagValue(`${mag} Mw`);
      setAccValue(`${acc} g`);
      const risk = Number(mag) > 4.9 ? 'Alto' : Number(mag) > 4.3 ? 'Moderado' : 'Bajo';
      setRiskValue(risk);
    }

    function loop() {
      t += 0.045;
      frame++;
      if (pathRef.current) pathRef.current.setAttribute('d', buildPath(t));
      if (frame % 12 === 0) updateReadout();
      if (!prefersReducedMotion) rafId = requestAnimationFrame(loop);
    }

    if (prefersReducedMotion) {
      if (pathRef.current) pathRef.current.setAttribute('d', buildPath(t));
      updateReadout();
    } else {
      loop();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="hero" id="inicio">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid"></div>
      </div>

      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__dot"></span>
            Análisis estructural preventivo
          </p>
          <h1 className="hero__title">
            Protege tu vivienda
            <br />
            antes del <span className="hero__title-accent">próximo sismo</span>
          </h1>
          <p className="hero__subtitle">
            SismoSafe traduce datos sísmicos y parámetros estructurales de tu vivienda en un
            diagnóstico claro: cómo se comporta tu edificación ante un movimiento telúrico y qué
            puedes reforzar antes de que ocurra.
          </p>
          <div className="hero__actions">
            <a href="#evaluacion" className="btn btn--primary">
              Comenzar evaluación
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#simulador" className="btn btn--ghost">
              Ver simulador
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="seismograph">
            <div className="seismograph__head">
              <span className="seismograph__label">REGISTRO EN VIVO</span>
              <span className="seismograph__live">
                <span className="seismograph__live-dot"></span>monitoreando
              </span>
            </div>
            <svg className="seismograph__svg" viewBox="0 0 600 220" preserveAspectRatio="none">
              <line x1="0" y1="55" x2="600" y2="55" className="seismograph__gridline" />
              <line x1="0" y1="110" x2="600" y2="110" className="seismograph__gridline" />
              <line x1="0" y1="165" x2="600" y2="165" className="seismograph__gridline" />
              <path ref={pathRef} className="seismograph__wave" fill="none" />
            </svg>
            <div className="seismograph__readout">
              <div className="seismograph__stat">
                <span className="seismograph__stat-label">Magnitud est.</span>
                <span className="seismograph__stat-value">{magValue}</span>
              </div>
              <div className="seismograph__stat">
                <span className="seismograph__stat-label">Aceleración</span>
                <span className="seismograph__stat-value">{accValue}</span>
              </div>
              <div className="seismograph__stat">
                <span className="seismograph__stat-label">Riesgo estructural</span>
                <span className="seismograph__stat-value seismograph__stat-value--alert">
                  {riskValue}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#caracteristicas" className="hero__scroll" aria-label="Bajar a características">
        <span></span>
      </a>
    </section>
  );
}
