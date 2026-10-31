import { Boton } from "./Boton";
import "./TarjetaUsuario.css";

interface Props {
  nombreRol: string;
  correo: string;
  onLogout: () => void; //Callback
  className?: string;
}

export function TarjetaUsuario({
  nombreRol,
  correo,
  onLogout,
  className = "",
}: Props) {
  return (
    <div
      className={`tarjeta-usuario dpF aiC g10 bsBox wFit mxW100 pd8-10 br10 coBlanco bgAzulTrans ${className}`.trim()}
    >
      <div
        className="dpF aiC jcC flx0 sqr36 br50 coBlanco bgBlanco20"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          focusable="false"
        >
          <circle cx="12" cy="8" r="4.5" />
          <path d="M3.5 21a8.5 8.5 0 0 1 17 0z" />
        </svg>
      </div>

      <div className="dpF fdC g1 flx1 minW0 fs8 lh125">
        <strong className="coBlanco fw7">{nombreRol}</strong>
        <span className="coBlanco90 wsN owAny">{correo}</span>
      </div>

      <Boton onClick={onLogout}>Cerrar Sesión</Boton>
    </div>
  );
}