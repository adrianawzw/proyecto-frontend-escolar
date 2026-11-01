import { useEffect, useId, useRef } from "react";
import { Boton } from "./Boton";
import { Aviso } from "./Aviso";
import "./ModalConfirmacion.css";

export interface DetalleModal {
  etiqueta: string;
  valor: string;
}

interface ModalConfirmacionProps {
  titulo: string;
  descripcion: string;
  detalle?: readonly DetalleModal[];
  error?: string;
  cargando?: boolean;
  textoConfirmar: string;
  textoReintentar?: string;
  textoCargando?: string;
  /** Id del elemento que recibe el foco si el botón que abrió el modal ya no existe. */
  idFocoAlternativo?: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

/**
 * Diálogo de confirmación basado en <dialog>. Se monta cuando hay algo que
 * confirmar y se desmonta al cerrar: no necesita estado "abierto".
 */
export function ModalConfirmacion({
  titulo,
  descripcion,
  detalle = [],
  error,
  cargando = false,
  textoConfirmar,
  textoReintentar = "Reintentar",
  textoCargando = "Guardando...",
  idFocoAlternativo,
  onCancelar,
  onConfirmar,
}: ModalConfirmacionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tituloId = useId();
  const descripcionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const elementoAnterior = document.activeElement;

    if (dialog && !dialog.open) dialog.showModal();

    return () => {
      dialog?.close();

      if (
        elementoAnterior instanceof HTMLElement &&
        elementoAnterior.isConnected
      ) {
        elementoAnterior.focus();
      } else if (idFocoAlternativo) {
        document.getElementById(idFocoAlternativo)?.focus();
      }
    };
  }, [idFocoAlternativo]);

  return (
    <dialog
      ref={dialogRef}
      className="modal-confirmacion"
      aria-labelledby={tituloId}
      aria-describedby={descripcionId}
      aria-busy={cargando}
      onCancel={(evento) => {
        evento.preventDefault();
        onCancelar();
      }}
    >
      <h2 id={tituloId}>{titulo}</h2>
      <p id={descripcionId} className="modal-confirmacion__descripcion">
        {descripcion}
      </p>

      {detalle.length > 0 && (
        <dl className="modal-confirmacion__detalle">
          {detalle.map((fila) => (
            <div key={fila.etiqueta}>
              <dt>{fila.etiqueta}</dt>
              <dd>{fila.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {error && <Aviso tipo="error">{error}</Aviso>}

      <div className="modal-confirmacion__acciones">
        <Boton onClick={onCancelar} disabled={cargando} autoFocus>
          Cancelar
        </Boton>
        <Boton
          variante="principal"
          onClick={onConfirmar}
          cargando={cargando}
          textoCargando={textoCargando}
        >
          {error ? textoReintentar : textoConfirmar}
        </Boton>
      </div>
    </dialog>
  );
}
