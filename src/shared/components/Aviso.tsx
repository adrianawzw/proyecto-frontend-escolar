import type { ReactNode } from "react";
import "./Aviso.css";

interface AvisoProps {
  tipo?: "exito" | "error" | "info";
  children: ReactNode;
  /** Si se pasa, aparece un botón para cerrar el aviso. */
  onCerrar?: () => void;
}

const iconos = {
  exito: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
};

export function Aviso({ tipo = "info", children, onCerrar }: AvisoProps) {
  return (
    <div
      className={`aviso aviso--${tipo}`}
      role={tipo === "error" ? "alert" : "status"}
    >
      <svg
        className="aviso__icono"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {iconos[tipo]}
      </svg>

      <p className="aviso__texto">{children}</p>

      {onCerrar && (
        <button
          type="button"
          className="aviso__cerrar"
          aria-label="Cerrar aviso"
          onClick={onCerrar}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
