// JavaScript para la invitación de XV Años

let invitationData = {};

document.addEventListener('DOMContentLoaded', function () {
  // --- Lógica del Sobre Animado y Música (Independiente del JSON) ---
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeClick = document.getElementById('envelope-click');
  const music = document.getElementById('bg-music');
  const playBtn = document.querySelector('.control-btn');

  if (envelopeClick && envelopeOverlay) {
    envelopeClick.addEventListener('click', function() {
      envelopeClick.classList.add('open');
      
      // Iniciar música al abrir el sobre (requerido por políticas de navegador)
      if (music) {
          music.play().then(() => {
              if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.parentElement.classList.add('playing');
              }
          }).catch(err => console.log("Audio bloqueado o error:", err));
      }

      // Esperar a que la animación termine para ocultar el overlay
      setTimeout(() => {
        envelopeOverlay.style.opacity = '0';
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
          envelopeOverlay.style.display = 'none';
        }, 800);
      }, 1200);
    });
  }

  if (playBtn && music) {
    setupMusicToggle(playBtn, music);
  }

  // Cargar datos desde el JSON
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      invitationData = data;
      populateUI(data);
      initInvitationLogic();
      startCountdown(data.fechaEvento);
    })
    .catch(error => console.error('Error cargando los datos:', error));
});

function setupMusicToggle(playBtn, music) {
  playBtn.addEventListener('click', function () {
      if (music.paused) {
          music.play();
          playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          playBtn.parentElement.classList.add('playing');
      } else {
          music.pause();
          playBtn.innerHTML = '<i class="fas fa-play"></i>';
          playBtn.parentElement.classList.remove('playing');
      }
  });
}

function populateUI(data) {
  // Texto básico
  document.getElementById('quin-name').textContent = data.nombre;
  document.getElementById('hero-date').textContent = data.heroFecha;
  document.getElementById('quote-text').textContent = data.frase;
  document.getElementById('father-name').textContent = data.padres.papa;
  document.getElementById('mother-name').textContent = data.padres.mama;
  document.getElementById('invitation-full-date').textContent = data.detallesEvento.invitacionTexto;
  
  // Fecha de evento
  document.getElementById('event-day').textContent = data.detallesEvento.diaSemana;
  document.getElementById('event-month').textContent = data.detallesEvento.diaMes;
  document.getElementById('event-year').textContent = data.detallesEvento.anio;

  // Ubicaciones
  document.getElementById('img-ceremonia').src = data.ubicaciones.ceremonia.imagen;
  document.getElementById('text-ceremonia').innerHTML = `<strong>Ceremonia Religiosa</strong><br>${data.ubicaciones.ceremonia.lugar}, ${data.ubicaciones.ceremonia.hora}`;
  document.getElementById('img-recepcion').src = data.ubicaciones.recepcion.imagen;
  document.getElementById('text-recepcion').innerHTML = `<strong>Recepción</strong><br>${data.ubicaciones.recepcion.lugar}, ${data.ubicaciones.recepcion.hora}`;

  // Vestimenta y Regalos
  document.getElementById('dress-type').textContent = data.vestimenta.tipo;
  document.getElementById('dress-note').innerHTML = data.vestimenta.nota;
  document.getElementById('regalo-banco').textContent = `Banco: ${data.mesaRegalos.banco}`;
  document.getElementById('regalo-titular').textContent = `A nombre de: ${data.mesaRegalos.titular}`;
  document.getElementById('clabe-number').textContent = data.mesaRegalos.clabe;
  
  // RSVP
  document.getElementById('rsvp-deadline').textContent = data.confirmacion.limite;
  
  // Desarrollador - Carga de datos y generación de enlaces
  const dev = data.desarrollador;
  const phoneClean = dev.telefono.replace(/\s+/g, '');
  
  document.getElementById('dev-logo').src = dev.logo;
  document.getElementById('dev-name').textContent = dev.nombre;
  document.getElementById('dev-phone').textContent = dev.telefono;
  document.getElementById('dev-phone-link').href = `tel:${phoneClean}`;
  document.getElementById('dev-whatsapp-link').href = `https://wa.me/${phoneClean.replace('+', '')}`;
  document.getElementById('dev-email').textContent = dev.correo;
  document.getElementById('dev-email-link').href = `mailto:${dev.correo}`;

  // Título de la pestaña
  document.title = `Mis XV Años - ${data.nombre}`;
}

function initInvitationLogic() {
  const data = invitationData;

  // --- Lógica del Modal de Datos Bancarios ---
  const modal = document.getElementById('bank-modal');
  const openModalBtn = document.getElementById('open-bank-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const copyBtn = document.getElementById('copy-clabe');

  if (openModalBtn && modal) {
      openModalBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
      });
  }

  if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
          modal.style.display = 'none';
      });
  }

  // Cerrar si se hace clic fuera del contenido blanco
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Función para copiar la CLABE
  if (copyBtn) {
      copyBtn.addEventListener('click', () => {
          const clabe = document.getElementById('clabe-number').textContent;
          navigator.clipboard.writeText(clabe);
          copyBtn.textContent = '¡COPIADO!';
          setTimeout(() => { copyBtn.textContent = 'COPIAR CLABE'; }, 2000);
      });
  }

  // --- Lógica del Modal de Mapa ---
  const mapModal = document.getElementById('map-modal');
  const closeMapModalBtn = document.getElementById('close-map-modal');
  const mapTitle = document.getElementById('map-title');
  const mapContainer = document.getElementById('map-iframe-container');
  const openMapButtons = document.querySelectorAll('.open-map');

  openMapButtons.forEach(btn => {
      btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-map');
          const mapInfo = data.ubicaciones[type];
          mapTitle.textContent = type === 'ceremonia' ? 'Ceremonia Religiosa' : 'Recepción';
          mapContainer.innerHTML = `<iframe src="${mapInfo.mapa}" allowfullscreen="" loading="lazy"></iframe>`;
          mapModal.style.display = 'flex';
      });
  });

  if (closeMapModalBtn) {
      closeMapModalBtn.addEventListener('click', () => {
          mapModal.style.display = 'none';
          mapContainer.innerHTML = '';
      });
  }

  window.addEventListener('click', (event) => {
      if (event.target === mapModal) {
          mapModal.style.display = 'none';
          mapContainer.innerHTML = '';
      }
  });
  
  // --- Lógica del Modal de Desarrollador ---
  const devModal = document.getElementById('dev-modal');
  const openDevModalBtn = document.getElementById('open-dev-modal');
  const closeDevModalBtn = document.getElementById('close-dev-modal');

  if (openDevModalBtn && devModal) {
      openDevModalBtn.addEventListener('click', () => {
          devModal.style.display = 'flex';
      });
  }

  if (closeDevModalBtn) {
      closeDevModalBtn.addEventListener('click', () => {
          devModal.style.display = 'none';
      });
  }

  window.addEventListener('click', (event) => {
      if (event.target === devModal) {
          devModal.style.display = 'none';
      }
  });
  
  setupRSVPForm(data.confirmacion.scriptUrl);
}

function startCountdown(targetDate) {
  const fechaXV = new Date(targetDate).getTime();

  const intervalo = setInterval(function() {
    // Obtener la fecha y hora actual
    const ahora = new Date().getTime();
    
    // Encontrar la distancia/tiempo restante entre ahora y el evento
    const distancia = fechaXV - ahora;
    
    // Cálculos de tiempo para Días, Horas, Minutos y Segundos
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
    
    // 3. Insertar los resultados en los elementos HTML correspondientes
    // Usamos padStart(2, '0') para que muestre "05" en vez de "5"
    document.getElementById("days").textContent = String(dias).padStart(2, '0');
    document.getElementById("hours").textContent = String(horas).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutos).padStart(2, '0');
    document.getElementById("seconds").textContent = String(segundos).padStart(2, '0');
    
    // 4. Si la cuenta regresiva termina, mostrar un mensaje o dejarlo en cero
    if (distancia < 0) {
        clearInterval(intervalo);
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        
        const note = document.getElementById("countdown-note");
        if (note) note.innerHTML = '<i class="fas fa-glass-cheers"></i> ¡Llegó el momento de celebrar!';
    }
  }, 1000);
}

function setupRSVPForm(urlScript) {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // Cambiar texto del botón para feedback visual
    const submitBtn = document.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'ENVIANDO...';
    submitBtn.disabled = true;

    // Recolectar y validar la opción de asistencia seleccionada
    const asistenciaInput = document.querySelector('input[name="asistencia"]:checked');
    
    if (!asistenciaInput) {
        alert('Por favor, selecciona si asistirás.');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    const nombreInvitado = document.getElementById('guest-name')?.value || 'Anónimo';
    const mensajeInvitado = document.getElementById('guest-message')?.value || '';
    const numeroPersonas = document.getElementById('guest-count')?.value || 1;

    // Usamos URLSearchParams para que Google Apps Script reciba los datos de forma sencilla
    const formData = new URLSearchParams();
    formData.append('asistencia', asistenciaInput.value);
    formData.append('nombre', nombreInvitado);
    formData.append('mensaje', mensajeInvitado);
    formData.append('numeroPersonas', numeroPersonas);

    // Enviar los datos mediante una petición POST (Fetch)
    fetch(urlScript, {
        method: 'POST',
        mode: 'no-cors', 
        body: formData
    })
    .then(() => {
        // Como usamos 'no-cors', asumimos éxito directo si no hay error de red
        alert('¡Gracias! Tu respuesta ha sido enviada con éxito.');
        form.reset(); // Limpia el formulario
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar tu respuesta. Por favor, inténtalo de nuevo.');
    })
    .finally(() => {
        // Restaurar el botón a su estado original
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
  });
}
