# SismoSafe

Plataforma de evaluación preventiva del riesgo sísmico, migrada de HTML/CSS/JS vanilla a **React + Vite**.

## Funcionalidades

- **Sismógrafo en vivo** — traza animada en el hero con métricas simuladas.
- **Simulador de ondas P/S** — calcula velocidades de onda (Vp, Vs) y tiempos de llegada según parámetros elásticos del medio.
- **Evaluación estructural** — cuestionario de 7 preguntas que estima el nivel de vulnerabilidad sísmica de una vivienda.
- **Calculadora sísmica E.030** — cortante basal de diseño y periodo fundamental según el método estático de la norma peruana E.030.
- **Mapa de riesgo** — zonificación sísmica E.030 (referencial) superpuesta con sismos reales de los últimos 30 días obtenidos en vivo desde la API pública de USGS, usando Leaflet.

## Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Leaflet](https://leafletjs.com/) para el mapa interactivo
- CSS plano con variables (sin frameworks de utilidades)

## Requisitos

- Node.js 18 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Esto inicia el servidor de desarrollo de Vite (por defecto en `http://localhost:5173`).

## Otros scripts

```bash
npm run build    # build de producción en /dist
npm run preview  # sirve el build de producción localmente
npm run lint      # linting con oxlint
```

## Estructura del proyecto

```
src/
├── components/        # Componentes de cada sección
├── data/              # Datos estáticos (preguntas del quiz, parámetros de suelo, zonas sísmicas)
├── hooks/             # Hooks personalizados (p. ej. prefers-reduced-motion)
├── App.jsx            # Composición de todas las secciones
├── index.css          # Estilos globales (design tokens, layout, componentes)
└── main.jsx           # Punto de entrada de React
```

## Notas

- El mapa de riesgo requiere conexión a internet para consultar la API de USGS (`earthquake.usgs.gov`) y los tiles de CartoDB.
- Este proyecto tiene fines académicos; no sustituye una evaluación estructural profesional.
