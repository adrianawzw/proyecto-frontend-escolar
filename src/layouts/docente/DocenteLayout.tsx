import type { ReactNode } from "react";
import {
  PanelLayout,
  type GrupoNavegacion,
} from "../../shared/layouts/PanelLayout";

interface DocenteLayoutProps {
  children: ReactNode;
  correo: string;
  onLogout: () => void;
}

const grupos: readonly GrupoNavegacion[] = [
  {
    titulo: "Gestión académica",
    enlaces: [
      {
        ruta: "/docente/cursos",
        texto: "Mis cursos",
      },
    ],
  },
];

export function DocenteLayout({ children, onLogout, correo }: DocenteLayoutProps) {
  return (
    <PanelLayout
      nombreRol="Docente"
      tituloPanel="Panel del docente"
      correo={correo}
      rutaInicio="/docente"
      grupos={grupos}
      onLogout={onLogout}
    >
      {children}
    </PanelLayout>
  );
}
