const opcionesRespuestas = document.getElementById("respuestas");
const textoPregunta = document.getElementById("preguntaTexto");
    document.getElementById('pantallaFinal').style.display = 'none';

function guardarNombre() {
  const input = document.getElementById('nombre'); // Apunta al input
  const valor = input.value.trim();

  if (!valor) {
    alert('esxcribge tu nombre sino perdiste.');
    return;
  }

  localStorage.setItem('nombreJugador', valor);

  const display = document.getElementById('nombreJugador');
  if (display) {
    display.innerText = valor;
  }


  window.location.href = 'preguntas.html';
}


function comenzarJuego() {
  const nombre = localStorage.getItem('nombreJugador');
  if (!nombre) {
    alert('Debes escribir tu nombre antes de comenzar el juego.');
    return;
  }
  window.location.href = 'preguntas.html';
}

function salirdelJuego() {
  alert('No puedes salir todavía');
}



// esto es para cargar el nombre guardado esto 
//como que te asegura que si exista el id nombre en plan que lo han
//puesto pero esque esa validacion no la he hecho porque el campo q he puesto ya es required entonces
//se asegura q 100 por 100 lo ponga.
function loadSavedName() {
  const nombre = localStorage.getItem('nombreJugador');
  const display = document.getElementById('nombreJugador');
  if (nombre && display) {
    display.innerText = nombre;
  }
}


//esto es para el cursor blabla
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


//esto es para esconder el radio el boton que no me hace gracia que es con los booleans esconderlos al estar pulsados
document.querySelectorAll('.opcion').forEach(div => {
  div.addEventListener('click', () => {
    const radio = div.querySelector('input[type="radio"]');
    radio.checked = true; // Marca la opción
  });
});
//esto es para cargar preguntas y las respuestas del 
//jueguito de putisima mierda que no funciona 


let preguntas = [];
let puntuacion = 0;
let indice = 0;

function cargarPreguntas() {
  fetch('assets/preguntas.json')
    .then(response => response.json())
    .then(data => {
      preguntas = data.preguntas;
      preguntas.sort(() => Math.random() - 0.5); // Mezclar preguntas y pones 0.5 lo desordneas y si pones 0 o 1 lo ordena o alg asi
      mostrarPregunta();

      textoPregunta.innerHTML = `${preguntas[0].pregunta}`;
      opcionA.innerHTML = `${preguntas[0].opciones.A}`;
      opcionB.innerHTML = `${preguntas[0].opciones.B}`;
      opcionC.innerHTML = `${preguntas[0].opciones.C}`;
      opcionD.innerHTML = `${preguntas[0].opciones.D}`;

    })
    .catch(error => {
      console.error('Error al cargar las preguntas:', error);
    });

}

function mostrarPregunta() {
  if (indice >= preguntas.length) {
    document.getElementById('pantallaFinal').style.display = 'flex';

    return;
  }

  const pregunta = preguntas[indice];
  const preguntaTexto = document.getElementById('preguntaTexto');
  const respuestasCaja = document.getElementById('respuestasCaja');

  preguntaTexto.innerText = pregunta.pregunta;
  respuestasCaja.innerHTML = '';

  for (const key in pregunta.opciones) {
    const div = document.createElement('div');
    div.classList.add('opcion');
    div.dataset.value = key;


    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'respuesta';
    radio.value = key;
    radio.style.display = 'none';

    const span = document.createElement('span');
    span.classList.add('texto');
    span.innerText = pregunta.opciones[key];

    div.appendChild(radio);
    div.appendChild(span);

    div.addEventListener('click', () => {
      radio.checked = true;
      document.querySelectorAll('.opcion').forEach(d => d.classList.remove('seleccionada'));
      div.classList.add('seleccionada');
    });

    respuestasCaja.appendChild(div);
  }

}


document.getElementById('botonSiguiente').addEventListener('click', () => {
  const seleccion = document.querySelector('input[name="respuesta"]:checked');
  if (!seleccion) {
    alert('Selecciona una opción antes de continuar.');
    return;
  }

  if (seleccion.value === preguntas[indice].solucion) {
    puntuacion += 100;
  }

  document.getElementById('puntuacion').innerText = puntuacion;
  indice++;
  mostrarPregunta();
});

function finalizarJuego() {
  const nombre = localStorage.getItem('nombreJugador') || 'Invitado';
  const totalPreguntas = preguntas.length;
  const acertadas = puntuacion / 100;
  const falladas = totalPreguntas - acertadas;
  const hasGanado = acertadas >= Math.ceil(totalPreguntas / 2);


  // document.getElementById('mensajeFinal').innerText =
  //   hasGanado
  //     ? `¡Felicidades ${nombre}, has ganado el concurso!`
  //     : `Lo siento ${nombre}, has perdido.`;

  document.getElementById('puntosFinales').innerText = puntuacion;
  document.getElementById('acertadasFinales').innerText = acertadas;
  document.getElementById('falladasFinales').innerText = falladas;


  //el array este se guartda demntro deel json de pña prtida 
  const resultado = {
    nombre: nombre,
    acertadas: acertadas,
    falladas: falladas,
    ganador: hasGanado
  };

  mostrarPregunta(resultado);
}



document.addEventListener('DOMContentLoaded', cargarPreguntas);