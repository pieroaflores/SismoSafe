import { useState } from 'react';
import { QUIZ_QUESTIONS, QUIZ_RECOMMENDATIONS } from '../data/quizData';

function getRiskLevel(total) {
  if (total <= 6) return { level: 'Bajo', color: '#5a7a55' };
  if (total <= 13) return { level: 'Moderado', color: '#c89a3d' };
  if (total <= 20) return { level: 'Alto', color: '#b3552b' };
  return { level: 'Crítico', color: '#7a1f1f' };
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(new Array(QUIZ_QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[current];
  const isLast = current === QUIZ_QUESTIONS.length - 1;

  function selectOption(index) {
    const next = [...answers];
    next[current] = { optionIndex: index, ...question.options[index] };
    setAnswers(next);
  }

  function handleNext() {
    if (!answers[current]) return;
    if (!isLast) {
      setCurrent((c) => c + 1);
    } else {
      setShowResult(true);
    }
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  function handleRestart() {
    setCurrent(0);
    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
    setShowResult(false);
  }

  const total = answers.reduce((sum, a) => sum + (a ? a.score : 0), 0);
  const maxScore = QUIZ_QUESTIONS.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.score)),
    0
  );
  const { level, color } = getRiskLevel(total);

  const flags = answers.filter((a) => a && a.flag).map((a) => a.flag);
  const recs = flags.map((f) => QUIZ_RECOMMENDATIONS[f]).filter(Boolean);
  if (recs.length === 0) {
    recs.push(
      'Mantén un programa de mantenimiento preventivo y revisa tu vivienda visualmente después de cualquier sismo moderado.'
    );
  }
  recs.push(
    'Esta evaluación es un primer diagnóstico orientativo; no sustituye una inspección profesional in situ.'
  );

  return (
    <section className="app-section app-section--alt" id="evaluacion">
      <div className="section-head">
        <p className="eyebrow eyebrow--center">
          <span className="eyebrow__dot"></span>Cuestionario técnico
        </p>
        <h2 className="section-title">Evaluación de vulnerabilidad estructural</h2>
        <p className="section-subtitle">
          Siete preguntas basadas en los mecanismos de daño observados en el terremoto de Pisco
          (2007) y en los criterios de la norma E.030.
        </p>
      </div>

      <div className="quiz" id="quizApp">
        <div className="quiz__progress">
          <div
            className="quiz__progress-bar"
            style={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
        <p className="quiz__step-label">
          Pregunta {current + 1} de {QUIZ_QUESTIONS.length}
        </p>

        {!showResult && (
          <div className="quiz__question" id="quizQuestion">
            <h4>{question.text}</h4>
            <div className="quiz__options">
              {question.options.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  className={`quiz__option${answers[current]?.optionIndex === i ? ' is-selected' : ''}`}
                  onClick={() => selectOption(i)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!showResult && (
          <div className="quiz__nav">
            <button className="btn btn--ghost" onClick={handleBack} disabled={current === 0}>
              Atrás
            </button>
            <button className="btn btn--primary" onClick={handleNext} disabled={!answers[current]}>
              {isLast ? 'Ver resultado' : 'Siguiente'}
            </button>
          </div>
        )}

        {showResult && (
          <div className="quiz__result" id="quizResult">
            <div className="quiz__result-badge" style={{ background: `${color}33`, color }}>
              Riesgo: {level}
            </div>
            <p className="quiz__result-score">
              Puntaje de vulnerabilidad: {total} de {maxScore} puntos posibles.
            </p>
            <h4 className="quiz__result-title">Plan de acción recomendado</h4>
            <ul className="quiz__result-list">
              {recs.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
            <button className="btn btn--ghost" onClick={handleRestart}>
              Repetir evaluación
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
