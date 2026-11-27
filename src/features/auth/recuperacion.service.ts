import { API_URL, fetchApi } from "../../shared/api/api";

const BASE = `${API_URL}/api/v1/auth/recuperacion`;

async function leerError(respuesta: Response, porDefecto: string): Promise<never> {
  let mensaje = porDefecto;

  try {
    const datos: unknown = await respuesta.json();
    if (
      typeof datos === "object" &&
      datos !== null &&
      "message" in datos &&
      typeof datos.message === "string" &&
      datos.message.trim() !== ""
    ) {
      mensaje = datos.message;
    }
  } catch {
    // Respuesta sin JSON válido; se conserva el mensaje por defecto.
  }

  throw new Error(mensaje);
}

async function post<T>(ruta: string, cuerpo: unknown, porDefecto: string): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetchApi(`${BASE}${ruta}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el sistema. Revisa tu conexión e intenta nuevamente.",
    );
  }

  if (!respuesta.ok) {
    await leerError(respuesta, porDefecto);
  }

  return (await respuesta.json()) as T;
}

/** Envía un código OTP por SMS para la cuenta y celular indicados. */
export function enviarCodigoRecuperacion(correo: string, celular: string) {
  return post<{ message: string }>(
    "/enviar-codigo",
    {
      correo: correo.trim(),
      celular: celular.replace(/\s/g, ""),
    },
    "No se pudo enviar el código. Inténtalo nuevamente.",
  );
}

/** Verifica el código OTP y devuelve un token temporal de un solo uso. */
export function verificarCodigoRecuperacion(celular: string, codigo: string) {
  return post<{ token: string; expiraEnSegundos: number }>(
    "/verificar-codigo",
    {
      celular: celular.replace(/\s/g, ""),
      codigo,
    },
    "Código inválido o expirado.",
  );
}

/** Actualiza la contraseña utilizando el token temporal de verificación. */
export function restablecerContrasena(token: string, nuevaContrasena: string) {
  return post<{ message: string }>(
    "/restablecer",
    { token, nuevaContrasena },
    "No se pudo restablecer la contraseña.",
  );
}
