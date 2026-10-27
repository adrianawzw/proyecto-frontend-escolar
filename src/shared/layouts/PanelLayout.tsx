import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { Boton } from "../components/Boton";
import "./PanelLayout.css";

interface EnlacePanel {
  ruta: string;
  texto: string;
}

export interface GrupoNavegacion {
  titulo: string;
  enlaces: readonly EnlacePanel[];
}

interface PanelLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  nombreRol: string;
  tituloPanel: string;
  rutaInicio: string;
  grupos: readonly GrupoNavegacion[];
}

export function PanelLayout({
  children,
  onLogout,
  nombreRol,
  tituloPanel,
  rutaInicio,
  grupos,
}: PanelLayoutProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();
  const [gruposExpandidos, setGruposExpandidos] = useState<
    Record<string, boolean>
  >({});

  const abrirRef = useRef<HTMLButtonElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const identificador = useId();
  const navegacionId = `${identificador}-navegacion`;
  const contenidoId = `${identificador}-contenido`;

  const rutaPerteneceAlGrupo = (ruta: string) =>
    pathname === ruta || pathname.startsWith(`${ruta}/`);

  const tituloGrupoActivo = grupos.find((grupo) =>
    grupo.enlaces.some((enlace) => rutaPerteneceAlGrupo(enlace.ruta)),
  )?.titulo;

  useEffect(() => {
    if (!tituloGrupoActivo) return;

    setGruposExpandidos((actuales) =>
      actuales[tituloGrupoActivo]
        ? actuales
        : { ...actuales, [tituloGrupoActivo]: true },
    );
  }, [pathname, tituloGrupoActivo]);

  const titulo =
    grupos
      .flatMap((grupo) => grupo.enlaces)
      .find((enlace) => enlace.ruta === pathname)?.texto ?? "Inicio";

  useEffect(() => {
    if (!menuAbierto) return;

    const sidebar = sidebarRef.current;
    const workspace = workspaceRef.current;
    const botonAbrir = abrirRef.current;

    if (!sidebar || !workspace) return;

    const overflowAnterior = document.body.style.overflow;
    const inertAnterior = workspace.inert;

    document.body.style.overflow = "hidden";
    workspace.inert = true;
    cerrarRef.current?.focus();

    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        setMenuAbierto(false);
        return;
      }

      if (evento.key !== "Tab" || !sidebar) return;

      const elementos = Array.from(
        sidebar.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), [tabindex="0"]',
        ),
      ).filter((elemento) => elemento.getClientRects().length > 0);

      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (!primero || !ultimo) return;

      const focoFueraDelMenu = !sidebar.contains(document.activeElement);

      if (
        evento.shiftKey &&
        (document.activeElement === primero || focoFueraDelMenu)
      ) {
        evento.preventDefault();
        ultimo.focus();
      } else if (
        !evento.shiftKey &&
        (document.activeElement === ultimo || focoFueraDelMenu)
      ) {
        evento.preventDefault();
        primero.focus();
      }
    }

    const escritorio = window.matchMedia("(min-width: 1024px)");

    function manejarTamano(evento: MediaQueryListEvent) {
      if (evento.matches) setMenuAbierto(false);
    }

    document.addEventListener("keydown", manejarTeclado);
    escritorio.addEventListener("change", manejarTamano);

    return () => {
      document.body.style.overflow = overflowAnterior;
      workspace.inert = inertAnterior;

      document.removeEventListener("keydown", manejarTeclado);
      escritorio.removeEventListener("change", manejarTamano);

      if (botonAbrir && botonAbrir.getClientRects().length > 0) {
        botonAbrir.focus();
      }
    };
  }, [menuAbierto]);

  function alternarGrupo(tituloGrupo: string) {
    setGruposExpandidos((actuales) => ({
      ...actuales,
      [tituloGrupo]: !actuales[tituloGrupo],
    }));
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function cerrarSesion() {
    cerrarMenu();
    onLogout();
  }

  return (
    <div className="panel-layout">
      <a
        className="panel-layout__saltar"
        href={`#${contenidoId}`}
        hidden={menuAbierto}
      >
        Ir al contenido
      </a>

      {menuAbierto && (
        <div
          className="panel-layout__backdrop"
          aria-hidden="true"
          onClick={cerrarMenu}
        />
      )}

      <aside
        ref={sidebarRef}
        id={navegacionId}
        className={`panel-layout__sidebar ${
          menuAbierto ? "panel-layout__sidebar--open" : ""
        }`}
        aria-label={`Menú: ${nombreRol}`}
      >
        <div className="panel-layout__sidebar-top">
          <strong className="panel-layout__brand">Liceo Santo Toribio</strong>

          <button
            ref={cerrarRef}
            className="panel-layout__close-button"
            type="button"
            aria-label="Cerrar menú"
            onClick={cerrarMenu}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <nav
          className="panel-layout__nav"
          aria-label={`Navegación: ${nombreRol}`}
        >
          <NavLink to={rutaInicio} end onClick={cerrarMenu}>
            Inicio
          </NavLink>

          {grupos.map((grupo, indice) => {
            const expandido = Boolean(gruposExpandidos[grupo.titulo]);
            const grupoId = `${identificador}-grupo-${indice}`;

            return (
              <section className="panel-layout__grupo" key={grupo.titulo}>
                <h2 className="panel-layout__grupo-heading">
                  <button
                    className="panel-layout__grupo-toggle"
                    type="button"
                    aria-expanded={expandido}
                    aria-controls={grupoId}
                    onClick={() => alternarGrupo(grupo.titulo)}
                  >
                    <span>{grupo.titulo}</span>
                    <svg
                      className={`panel-layout__chevron ${
                        expandido ? "panel-layout__chevron--abierto" : ""
                      }`}
                      viewBox="0 0 20 20"
                      width="18"
                      height="18"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="m5 7.5 5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </h2>

                <div
                  id={grupoId}
                  className={`panel-layout__grupo-panel ${
                    expandido ? "panel-layout__grupo-panel--abierto" : ""
                  }`}
                  aria-hidden={!expandido}
                  inert={!expandido}
                >
                  <ul>
                    {grupo.enlaces.map((enlace) => (
                      <li key={enlace.ruta}>
                        <NavLink to={enlace.ruta} end onClick={cerrarMenu}>
                          {enlace.texto}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </nav>

        <div className="panel-layout__sidebar-account">
          <span>{nombreRol}</span>
          <Boton onClick={cerrarSesion}>Cerrar sesión</Boton>
        </div>
      </aside>

      <div ref={workspaceRef} className="panel-layout__workspace">
        <header className="panel-layout__header">
          <div className="panel-layout__heading">
            <button
              ref={abrirRef}
              className="panel-layout__open-button"
              type="button"
              aria-expanded={menuAbierto}
              aria-controls={navegacionId}
              onClick={() => setMenuAbierto(true)}
            >
              <span aria-hidden="true">☰</span>
              <span>Menú</span>
            </button>

            <div>
              <p className="panel-layout__contexto">{tituloPanel}</p>
              <strong>{titulo}</strong>
            </div>
          </div>

          <div className="panel-layout__desktop-account">
            <span>{nombreRol}</span>
            <Boton onClick={cerrarSesion}>Cerrar sesión</Boton>
          </div>
        </header>

        <main id={contenidoId} className="panel-layout__content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
