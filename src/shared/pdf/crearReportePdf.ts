import { PdfGenerator } from "./PdfGenerator";
import { fechaEmision, NOMBRE_INSTITUCION } from "./pdf.formato";
import type { ColumnaPdf, ReportePdf } from "./pdf.types";

export const columnaNumero = <T>(): ColumnaPdf<T> => ({
  encabezado: "N°",
  valor: (_, indice) => indice + 1,
  ancho: 14,
});

interface OpcionesReporte<T> extends Omit<ReportePdf<T>, "detalles"> {
  /** Líneas extra entre el encabezado y el total (ej. "Año lectivo: 2026"). */
  detallesPrevios?: string[];
  /** Texto del total, ej. "Total de docentes". */
  etiquetaTotal: string;
  orientacion?: "portrait" | "landscape";
}

export function crearReportePdf<T>({
  detallesPrevios = [],
  etiquetaTotal,
  orientacion = "landscape",
  ...reporte
}: OpcionesReporte<T>): PdfGenerator {
  return new PdfGenerator(orientacion).agregarTabla({
    titulo: NOMBRE_INSTITUCION,
    ...reporte,
    detalles: [
      ...detallesPrevios,
      `Fecha de emisión: ${fechaEmision()}`,
      `${etiquetaTotal}: ${reporte.datos.length}`,
    ],
  });
}
