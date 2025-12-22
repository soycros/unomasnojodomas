// Configuración
const YOUTUBE_ID = "YOUTUBE_VIDEO_ID"; // Reemplazar con el ID real
const PAGE_URL = window.location.href;

// Enlaces para compartir
function updateShareLinks() {
  const title = "UNA MAS, NO JODO MAS — Estreno oficial";
  const youtubeUrl = `https://www.youtube.com/watch?v=${YOUTUBE_ID}`;

  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(youtubeUrl)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} ${youtubeUrl}`)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;

  const elTwitter = document.getElementById("shareTwitter");
  const elWhatsApp = document.getElementById("shareWhatsApp");
  const elFacebook = document.getElementById("shareFacebook");
  const elNative = document.getElementById("shareNative");
  const elYoutubeLink = document.getElementById("youtubeLink");

  if (elTwitter) elTwitter.href = twitter;
  if (elWhatsApp) elWhatsApp.href = whatsapp;
  if (elFacebook) elFacebook.href = facebook;
  if (elYoutubeLink) elYoutubeLink.href = youtubeUrl;

  if (navigator.share && elNative) {
    elNative.addEventListener("click", async () => {
      try {
        await navigator.share({
          title,
          text: "Mirá el estreno en YouTube",
          url: youtubeUrl
        });
      } catch (_) { /* usuario canceló */ }
    });
  } else if (elNative) {
    elNative.style.display = "none";
  }
}

// Fondo de estrellas minimalista
function initStars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let w, h, stars;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = Array.from({ length: Math.round((w * h) / 8000) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.6 + 0.2,
      tw: Math.random() * 0.02 + 0.005
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.6, h * 0.1, w * 0.5, h * 0.6, h * 0.9);
    grad.addColorStop(0, "rgba(38, 209, 195, 0.06)");
    grad.addColorStop(0.5, "rgba(184, 75, 255, 0.05)");
    grad.addColorStop(1, "rgba(7, 8, 13, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      const pulse = s.a + Math.sin((t * s.tw) + s.x) * 0.25;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, pulse));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#e6e9f2";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

// --- MODO CINE ---
function initCinemaMode() {
  const iframe = document.querySelector(".video-frame iframe");
  const videoFrame = document.querySelector(".video-frame");

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "cinema-overlay";
  document.body.appendChild(overlay);

  // Cargar API de YouTube
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    const player = new YT.Player(iframe, {
      events: {
        'onStateChange': (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            videoFrame.classList.add("cinema-mode");
            overlay.style.display = "block";
          }
        }
      }
    });
  };

  // Al hacer clic fuera del video, volver al estado normal
  overlay.addEventListener("click", () => {
    videoFrame.classList.remove("cinema-mode");
    overlay.style.display = "none";
    // No pausamos el video, solo cerramos el modo cine
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  updateShareLinks();
  initStars();
  initCinemaMode();
});
