import { Link } from "react-router";
import "./NotFoundPage.css";

interface NotFoundPageProps {
  rutaInicio: string;
}

export function NotFoundPage({ rutaInicio }: NotFoundPageProps) {
  return (
    <section className="no-encontrada" aria-labelledby="no-encontrada-titulo">
      <p className="no-encontrada__codigo" aria-hidden="true">
        404
      </p>

      <div className="no-encontrada__texto">
        <h1 id="no-encontrada-titulo">Esta página no existe</h1>
        <p>
          La dirección que ingresaste es incorrecta, o la página fue movida o
          eliminada.
        </p>
        <p>
          Si el problema continúa, comunícate con el administrador del sistema.
        </p>

        <div className="no-encontrada__acciones">
          <Link className="boton boton--principal" to={rutaInicio}>
            Volver al inicio
          </Link>
          <button
            type="button"
            className="boton boton--secundario"
            onClick={() => window.history.back()}
          >
            Regresar
          </button>
        </div>
      </div>
    </section>
  );
}
