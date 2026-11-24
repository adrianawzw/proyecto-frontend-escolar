import { useEffect, useRef } from "react";
import { PdfCanvasViewer } from "./PdfCanvasViewer";
import "./PdfPreviewModal.css";

interface PdfPreviewModalProps {
  url: string;
  titulo: string;
  aviso?: string;
  onCerrar: () => void;
  onDescargar?: () => void;
}

/**
 * Muestra una vista previa del PDF en un modal.
 * La descarga completa la controla el módulo que lo utiliza.
 */
export function PdfPreviewModal({
  url,
  titulo,
  aviso,
  onCerrar,
  onDescargar,
}: PdfPreviewModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.showModal();

    return () => {
      if (modal.open) modal.close();
    };
  }, []);

  return (
    <dialog
      ref={modalRef}
      className="pdf-preview-modal"
      aria-labelledby="pdf-preview-titulo"
      onCancel={(evento) => {
        evento.preventDefault();
        onCerrar();
      }}
      onClick={(evento) => {
        // Cierra al hacer clic en el fondo (backdrop), no dentro del contenido.
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <div className="pdf-preview-modal__contenido">
        <header className="pdf-preview-modal__encabezado">
          <div className="pdf-preview-modal__titulos">
            {aviso && <p className="pdf-preview-modal__aviso">{aviso}</p>}

            <h2 id="pdf-preview-titulo">{titulo}</h2>
          </div>

          <button type="button" className="boton" onClick={onCerrar}>
            Cerrar
          </button>
        </header>

        <div className="pdf-preview-modal__visor">
          <PdfCanvasViewer url={url} titulo={titulo} />
        </div>

        {onDescargar && (
          <footer className="pdf-preview-modal__pie">
            <button
              type="button"
              className="boton boton--principal"
              onClick={onDescargar}
            >
              Descargar PDF completo
            </button>
          </footer>
        )}
      </div>
    </dialog>
  );
}
