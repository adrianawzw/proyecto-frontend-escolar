import type { PagoDocente } from "../pagos-docentes/pagos-docentes.types";
import type { Pension } from "../pensiones/pensiones.types";

export interface Alerta {
  id: string;
  gravedad: "error" | "alerta";
  mensaje: string;
  detalle?: string;
  ruta: string;
}

const DIAS_AVISO_PAGO_DOCENTE = 5;
const DIAS_AVISO_PENSION = 3;

const fechaCorta = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
});

/** "2026-11-08" → fecha local a medianoche (evita el desfase de zona horaria). */
function fechaLocal(texto: string): Date {
  const [anio, mes, dia] = texto.slice(0, 10).split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

function diasHasta(texto: string, hoy: Date): number {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const milisegundos = fechaLocal(texto).getTime() - inicioHoy.getTime();
  return Math.round(milisegundos / 86_400_000);
}

function plural(cantidad: number, singular: string, pluralTexto: string) {
  return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`;
}

function textoDias(dias: number): string {
  if (dias <= 0) return "hoy";
  return dias === 1 ? "mañana" : `en ${dias} días`;
}

/**
 * Convierte los datos que el backend ya entrega (pagos a docentes y pensiones)
 * en avisos para el administrador. No requiere ningún endpoint nuevo.
 */
export function calcularAlertas(
  pagos: readonly PagoDocente[],
  pensiones: readonly Pension[],
  hoy: Date = new Date(),
): Alerta[] {
  const alertas: Alerta[] = [];

  const pagosRetrasados = pagos.filter((pago) => pago.estado === "RETRASO");
  if (pagosRetrasados.length > 0) {
    alertas.push({
      id: "pagos-docentes-retraso",
      gravedad: "error",
      mensaje: `${plural(
        pagosRetrasados.length,
        "pago a docente en retraso",
        "pagos a docentes en retraso",
      )}`,
      ruta: "/admin/pagos-docentes",
    });
  }

  const pensionesEnMora = pensiones.filter(
    (pension) => pension.estado === "EN_MORA",
  );
  if (pensionesEnMora.length > 0) {
    alertas.push({
      id: "pensiones-mora",
      gravedad: "error",
      mensaje: plural(
        pensionesEnMora.length,
        "pensión en mora",
        "pensiones en mora",
      ),
      ruta: "/admin/pensiones",
    });
  }

  const pagosProximos = pagos
    .filter((pago) => pago.estado === "PROGRAMADO")
    .map((pago) => ({ pago, dias: diasHasta(pago.fechaProgramada, hoy) }))
    .filter(({ dias }) => dias >= 0 && dias <= DIAS_AVISO_PAGO_DOCENTE)
    .sort((a, b) => a.dias - b.dias);

  if (pagosProximos.length > 0) {
    const { pago, dias } = pagosProximos[0];
    const restantes = pagosProximos.length - 1;

    alertas.push({
      id: "pagos-docentes-proximos",
      gravedad: "alerta",
      mensaje: `Pago a ${pago.nombresDocente} ${textoDias(dias)}`,
      detalle:
        restantes > 0
          ? `Y ${plural(restantes, "pago más", "pagos más")} esta semana`
          : `Programado para el ${fechaCorta.format(fechaLocal(pago.fechaProgramada))}`,
      ruta: "/admin/pagos-docentes",
    });
  }

  const pensionesPorVencer = pensiones.filter((pension) => {
    if (pension.estado !== "PENDIENTE") return false;
    const dias = diasHasta(pension.fechaVencimiento, hoy);
    return dias >= 0 && dias <= DIAS_AVISO_PENSION;
  });

  if (pensionesPorVencer.length > 0) {
    alertas.push({
      id: "pensiones-por-vencer",
      gravedad: "alerta",
      mensaje: `${plural(
        pensionesPorVencer.length,
        "pensión vence",
        "pensiones vencen",
      )} en los próximos ${DIAS_AVISO_PENSION} días`,
      ruta: "/admin/pensiones",
    });
  }

  return alertas;
}
