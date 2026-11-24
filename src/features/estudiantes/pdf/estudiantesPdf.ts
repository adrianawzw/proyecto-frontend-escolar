import {
  columnaNumero,
  crearReportePdf,
} from "../../../shared/pdf/crearReportePdf";
import {
  formatearFechaIso,
  nombreCompleto,
} from "../../../shared/pdf/pdf.formato";
import type { Estudiante } from "../estudiantes.types";

export const NOMBRE_ARCHIVO_ESTUDIANTES_PDF = "lista-estudiantes.pdf";

export const crearPdfEstudiantes = (estudiantes: Estudiante[]) =>
  crearReportePdf<Estudiante>({
    descripcion: "Lista de estudiantes registrados",
    etiquetaTotal: "Total de estudiantes",
    datos: estudiantes,
    columnas: [
      columnaNumero(),
      { encabezado: "DNI", valor: (e) => e.dni, ancho: 28 },
      { encabezado: "Estudiante", valor: nombreCompleto },
      {
        encabezado: "Fecha de nacimiento",
        valor: (e) => formatearFechaIso(e.fechaNacimiento),
      },
      {
        encabezado: "Apoderado",
        valor: (e) => e.nombreApoderado ?? "Sin apoderado",
      },
    ],
  });
