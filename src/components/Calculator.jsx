import { useState } from 'react';
import { SOIL_PARAMS, getSoilFactor } from '../data/calculatorData';

/* =========================================================
   CALCULADORA SÍSMICA — Método estático, Norma E.030
   T = hn / Ct        V = (Z·U·C·S / R)·P
   C = 2.5 si T<Tp ; 2.5·(Tp/T) si Tp<T<Tl ; 2.5·(Tp·Tl/T²) si T>Tl
   ========================================================= */

function computeResults({ Z, U, soilCode, sistema, irregularFactor, P, hn }) {
  const soil = SOIL_PARAMS[soilCode];
  const S = getSoilFactor(Z, soilCode);
  const [Rbase, Ct] = sistema.split('|').map(Number);

  const T = hn / Ct;
  const Reff = Rbase * irregularFactor;

  let C;
  if (T < soil.Tp) {
    C = 2.5;
  } else if (T <= soil.Tl) {
    C = 2.5 * (soil.Tp / T);
  } else {
    C = (2.5 * (soil.Tp * soil.Tl)) / (T * T);
  }
  C = Math.min(C, 2.5);

  const coef = (Z * U * C * S) / Reff;
  const V = coef * P;

  const ratio = Math.abs(T - soil.Tp) / soil.Tp;
  const isResonance = ratio < 0.2;
  const resonanceText = isResonance
    ? `Atención: el periodo de tu estructura (T = ${T.toFixed(2)} s) está cerca del periodo predominante del suelo (Tp = ${soil.Tp.toFixed(2)} s, ${soil.label}). Existe riesgo de amplificación dinámica por resonancia, igual que en el Ejercicio 4 del estudio de referencia.`
    : `El periodo de tu estructura (T = ${T.toFixed(2)} s) se encuentra alejado del periodo predominante del suelo (Tp = ${soil.Tp.toFixed(2)} s, ${soil.label}), por lo que el riesgo de resonancia es bajo.`;

  return { T, C, coef, V, isResonance, resonanceText };
}

const initialForm = {
  Z: '0.45',
  U: '1.0',
  soilCode: 'S2',
  sistema: '7|45',
  irregularFactor: '1',
  P: 800,
  hn: 9,
};

export default function Calculator() {
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState(() =>
    computeResults({
      Z: Number(initialForm.Z),
      U: Number(initialForm.U),
      soilCode: initialForm.soilCode,
      sistema: initialForm.sistema,
      irregularFactor: Number(initialForm.irregularFactor),
      P: Number(initialForm.P),
      hn: Number(initialForm.hn),
    })
  );

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = computeResults({
      Z: Number(form.Z),
      U: Number(form.U),
      soilCode: form.soilCode,
      sistema: form.sistema,
      irregularFactor: Number(form.irregularFactor),
      P: Number(form.P),
      hn: Number(form.hn),
    });
    setResults(next);
  }

  return (
    <section className="app-section" id="calculadora">
      <div className="section-head">
        <p className="eyebrow eyebrow--center">
          <span className="eyebrow__dot"></span>Método estático — Norma E.030
        </p>
        <h2 className="section-title">Calculadora de fuerza cortante y periodo</h2>
        <p className="section-subtitle">
          Calcula el cortante basal de diseño V = (Z·U·C·S / R)·P y el periodo fundamental T =
          hn / Ct.
        </p>
      </div>

      <div className="calc-layout">
        <form className="calc-form" id="calcForm" onSubmit={handleSubmit}>
          <div className="calc-grid">
            <div className="calc-field">
              <label htmlFor="calcZona">Zona sísmica (Z)</label>
              <select id="calcZona" value={form.Z} onChange={handleChange('Z')}>
                <option value="0.10">Zona 1 — Z = 0.10</option>
                <option value="0.25">Zona 2 — Z = 0.25</option>
                <option value="0.35">Zona 3 — Z = 0.35</option>
                <option value="0.45">Zona 4 (costa) — Z = 0.45</option>
              </select>
            </div>
            <div className="calc-field">
              <label htmlFor="calcUso">Categoría de uso (U)</label>
              <select id="calcUso" value={form.U} onChange={handleChange('U')}>
                <option value="1.5">A — Esencial — U = 1.5</option>
                <option value="1.3">B — Importante — U = 1.3</option>
                <option value="1.0">C — Común (vivienda) — U = 1.0</option>
              </select>
            </div>
            <div className="calc-field">
              <label htmlFor="calcSuelo">Tipo de suelo</label>
              <select id="calcSuelo" value={form.soilCode} onChange={handleChange('soilCode')}>
                <option value="S0">S0 — Roca dura</option>
                <option value="S1">S1 — Roca / suelo muy rígido</option>
                <option value="S2">S2 — Suelo intermedio</option>
                <option value="S3">S3 — Suelo blando</option>
              </select>
            </div>
            <div className="calc-field">
              <label htmlFor="calcSistema">Sistema estructural (R₀)</label>
              <select id="calcSistema" value={form.sistema} onChange={handleChange('sistema')}>
                <option value="8|35">Pórticos de concreto armado — R = 8</option>
                <option value="6|45">Muros estructurales — R = 6</option>
                <option value="7|45">Sistema dual — R = 7</option>
                <option value="3|60">Albañilería confinada — R = 3</option>
                <option value="8|35">Pórticos de acero dúctil — R = 8</option>
              </select>
            </div>
            <div className="calc-field">
              <label htmlFor="calcIrregular">Configuración</label>
              <select
                id="calcIrregular"
                value={form.irregularFactor}
                onChange={handleChange('irregularFactor')}
              >
                <option value="1">Regular</option>
                <option value="0.75">Irregular (Ia·Ip ≈ 0.75)</option>
              </select>
            </div>
            <div className="calc-field">
              <label htmlFor="calcPeso">
                Peso sísmico P <span className="calc-field__unit">kN</span>
              </label>
              <input
                type="number"
                id="calcPeso"
                value={form.P}
                min="1"
                step="any"
                onChange={handleChange('P')}
              />
            </div>
            <div className="calc-field">
              <label htmlFor="calcAltura">
                Altura total hn <span className="calc-field__unit">m</span>
              </label>
              <input
                type="number"
                id="calcAltura"
                value={form.hn}
                min="1"
                step="any"
                onChange={handleChange('hn')}
              />
            </div>
          </div>

          <button type="submit" className="btn btn--primary calc-form__cta">
            Calcular cortante basal
          </button>
        </form>

        <div className="calc-results" id="calcResults">
          <div className="calc-result-card">
            <span className="calc-result-card__label">Periodo fundamental T</span>
            <span className="calc-result-card__value">{results.T.toFixed(2)} s</span>
          </div>
          <div className="calc-result-card">
            <span className="calc-result-card__label">Factor de amplificación C</span>
            <span className="calc-result-card__value">{results.C.toFixed(2)}</span>
          </div>
          <div className="calc-result-card">
            <span className="calc-result-card__label">Coeficiente sísmico ZUCS/R</span>
            <span className="calc-result-card__value">{results.coef.toFixed(4)}</span>
          </div>
          <div className="calc-result-card calc-result-card--highlight">
            <span className="calc-result-card__label">Cortante basal de diseño V</span>
            <span className="calc-result-card__value">{results.V.toFixed(1)} kN</span>
          </div>
          <div className="calc-result-card calc-result-card--full">
            <span className="calc-result-card__label">
              Verificación de resonancia (T vs Tp del suelo)
            </span>
            <p className={`calc-resonance-text${results.isResonance ? ' is-warning' : ''}`}>
              {results.resonanceText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
