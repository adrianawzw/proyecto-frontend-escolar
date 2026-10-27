
from pathlib import Path

tsx_path = Path("src/shared/layouts/PanelLayout.tsx")
css_path = Path("src/shared/layouts/PanelLayout.css")
tsx = tsx_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")

marker = '''interface EnlacePanel {
  ruta: string;
  texto: string;
}
'''

component = r'''interface EnlacePanel {
  ruta: string;
  texto: string;
}

const iconoPorRuta: Record<string, string> = {
  "/admin": "dashboard",
  "/docente": "dashboard",
  "/admin/estudiantes": "users",
  "/admin/matriculas/nueva": "file-plus",
  "/admin/matriculas": "clipboard-list",
  "/admin/cursos": "book-open",
  "/admin/boletas": "chart-column",
  "/admin/docentes": "contact",
  "/admin/pagos-docentes": "wallet",
  "/admin/pensiones": "receipt",
  "/admin/movimientos-financieros": "arrows-left-right",
  "/admin/reportes-financieros": "chart-combined",
  "/docente/cursos": "library",
};

function IconoNavegacion({ nombre }: { nombre: string }) {
  let trazo: ReactNode;

  switch (nombre) {
    case "dashboard":
      trazo = <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>;
      break;
    case "users":
      trazo = <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>;
      break;
    case "file-plus":
      trazo = <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M12 18v-6M9 15h6" /></>;
      break;
    case "clipboard-list":
      trazo = <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5h6a1 1 0 0 0-1-1h-1a1 1 0 0 0-2 0h-1a1 1 0 0 0-1 1ZM9 10h6M9 14h6M9 18h3" /></>;
      break;
    case "book-open":
      trazo = <><path d="M12 7v14M3 18V5a1 1 0 0 1 1-1h4a4 4 0 0 1 4 4 4 4 0 0 1 4-4h4a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" /></>;
      break;
    case "chart-column":
      trazo = <><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></>;
      break;
    case "contact":
      trazo = <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2.5" /><path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9h3M15 13h3" /></>;
      break;
    case "wallet":
      trazo = <><path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6" /><path d="M20 12h-4a2 2 0 0 0 0 4h4z" /></>;
      break;
    case "receipt":
      trazo = <><path d="M4 3v18l3-2 3 2 2-2 3 2 2-2 3 2V3l-3 2-3-2-2 2-3-2-3 2z" /><path d="M8 9h8M8 13h8" /></>;
      break;
    case "arrows-left-right":
      trazo = <><path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M3 17h18" /></>;
      break;
    case "chart-combined":
      trazo = <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 4 5-7" /><path d="M7 18v-2M11 18v-5M15 18v-3M19 18v-6" /></>;
      break;
    case "library":
      trazo = <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8M8 11h8" /></>;
      break;
    default:
      trazo = <circle cx="12" cy="12" r="8" />;
  }

  return (
    <svg
      className="panel-layout__nav-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {trazo}
    </svg>
  );
}
'''

if "function IconoNavegacion(" not in tsx:
    if marker not in tsx:
        raise SystemExit("No se encontró EnlacePanel; no se modificó ningún archivo.")
    tsx = tsx.replace(marker, component, 1)

old_home = '''<NavLink to={rutaInicio} end onClick={cerrarMenu}>
            Inicio
          </NavLink>'''
new_home = '''<NavLink to={rutaInicio} end onClick={cerrarMenu}>
            <IconoNavegacion nombre={iconoPorRuta[rutaInicio] ?? "dashboard"} />
            <span>Inicio</span>
          </NavLink>'''
if old_home in tsx:
    tsx = tsx.replace(old_home, new_home, 1)
elif new_home not in tsx:
    raise SystemExit("No se encontró el enlace Inicio; no se modificó ningún archivo.")

old_link = '''<NavLink to={enlace.ruta} end onClick={cerrarMenu}>
                          {enlace.texto}
                        </NavLink>'''
new_link = '''<NavLink to={enlace.ruta} end onClick={cerrarMenu}>
                          <IconoNavegacion nombre={iconoPorRuta[enlace.ruta] ?? "dashboard"} />
                          <span>{enlace.texto}</span>
                        </NavLink>'''
if old_link in tsx:
    tsx = tsx.replace(old_link, new_link, 1)
elif new_link not in tsx:
    raise SystemExit("No se encontró el enlace de los grupos; no se modificó ningún archivo.")

css_marker = '''.panel-layout__nav a {
  display: flex;
  align-items: center;
  min-height: var(--altura-control);'''
css_replacement = '''.panel-layout__nav a {
  display: flex;
  align-items: center;
  gap: var(--espacio-3);
  min-height: var(--altura-control);'''
if css_marker in css:
    css = css.replace(css_marker, css_replacement, 1)
elif "gap: var(--espacio-3);" not in css[css.find(".panel-layout__nav a"):css.find(".panel-layout__nav a") + 250]:
    raise SystemExit("No se encontró la regla de enlaces del sidebar.")

if ".panel-layout__nav-icon" not in css:
    css += '''

/* Iconos lineales compartidos por todas las opciones de navegación. */
.panel-layout__nav-icon {
  display: block;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  color: currentColor;
}
'''

tsx_path.write_text(tsx, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")
print("Listo: PanelLayout.tsx y PanelLayout.css actualizados.")
