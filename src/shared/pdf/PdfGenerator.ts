import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportePdf } from "./pdf.types";

const COLOR_CABECERA: [number, number, number] = [35, 68, 132];
const COLOR_TEXTO: [number, number, number] = [30, 41, 59];
const MARGEN = 14;

export class PdfGenerator {
  private readonly doc: jsPDF;
  private paginasNumeradas = false;

  constructor(orientacion: "portrait" | "landscape" = "portrait") {
    this.doc = new jsPDF({
      orientation: orientacion,
      unit: "mm",
      format: "a4",
    });
  }

  agregarTabla<T>({
    titulo,
    descripcion,
    detalles = [],
    columnas,
    datos,
  }: ReportePdf<T> & { titulo: string }): this {
    this.doc.setProperties({ title: descripcion });

    this.doc
      .setFont("helvetica", "bold")
      .setFontSize(16)
      .text(titulo, MARGEN, 18);
    this.doc
      .setFont("helvetica", "normal")
      .setFontSize(11)
      .text(descripcion, MARGEN, 26);
    this.doc.setFontSize(9);
    detalles.forEach((d, i) => this.doc.text(d, MARGEN, 33 + i * 5));

    autoTable(this.doc, {
      startY: 38 + detalles.length * 5,
      head: [columnas.map((c) => c.encabezado)],
      body: datos.map((fila, i) => columnas.map((c) => c.valor(fila, i))),
      theme: "striped",
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: COLOR_TEXTO,
        cellPadding: 4,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: COLOR_CABECERA,
        lineColor: COLOR_CABECERA, // tapa la costura entre celdas
        lineWidth: 0.1,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: Object.fromEntries(
        columnas.map((c, i) => [
          i,
          { halign: c.alineacion ?? "left", cellWidth: c.ancho ?? "auto" },
        ]),
      ),
      didParseCell: ({ section, column, cell }) => {
        if (section !== "head") return;
        cell.styles.halign = columnas[column.index]?.alineacion ?? "left";
      },
      margin: { top: 16, right: MARGEN, bottom: 17, left: MARGEN },
      showHead: "everyPage",
    });

    return this;
  }

  private numerarPaginas(): void {
    if (this.paginasNumeradas) return;
    this.paginasNumeradas = true;

    const total = this.doc.getNumberOfPages();
    const { width, height } = this.doc.internal.pageSize;

    this.doc.setFontSize(8).setTextColor(100);
    for (let p = 1; p <= total; p++) {
      this.doc.setPage(p);
      this.doc.text(`Página ${p} de ${total}`, width - MARGEN, height - 9, {
        align: "right",
      });
    }
    this.doc.setTextColor(0);
  }

  obtenerBlob(): Blob {
    this.numerarPaginas();
    return this.doc.output("blob");
  }

  descargar(nombreArchivo: string): void {
    this.numerarPaginas();
    this.doc.save(nombreArchivo);
  }
}
