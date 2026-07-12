/* =========================================================
   CALCULADORA SÍSMICA — Método estático, Norma E.030
   T = hn / Ct        V = (Z·U·C·S / R)·P
   C = 2.5 si T<Tp ; 2.5·(Tp/T) si Tp<T<Tl ; 2.5·(Tp·Tl/T²) si T>Tl
   ========================================================= */

// Tp y TL dependen solo del perfil de suelo (Tabla N°3, E.030)
export const SOIL_PARAMS = {
  S0: { Tp: 0.3, Tl: 3.0, label: 'roca dura' },
  S1: { Tp: 0.4, Tl: 2.5, label: 'roca o suelo muy rígido' },
  S2: { Tp: 0.6, Tl: 2.0, label: 'suelo intermedio' },
  S3: { Tp: 1.0, Tl: 1.6, label: 'suelo blando' },
};

// Factor de suelo "S" (Tabla N°4, E.030): depende de la ZONA y del SUELO a la vez.
// Se indexa por el valor Z de cada zona.
export const SOIL_FACTOR_BY_ZONE = {
  '0.45': { S0: 0.8, S1: 1.0, S2: 1.05, S3: 1.1 }, // Zona 4
  '0.35': { S0: 0.8, S1: 1.0, S2: 1.15, S3: 1.2 }, // Zona 3
  '0.25': { S0: 0.8, S1: 1.0, S2: 1.2, S3: 1.4 }, // Zona 2
  '0.1': { S0: 0.8, S1: 1.0, S2: 1.6, S3: 2.0 }, // Zona 1
};

export function getSoilFactor(Z, soilCode) {
  const key = String(Z);
  const row = SOIL_FACTOR_BY_ZONE[key] || SOIL_FACTOR_BY_ZONE['0.45'];
  return row[soilCode];
}
