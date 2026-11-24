import {
  columnaNumero,
  crearReportePdf,
} from "../../../shared/pdf/crearReportePdf";
import {
  formatearMoneda,
  nombreCompleto,
} from "../../../shared/pdf/pdf.formato";
import type { Docente } from "../docentes.types";

export const NOMBRE_ARCHIVO_DOCENTES_PDF = "lista-docentes.pdf";

/** Respeta orden y filtros de la página. No consulta al backend. */
export const crearPdfDocentes = (docentes: Docente[]) =>
  crearReportePdf<Docente>({
    descripcion: "Lista de docentes registrados",
    etiquetaTotal: "Total de docentes",
    datos: docentes,
    columnas: [
      columnaNumero(),
      { encabezado: "DNI", valor: (d) => d.dni, ancho: 28 },
      { encabezado: "Docente", valor: nombreCompleto },
      {
        encabezado: "Sueldo mensual",
        valor: (d) => formatearMoneda(d.sueldoMensual),
        alineacion: "right",
      },
      {
        encabezado: "Estado",
        valor: (d) => (d.activo ? "Activo" : "Inactivo"),
        ancho: 28,
      },
    ],
  });
