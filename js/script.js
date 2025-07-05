document.addEventListener("DOMContentLoaded", () => {
  const sonidoPagina = new Audio("sounds/flip_page.wav");

  let paginaActual = 0;
  const paginas = document.querySelectorAll(".pagina");
  const flechaDerecha = document.getElementById("flechaDerecha");
  const flechaIzquierda = document.getElementById("flechaIzquierda");

  const pantallaInicio = document.getElementById("pantallaInicio");
  const libroCompleto = document.getElementById("libroCompleto");

  // Mostrar una página con animación
  function mostrarPagina(index) {
    paginas.forEach((pagina) => {
      pagina.classList.remove("activa", "animar");
    });

    const paginaActualDOM = paginas[index];
    paginaActualDOM.classList.add("activa");

    // Forzar reflow para reiniciar animación
    void paginaActualDOM.offsetWidth;
    paginaActualDOM.classList.add("animar");

    // Mostrar/ocultar flechas
    flechaIzquierda.style.visibility = index === 0 ? "hidden" : "visible";
    flechaDerecha.style.visibility =
      index === paginas.length - 1 ? "hidden" : "visible";
  }

  // Avanzar página
  flechaDerecha.addEventListener("click", () => {
    if (paginaActual < paginas.length - 1) {
      paginaActual++;
      mostrarPagina(paginaActual);
      sonidoPagina.currentTime = 0;
      sonidoPagina.play();
    }
  });

  // Retroceder página
  flechaIzquierda.addEventListener("click", () => {
    if (paginaActual > 0) {
      paginaActual--;
      mostrarPagina(paginaActual);
      sonidoPagina.currentTime = 0;
      sonidoPagina.play();
    }
  });

  // Mostrar libro al hacer clic en el libro con pluma
  pantallaInicio.addEventListener("click", () => {
    pantallaInicio.classList.add("oculto");
    libroCompleto.classList.add("visible");
    mostrarPagina(paginaActual);
  });

  // Asegura que el libro no sea visible al cargar
  libroCompleto.classList.remove("visible");

  // 🔴 Puntos rojos animados
  const cantidadPuntos = 50;
  const separacionMinima = 80;
  const puntos = [];
  const fondo = document.querySelector(".fondo");

  function generarPosicionNoAgrupada() {
    let x, y, muyCerca;
    let intentos = 0;
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
      intentos++;
      muyCerca = puntos.some((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < separacionMinima;
      });
    } while (muyCerca && intentos < 100);
    return { x, y };
  }

  for (let i = 0; i < cantidadPuntos; i++) {
    const { x, y } = generarPosicionNoAgrupada();
    puntos.push({ x, y });

    const punto = document.createElement("div");
    punto.className = "punto-rojo";
    punto.style.left = `${x}px`;
    punto.style.top = `${y}px`;
    fondo.appendChild(punto);
  }

  // 💨 HUMO DINÁMICO CON GSAP
  const humoContenedor = document.querySelector(".humo-bocanada");

  // Función que crea una nube y la anima con GSAP
  function crearNube(direccionX) {
    const nube = document.createElement("div");
    nube.classList.add("nube");

    nube.style.left = "50%";
    nube.style.top = "60%";
    nube.style.transform = "translate(-50%, -50%)";
    nube.style.opacity = "0";

    humoContenedor.appendChild(nube);

    const desplazamientoY = -(100 + Math.random() * 300);
    const desplazamientoX = direccionX * (100 + Math.random() * 200);

    // Animación de entrada y movimiento
    gsap.to(nube, {
      x: desplazamientoX,
      y: desplazamientoY,
      scale: Math.random() * 1.5 + 0.8,
      opacity: 0.6,
      duration: 4 + Math.random() * 2,
      ease: "power2.out",
      onComplete: () => {
        // Desaparecer suavemente antes de remover
        gsap.to(nube, {
          opacity: 0,
          duration: 1.5,
          onComplete: () => nube.remove(),
        });
      },
    });

    // Parpadeo leve en paralelo
    gsap.to(nube, {
      opacity: 0.3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Crear una nube hacia la derecha y otra hacia la izquierda cada 1500 ms
  setInterval(() => {
    crearNube(2); // nube que se mueve a la derecha
    crearNube(-2); // nube que se mueve a la izquierda
  }, 1500);
});
