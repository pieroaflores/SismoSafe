/* =========================================================
   EVALUACIÓN ESTRUCTURAL — cuestionario de vulnerabilidad
   Puntajes y recomendaciones basados en los mecanismos de
   daño del terremoto de Pisco 2007 y criterios de la E.030.
   ========================================================= */

export const QUIZ_QUESTIONS = [
  {
    text: '¿Cuál es el material estructural predominante de tu vivienda?',
    options: [
      { label: 'Concreto armado', score: 1 },
      { label: 'Albañilería confinada', score: 2 },
      { label: 'Acero', score: 1 },
      { label: 'Albañilería no confinada o adobe', score: 4, flag: 'albanileria' },
    ],
  },
  {
    text: '¿En qué periodo se construyó la edificación?',
    options: [
      { label: 'Después de 2006 (norma E.030 vigente)', score: 0 },
      { label: 'Entre 1997 y 2006', score: 2 },
      { label: 'Antes de 1997', score: 4, flag: 'normaAntigua' },
    ],
  },
  {
    text: '¿Cuántos niveles tiene la edificación?',
    options: [
      { label: '1 a 2 niveles', score: 1 },
      { label: '3 a 5 niveles', score: 2 },
      { label: '6 niveles o más', score: 3 },
    ],
  },
  {
    text: '¿Cómo describirías la configuración en planta?',
    options: [
      { label: 'Regular y simétrica', score: 0 },
      { label: 'Irregular: esquinas entrantes, forma en L/T o asimetría', score: 3, flag: 'irregular' },
    ],
  },
  {
    text: '¿El primer nivel tiene visiblemente menor rigidez que los superiores (cochera o local comercial abierto)?',
    options: [
      { label: 'No', score: 0 },
      { label: 'Sí', score: 4, flag: 'pisoBlando' },
    ],
  },
  {
    text: '¿Qué tipo de suelo predomina en la zona donde se ubica la vivienda?',
    options: [
      { label: 'Roca o suelo muy rígido (S0 / S1)', score: 0 },
      { label: 'Suelo intermedio (S2)', score: 2 },
      { label: 'Suelo blando (S3)', score: 4, flag: 'sueloBlando' },
    ],
  },
  {
    text: '¿Cuál es el estado visible de la estructura?',
    options: [
      { label: 'Buen estado, sin fisuras', score: 0 },
      { label: 'Fisuras menores', score: 2 },
      { label: 'Fisuras importantes, asentamientos o inclinación', score: 4, flag: 'dano' },
    ],
  },
];

export const QUIZ_RECOMMENDATIONS = {
  albanileria:
    'Confina los muros de albañilería con columnas y vigas de amarre de concreto armado: la albañilería no confinada fue uno de los sistemas con mayor fragilidad en Pisco 2007.',
  normaAntigua:
    'Solicita una evaluación estructural detallada a un ingeniero civil: tu vivienda se construyó antes de la vigencia plena de la norma E.030.',
  irregular:
    'Reduce asimetrías en planta o añade elementos rigidizantes en las esquinas para limitar la respuesta torsional observada en edificaciones irregulares.',
  pisoBlando:
    'Refuerza el primer nivel con muros o pórticos adicionales: el colapso por piso blando fue el mecanismo de daño más frecuente en el terremoto de Pisco 2007.',
  sueloBlando:
    'Profundiza el estudio de mecánica de suelos: los suelos blandos amplifican el movimiento sísmico y pueden generar resonancia suelo-estructura.',
  dano:
    'Repara cuanto antes las fisuras visibles y consulta a un ingeniero civil para descartar pérdida de capacidad resistente.',
};
