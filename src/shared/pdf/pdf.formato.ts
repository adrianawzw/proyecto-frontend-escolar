export const NOMBRE_INSTITUCION = "Liceo Santo Toribio";

const formatoMoneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const formatoFecha = new Intl.DateTimeFormat("es-PE");

export const formatearMoneda = (monto: number): string =>
  formatoMoneda.format(monto);

export const fechaEmision = (): string => formatoFecha.format(new Date());

/** Convierte "2012-05-30" en "30/05/2012" sin depender de la zona horaria. */
export function formatearFechaIso(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha;
}

export const nombreCompleto = (p: {
  nombres: string;
  apellidos: string;
}): string => `${p.nombres} ${p.apellidos}`;
