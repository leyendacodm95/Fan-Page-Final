document.addEventListener("DOMContentLoaded", function () {
  // --- Lógica del Menú Hamburguesa ---
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("nav-links");

  if (hamburgerBtn && navLinks) {
    // 1. Al hacer clic en el botón, muestra/oculta el menú
    hamburgerBtn.addEventListener("click", (event) => {
      // Detenemos la propagación para que el clic no llegue al 'document'
      event.stopPropagation();
      navLinks.classList.toggle("menu-open");
    });

    // 2. Al hacer clic en CUALQUIER LUGAR del documento...
    document.addEventListener("click", (event) => {
      // Verificamos si el menú está abierto Y si el clic NO fue dentro del menú
      const isClickInsideMenu = navLinks.contains(event.target);

      if (navLinks.classList.contains("menu-open") && !isClickInsideMenu) {
        // Si se cumplen ambas, cerramos el menú
        navLinks.classList.remove("menu-open");
      }
    });

    // 3. Opcional: Cierra el menú si se hace clic en un enlace (útil para móviles)
    navLinks.addEventListener("click", () => {
      navLinks.classList.remove("menu-open");
    });
  }

  // ===========================================
  // --- LÓGICA DE MODO OSCURO ---
  // ===========================================
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // 1. FUNCIÓN PARA APLICAR EL MODO OSCURO (O QUITARLO)
  const aplicarModoOscuro = (activado) => {
    if (activado) {
      body.classList.add("dark-mode");
      darkModeToggle.textContent = "☀️"; // Cambia el ícono a Sol
      localStorage.setItem("darkMode", "true"); // Guarda en memoria
    } else {
      body.classList.remove("dark-mode");
      darkModeToggle.textContent = "🌙"; // Cambia el ícono a Luna
      localStorage.setItem("darkMode", "false"); // Guarda en memoria
    }
  };

  // 2. VERIFICAR LA MEMORIA AL CARGAR LA PÁGINA
  // Esto es lo que "recuerda" tu elección entre páginas
  const modoGuardado = localStorage.getItem("darkMode");

  // Comprueba si ya estaba activado en una visita anterior
  // Aseguramos que el botón exista antes de cambiar su texto
  if (modoGuardado === "true") {
    if (darkModeToggle) {
      aplicarModoOscuro(true);
    } else {
      body.classList.add("dark-mode"); // Aplica la clase aunque el botón no esté
    }
  } else {
    if (darkModeToggle) {
      aplicarModoOscuro(false); // Asegura que esté desactivado
    }
  }

  // 3. EVENTO DE CLIC EN EL BOTÓN
  // Esto es lo que pasa cuando el usuario hace clic
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      // Revisa si el modo oscuro YA está activo, para hacer lo contrario
      const estaActivo = body.classList.contains("dark-mode");
      aplicarModoOscuro(!estaActivo); // Envía el valor opuesto (toggle)
    });
  }

  // ===========================================
  // --- Lógica del carrusel ---
  // ===========================================
  const slide = document.querySelector(".carousel-slide");
  const images = document.querySelectorAll(".carousel-slide img");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Nos aseguramos que existan imágenes en el carrusel antes de ejecutar el código
  if (slide && images.length > 0) {
    let currentIndex = 0;

    function showSlide(index) {
      if (index >= images.length) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = images.length - 1;
      } else {
        currentIndex = index;
      }
      slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Mover automáticamente cada 3 segundos
    setInterval(nextSlide, 3000);
  }

  // ===========================================
  // --- Lógica del reproductor de música (Modo Aleatorio) ---
  // ===========================================
  const audioPlayer = document.getElementById("audioPlayer");
  const songNameDisplay = document.getElementById("song-name");
  const prevSongBtn = document.getElementById("prev-song");
  const nextSongBtn = document.getElementById("next-song");

  if (audioPlayer) {
    const sources = audioPlayer.getElementsByTagName("source");
    let currentSongIndex = 0; // El índice en la lista de 'sources'

    // Variables para el modo aleatorio
    let shuffledPlaylist = []; // Array para guardar el orden aleatorio
    let playlistIndex = 0; // Dónde vamos en la lista aleatoria

    // Función para barajar la lista de canciones (Algoritmo Fisher-Yates)
    function createShuffledPlaylist() {
      // 1. Crear una lista de índices: [0, 1, 2, 3, 4, 5, 6]
      let indices = Array.from({ length: sources.length }, (_, i) => i);

      // 2. Barajar la lista de índices
      let m = indices.length,
        t,
        i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = indices[m];
        indices[m] = indices[i];
        indices[i] = t;
      }

      // 3. Evitar que la nueva lista empiece con la misma canción que acaba de sonar
      if (indices.length > 1 && indices[0] === currentSongIndex) {
        // Intercambia el primer y el último elemento
        let first = indices[0];
        indices[0] = indices[indices.length - 1];
        indices[indices.length - 1] = first;
      }

      shuffledPlaylist = indices;
      playlistIndex = 0; // Reiniciar el contador
      console.log("Nueva lista aleatoria creada:", shuffledPlaylist);
    }

    function updateSongInfo() {
      // 'currentSongIndex' siempre tendrá el índice de la canción actual
      const songPath = sources[currentSongIndex].getAttribute("src");
      let fileName = songPath
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "");
      songNameDisplay.textContent = `Reproduciendo: ${fileName}`;
    }

    // 'playSong' ahora solo reproduce un índice, pero no lo elige
    function playSong(index) {
      currentSongIndex = index; // Actualiza el índice global
      audioPlayer.src = sources[currentSongIndex].src;
      audioPlayer.play();
    }

    // Función 'next' modificada para el modo aleatorio
    function playNextShuffledSong() {
      // Si la lista barajada está vacía o se terminó, crear una nueva
      if (playlistIndex >= shuffledPlaylist.length) {
        createShuffledPlaylist();
      }

      // Obtener el siguiente índice de la lista barajada
      const nextSongIndex = shuffledPlaylist[playlistIndex];

      // Incrementar para la próxima vez
      playlistIndex++;

      // Reproducir esa canción
      playSong(nextSongIndex);
    }

    // Función 'prev' modificada para el modo aleatorio
    function playPrevShuffledSong() {
      // Retroceder en el índice de la playlist
      playlistIndex -= 2; // (Restamos 1 por el 'next' que ya se sumó, y 1 para ir al anterior)

      // Si nos vamos por debajo de 0, simplemente volvemos a la canción 0
      if (playlistIndex < 0) {
        playlistIndex = 0;
      }

      const prevSongIndex = shuffledPlaylist[playlistIndex];
      playlistIndex++; // Pre-incrementamos para el siguiente 'next'
      playSong(prevSongIndex);
    }

    // Asignación de eventos del reproductor
    audioPlayer.addEventListener("ended", playNextShuffledSong); // Al terminar, toca la siguiente de la lista aleatoria
    audioPlayer.addEventListener("play", updateSongInfo);
    prevSongBtn.addEventListener("click", playPrevShuffledSong); // Botón "Prev" va a la anterior en la lista aleatoria
    nextSongBtn.addEventListener("click", playNextShuffledSong); // Botón "Next" va a la siguiente en la lista aleatoria

    // Configuración inicial al cargar la página
    // 1. Crear la lista barajada por primera vez
    createShuffledPlaylist();
    // 2. Tocar la PRIMERA canción de esa lista
    currentSongIndex = shuffledPlaylist[playlistIndex];
    playlistIndex++; // Apuntar al siguiente

    audioPlayer.volume = 0.25;
    audioPlayer.src = sources[currentSongIndex].src;

    // LÓGICA DE AUTOPLAY (SOLO PARA LA PÁGINA PRINCIPAL)
    const path = window.location.pathname;
    const isMainPage =
      path.endsWith("/") || path.endsWith("/index.html") || path === "/";

    if (isMainPage) {
      updateSongInfo(); // Muestra el nombre de la canción (ya aleatoria)
      const startPlayback = () => {
        audioPlayer.play().catch((error) => {
          songNameDisplay.textContent = "Haz clic para iniciar la música";
          console.log(
            "La reproducción automática fue bloqueada por el navegador."
          );
        });
        document.body.removeEventListener("click", startPlayback);
      };
      document.body.addEventListener("click", startPlayback, { once: true });
    } else {
      // Para las subpáginas, solo mostramos el nombre (ya aleatorio)
      const songPath = sources[currentSongIndex].getAttribute("src");
      let fileName = songPath
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "");
      songNameDisplay.textContent = `${fileName}`; // Muestra solo el nombre
    }

    // LÓGICA PARA DETENER MÚSICA EN SUBPÁGINAS
    const navLinksList = document.querySelectorAll("nav a");
    navLinksList.forEach((link) => {
      link.addEventListener("click", (event) => {
        // Solo pausamos si el enlace abre una nueva pestaña (_blank) o es a otra página (_self)
        // No pausamos si es un enlace ancla (#)
        if (
          link.getAttribute("href") !== "#" &&
          link.getAttribute("href") !== ""
        ) {
          audioPlayer.pause();
        }
      });
    });
  }

  // ===========================================
  // --- LÓGICA PARA LA SECCIÓN DE DATOS CURIOSOS ---
  // ===========================================
  const botonCuriosidad = document.getElementById("botonCuriosidad");
  const textoCuriosidad = document.getElementById("textoCuriosidad");

  // Nos aseguramos que existan el botón y el párrafo en la página
  if (botonCuriosidad && textoCuriosidad) {
    const curiosidades = [
      "El anime más largo de la historia no es One Piece, sino Sazae-san, que se emite desde 1969 y tiene más de 7,500 episodios.",
      "Producir un solo episodio de un anime de alta calidad puede costar entre $100,000 y $300,000 dólares.",
      "En Japón, se vende más papel para imprimir manga que para fabricar papel higiénico.",
      "La palabra 'anime' (アニメ) en Japón se usa para referirse a cualquier tipo de animación, incluyendo las de Disney o Pixar.",
      "La famosa transformación de Goku en Super Saiyan 3 duró casi 4 minutos de gritos en la versión original japonesa.",
      "El creador de Attack on Titan se inspiró en un cliente borracho de un cibercafé para diseñar a los titanes.",
      "El restaurante 'Ichiraku Ramen' de Naruto está basado en un puesto de ramen real cerca de la universidad del creador.",
      "La voz de Pikachu es la misma en todos los idiomas. La actriz de voz Ikue Otani no es doblada para mantener la identidad del personaje.",
      "El primer anime de la historia data de 1907 y se llama 'Katsudo Shashin'. Dura apenas 3 o 4 segundos.",
      "'El Viaje de Chihiro' es la única película de anime dibujada a mano que ha ganado un Premio Óscar a la Mejor Película de Animación.",
      "En 'Dragon Ball Z', los nombres de los villanos Bibidi, Babidi y Boo vienen de la canción 'Bibbidi-Bobbidi-Boo' de la película 'La Cenicienta' de Disney.",
      "Los creadores de 'Sailor Moon' (Naoko Takeuchi) y 'Hunter x Hunter' (Yoshihiro Togashi) están casados.",
      "La película 'Your Name' (Kimi no Na Wa) fue tan exitosa que se convirtió en la película de anime más taquillera de la historia por un tiempo.",
      "En el anime 'Code Geass', la cadena Pizza Hut fue un patrocinador oficial. Por eso, los personajes comen sus pizzas tan frecuentemente.",
      "Los icónicos ojos grandes del anime fueron popularizados por Osamu Tezuka ('Astroboy'), quien se inspiró en las animaciones de Walt Disney como 'Bambi'.",
      "Nezuko de 'Kimetsu no Yaiba' es el único demonio conocido que puede usar técnicas de sangre demoníaca sin haber comido humanos.",
      "Técnicamente, Krilin es considerado el humano (puro) más fuerte del universo de 'Dragon Ball'.",
      "El anime 'Akira' (1988) predijo que las Olimpiadas de 2020 se celebrarían en Tokio.",
      "El titán 'Bailarín' de Attack on Titan (Ymir) está basado en la apariencia de la madre del creador, Hajime Isayama, cuando estaba enfadada.",
      "En Jujutsu Kaisen, el personaje Satoro Gojo fue diseñado originalmente para ser el protagonista, pero Gege Akutami decidió que era 'demasiado perfecto' y creó a Yuji Itadori en su lugar.",
    ];

    let ultimaCuriosidadIndex = -1; // Para no repetir la misma curiosidad dos veces seguidas

    botonCuriosidad.addEventListener("click", () => {
      let nuevaCuriosidadIndex;

      // Elegimos un número al azar y nos aseguramos de que no sea el mismo que el anterior
      do {
        nuevaCuriosidadIndex = Math.floor(Math.random() * curiosidades.length);
      } while (
        curiosidades.length > 1 &&
        nuevaCuriosidadIndex === ultimaCuriosidadIndex
      );

      // Actualizamos el texto del párrafo con la nueva curiosidad
      textoCuriosidad.textContent = curiosidades[nuevaCuriosidadIndex];

      // Guardamos el índice de la curiosidad que acabamos de mostrar
      ultimaCuriosidadIndex = nuevaCuriosidadIndex;
    });
  }
});
