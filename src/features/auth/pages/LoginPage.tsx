import { useState, type FormEvent } from "react";
import { Boton } from "../../../shared/components/Boton";
import { CampoEntrada } from "../../../shared/components/CampoEntrada";
import { iniciarSesion } from "../auth.service";
import type { LoginResponse } from "../auth.types";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: (sesion: LoginResponse) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [tocados, setTocados] = useState({
    correo: false,
    contrasena: false,
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  function validarCorreo(valor: string) {
    if (!valor.trim()) return "Ingresa tu correo electrónico.";

    if (!/^[^\s@]+@[^\s@]+$/.test(valor.trim())) {
      return "Ingresa un correo electrónico válido.";
    }

    return "";
  }

  function validarContrasena(valor: string) {
    return valor.length === 0 ? "Ingresa tu contraseña." : "";
  }

  const errorCorreo = validarCorreo(correo);
  const errorContrasena = validarContrasena(contrasena);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (cargando) return;

    setTocados({ correo: true, contrasena: true });
    setError("");

    if (errorCorreo || errorContrasena) {
      const formulario = evento.currentTarget;
      const campoId = errorCorreo ? "correo" : "contrasena";

      formulario.querySelector<HTMLInputElement>(`#${campoId}`)?.focus();
      return;
    }

    const formulario = evento.currentTarget;

    if (!formulario.reportValidity()) return;

    setCargando(true);

    try {
      const sesion = await iniciarSesion({
        correo: correo.trim(),
        contrasena,
      });

      onLogin(sesion);
    } catch (fallo: unknown) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : "No se pudo iniciar sesión. Inténtalo nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-page__presentacion" aria-label="Bienvenida">
        <div className="login-page__marca">
          <span className="login-page__simbolo" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01" />
            </svg>
          </span>
          <span>Liceo Santo Toribio</span>
        </div>

        <div className="login-page__ilustracion" aria-hidden="true">
          <div className="login-page__ilustracion-halo" />
          <svg
            className="login-page__escuela"
            viewBox="0 0 520 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
          >
            <path d="M65 302H455" stroke="#DCE6FA" strokeWidth="2" strokeLinecap="round" />
            <path d="M104 298V151L260 75L416 151V298H104Z" fill="#F8FAFC" fillOpacity=".98" />
            <path d="M83 153L260 64L437 153" stroke="#F8FAFC" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M127 170H393V298H127V170Z" fill="#DCE6FA" />
            <path d="M150 191H199V237H150V191ZM221 191H270V237H221V191ZM293 191H342V237H293V191ZM365 191H386V237H365V191Z" fill="#204589" />
            <path d="M232 258H288V298H232V258Z" fill="#C2410C" />
            <circle cx="278" cy="278" r="2.5" fill="#FFF7ED" />
            <path d="M70 298H450" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
            <rect x="42" y="219" width="77" height="70" rx="8" fill="#FFFFFF" />
            <path d="M54 239L80 226L107 239V279H54V239Z" fill="#EFF6FF" stroke="#204589" strokeWidth="2" strokeLinejoin="round" />
            <path d="M66 249H95M66 258H95M66 267H88" stroke="#204589" strokeWidth="2" strokeLinecap="round" />
            <rect x="365" y="221" width="113" height="68" rx="9" fill="#FFF7ED" />
            <path d="M385 239H458M385 251H449M385 263H438" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
            <circle cx="407" cy="92" r="25" fill="#C2410C" fillOpacity=".95" />
            <path d="M397 92L405 100L419 84" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M78 103L86 88L94 103L109 111L94 119L86 134L78 119L63 111L78 103Z" fill="#DCE6FA" />
            <circle cx="448" cy="168" r="7" fill="#DCE6FA" />
          </svg>
          <div className="login-page__nota">
            <span className="login-page__nota-icono">✓</span>
            <span>
              <strong>Todo en un solo lugar</strong>
              <small>Gestión escolar sencilla y organizada</small>
            </span>
          </div>
        </div>

        <div className="login-page__mensaje">
          <p>Un espacio para nuestra comunidad educativa</p>
          <h2>Aprender, enseñar y crecer juntos.</h2>
        </div>

        <p className="login-page__pie">© 2026 Liceo Santo Toribio</p>
      </section>

      <section className="login-page__acceso" aria-labelledby="login-titulo">
        <div className="login-page__contenido">
          <p className="login-page__etiqueta">Sistema de gestión escolar</p>
          <h1 id="login-titulo">¡Bienvenido!</h1>
          <p className="login-page__descripcion">
            Ingresa tus credenciales para continuar.
          </p>

          <form
            className="login-page__formulario"
            onSubmit={manejarEnvio}
            noValidate
            aria-busy={cargando}
          >
            <CampoEntrada
              id="correo"
              name="correo"
              etiqueta="Correo electrónico"
              type="email"
              value={correo}
              onChange={(evento) => {
                setCorreo(evento.target.value);
                setError("");
              }}
              onBlur={() => {
                setTocados((actuales) => ({ ...actuales, correo: true }));
              }}
              error={tocados.correo ? errorCorreo : ""}
              placeholder="nombre@ejemplo.com"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              disabled={cargando}
              required
            />

            <div className="login-page__contrasena">
              <CampoEntrada
                id="contrasena"
                etiqueta="Contraseña"
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                disabled={cargando}
                required
              />

              <button
                type="button"
                className="login-page__ver-contrasena"
                onClick={() => setMostrarContrasena((actual) => !actual)}
                aria-label={
                  mostrarContrasena
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                aria-controls="contrasena"
                title={
                  mostrarContrasena
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                disabled={cargando}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {mostrarContrasena && <path d="m3 3 18 18" />}
                </svg>
              </button>
            </div>

            {error && (
              <p className="login-page__error" role="alert">
                {error}
              </p>
            )}

            <Boton
              type="submit"
              variante="principal"
              cargando={cargando}
              textoCargando="Ingresando..."
            >
              Iniciar sesión
            </Boton>
          </form>
        </div>
      </section>
    </main>
  );
}
