import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { Boton } from "../components/Boton";
import "./PanelLayout.css";
import { TarjetaUsuario } from "../components/TarjetaUsuario";
import { Alert } from "../components/Alert";

interface EnlacePanel {
  ruta: string;
  texto: string;
}

export interface GrupoNavegacion {
  titulo: string;
  enlaces: readonly EnlacePanel[];
}

function IconoMenu({ nombre }: { nombre: string }) {
  const props = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: false as const,
  };

  const iconos: Record<string, ReactNode> = {
    Inicio: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    Estudiantes: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
        <path d="M16 5.5a3.5 3.5 0 0 1 0 6.5M18 14a5 5 0 0 1 3 4.5V20" />
      </>
    ),
    "Nueva matrícula": (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M12 12v6M9 15h6" />
      </>
    ),
    "Matrículas registradas": (
      <>
        <rect x="4" y="4" width="16" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M8 11h8M8 15h5" />
      </>
    ),
    "Cursos y competencias": (
      <>
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M4 4.5v17M8 6h8M8 10h8" />
      </>
    ),
    "Boletas de notas": (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 6-7" />
      </>
    ),
    Docentes: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0M18 4l2 2-2 2" />
      </>
    ),
    "Pagos a docentes": (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
    Pensiones: (
      <>
        <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </>
    ),
    "Movimientos adicionales": (
      <>
        <path d="M7 7h14l-4-4M17 17H3l4 4" />
        <path d="M21 7v4M3 17v-4" />
      </>
    ),
    "Reportes financieros": (
      <>
        <path d="M3 3v18h18" />
        <rect x="7" y="12" width="3" height="5" rx="0.5" />
        <rect x="13" y="8" width="3" height="9" rx="0.5" />
        <rect x="19" y="5" width="2" height="12" rx="0.5" />
      </>
    ),
    "Mis cursos": (
      <>
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M4 4.5v17M8 7h8M8 11h8" />
      </>
    ),
  };

  return (
    <svg {...props}>{iconos[nombre] ?? <circle cx="12" cy="12" r="8" />}</svg>
  );
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
    Alert.confirm({
      msg: "¿Seguro que deseas cerrar sesión?",
      btnTxt: "CERRAR SESIÓN",
      resolve: onLogout,
    });
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
            <IconoMenu nombre="Inicio" />
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
                          <IconoMenu nombre={enlace.texto} />
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

          <TarjetaUsuario
            nombreRol={nombreRol}
            correo="administrador@colegio.com"
            onLogout={cerrarSesion}
          />
        </header>

        <main id={contenidoId} className="panel-layout__content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
