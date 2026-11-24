export interface ColumnaPdf<T> {
  encabezado: string;
  valor: (fila: T, indice: number) => string | number;
  alineacion?: "left" | "center" | "right";
  ancho?: number;
}
export interface ReportePdf<T> {
  descripcion: string;
  detalles?: string[];
  columnas: ColumnaPdf<T>[];
  datos: T[];
}
export interface TemaPdf {
  colorCabecera: [number, number, number];
  colorTexto: [number, number, number];
  tamanoCuerpo: number;
  margen: number;
}
