import type { ReactNode } from "react";
import "./EncabezadoPagina.css";

interface EncabezadoPaginaProps {
  titulo: string;
  descripcion?: string;
  /** Botones de la página (por ejemplo "Generar pagos"). Van a la derecha. */
  acciones?: ReactNode;
}

export function EncabezadoPagina({
  titulo,
  descripcion,
  acciones,
}: EncabezadoPaginaProps) {
  return (
    <header className="encabezado-pagina">
      <div className="encabezado-pagina__texto">
        <h1>{titulo}</h1>
        {descripcion && <p>{descripcion}</p>}
      </div>

      {acciones && <div className="encabezado-pagina__acciones">{acciones}</div>}
    </header>
  );
}
