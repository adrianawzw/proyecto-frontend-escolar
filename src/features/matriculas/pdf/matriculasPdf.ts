import {
  columnaNumero,
  crearReportePdf,
} from "../../../shared/pdf/crearReportePdf";
import { formatearMoneda } from "../../../shared/pdf/pdf.formato";
import type { Matricula } from "../matriculas.types";

export const NOMBRE_ARCHIVO_MATRICULAS_PDF = "lista-matriculas.pdf";

const ETIQUETA_NIVEL: Record<string, string> = {
  INICIAL: "Inicial",
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
};

export const crearPdfMatriculas = (
  matriculas: Matricula[],
  anioLectivo: number,
) =>
  crearReportePdf<Matricula>({
    descripcion: "Lista de matrículas registradas",
    detallesPrevios: [`Año lectivo: ${anioLectivo}`],
    etiquetaTotal: "Total de matrículas",
    datos: matriculas,
    columnas: [
      columnaNumero(),
      { encabezado: "Estudiante", valor: (m) => m.nombreEstudiante },
      { encabezado: "Nivel", valor: (m) => ETIQUETA_NIVEL[m.nivel] ?? m.nivel },
      { encabezado: "Grado", valor: (m) => m.grado },
      {
        encabezado: "Matrícula",
        valor: (m) => formatearMoneda(m.montoMatricula),
        alineacion: "right",
      },
      {
        encabezado: "Pensión mensual",
        valor: (m) => formatearMoneda(m.montoPensionMensual),
        alineacion: "right",
      },
      {
        encabezado: "Estado de pago",
        valor: (m) => (m.matriculaPagada ? "Pagada" : "Pendiente"),
      },
    ],
  });
