import type { ReactNode } from "react";
import "./PanelFiltros.css";

interface PanelFiltrosProps {
  children: ReactNode;
  etiqueta?: string;
}

/**
 * Barra de filtros del listado. Las columnas se ajustan solas al ancho.
 * Para que un campo ocupe doble ancho (por ejemplo el buscador),
 * envuélvelo en <div className="panel-filtros__ancho">.
 */
export function PanelFiltros({
  children,
  etiqueta = "Filtros del listado",
}: PanelFiltrosProps) {
  return (
    <div className="panel-filtros" role="group" aria-label={etiqueta}>
      {children}
    </div>
  );
}
