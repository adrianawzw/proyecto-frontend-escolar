import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { obtenerPagosDocentes } from "../../pagos-docentes/pagos-docentes.service";
import { obtenerPensiones } from "../../pensiones/pensiones.service";
import { calcularAlertas, type Alerta } from "../alertas";
import "./CampanaAlertas.css";

interface CampanaAlertasProps {
  token: string;
}

/** Evita volver a pedir datos si el panel se abre varias veces seguidas. */
const SEGUNDOS_ENTRE_CARGAS = 60;

export function CampanaAlertas({ token }: CampanaAlertasProps) {
  const [alertas, setAlertas] = useState<Alerta[] | null>(null);
  const [error, setError] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const ultimaCargaRef = useRef(0);
  const panelId = useId();

  const cargar = useCallback(
    async (esActivo: () => boolean = () => true) => {
      ultimaCargaRef.current = Date.now();

      try {
        const [pagos, pensiones] = await Promise.all([
          obtenerPagosDocentes(token),
          obtenerPensiones(token),
        ]);

        if (!esActivo()) return;
        setAlertas(calcularAlertas(pagos, pensiones));
        setError(false);
      } catch {
        if (!esActivo()) return;
        setError(true);
      }
    },
    [token],
  );

  useEffect(() => {
    let activo = true;
    void cargar(() => activo);

    return () => {
      activo = false;
    };
  }, [cargar]);

  useEffect(() => {
    if (!abierto) return;

    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key !== "Escape") return;
      setAbierto(false);
      botonRef.current?.focus();
    }

    function alPulsarFuera(evento: PointerEvent) {
      if (!contenedorRef.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }

    document.addEventListener("keydown", alPulsarTecla);
    document.addEventListener("pointerdown", alPulsarFuera);

    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, [abierto]);

  function alternar() {
    const abriendo = !abierto;
    setAbierto(abriendo);

    const pasaron = (Date.now() - ultimaCargaRef.current) / 1000;
    if (abriendo && pasaron > SEGUNDOS_ENTRE_CARGAS) void cargar();
  }

  const cantidad = alertas?.length ?? 0;

  return (
    <div className="campana-alertas" ref={contenedorRef}>
      <button
        ref={botonRef}
        type="button"
        className="campana-alertas__boton"
        aria-expanded={abierto}
        aria-controls={panelId}
        aria-label={
          cantidad > 0
            ? `Alertas, ${cantidad} ${cantidad === 1 ? "pendiente" : "pendientes"}`
            : "Alertas"
        }
        onClick={alternar}
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>

        {cantidad > 0 && (
          <span className="campana-alertas__contador" aria-hidden="true">
            {cantidad}
          </span>
        )}
      </button>

      {abierto && (
        <div
          id={panelId}
          className="campana-alertas__panel"
          role="region"
          aria-label="Alertas pendientes"
        >
          <h2>Alertas</h2>

          {error && (
            <div className="campana-alertas__vacio" role="alert">
              <p>No se pudieron cargar las alertas.</p>
              <button
                type="button"
                className="boton boton--secundario boton--compacto"
                onClick={() => void cargar()}
              >
                Reintentar
              </button>
            </div>
          )}

          {!error && alertas === null && (
            <p className="campana-alertas__vacio" role="status">
              Cargando alertas...
            </p>
          )}

          {!error && alertas?.length === 0 && (
            <p className="campana-alertas__vacio">
              No hay alertas pendientes. Todo al día.
            </p>
          )}

          {!error && alertas && alertas.length > 0 && (
            <ul>
              {alertas.map((alerta) => (
                <li key={alerta.id}>
                  <Link
                    to={alerta.ruta}
                    className={`campana-alertas__item campana-alertas__item--${alerta.gravedad}`}
                    onClick={() => setAbierto(false)}
                  >
                    <span className="campana-alertas__punto" aria-hidden="true" />
                    <span>
                      <span className="campana-alertas__mensaje">
                        {alerta.mensaje}
                      </span>
                      {alerta.detalle && (
                        <span className="campana-alertas__detalle">
                          {alerta.detalle}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
