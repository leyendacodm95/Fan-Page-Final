/*
=====================================================
--- INICIALIZACIÓN PRINCIPAL ---
Este evento escucha cuando el navegador termina de leer todo el HTML.
Asegura que los elementos existan antes de ejecutar el script.
=====================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  
    /*
    =====================================================
    --- MENÚ HAMBURGUESA (NAVEGACIÓN MÓVIL) ---
    Controla la apertura, cierre y comportamiento del menú desplegable.
    =====================================================
    */
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");
  
    if (hamburgerBtn && navLinks) {
      // 1. Evento para ABRIR/CERRAR el menú
      hamburgerBtn.addEventListener("click", (event) => {
        // Detenemos la propagación para que el clic no llegue al 'document' y se cierre inmediatamente
        event.stopPropagation();
        navLinks.classList.toggle("menu-open");
      });
  
      // 2. Evento para CERRAR al hacer clic FUERA del menú
      document.addEventListener("click", (event) => {
        // Verificamos si el clic ocurrió dentro del contenedor del menú
        const isClickInsideMenu = navLinks.contains(event.target);
  
        // Si el menú está abierto Y el clic fue afuera, lo cerramos
        if (navLinks.classList.contains("menu-open") && !isClickInsideMenu) {
          navLinks.classList.remove("menu-open");
        }
      });
  
      // 3. Evento para CERRAR al hacer clic en un ENLACE
      // Mejora la experiencia de usuario (UX) en móviles al navegar
      navLinks.addEventListener("click", () => {
        navLinks.classList.remove("menu-open");
      });
    }
  
    /*
    =====================================================
    --- GESTIÓN DEL MODO OSCURO (DARK MODE) ---
    Maneja el cambio de tema visual y guarda la preferencia en el navegador.
    =====================================================
    */
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
  
    // 1. Función auxiliar para aplicar o quitar la clase 'dark-mode'
    const aplicarModoOscuro = (activado) => {
      if (activado) {
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "☀️"; // Cambia icono a Sol (modo claro disponible)
        localStorage.setItem("darkMode", "true"); // Guarda la preferencia
      } else {
        body.classList.remove("dark-mode");
        darkModeToggle.textContent = "🌙"; // Cambia icono a Luna (modo oscuro disponible)
        localStorage.setItem("darkMode", "false"); // Guarda la preferencia
      }
    };
  
    // 2. Verificación de MEMORIA al cargar la página (Persistencia)
    // Recupera la elección del usuario de visitas anteriores
    const modoGuardado = localStorage.getItem("darkMode");
  
    if (modoGuardado === "true") {
      if (darkModeToggle) {
        aplicarModoOscuro(true);
      } else {
        // Si no hay botón (otra página), aplicamos el estilo directamente
        body.classList.add("dark-mode");
      }
    } else {
      if (darkModeToggle) {
        aplicarModoOscuro(false);
      }
    }
  
    // 3. Evento de CLIC en el botón de cambio de modo
    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", () => {
        // Verifica el estado actual e invierte el valor (true -> false / false -> true)
        const estaActivo = body.classList.contains("dark-mode");
        aplicarModoOscuro(!estaActivo);
      });
    }
  
    /*
    =====================================================
    --- CARRUSEL DE IMÁGENES ---
    Lógica para deslizar imágenes y control automático.
    =====================================================
    */
    const slide = document.querySelector(".carousel-slide");
    const images = document.querySelectorAll(".carousel-slide img");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
  
    // Validación: Solo ejecutamos si existen imágenes para evitar errores en consola
    if (slide && images.length > 0) {
      let currentIndex = 0;
  
      // 1. Función principal que mueve el carrusel
      function showSlide(index) {
        // Si llegamos al final, volvemos al principio (Loop infinito)
        if (index >= images.length) {
          currentIndex = 0;
        } 
        // Si retrocedemos desde el principio, vamos al final
        else if (index < 0) {
          currentIndex = images.length - 1;
        } else {
          currentIndex = index;
        }
        // Aplicamos la transformación CSS para mover las imágenes
        slide.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
  
      // 2. Funciones de navegación (Siguiente / Anterior)
      function nextSlide() {
        showSlide(currentIndex + 1);
      }
  
      function prevSlide() {
        showSlide(currentIndex - 1);
      }
  
      // 3. Asignación de eventos a los botones
      nextBtn.addEventListener("click", nextSlide);
      prevBtn.addEventListener("click", prevSlide);
  
      // 4. Temporizador automático (Cambia cada 3 segundos)
      setInterval(nextSlide, 3000);
    }
  
    /*
    =====================================================
    --- REPRODUCTOR DE MÚSICA (ALEATORIO / SHUFFLE) ---
    Controla la reproducción, lista aleatoria y persistencia entre páginas.
    =====================================================
    */
    const audioPlayer = document.getElementById("audioPlayer");
    const songNameDisplay = document.getElementById("song-name");
    const prevSongBtn = document.getElementById("prev-song");
    const nextSongBtn = document.getElementById("next-song");
  
    if (audioPlayer) {
      const sources = audioPlayer.getElementsByTagName("source");
      let currentSongIndex = 0; // Índice real en el HTML
  
      // Variables de estado para el modo aleatorio
      let shuffledPlaylist = []; // Almacena el orden mezclado
      let playlistIndex = 0;     // Posición actual dentro de la mezcla
  
      // 1. Algoritmo Fisher-Yates para BARAJAR la lista
      function createShuffledPlaylist() {
        // Crea un array simple con los índices [0, 1, 2...]
        let indices = Array.from({ length: sources.length }, (_, i) => i);
  
        let m = indices.length, t, i;
        // Mezcla los elementos mientras queden elementos por mezclar
        while (m) {
          i = Math.floor(Math.random() * m--);
          t = indices[m];
          indices[m] = indices[i];
          indices[i] = t;
        }
  
        // Evita repetir la misma canción si se regenera la lista
        if (indices.length > 1 && indices[0] === currentSongIndex) {
          let first = indices[0];
          indices[0] = indices[indices.length - 1];
          indices[indices.length - 1] = first;
        }
  
        shuffledPlaylist = indices;
        playlistIndex = 0;
        console.log("Nueva lista aleatoria creada:", shuffledPlaylist);
      }
  
      // 2. Actualiza el texto visible con el nombre del archivo
      function updateSongInfo() {
        const songPath = sources[currentSongIndex].getAttribute("src");
        // Limpia la ruta para dejar solo el nombre del archivo (sin extensión)
        let fileName = songPath.split("/").pop().replace(/\.[^/.]+$/, "");
        songNameDisplay.textContent = `Reproduciendo: ${fileName}`;
      }
  
      // 3. Carga y reproduce una canción específica por índice
      function playSong(index) {
        currentSongIndex = index;
        audioPlayer.src = sources[currentSongIndex].src;
        audioPlayer.play();
      }
  
      // 4. Lógica para SIGUIENTE canción (Modo Aleatorio)
      function playNextShuffledSong() {
        if (playlistIndex >= shuffledPlaylist.length) {
          createShuffledPlaylist(); // Si terminamos la lista, creamos una nueva
        }
        const nextSongIndex = shuffledPlaylist[playlistIndex];
        playlistIndex++;
        playSong(nextSongIndex);
      }
  
      // 5. Lógica para ANTERIOR canción (Modo Aleatorio)
      function playPrevShuffledSong() {
        playlistIndex -= 2; // Retrocedemos el contador
        if (playlistIndex < 0) {
          playlistIndex = 0;
        }
        const prevSongIndex = shuffledPlaylist[playlistIndex];
        playlistIndex++;
        playSong(prevSongIndex);
      }
  
      // 6. Asignación de eventos del reproductor
      audioPlayer.addEventListener("ended", playNextShuffledSong); // Auto-siguiente
      audioPlayer.addEventListener("play", updateSongInfo);
      prevSongBtn.addEventListener("click", playPrevShuffledSong);
      nextSongBtn.addEventListener("click", playNextShuffledSong);
  
      // 7. Inicialización al cargar la página
      createShuffledPlaylist();
      currentSongIndex = shuffledPlaylist[playlistIndex];
      playlistIndex++;
  
      audioPlayer.volume = 0.25; // Volumen inicial bajo
      audioPlayer.src = sources[currentSongIndex].src;
  
      // 8. Control de AUTOPLAY (Solo en página principal)
      const path = window.location.pathname;
      const isMainPage = path.endsWith("/") || path.endsWith("/index.html") || path === "/";
  
      if (isMainPage) {
        updateSongInfo();
        // Los navegadores bloquean el autoplay sin interacción, capturamos el error
        const startPlayback = () => {
          audioPlayer.play().catch(() => {
            songNameDisplay.textContent = "Haz clic para iniciar la música";
            console.log("Autoplay bloqueado por el navegador.");
          });
          document.body.removeEventListener("click", startPlayback);
        };
        // Intentamos reproducir al primer clic del usuario en cualquier parte
        document.body.addEventListener("click", startPlayback, { once: true });
      } else {
        // En sub-páginas solo mostramos el nombre sin reproducir automáticamente
        const songPath = sources[currentSongIndex].getAttribute("src");
        let fileName = songPath.split("/").pop().replace(/\.[^/.]+$/, "");
        songNameDisplay.textContent = `${fileName}`;
      }
  
      // 9. Detener música al navegar a otras páginas internas
      const navLinksList = document.querySelectorAll("nav a");
      navLinksList.forEach((link) => {
        link.addEventListener("click", () => {
          if (link.getAttribute("href") !== "#" && link.getAttribute("href") !== "") {
            audioPlayer.pause();
          }
        });
      });
    }
  
    /*
    =====================================================
    --- SECCIÓN DE CURIOSIDADES (DATOS RANDOM) ---
    Generador aleatorio de texto sin repetir el dato anterior.
    =====================================================
    */
    const botonCuriosidad = document.getElementById("botonCuriosidad");
    const textoCuriosidad = document.getElementById("textoCuriosidad");
  
    if (botonCuriosidad && textoCuriosidad) {
      const curiosidades = [
        "El anime más largo de la historia no es One Piece, sino Sazae-san (+7,500 caps).",
        "Producir un episodio de anime cuesta entre $100,000 y $300,000 dólares.",
        "En Japón, se usa más papel para manga que para papel higiénico.",
        "La palabra 'anime' en Japón refiere a cualquier animación, incluso Disney.",
        "La transformación de Goku SSJ3 duró casi 4 minutos de gritos originales.",
        "El creador de Attack on Titan se inspiró en un borracho para los titanes.",
        "Ichiraku Ramen (Naruto) existe en la vida real.",
        "La voz de Pikachu (Ikue Otani) nunca es doblada en otros idiomas.",
        "El primer anime data de 1907 y dura solo 4 segundos.",
        "'El Viaje de Chihiro' ganó un Óscar a Mejor Película de Animación.",
        "Bibidi, Babidi y Boo (DBZ) vienen de la canción de Cenicienta.",
        "Los creadores de Sailor Moon y Hunter x Hunter están casados.",
        "'Your Name' fue el anime más taquillero de la historia por un tiempo.",
        "Pizza Hut patrocinó Code Geass, por eso comen tanta pizza.",
        "Los ojos grandes del anime se inspiraron en Bambi de Disney.",
        "Nezuko es el único demonio que usa técnicas sin comer humanos.",
        "Krilin es el humano puro más fuerte de Dragon Ball.",
        "Akira (1988) predijo las Olimpiadas de Tokio 2020.",
        "El titán de Ymir se basa en la madre del creador cuando se enojaba.",
        "Gojo Satoru iba a ser el protagonista, pero era 'demasiado perfecto'."
      ];
  
      let ultimaCuriosidadIndex = -1;
  
      // Evento para obtener un dato nuevo
      botonCuriosidad.addEventListener("click", () => {
        let nuevaCuriosidadIndex;
  
        // Bucle 'Do-While' para asegurar que no salga el mismo dato dos veces seguidas
        do {
          nuevaCuriosidadIndex = Math.floor(Math.random() * curiosidades.length);
        } while (
          curiosidades.length > 1 &&
          nuevaCuriosidadIndex === ultimaCuriosidadIndex
        );
  
        textoCuriosidad.textContent = curiosidades[nuevaCuriosidadIndex];
        ultimaCuriosidadIndex = nuevaCuriosidadIndex;
      });
    }
  
  }); // Fin del DOMContentLoaded
  
  /*
  =====================================================
  --- EFECTO SAKURA (PÉTALOS CAYENDO) ---
  Animación generada dinámicamente fuera del flujo principal.
  =====================================================
  */
  function crearPetalo() {
    const petalo = document.createElement("span");
    petalo.classList.add("sakura-petal");
  
    // 1. Posicionamiento y tamaño aleatorio
    const startLeft = Math.random() * 100; // Posición horizontal (0-100vw)
    const size = Math.random() * 10 + 10;  // Tamaño entre 10px y 20px
    const duration = Math.random() * 6 + 6; // Duración caída (6s-12s)
  
    // 2. Aplicación de estilos en línea
    petalo.style.left = startLeft + "vw";
    petalo.style.width = size + "px";
    petalo.style.height = size + "px";
    petalo.style.animation = `fall-sway ${duration}s linear`;
  
    document.body.appendChild(petalo);
  
    // 3. Garbage Collection: Eliminar elemento del DOM al terminar
    // Esto evita que la página se vuelva lenta por tener miles de elementos
    setTimeout(() => {
      petalo.remove();
    }, duration * 1000);
  }
  
  // Inicia la generación de pétalos cada 300ms
  setInterval(crearPetalo, 300);
