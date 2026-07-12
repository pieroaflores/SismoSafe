import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PERU_ZONES_GEOJSON, ZONE_INFO, magColor } from '../data/mapData';

/* =========================================================
   MAPA DE RIESGO — Leaflet + API pública USGS (sin clave)
   Zonificación E.030 simplificada (referencial) + sismos
   reales de los últimos 30 días en el catálogo del USGS.
   ========================================================= */

export default function RiskMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);
  const [status, setStatus] = useState('Conectando con earthquake.usgs.gov…');
  const [events, setEvents] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Inicializa el mapa y la capa de zonificación una sola vez
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, { scrollWheelZoom: false }).setView(
      [-9.19, -75.0],
      5
    );
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.geoJSON(PERU_ZONES_GEOJSON, {
      style: (feature) => ({
        color: feature.properties.color,
        weight: 1,
        fillColor: feature.properties.color,
        fillOpacity: 0.45,
      }),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(feature.properties.name, { sticky: true });
      },
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Carga los sismos recientes desde USGS; se puede reintentar (retryKey) sin recrear el mapa
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let cancelled = false;
    setHasError(false);
    setStatus('Conectando con earthquake.usgs.gov…');

    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    const url =
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
      `&starttime=${start.toISOString()}&endtime=${end.toISOString()}` +
      `&minlatitude=-19.5&maxlatitude=1&minlongitude=-82&maxlongitude=-68` +
      `&minmagnitude=2&orderby=time&limit=100`;

    // fetchWithRetry: la API pública de USGS a veces falla en el primer
    // intento por hipos de red pasajeros; reintenta una vez tras una pausa
    // antes de mostrar un error al usuario.
    async function fetchWithRetry(attempt = 1) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`USGS respondió con estado HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1500));
          return fetchWithRetry(attempt + 1);
        }
        throw err;
      }
    }

    fetchWithRetry()
      .then((data) => {
        if (cancelled) return;

        const features = (data.features || [])
          .slice()
          .sort((a, b) => b.properties.time - a.properties.time);

        if (markerGroupRef.current) {
          map.removeLayer(markerGroupRef.current);
          markerGroupRef.current = null;
        }

        if (!features.length) {
          setStatus('No se registraron sismos M≥2.0 cerca del Perú en los últimos 30 días.');
          setEvents([]);
          return;
        }

        setStatus(`${features.length} sismo(s) M≥2.0 registrados en los últimos 30 días.`);

        const markerGroup = L.layerGroup();

        features.forEach((f) => {
          const [lng, lat, depth] = f.geometry.coordinates;
          const mag = f.properties.mag ?? 0;
          const place = f.properties.place || 'Ubicación no especificada';
          const time = new Date(f.properties.time);
          const detailUrl = f.properties.url;

          L.circleMarker([lat, lng], {
            radius: Math.max(4, mag * 2.4),
            color: magColor(mag),
            weight: 1,
            fillColor: magColor(mag),
            fillOpacity: 0.55,
          })
            .bindPopup(
              `<strong>M ${mag.toFixed(1)}</strong> — ${place}<br>` +
                `${time.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}<br>` +
                `Profundidad: ${depth.toFixed(1)} km<br>` +
                `<a href="${detailUrl}" target="_blank" rel="noopener">Ver detalle en USGS →</a>`
            )
            .addTo(markerGroup);
        });

        markerGroup.addTo(map);
        markerGroupRef.current = markerGroup;
        setEvents(features.slice(0, 10));
      })
      .catch((err) => {
        if (cancelled) return;
        // El detalle técnico queda en consola para depuración; al usuario
        // se le muestra un mensaje claro y accionable (botón "Reintentar").
        console.error('RiskMap: fallo al consultar la API de USGS.', err);
        setStatus(
          'No se pudo conectar con el servicio de USGS. Puede ser un corte de red temporal ' +
            'de tu conexión, un bloqueador de anuncios/extensión que bloquea earthquake.usgs.gov, ' +
            'o el servicio de USGS caído momentáneamente.'
        );
        setHasError(true);
        setEvents([]);
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return (
    <section className="app-section app-section--alt" id="mapa">
      <div className="section-head">
        <p className="eyebrow eyebrow--center">
          <span className="eyebrow__dot"></span>Datos en tiempo real — API pública USGS
        </p>
        <h2 className="section-title">Mapa de zonificación sísmica y sismos recientes</h2>
        <p className="section-subtitle">
          Zonificación E.030 oficial del Perú (4 zonas, a nivel distrital) superpuesta con
          sismos reales de los últimos 30 días, obtenidos en vivo del catálogo del USGS.
        </p>
      </div>

      <div className="map-layout">
        <div className="map-canvas" id="riskMap" ref={mapContainerRef}></div>

        <aside className="map-sidebar">
          <h4 className="map-sidebar__title">Sismos recientes (USGS)</h4>
          <p className="map-sidebar__status">{status}</p>
          {hasError && (
            <button
              type="button"
              className="btn btn--secondary map-sidebar__retry"
              onClick={() => setRetryKey((k) => k + 1)}
            >
              Reintentar
            </button>
          )}
          <ul className="map-sidebar__list">
            {events.map((f) => {
              const mag = f.properties.mag ?? 0;
              const place = f.properties.place || 'Ubicación no especificada';
              const time = new Date(f.properties.time);
              const color = magColor(mag);
              return (
                <li className="map-event" key={f.id}>
                  <span className="map-event__mag" style={{ background: `${color}33`, color }}>
                    {mag.toFixed(1)}
                  </span>
                  <span className="map-event__body">
                    <span className="map-event__place">{place}</span>
                    <span className="map-event__time">
                      {time.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="map-legend">
            <h5>Zonificación sísmica E.030 (RM 355-2018-VIVIENDA)</h5>
            {ZONE_INFO.map((z) => (
              <div className="map-legend__item" key={z.zone}>
                <span className="map-legend__swatch" style={{ background: z.color }}></span>
                {z.name} — Z = {z.z.toFixed(2)}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
