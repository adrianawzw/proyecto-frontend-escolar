import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Boton } from "../../../shared/components/Boton";
import { CampoEntrada } from "../../../shared/components/CampoEntrada";
import {
  enviarCodigoRecuperacion,
  restablecerContrasena,
  verificarCodigoRecuperacion,
} from "../recuperacion.service";
import "./RecuperarContrasenaPage.css";

type Paso = "correo" | "celular" | "codigo" | "nuevaContrasena" | "verificado";

const SEGUNDOS_REENVIO = 60;

function validarCorreo(valor: string) {
  if (!valor.trim()) return "Ingresa tu correo electrónico.";

  if (!/^[^\s@]+@[^\s@]+$/.test(valor.trim())) {
    return "Ingresa un correo electrónico válido.";
  }

  return "";
}

function validarCelular(valor: string) {
  const digitos = valor.replace(/\s/g, "");

  if (!digitos) return "Ingresa tu número de celular.";
  if (!/^9\d{8}$/.test(digitos)) {
    return "Ingresa un celular válido de 9 dígitos que empiece con 9.";
  }

  return "";
}

function validarCodigo(valor: string) {
  if (!valor) return "Ingresa el código que te enviamos por SMS.";
  if (!/^\d{6}$/.test(valor)) return "El código debe tener 6 dígitos.";

  return "";
}

function validarNuevaContrasena(valor: string) {
  if (!valor) return "Ingresa una nueva contraseña.";
  if (valor.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (valor.length > 72) return "La contraseña no puede superar los 72 caracteres.";

  return "";
}

function validarConfirmacion(nueva: string, confirmacion: string) {
  if (!confirmacion) return "Confirma tu nueva contraseña.";
  if (nueva !== confirmacion) return "Las contraseñas no coinciden.";

  return "";
}

function ocultarCelular(valor: string) {
  const digitos = valor.replace(/\s/g, "");
  return `+51 ${digitos.slice(0, 1)}** *** ${digitos.slice(-3)}`;
}

function extraerMensajeError(fallo: unknown, porDefecto: string) {
  return fallo instanceof Error && fallo.message ? fallo.message : porDefecto;
}

export function RecuperarContrasenaPage() {
  const [paso, setPaso] = useState<Paso>("correo");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tokenRestablecimiento, setTokenRestablecimiento] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [segundos, setSegundos] = useState(0);

  const errorCorreo = validarCorreo(correo);
  const errorCelular = validarCelular(celular);
  const errorCodigo = validarCodigo(codigo);
  const errorNueva = validarNuevaContrasena(nuevaContrasena);
  const errorConfirmacion = validarConfirmacion(nuevaContrasena, confirmarContrasena);

  useEffect(() => {
    if (paso !== "codigo" || segundos <= 0) return;

    const temporizador = window.setTimeout(() => {
      setSegundos((actual) => actual - 1);
    }, 1000);

    return () => window.clearTimeout(temporizador);
  }, [paso, segundos]);

  function continuarConCorreo(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTocado(true);
    setErrorServidor("");

    if (errorCorreo || cargando) return;

    setTocado(false);
    setPaso("celular");
  }

  async function enviarCodigo(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTocado(true);
    setErrorServidor("");

    if (errorCelular || cargando) return;

    setCargando(true);
    try {
      await enviarCodigoRecuperacion(correo, celular);
      setTocado(false);
      setCodigo("");
      setSegundos(SEGUNDOS_REENVIO);
      setPaso("codigo");
    } catch (fallo: unknown) {
      setErrorServidor(
        extraerMensajeError(fallo, "No se pudo enviar el código. Inténtalo nuevamente."),
      );
    } finally {
      setCargando(false);
    }
  }

  async function verificarCodigo(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTocado(true);
    setErrorServidor("");

    if (errorCodigo || cargando) return;

    setCargando(true);
    try {
      const respuesta = await verificarCodigoRecuperacion(celular, codigo);
      setTokenRestablecimiento(respuesta.token);
      setTocado(false);
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setMostrarNueva(false);
      setMostrarConfirmacion(false);
      setPaso("nuevaContrasena");
    } catch (fallo: unknown) {
      setErrorServidor(extraerMensajeError(fallo, "Código inválido o expirado."));
    } finally {
      setCargando(false);
    }
  }

  async function guardarNuevaContrasena(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTocado(true);
    setErrorServidor("");

    if (errorNueva || errorConfirmacion || cargando) return;

    setCargando(true);
    try {
      await restablecerContrasena(tokenRestablecimiento, nuevaContrasena);
      setTokenRestablecimiento("");
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setMostrarNueva(false);
      setMostrarConfirmacion(false);
      setTocado(false);
      setPaso("verificado");
    } catch (fallo: unknown) {
      setErrorServidor(
        extraerMensajeError(fallo, "No se pudo restablecer la contraseña."),
      );
    } finally {
      setCargando(false);
    }
  }

  async function reenviarCodigo() {
    if (segundos > 0 || cargando) return;

    setErrorServidor("");
    setCargando(true);
    try {
      await enviarCodigoRecuperacion(correo, celular);
      setCodigo("");
      setTocado(false);
      setSegundos(SEGUNDOS_REENVIO);
    } catch (fallo: unknown) {
      setErrorServidor(
        extraerMensajeError(fallo, "No se pudo reenviar el código. Inténtalo más tarde."),
      );
    } finally {
      setCargando(false);
    }
  }

  function cambiarCorreo() {
    setPaso("correo");
    setTocado(false);
    setErrorServidor("");
  }

  function cambiarNumero() {
    setPaso("celular");
    setCodigo("");
    setTocado(false);
    setErrorServidor("");
    setSegundos(0);
  }

  return (
    <main className="recuperacion-page">
      <section className="recuperacion-page__tarjeta" aria-labelledby="recuperacion-titulo">
        <div className="recuperacion-page__marca">
          <span className="recuperacion-page__simbolo" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
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

        {paso === "correo" && (
          <>
            <h1 id="recuperacion-titulo">Recupera tu contraseña</h1>
            <p className="recuperacion-page__descripcion">
              Ingresa el correo electrónico de tu cuenta para continuar con la
              verificación.
            </p>

            <IlustracionCelular />

            <form className="recuperacion-page__formulario" onSubmit={continuarConCorreo} noValidate>
              <CampoEntrada
                id="correo-recuperacion"
                etiqueta="Correo electrónico"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="nombre@ejemplo.com"
                value={correo}
                onChange={(evento) => {
                  setCorreo(evento.target.value);
                  setErrorServidor("");
                }}
                onBlur={() => setTocado(true)}
                error={tocado ? errorCorreo : ""}
                disabled={cargando}
                autoFocus
                required
              />

              <Boton type="submit" variante="principal">
                Continuar
              </Boton>
            </form>
          </>
        )}

        {paso === "celular" && (
          <>
            <h1 id="recuperacion-titulo">Ingresa tu celular</h1>
            <p className="recuperacion-page__descripcion">
              Ingresa el número de celular asociado a{" "}
              <strong>{correo.trim()}</strong> y te enviaremos un código por SMS.
            </p>

            <IlustracionCelular />

            <form className="recuperacion-page__formulario" onSubmit={enviarCodigo} noValidate>
              <div className="recuperacion-page__telefono">
                <span className="recuperacion-page__prefijo" aria-hidden="true">
                  +51
                </span>
                <CampoEntrada
                  id="celular"
                  etiqueta="Número de celular"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-nacional"
                  placeholder="Ingrese numero de celular"
                  maxLength={11}
                  value={celular}
                  onChange={(evento) => {
                    setCelular(evento.target.value.replace(/[^\d\s]/g, ""));
                    setErrorServidor("");
                  }}
                  onBlur={() => setTocado(true)}
                  error={tocado ? errorCelular : ""}
                  disabled={cargando}
                  autoFocus
                  required
                />
              </div>

              {errorServidor && (
                <p className="recuperacion-page__error" role="alert">
                  {errorServidor}
                </p>
              )}

              <Boton
                type="submit"
                variante="principal"
                cargando={cargando}
                textoCargando="Enviando código..."
              >
                Enviar código
              </Boton>
            </form>

            <div className="recuperacion-page__acciones">
              <button
                type="button"
                className="recuperacion-page__enlace"
                onClick={cambiarCorreo}
                disabled={cargando}
              >
                Cambiar correo
              </button>
            </div>
          </>
        )}

        {paso === "codigo" && (
          <>
            <h1 id="recuperacion-titulo">Introduce el código</h1>
            <p className="recuperacion-page__descripcion">
              Te enviamos un código de 6 dígitos por SMS al{" "}
              <strong>{ocultarCelular(celular)}</strong>.
            </p>

            <IlustracionCelular />

            <form className="recuperacion-page__formulario" onSubmit={verificarCodigo} noValidate>
              <CampoEntrada
                id="codigo"
                etiqueta="Código de verificación"
                className="recuperacion-page__codigo"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                maxLength={6}
                value={codigo}
                onChange={(evento) => {
                  setCodigo(evento.target.value.replace(/\D/g, ""));
                  setErrorServidor("");
                }}
                onBlur={() => setTocado(true)}
                error={tocado ? errorCodigo : ""}
                disabled={cargando}
                autoFocus
                required
              />

              {errorServidor && (
                <p className="recuperacion-page__error" role="alert">
                  {errorServidor}
                </p>
              )}

              <Boton
                type="submit"
                variante="principal"
                cargando={cargando}
                textoCargando="Verificando..."
              >
                Verificar código
              </Boton>
            </form>

            <div className="recuperacion-page__acciones">
              <p aria-live="polite">
                {segundos > 0 ? (
                  <>¿No te llegó? Reenviar en {segundos} s</>
                ) : (
                  <>
                    ¿No te llegó?{" "}
                    <button
                      type="button"
                      className="recuperacion-page__enlace"
                      onClick={reenviarCodigo}
                      disabled={cargando}
                    >
                      Reenviar código
                    </button>
                  </>
                )}
              </p>
              <button
                type="button"
                className="recuperacion-page__enlace"
                onClick={cambiarNumero}
                disabled={cargando}
              >
                Cambiar número
              </button>
            </div>
          </>
        )}

        {paso === "nuevaContrasena" && (
          <>
            <h1 id="recuperacion-titulo">Nueva contraseña</h1>
            <p className="recuperacion-page__descripcion">
              Crea una nueva contraseña segura para <strong>{correo.trim()}</strong>.
            </p>

            <form
              className="recuperacion-page__formulario recuperacion-page__formulario--espaciado"
              onSubmit={guardarNuevaContrasena}
              noValidate
            >
              <div className="recuperacion-page__contrasena">
                <CampoEntrada
                  id="nueva-contrasena"
                  etiqueta="Nueva contraseña"
                  type={mostrarNueva ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={nuevaContrasena}
                  onChange={(evento) => {
                    setNuevaContrasena(evento.target.value);
                    setErrorServidor("");
                  }}
                  onBlur={() => setTocado(true)}
                  error={tocado ? errorNueva : ""}
                  disabled={cargando}
                  autoFocus
                  required
                />

                <button
                  type="button"
                  className="recuperacion-page__ver-contrasena"
                  onClick={() => setMostrarNueva((actual) => !actual)}
                  aria-label={mostrarNueva ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-controls="nueva-contrasena"
                  title={mostrarNueva ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={cargando}
                >
                  <IconoOjo oculto={mostrarNueva} />
                </button>
              </div>

              <div className="recuperacion-page__contrasena">
                <CampoEntrada
                  id="confirmar-contrasena"
                  etiqueta="Confirmar contraseña"
                  type={mostrarConfirmacion ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repite la nueva contraseña"
                  value={confirmarContrasena}
                  onChange={(evento) => {
                    setConfirmarContrasena(evento.target.value);
                    setErrorServidor("");
                  }}
                  onBlur={() => setTocado(true)}
                  error={tocado ? errorConfirmacion : ""}
                  disabled={cargando}
                  required
                />

                <button
                  type="button"
                  className="recuperacion-page__ver-contrasena"
                  onClick={() => setMostrarConfirmacion((actual) => !actual)}
                  aria-label={
                    mostrarConfirmacion
                      ? "Ocultar confirmación de contraseña"
                      : "Mostrar confirmación de contraseña"
                  }
                  aria-controls="confirmar-contrasena"
                  title={
                    mostrarConfirmacion ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  disabled={cargando}
                >
                  <IconoOjo oculto={mostrarConfirmacion} />
                </button>
              </div>

              {errorServidor && (
                <p className="recuperacion-page__error" role="alert">
                  {errorServidor}
                </p>
              )}

              <Boton
                type="submit"
                variante="principal"
                cargando={cargando}
                textoCargando="Guardando..."
              >
                Guardar nueva contraseña
              </Boton>
            </form>
          </>
        )}

        {paso === "verificado" && (
          <>
            <span className="recuperacion-page__exito" aria-hidden="true">
              ✓
            </span>
            <h1 id="recuperacion-titulo">Contraseña actualizada</h1>
            <p className="recuperacion-page__descripcion" role="status">
              Tu contraseña para <strong>{correo.trim()}</strong> se actualizó
              correctamente. Ya puedes iniciar sesión.
            </p>

            <Link
              className="boton boton--principal recuperacion-page__boton-enlace"
              to="/login"
            >
              Ir a iniciar sesión
            </Link>
          </>
        )}

        {paso !== "verificado" && (
          <Link className="recuperacion-page__volver" to="/login">
            ← Volver a iniciar sesión
          </Link>
        )}
      </section>
    </main>
  );
}

function IconoOjo({ oculto }: { oculto: boolean }) {
  return (
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
      {oculto && <path d="m3 3 18 18" />}
    </svg>
  );
}

function IlustracionCelular() {
  return (
    <svg
      className="recuperacion-page__ilustracion"
      viewBox="0 0 240 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="78" y="14" width="66" height="122" rx="12" fill="#fff" stroke="#204589" strokeWidth="3" />
      <path d="M102 26h18" stroke="#204589" strokeWidth="3" strokeLinecap="round" />
      <rect x="88" y="38" width="46" height="78" rx="4" fill="#EFF6FF" />
      <circle cx="111" cy="125" r="4" fill="#204589" />
      <path d="M96 56h30M96 66h22M96 76h26" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      <rect x="132" y="30" width="78" height="44" rx="10" fill="#fff" stroke="#C2410C" strokeWidth="3" />
      <path d="M146 74l-6 12 16-12" fill="#fff" stroke="#C2410C" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="152" cy="52" r="4" fill="#C2410C" />
      <circle cx="166" cy="52" r="4" fill="#C2410C" />
      <circle cx="180" cy="52" r="4" fill="#C2410C" />
      <circle cx="194" cy="52" r="4" fill="#C2410C" />
      <rect x="30" y="86" width="52" height="38" rx="8" fill="#fff" stroke="#204589" strokeWidth="3" />
      <rect x="44" y="102" width="24" height="16" rx="3" fill="#DCE6FA" stroke="#204589" strokeWidth="2.5" />
      <path d="M49 102v-5a7 7 0 0 1 14 0v5" stroke="#204589" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
