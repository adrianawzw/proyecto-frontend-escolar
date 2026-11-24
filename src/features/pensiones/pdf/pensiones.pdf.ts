import {
  columnaNumero,
  crearReportePdf,
} from "../../../shared/pdf/crearReportePdf";
import {
  formatearFechaIso,
  formatearMoneda,
} from "../../../shared/pdf/pdf.formato";
import type { Pension } from "../pensiones.types";
import type { Matricula } from "../../matriculas/matriculas.types";

export const NOMBRE_ARCHIVO_PENSIONES_PDF = "lista-pensiones.pdf";

interface OpcionesPdfPensiones {
  pensiones: Pension[];
  matriculasPorId: Map<Pension["matriculaId"], Matricula>;
  anio: string;
  mes: string;
  estado: string;
  meses: string[];
  estados: Record<Pension["estado"], string>;
}

/** Respeta orden y filtros de la página. No consulta al backend. */
export const crearPdfPensiones = ({
  pensiones,
  matriculasPorId,
  anio,
  mes,
  estado,
  meses,
  estados,
}: OpcionesPdfPensiones) =>
  crearReportePdf<Pension>({
    descripcion: "Lista de pensiones",
    detallesPrevios: [
      `Año lectivo: ${anio}`,
      `Mes: ${mes}`,
      `Estado: ${estado}`,
    ],
    etiquetaTotal: "Total de pensiones",
    datos: pensiones,
    columnas: [
      columnaNumero<Pension>(),
      {
        encabezado: "Estudiante",
        valor: (p) =>
          matriculasPorId.get(p.matriculaId)?.nombreEstudiante ?? "Estudiante",
      },
      { encabezado: "Mes", valor: (p) => meses[p.mes - 1] },
      {
        encabezado: "Monto base",
        valor: (p) => formatearMoneda(p.montoBase),
        alineacion: "right",
      },
      {
        encabezado: "Mora",
        valor: (p) => formatearMoneda(p.moraAcumulada),
        alineacion: "right",
      },
      {
        encabezado: "Total",
        valor: (p) =>
          p.montoTotal == null
            ? "No disponible"
            : formatearMoneda(p.montoTotal),
        alineacion: "right",
      },
      {
        encabezado: "Vencimiento",
        valor: (p) => formatearFechaIso(p.fechaVencimiento),
      },
      { encabezado: "Estado", valor: (p) => estados[p.estado] },
    ],
  });
