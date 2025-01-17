// URL de tu servidor local de LibreTranslate
const translateApiUrl = 'http://localhost:5000/translate';

// Función para traducir el texto usando LibreTranslate
async function translateText(text, sourceLang = 'en', targetLang = 'es') {
  try {
    const response = await fetch(translateApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la traducción');
    }

    const data = await response.json();
    return data.translatedText || '';  // Asegúrate de manejar el caso en que no haya traducción
  } catch (error) {
    console.error('Error al traducir el texto:', error);
    return null; // Retorna null en caso de error
  }
}

// Función para eliminar subtítulos traducidos residuales
function removeResidualTranslatedSubtitles() {
    const residuals = document.querySelectorAll('.translated-subtitle');
    residuals.forEach(element => {
      if (!document.querySelector('[data-purpose="captions-cue-text"]')) {
        // Elimina el subtítulo traducido solo si no hay subtítulos originales visibles
        element.remove();
      }
    });
  }

 // Función para asegurar que el contenedor del video tenga position: relative
 function ensureVideoContainerRelativePosition() {
    const videoElement = document.querySelector('video');
  
    if (videoElement) {
      // Selecciona el contenedor del video o el propio video
      const videoContainer = videoElement.parentElement;
  
      // Verifica si tiene position que no sea relative
      const computedStyle = window.getComputedStyle(videoContainer);
      console.log('computedStyle.position: ', computedStyle.position);
      if (computedStyle.position !== 'relative') {
        // Si no tiene position: relative, lo aplicamos (independientemente de si es static, absolute, etc.)
        videoContainer.style.position = 'relative';
        console.log("Position: relative aplicado al contenedor del video.");
      } else {
        console.log("El contenedor del video ya tiene position: relative.");
      }
    } else {
      console.log("No se encontró el elemento de video.");
    }
  }


// Función para procesar y traducir los subtítulos
async function processSubtitles() {
  // Asegúrate de que el contenedor del video tenga position: relative
  ensureVideoContainerRelativePosition();

  const subtitleContainer = document.querySelector('.captions-display--captions-container--PqdGQ');

  if (subtitleContainer) {
    console.log('Contenedor de subtítulos encontrado.');

    const subtitleElement = subtitleContainer.querySelector('[data-purpose="captions-cue-text"]');

    // Elimina los residuos de subtítulos traducidos
    removeResidualTranslatedSubtitles();
    
    if (subtitleElement) {
      const originalSubtitle = subtitleElement.innerText.trim();
      console.log('Texto del subtítulo original:', originalSubtitle);

      try {
        const translatedSubtitle = await translateText(originalSubtitle, 'en', 'es');
        if (translatedSubtitle === null) {
          // Si hay un error en la traducción, no se hace nada
          console.warn('La traducción falló. No se creará un elemento traducido.');
          return; // Salir de la función
        }

        console.log('Subtítulo traducido:', translatedSubtitle);

        // Calcula la posición del subtítulo original
        const rect = subtitleElement.getBoundingClientRect();
        console.log('rect.left:', rect.left);
        console.log('rect.bottom:', rect.bottom);

        // Crea un nuevo elemento para mostrar el subtítulo traducido
        let translatedElement = document.createElement('div');
        translatedElement.style.fontSize = getComputedStyle(subtitleElement).fontSize; // Usa el mismo tamaño de fuente
        translatedElement.style.opacity = getComputedStyle(subtitleElement).opacity; // Usa la misma opacidad
        translatedElement.style.color = 'yellow'; // Cambia el color del texto traducido para diferenciarlo
        translatedElement.style.position = 'absolute'; // Posiciona el nuevo subtítulo
        translatedElement.style.left = rect.left; // Ajusta la posición horizontal
        translatedElement.style.top = rect.bottom + window.scrollY+20; // Ajusta la posición vertical
        translatedElement.style.width = rect.width; // Ajusta el ancho
        translatedElement.style.height = rect.height;
        translatedElement.style.textAlign = getComputedStyle(subtitleElement).textAlign; // Usa la misma alineación
        translatedElement.style.zIndex = '9999'; // Asegúrate de que el subtítulo traducido esté sobre el subtítulo original
        translatedElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fondo semitransparente para mayor visibilidad
        translatedElement.className = 'translated-subtitle';

        translatedElement.innerText = translatedSubtitle;

        // Remueve cualquier subtítulo traducido previo
        const previousTranslation = subtitleElement.nextSibling;
        if (previousTranslation && previousTranslation.className === 'translated-subtitle') {
          previousTranslation.remove();
        }

        // Inserta el subtítulo traducido justo debajo del original
        subtitleElement.parentNode.insertBefore(translatedElement, subtitleElement.nextSibling);
      } catch (error) {
        console.error('Error al procesar el subtítulo:', error);
      }
    }
  } else {
    console.warn('Contenedor de subtítulos no encontrado. Reintentando...');
  }
}

// Configura el polling para verificar periódicamente
const pollingInterval = 1000; // Intervalo en milisegundos (1 segundo)
setInterval(processSubtitles, pollingInterval);


