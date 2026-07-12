import { useEffect, useRef, useState } from 'react';

/* =========================================================
   SIMULADOR DE ONDAS SÍSMICAS
   Vp = sqrt((K + 4/3 mu) / rho)   Vs = sqrt(mu / rho)
   Distancia <-> tiempo de llegada, regla empírica 8*(tS-tP)
   ========================================================= */

const EPI_X = 40;
const EPI_Y = 160;
const MAX_PX = 460;
const MAX_KM = 300;
const PX_PER_KM = MAX_PX / MAX_KM;

function kmToPx(km) {
  return Math.min(km, MAX_KM) * PX_PER_KM;
}

function computeParams({ K, Mu, Rho, dist, mag }) {
  const Vp = Math.sqrt(((K + (4 / 3) * Mu) * 1e9) / Rho) / 1000; // km/s
  const Vs = Math.sqrt((Mu * 1e9) / Rho) / 1000; // km/s
  const tP = dist / Vp;
  const tS = dist / Vs;
  const delta = tS - tP;
  const estDist = 8 * delta;
  return { K, Mu, Rho, dist, mag, Vp, Vs, tP, tS, delta, estDist };
}

function buildSeismoPath(p, simT, ampScale) {
  const width = 600;
  const mid = 70;
  const tMax = p.tS * 1.8 + 1;
  const points = 160;
  let d = `M 0 ${mid}`;
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * tMax;
    if (t > simT) {
      d += ` L ${((i / points) * width).toFixed(1)} ${mid}`;
      continue;
    }
    let y = mid;
    if (t >= p.tP && t < p.tS) {
      const local = t - p.tP;
      y += Math.sin(local * 14) * 5 * ampScale;
    } else if (t >= p.tS) {
      const local = t - p.tS;
      const decay = Math.exp(-local * 0.35);
      y += Math.sin(local * 6) * 26 * ampScale * decay + Math.sin(local * 17) * 8 * ampScale * decay;
    }
    d += ` L ${((i / points) * width).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export default function WaveSimulator() {
  const [K, setK] = useState(36);
  const [Mu, setMu] = useState(28);
  const [Rho, setRho] = useState(2600);
  const [Dist, setDist] = useState(60);
  const [Mag, setMag] = useState(6.0);

  const [readout, setReadout] = useState(() =>
    computeParams({ K: 36, Mu: 28, Rho: 2600, dist: 60, mag: 6.0 })
  );

  const waveGroupRef = useRef(null);
  const houseGroupRef = useRef(null);
  const houseLabelRef = useRef(null);
  const seismoPathRef = useRef(null);
  const animFrameId = useRef(null);

  // Recalcula el readout en vivo al mover los sliders (sin animar)
  useEffect(() => {
    const params = computeParams({ K, Mu, Rho, dist: Dist, mag: Mag });
    setReadout(params);
  }, [K, Mu, Rho, Dist, Mag]);

  // Reposiciona la casa en el mapa SVG cuando cambia la distancia
  useEffect(() => {
    const px = EPI_X + kmToPx(Dist);
    if (houseGroupRef.current) {
      houseGroupRef.current.setAttribute('transform', `translate(${px}, 150)`);
    }
    if (houseLabelRef.current) {
      houseLabelRef.current.setAttribute('x', px);
      houseLabelRef.current.setAttribute('y', 182);
    }
  }, [Dist]);

  useEffect(() => {
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  function runSimulation() {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);

    const p = computeParams({ K, Mu, Rho, dist: Dist, mag: Mag });
    setReadout(p);

    const ampScale = Math.min(3, Math.max(0.3, Math.pow(10, (p.mag - 6) / 3)));
    const simTMax = p.tS * 1.8 + 1;
    // La duración real de la animación debe escalar con simTMax para que la
    // velocidad aparente de las ondas en pantalla se mantenga constante
    // (Vp y Vs son propiedades del medio, no dependen de la distancia).
    // Antes esto era un valor fijo (3200ms) sin importar la distancia, lo
    // cual hacía que el frente de onda pareciera acelerar y "sobrepasar"
    // la casa a medida que se alejaba, en vez de simplemente tardar más.
    const MS_PER_SIM_SECOND = 90; // factor de compresión tiempo real / tiempo simulado
    const MIN_DURATION = 1200;
    const MAX_DURATION = 13000;
    const animDuration = Math.min(
      MAX_DURATION,
      Math.max(MIN_DURATION, simTMax * MS_PER_SIM_SECOND)
    );
    const start = performance.now();

    function frame(now) {
      const elapsedMs = now - start;
      const progress = Math.min(elapsedMs / animDuration, 1);
      const simT = progress * simTMax;

      const rP_km = p.Vp * simT;
      const rS_km = p.Vs * simT;

      if (waveGroupRef.current) {
        waveGroupRef.current.innerHTML = `
          <circle class="sim-wave-p" cx="${EPI_X}" cy="${EPI_Y}" r="${Math.max(0, kmToPx(rP_km))}"></circle>
          <circle class="sim-wave-s" cx="${EPI_X}" cy="${EPI_Y}" r="${Math.max(0, kmToPx(rS_km))}"></circle>
        `;
      }
      if (seismoPathRef.current) {
        seismoPathRef.current.setAttribute('d', buildSeismoPath(p, simT, ampScale));
      }

      if (progress < 1) {
        animFrameId.current = requestAnimationFrame(frame);
      } else {
        animFrameId.current = null;
      }
    }
    animFrameId.current = requestAnimationFrame(frame);
  }

  return (
    <section className="app-section" id="simulador">
      <div className="section-head">
        <p className="eyebrow eyebrow--center">
          <span className="eyebrow__dot"></span>Simulador físico
        </p>
        <h2 className="section-title">Simulador de propagación de ondas P y S</h2>
        <p className="section-subtitle">
          Ajusta las propiedades elásticas del medio y la distancia al epicentro para ver cómo
          cambian las velocidades de onda y el tiempo de llegada a tu vivienda.
        </p>
      </div>

      <div className="sim-layout">
        <div className="sim-panel">
          <h4 className="sim-panel__title">Parámetros del medio</h4>

          <div className="sim-field">
            <label htmlFor="simK">
              Módulo volumétrico K <span className="sim-field__unit">{K} GPa</span>
            </label>
            <input
              type="range"
              id="simK"
              min="10"
              max="80"
              step="1"
              value={K}
              onChange={(e) => setK(Number(e.target.value))}
            />
          </div>
          <div className="sim-field">
            <label htmlFor="simMu">
              Módulo de corte μ <span className="sim-field__unit">{Mu} GPa</span>
            </label>
            <input
              type="range"
              id="simMu"
              min="5"
              max="60"
              step="1"
              value={Mu}
              onChange={(e) => setMu(Number(e.target.value))}
            />
          </div>
          <div className="sim-field">
            <label htmlFor="simRho">
              Densidad ρ <span className="sim-field__unit">{Rho} kg/m³</span>
            </label>
            <input
              type="range"
              id="simRho"
              min="1600"
              max="3200"
              step="50"
              value={Rho}
              onChange={(e) => setRho(Number(e.target.value))}
            />
          </div>
          <div className="sim-field">
            <label htmlFor="simDist">
              Distancia al epicentro <span className="sim-field__unit">{Dist} km</span>
            </label>
            <input
              type="range"
              id="simDist"
              min="5"
              max="300"
              step="5"
              value={Dist}
              onChange={(e) => setDist(Number(e.target.value))}
            />
          </div>
          <div className="sim-field">
            <label htmlFor="simMag">
              Magnitud estimada <span className="sim-field__unit">{Mag.toFixed(1)} Mw</span>
            </label>
            <input
              type="range"
              id="simMag"
              min="3"
              max="9"
              step="0.1"
              value={Mag}
              onChange={(e) => setMag(Number(e.target.value))}
            />
          </div>

          <button className="btn btn--primary sim-panel__cta" id="simRunBtn" onClick={runSimulation}>
            Lanzar simulación
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
            </svg>
          </button>

          <div className="sim-formula">
            <p>
              <strong>Vp</strong> = √((K + 4/3·μ) / ρ)
            </p>
            <p>
              <strong>Vs</strong> = √(μ / ρ)
            </p>
            <p className="sim-formula__note">
              Fórmulas de velocidad de onda en un medio elástico isotrópico (Kramer, 2020).
            </p>
          </div>
        </div>

        <div className="sim-stage">
          <div className="sim-stage__map">
            <svg viewBox="0 0 520 320" id="simMapSvg" className="sim-stage__svg">
              <line x1="0" y1="160" x2="520" y2="160" className="sim-stage__ground" />
              <g id="simWaveGroup" ref={waveGroupRef}></g>
              <circle cx="40" cy="160" r="5" fill="var(--orange)" />
              <text x="40" y="182" className="sim-stage__label" textAnchor="middle">
                Epicentro
              </text>
              <g id="simHouseGroup" ref={houseGroupRef}>
                <path d="M0 0 L-12 -12 L12 -12 Z" fill="var(--blue-instrument)" />
                <rect x="-10" y="-12" width="20" height="14" fill="var(--blue-instrument)" opacity="0.85" />
              </g>
              <text id="simHouseLabel" ref={houseLabelRef} className="sim-stage__label" textAnchor="middle">
                Tu vivienda
              </text>
            </svg>
          </div>

          <div className="sim-readout">
            <div className="sim-readout__stat">
              <span className="sim-readout__label">Vp (onda P)</span>
              <span className="sim-readout__value">{readout.Vp.toFixed(2)} km/s</span>
            </div>
            <div className="sim-readout__stat">
              <span className="sim-readout__label">Vs (onda S)</span>
              <span className="sim-readout__value">{readout.Vs.toFixed(2)} km/s</span>
            </div>
            <div className="sim-readout__stat">
              <span className="sim-readout__label">Llegada onda P</span>
              <span className="sim-readout__value">{readout.tP.toFixed(1)} s</span>
            </div>
            <div className="sim-readout__stat">
              <span className="sim-readout__label">Llegada onda S</span>
              <span className="sim-readout__value">{readout.tS.toFixed(1)} s</span>
            </div>
            <div className="sim-readout__stat">
              <span className="sim-readout__label">Δt (S−P)</span>
              <span className="sim-readout__value">{readout.delta.toFixed(1)} s</span>
            </div>
            <div className="sim-readout__stat">
              <span className="sim-readout__label">Distancia estimada (regla 8×Δt)</span>
              <span className="sim-readout__value">{readout.estDist.toFixed(0)} km</span>
            </div>
          </div>

          <div className="sim-seismo">
            <svg viewBox="0 0 600 140" preserveAspectRatio="none" className="sim-seismo__svg">
              <line x1="0" y1="70" x2="600" y2="70" className="seismograph__gridline" />
              <path ref={seismoPathRef} fill="none" className="seismograph__wave" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
