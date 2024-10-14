let contenedor = document.getElementById("container");

//si lo generamos asi despues podemos actualizar segun el indice del jugador en turno
let elementosHTML = [
  {
    nombre: document.getElementById("J1Nombre"),
    numCartas: document.getElementById("J1NumCartas"),
    puntos: document.getElementById("J1Puntos"),
    saltoTurno: document.getElementById("J1saltoTurno"),
    desactivacion: document.getElementById("J1Desactivacion"),
  },
  {
    nombre: document.getElementById("J2Nombre"),
    numCartas: document.getElementById("J2NumCartas"),
    puntos: document.getElementById("J2Puntos"),
    saltoTurno: document.getElementById("J2saltoTurno"),
    desactivacion: document.getElementById("J2Desactivacion"),
  },
  {
    nombre: document.getElementById("J3Nombre"),
    numCartas: document.getElementById("J3NumCartas"),
    puntos: document.getElementById("J3Puntos"),
    saltoTurno: document.getElementById("J3saltoTurno"),
    desactivacion: document.getElementById("J3Desactivacion"),
  },
];

let imgCartaRobada = document.getElementById("imgCartaRobada");

let btnRobar = document.getElementById("btnRobar");
let btnPasar = document.getElementById("btnPasar");
btnPasar.style.opacity = 0.5;
btnPasar.disabled = true;

btnRobar.addEventListener("click", jugar);
btnPasar.addEventListener("click", pasarTurnoConBoton);

let nombres = [J1Nombre, J2Nombre, J3Nombre];
let numCartas = [J1NumCartas, J2NumCartas, J3NumCartas];
let puntos = [J1Puntos, J2Puntos, J3Puntos];
let saltoTurno = [J1saltoTurno, J2saltoTurno, J3saltoTurno];
let desactivacion = [J1Desactivacion, J2Desactivacion, J3Desactivacion];

function CambiarImagrenCarta(carta) {
  let tipoCarta = carta.tipo;
  if (tipoCarta == "Puntos") {
    imgCartaRobada.src =
      "img/card/robot_" +
      String(Math.floor(Math.random() * 20) + 1).padStart(2, "0") +
      ".png";
  } else if (tipoCarta == "Bomba") {
    imgCartaRobada.src = "img/bomba/bomba.png";
  } else if (tipoCarta == "Desactivación") {
    imgCartaRobada.src = "img/herramienta/herramienta.png";
  } else if (tipoCarta == "SaltarTurno") {
    imgCartaRobada.src = "img/pasarTurno/pasarTurno.png";
  }
}

class Jugador {
  constructor(nombre, eliminado, turno) {
    this.nombre = nombre;
    this.cartasEnLaMano = [];
    this.eliminado = Boolean(eliminado);
    this.turno = Boolean(turno);
  }
  saberCartasTotales() {
    //Coger una carta del mazo
    let contador = 0;

    for (let i = 0; i < this.cartasEnLaMano.length; i++) {
      contador++;
    }

    return contador;
  }
  saberCartasDeCadaTipo() {
    //SEPARAR EN DOS FUNCIONES

    let desactivaciones = 0;
    let saltarTurno = 0;
    for (let i = 0; i < this.cartasEnLaMano.length; i++) {
      if (this.cartasEnLaMano[i].tipo == "Desactivación") {
        desactivaciones++;
      } else if (this.cartasEnLaMano[i].tipo == "SaltarTurno") {
        saltarTurno++;
      }
    }
    return [desactivaciones, saltarTurno];
  }
  cartasSaltarTurno() {
    let saltarTurno = 0;
    for (let i = 0; i < this.cartasEnLaMano.length; i++) {
      if (this.cartasEnLaMano[i].tipo == "SaltarTurno") {
        saltarTurno++;
      }
    }
    return saltarTurno;
  }

  cartasBomba() {
    let bomba = 0;
    for (let i = 0; i < this.cartasEnLaMano.length; i++) {
      if (this.cartasEnLaMano[i].tipo == "Bomba") {
        bomba++;
      }
    }
    return bomba;
  }

  cartasDesactivacion() {
    let desactivaciones = 0;
    for (let i = 0; i < this.cartasEnLaMano.length; i++) {
      if (this.cartasEnLaMano[i].tipo == "Desactivación") {
        desactivaciones++;
      }
    }
    return desactivaciones;
  }
/**
 * busca la puntuación de las cartas tipo punto del jugador y las suma
 * @returns {number}
 */
  saberPuntuacion() {
    let puntosiniciales = 0;
    let puntosTotales = 0;
    for (let i = 0; i < this.cartasEnLaMano.length; i++) {
      if (this.cartasEnLaMano[i].tipo == "Puntos") {
        puntosTotales = puntosiniciales += this.cartasEnLaMano[i].puntos;
      }
    }
    return puntosTotales;
  }
  /**
   * Hace varias cosas, comprueba si no quedan mas cartas y si no, muestra la imagen de deck
   * y llama al metodo ganar por puntos
   * 
   * si hay mas cartas las mete en la deck la borra de ahi y la introduce en la mano del jugador
   * 
   * si roba la carta de bomba usara el metodo desactivarSiEsPosible
   * 
   * @param {*} carta 
   * @returns 
   */
  robar(carta) {
    if (cartasMezcladas.length == 0) {
      console.log("No hay más cartas para robar");
      imgCartaRobada.src = "img/deck/deck.png";
      hayGanadorPorPuntos();
      return;
    }
    this.cartasEnLaMano.push(carta);
    CambiarImagrenCarta(carta);
    cartasMezcladas.splice(0, 1);
  
    if (carta.tipo == "Bomba") {
      desactivarSiEsPosible();
    } else {

      if (this.cartasSaltarTurno() > 0) {
        btnPasar.style.opacity = 1;
        btnPasar.disabled = false;
      } else {
        btnPasar.style.opacity = 0.5;
        btnPasar.disabled = true;
      }
    }
  }
}

const TipoCarta = {
  BOMBA: "Bomba",
  DESACTIVACION: "Desactivación",
  SALTAR_TURNO: "SaltarTurno",
  PUNTOS: "Puntos",
};

// Clase Carta
class Carta {
  constructor(tipo, puntos, src) {
    this.tipo = tipo;
    this.puntos = puntos;
    this.src = src;
  }
  eliminarCarta() {
    //buscamos la carta y la eliminamos
    for (let i = 0; i < this.jugador.cartasEnLaMano.length; i++) {
      if (this.jugador.cartasEnLaMano[i].tipo == this.rol) {
        this.jugador.cartasEnLaMano.splice(i, 1);
      }
    }
  }
}

class Mazo {
  constructor() {
    this.arrayCartas = [];
  }

  crear() {
    let baraja = [];

    for (let i = 0; i < 6; i++) {
      baraja.push(new Carta("Bomba"));
    }
    for (let i = 0; i < 6; i++) {
      baraja.push(new Carta("Desactivación"));
    }
    for (let i = 0; i < 10; i++) {
      baraja.push(new Carta("SaltarTurno"));
    }
    for (let i = 0; i < 38; i++) {
      // El valor será un número entre 1 y 10, generado aleatoriamente
      let valorPuntos = Math.floor(Math.random() * 10) + 1;
      baraja.push(new Carta("Puntos", valorPuntos));
    }
    return baraja; // Retornamos la baraja creada
  }

  barajar(barajaCreada) {
    //Mezclar todas las cartas mediante el algoritmo de Fisher-Yates Shuffle.
    let i = barajaCreada.length,
      j,
      temp;
    while (--i > 0) {
      j = Math.floor(Math.random() * (i + 1));
      temp = barajaCreada[j];
      barajaCreada[j] = barajaCreada[i];
      barajaCreada[i] = temp;
    }
    return barajaCreada;
  }
}

function crearMazoYBarajar() {
  if (!mazoCreado) {
    mazo = new Mazo();
    barajaCreada = mazo.crear();
    cartasMezcladas = mazo.barajar(barajaCreada);
    console.log("Cartas mezcladas: ", cartasMezcladas);
    mazoCreado = true;
  }

  if (!jugadoresCreados) {
    console.log(ArrayDeJuadores);
    jugadoresCreados = true;
  }
}

function jugar() {
  crearMazoYBarajar();
  console.log("BOTON JUGAR");

  let JugadorEnTurno;
  if (ArrayDeJuadores.every((jugador) => !jugador.turno)) {
    //si todos tienen el turno en falso se empieza por el primero asi se evita que robe 2 veces
    JugadorEnTurno = ArrayDeJuadores[0];
  } else {
    // sino se sige por el que tenga turno en true
    JugadorEnTurno = ArrayDeJuadores.find((jugador) => jugador.turno);
  }

  JugadorEnTurno.turno = true;

  ArrayDeJuadores.forEach((jugador) => {
    if (jugador !== JugadorEnTurno) {
      jugador.turno = false;
    }
  });
  console.log("Jugador en turno: ", JugadorEnTurno);
  JugadorEnTurno.robar(cartasMezcladas[0]);
  

  let IndiceDeJugadorEnTurno = ArrayDeJuadores.indexOf(JugadorEnTurno);

  actualizarHTML(IndiceDeJugadorEnTurno, JugadorEnTurno);
  console.log("Cartas Totales: ", JugadorEnTurno.saberCartasTotales());

  pasarTurno();
}



function actualizarHTML(IndiceDeJugadorEnTurno, JugadorEnTurno) {
  let elementoHTML = elementosHTML[IndiceDeJugadorEnTurno];
  if (elementoHTML !== undefined) {
    elementoHTML.numCartas.textContent =
      "⚪️ Número de cartas: " + JugadorEnTurno.saberCartasTotales();
    elementoHTML.puntos.textContent =
      "⚪️ Puntos totales: " + JugadorEnTurno.saberPuntuacion();
    elementoHTML.saltoTurno.textContent =
      "⚪️ Cartas salto turno: " + JugadorEnTurno.cartasSaltarTurno();
    elementoHTML.desactivacion.textContent =
      "⚪️ Cartas desactivación: " + JugadorEnTurno.cartasDesactivacion();
  } else {
    console.log("Elemento HTML no encontrado");
  }
}

function pasarTurno() {
  console.log("BOTON PASAR TURNO");
//si el jugador tiene carta de pasar turno y pulsa el boton pasar turno, se le borra una carta de pasar turno y se cambia el turno
  // Actualizar el turno del jugador actual
  
  let jugadorActual = ArrayDeJuadores[indiceJugadorEnTurno];
  jugadorActual.turno = false;

  // Pasa el turno al siguiente jugador, saltando a los eliminados
  if (ArrayDeJuadores.some((jugador) => !jugador.eliminado)) {
    do {
      indiceJugadorEnTurno =(indiceJugadorEnTurno + 1) % ArrayDeJuadores.length;
    } while (ArrayDeJuadores[indiceJugadorEnTurno].eliminado);
  }

  // Verificar si el jugador actual no ha sido eliminado
  if (!ArrayDeJuadores[indiceJugadorEnTurno].eliminado) {
    // Establecer el turno del nuevo jugador
    let jugadorNuevo = ArrayDeJuadores[indiceJugadorEnTurno];
    jugadorNuevo.turno = true;
  }
}




 function pasarTurnoConBoton() {
  console.log("BOTON PASAR TURNO CON BOTON");
  
  let jugadorActual = ArrayDeJuadores[indiceJugadorEnTurno];
  jugadorActual.turno = false;

  const indexPasar = jugadorActual.cartasEnLaMano.findIndex(carta => carta.tipo === "SaltarTurno");
  if (indexPasar !== -1) {
    jugadorActual.cartasEnLaMano.splice(indexPasar, 1);
  }

  if (ArrayDeJuadores.some((jugador) => !jugador.eliminado)) {
    do {
      indiceJugadorEnTurno =(indiceJugadorEnTurno + 1) % ArrayDeJuadores.length;
    } while (ArrayDeJuadores[indiceJugadorEnTurno].eliminado);
  }

  if (!ArrayDeJuadores[indiceJugadorEnTurno].eliminado) {

    let jugadorNuevo = ArrayDeJuadores[indiceJugadorEnTurno];
    jugadorNuevo.turno = true;
  }

  btnPasar.style.opacity = 1;
  btnPasar.disabled = false;
  let IndiceDeJugadorEnTurno = ArrayDeJuadores.indexOf(JugadorEnTurno);

  actualizarHTML(IndiceDeJugadorEnTurno, JugadorEnTurno);
}
/**
 * Elimina al jugador actual
 */
function eliminarJugador() {
  console.log("ELIMINAR JUGADOR");

  ArrayDeJuadores[indiceJugadorEnTurno].cartasEnLaMano = [];

  nombres[indiceJugadorEnTurno].textContent = "ELIMINADO";
  nombres[indiceJugadorEnTurno].style.color = "red";
  numCartas[indiceJugadorEnTurno].textContent = "⚪️ Número de cartas: 0";
  puntos[indiceJugadorEnTurno].textContent = "⚪️ Puntos totales: 0";
  saltoTurno[indiceJugadorEnTurno].textContent = "⚪️ Cartas salto turno: 0";
  desactivacion[indiceJugadorEnTurno].textContent =
    "⚪️ Cartas desactivación: 0";

  ArrayDeJuadores[indiceJugadorEnTurno].eliminado = true;

  console.log(ArrayDeJuadores.length);

  // Si solo hay un jugador no eliminado, hay un ganador
  if (ArrayDeJuadores.filter((jugador) => !jugador.eliminado).length === 1) {
    hayGanadorPorEliminacion();
  } else {
    // Si hay m  s de un jugador no eliminado, pasa el turno al siguiente jugador
  if (ArrayDeJuadores.filter((jugador) => !jugador.eliminado).length > 1) {
    // comprueba si el jugador actual no ha sido eliminado
    if (!ArrayDeJuadores[indiceJugadorEnTurno].eliminado) {
      pasarTurno();
    }
  } else {
    hayGanadorPorEliminacion();
  }
}
}



function hayGanadorPorEliminacion() {
  if (ArrayDeJuadores.filter((jugador) => !jugador.eliminado).length === 1) {
    alert("El jugador " + ArrayDeJuadores.find((jugador) => !jugador.eliminado).nombre + " GANÓ");
  }
  reiniciarJuego();
}

function hayGanadorPorPuntos() {
  /**
   * compruba los puntos de los jugadores que queden y muestra el nombre del que mas tenga
   */
  reiniciarJuego();
  console.log("HAY GANADOR POR PUNTOS");
  for (let i = 0; i < ArrayDeJuadores.length; i++) {
    ArrayDeJuadores[i].puntuacion = ArrayDeJuadores[i].saberPuntuacion();
  }
  if (
    ArrayDeJuadores[0].puntuacion > ArrayDeJuadores[1].puntuacion &&
    ArrayDeJuadores[0].puntuacion > ArrayDeJuadores[2].puntuacion
  ) {
    return alert("El jugador " + ArrayDeJuadores[0].nombre + " GANÓ");
  } else if (
    ArrayDeJuadores[1].puntuacion > ArrayDeJuadores[0].puntuacion &&
    ArrayDeJuadores[1].puntuacion > ArrayDeJuadores[2].puntuacion
  ) {
    return alert("El jugador " + ArrayDeJuadores[1].nombre + " GANÓ");
  } else {
    return alert("El jugador " + ArrayDeJuadores[2].nombre + " GANÓ");
  }
}

function desactivarBomba() {
  alert("Bomba desactivada");
  pasarTurno();
}
/**
 * busca si el jugador tiene cartas de tipo "Bomba" y "Desactivación" y borra las dos cartas de ese tipo con el splice y el findIndex
 */
function desactivarSiEsPosible() {
  const jugadorActual = ArrayDeJuadores[indiceJugadorEnTurno];
  
  // Verificar si el jugador tiene cartas de tipo "Bomba" y "Desactivación"
  const tieneBomba = jugadorActual.cartasEnLaMano.some(carta => carta.tipo === "Bomba");
  const tieneDesactivacion = jugadorActual.cartasEnLaMano.some(carta => carta.tipo === "Desactivación");

  if (tieneDesactivacion && tieneBomba) {

    jugadorActual.cartasEnLaMano.splice(jugadorActual.cartasEnLaMano.findIndex(carta => carta.tipo === "Desactivación"), 1);
    jugadorActual.cartasEnLaMano.splice(jugadorActual.cartasEnLaMano.findIndex(carta => carta.tipo === "Bomba"), 1);
    desactivarBomba();
  } else {
    eliminarJugador();
    btnPasar.style.opacity = 0.3;
  }
}


/**
 * esta funcion le quita el evento establecido al boton robar y le agrega el evento click para reiniciar el juego
 */
function reiniciarJuego() {
  btnPasar.style.display = "none";
  btnRobar.textContent = "REINICIAR JUEGO";
  btnRobar.removeEventListener("click", pasarTurno);
  btnRobar.addEventListener("click", () => {
    location.reload(false);
  });
  console.log("REINICIAR JUEGO");
}

let indiceJugadorEnTurno = 0;

let jugador1 = new Jugador("Jugador 1", false, false);
let jugador2 = new Jugador("Jugador 2", false, false);
let jugador3 = new Jugador("Jugador 3", false, false);

const ArrayDeJuadores = [jugador1, jugador2, jugador3];

let mazoCreado = false;
let jugadoresCreados = false;
let mazo;
let barajaCreada;
let cartasMezcladas;

