// Esperamos a que todo el contenido del HTML se cargue
document.addEventListener('DOMContentLoaded', function() {

    // Seleccionamos los elementos del HTML que vamos a usar
    const botonCuriosidad = document.getElementById('botonCuriosidad');
    const textoCuriosidad = document.getElementById('textoCuriosidad');

    // Creamos una lista (array) de curiosidades
    const curiosidades = [
        "Dato curioso número 1.",
        "Dato curioso número 2.",
        "A [nombre del artista] le gusta programar en sus tiempos libres.",
        "Este es otro dato interesante.",
        "La primera canción fue escrita en 10 minutos."
    ];

    // Función que se ejecuta al hacer clic en el botón
    function mostrarNuevaCuriosidad() {
        // Obtenemos un índice aleatorio del array de curiosidades
        const indiceAleatorio = Math.floor(Math.random() * curiosidades.length);
        
        // Mostramos la curiosidad en el párrafo correspondiente
        textoCuriosidad.textContent = curiosidades[indiceAleatorio];
    }

    // Le decimos al botón que escuche el evento 'click' y ejecute nuestra función
    botonCuriosidad.addEventListener('click', mostrarNuevaCuriosidad);

});