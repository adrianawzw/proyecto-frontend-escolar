import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfCanvasViewerProps {
  url: string;
  titulo: string;
}

type Estado = "cargando" | "listo" | "error";

/**
 * Renderiza un PDF en canvas con pdf.js.
 * Evita las costuras blancas que el visor nativo del navegador
 * (iframe) puede dibujar entre mosaicos de renderizado.
 */
export function PdfCanvasViewer({ url, titulo }: PdfCanvasViewerProps) {
  const paginasRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("cargando");

  useEffect(() => {
    const contenedor = paginasRef.current;
    if (!contenedor) return;

    let cancelado = false;
    const tarea = pdfjs.getDocument({ url });

    setEstado("cargando");
    contenedor.replaceChildren();

    (async () => {
      try {
        const pdf = await tarea.promise;

        for (let numero = 1; numero <= pdf.numPages; numero++) {
          const pagina = await pdf.getPage(numero);
          if (cancelado) return;

          // Escala entera para el canvas: evita costuras por redondeo.
          const anchoCss = contenedor.clientWidth;
          const escalaCss = anchoCss / pagina.getViewport({ scale: 1 }).width;
          const dpr = Math.ceil(window.devicePixelRatio || 1);
          const viewport = pagina.getViewport({ scale: escalaCss * dpr });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "pdf-canvas-viewer__pagina";
          canvas.setAttribute("aria-label", `${titulo}, página ${numero}`);
          contenedor.appendChild(canvas);

          const contexto = canvas.getContext("2d");
          if (!contexto) throw new Error("Canvas no disponible");

          await pagina.render({ canvas, canvasContext: contexto, viewport })
            .promise;

          if (numero === 1 && !cancelado) setEstado("listo");
        }
      } catch (error) {
        if (!cancelado) {
          console.error("No se pudo mostrar la vista previa del PDF", error);
          setEstado("error");
        }
      }
    })();

    return () => {
      cancelado = true;
      void tarea.destroy();
    };
  }, [url, titulo]);

  return (
    <div className="pdf-canvas-viewer" role="document">
      {estado === "cargando" && (
        <p className="pdf-canvas-viewer__mensaje">Cargando vista previa…</p>
      )}
      {estado === "error" && (
        <p className="pdf-canvas-viewer__mensaje">
          No se pudo mostrar la vista previa. Puedes descargar el PDF completo.
        </p>
      )}
      <div ref={paginasRef} className="pdf-canvas-viewer__paginas" />
    </div>
  );
}
