import { Boton } from "./Boton";
import "./TarjetaResumen.css";

interface TarjetaResumenProps {
  titulo: string;
  valor: string | number | null;
  /** Línea de contexto bajo la cifra, por ejemplo "12 pagos en marzo". */
  detalle?: string;
  /** Color semántico del punto junto al título. Sin tono, la tarjeta es neutra. */
  tono?: "exito" | "alerta" | "error";
  error?: string;
  onReintentar?: () => void;
}

export function TarjetaResumen({
  titulo,
  valor,
  detalle,
  tono,
  error,
  onReintentar,
}: TarjetaResumenProps) {
  const cargando = valor === null && !error;
  const tonoActivo = error ? "error" : tono;

  return (
    <article
      className={`tarjeta-resumen ${
        tonoActivo ? `tarjeta-resumen--${tonoActivo}` : ""
      }`.trim()}
      aria-busy={cargando}
    >
      <h3 className="tarjeta-resumen__titulo">{titulo}</h3>

      {error ? (
        <div className="tarjeta-resumen__error">
          <p role="alert">{error}</p>

          {onReintentar && (
            <Boton variante="principal" onClick={onReintentar}>
              Reintentar
            </Boton>
          )}
        </div>
      ) : cargando ? (
        <div className="tarjeta-resumen__cargando" role="status">
          <span className="tarjeta-resumen__skeleton"></span>
        </div>
      ) : (
        <>
          <p className="tarjeta-resumen__valor">{valor}</p>
          {detalle && <p className="tarjeta-resumen__detalle">{detalle}</p>}
        </>
      )}
    </article>
  );
}
