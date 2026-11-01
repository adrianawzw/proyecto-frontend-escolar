import "./Alert.css";

interface OpcionesConfirm {
  msg: string;
  titulo?: string;
  btnTxt?: string;
  cancelTxt?: string;
  resolve?: () => void; // al pulsar el botón principal
  reject?: () => void; // al cancelar, Escape o clic en el fondo
}

function crear<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  clase: string,
  texto = "",
) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

function confirm({
  msg,
  titulo = "Confirmar",
  btnTxt = "Aceptar",
  cancelTxt = "Cancelar",
  resolve,
  reject,
}: OpcionesConfirm) {
  const dialogo = crear(
    "dialog",
    "alerta bsBox wAlerta pd20 bdN br14 coTexto bgBlanco bxsh-alert",
  );
  dialogo.setAttribute("aria-label", titulo);

  const botonCancelar = crear("button", "alerta__btn alerta__btn--sec", cancelTxt);
  const botonAceptar = crear("button", "alerta__btn", btnTxt);
  botonCancelar.type = "button";
  botonAceptar.type = "button";

  const acciones = crear("div", "alerta__acciones dpF jcFE g10");
  acciones.append(botonCancelar, botonAceptar);

  dialogo.append(
    crear("h2", "m0-8 fs11", titulo),
    crear("div", "m0-20 lh14", msg),
    acciones,
  );

  let confirmado = false;

  botonCancelar.onclick = () => dialogo.close();
  botonAceptar.onclick = () => {
    confirmado = true;
    dialogo.close();
  };
  // clic en el fondo oscuro
  dialogo.onclick = (evento) => {
    if (evento.target === dialogo) dialogo.close();
  };
  // se dispara al cerrar por cualquier vía (botón, Escape, fondo)
  dialogo.onclose = () => {
    dialogo.remove();
    if (confirmado) resolve?.();
    else reject?.();
  };

  document.body.appendChild(dialogo);
  dialogo.showModal();
}

export const Alert = { confirm };