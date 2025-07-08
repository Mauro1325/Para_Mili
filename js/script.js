document.addEventListener("DOMContentLoaded", () => {
  const sonidoPagina = new Audio("sounds/flip_page.wav");

  let paginaActual = 0;
  const paginas = document.querySelectorAll(".pagina");
  const flechaDerecha = document.getElementById("flechaDerecha");
  const flechaIzquierda = document.getElementById("flechaIzquierda");

  const pantallaInicio = document.getElementById("pantallaInicio");
  const libroCompleto = document.getElementById("libroCompleto");

  function mostrarPagina(index) {
    paginas.forEach((pagina) => {
      pagina.classList.remove("activa", "animar");
    });

    const paginaActualDOM = paginas[index];
    paginaActualDOM.classList.add("activa");
    void paginaActualDOM.offsetWidth;
    paginaActualDOM.classList.add("animar");

    flechaIzquierda.style.visibility = index === 0 ? "hidden" : "visible";
    flechaDerecha.style.visibility =
      index === paginas.length - 1 ? "hidden" : "visible";
  }

  flechaDerecha.addEventListener("click", () => {
    if (paginaActual < paginas.length - 1) {
      paginaActual++;
      mostrarPagina(paginaActual);
      sonidoPagina.currentTime = 0;
      sonidoPagina.play();
    }
  });

  flechaIzquierda.addEventListener("click", () => {
    if (paginaActual > 0) {
      paginaActual--;
      mostrarPagina(paginaActual);
      sonidoPagina.currentTime = 0;
      sonidoPagina.play();
    }
  });

  pantallaInicio.addEventListener("click", () => {
    pantallaInicio.classList.add("oculto");
    libroCompleto.classList.add("visible");
    mostrarPagina(paginaActual);
  });

  libroCompleto.classList.remove("visible");

  // 🔴 PUNTOS ROJOS
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

  // 💨 NUBES (humo)
  const humoContenedor = document.querySelector(".humo-bocanada");
  let nubeActivaCount = 0;
  let intervaloNubes;
  let animacionActiva = true;

  function crearNube(direccionX) {
    if (nubeActivaCount >= 10) return;

    const nube = document.createElement("div");
    nube.classList.add("nube");

    nube.style.left = "50%";
    nube.style.top = "60%";
    nube.style.transform = "translate(-50%, -50%)";
    nube.style.opacity = "0";

    humoContenedor.appendChild(nube);
    nubeActivaCount++;

    const desplazamientoY = -(100 + Math.random() * 300);
    const desplazamientoX = direccionX * (100 + Math.random() * 200);

    gsap.to(nube, {
      x: desplazamientoX,
      y: desplazamientoY,
      scale: Math.random() * 1.5 + 0.8,
      opacity: 0.6,
      duration: 4 + Math.random() * 2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(nube, {
          opacity: 0,
          duration: 1.5,
          onComplete: () => {
            nube.remove();
            nubeActivaCount--;
          },
        });
      },
    });

    gsap.to(nube, {
      opacity: 0.3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  function iniciarNubes() {
    if (!intervaloNubes) {
      intervaloNubes = setInterval(() => {
        if (animacionActiva) {
          crearNube(2);
          crearNube(-2);
        }
      }, 1500);
    }
  }

  function detenerNubes() {
    clearInterval(intervaloNubes);
    intervaloNubes = null;
  }

  // ▶️ Arranca las nubes
  iniciarNubes();

  // 💤 Pausar/Reanudar nubes según visibilidad
  document.addEventListener("visibilitychange", () => {
    animacionActiva = !document.hidden;
  });
});
