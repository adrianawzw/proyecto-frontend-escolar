export type EstadoPension = "PENDIENTE" | "PAGADO" | "EN_MORA";

export interface Pension {
  id: string;
  matriculaId: string;
  mes: number;
  montoBase: number;
  moraAcumulada: number;
  montoTotal: number;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: EstadoPension;
}

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const ESTADOS = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagada",
  EN_MORA: "En mora",
};
