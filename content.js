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

// Función para eliminar todos los subtítulos traducidos residuales
async function removeAllTranslatedSubtitles() {
    const translatedSubtitles = document.querySelectorAll('.translated-subtitle');
    translatedSubtitles.forEach(subtitle => {
      subtitle.remove();
      console.log('Subtítulo traducido residual eliminado:', subtitle.innerText);
    });
}

// Función para eliminar subtítulos traducidos residuales cuando desaparece el subtítulo original
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
      if (computedStyle.position !== 'relative') {
        videoContainer.style.position = 'relative';
        console.log("Position: relative aplicado al contenedor del video.");
      }
    } else {
      console.log("No se encontró el elemento de video.");
    }
}

// Función para obtener el valor almacenado en el almacenamiento local
function getStoredValue(key, defaultValue) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || defaultValue);
      });
    });
}

// Función para aplicar los estilos almacenados a los subtítulos
async function applyStoredStyles() {
    // Recupera los valores almacenados
    const [originalSubtitleSize, translatedSubtitleSize, originalSubtitleColor, translatedSubtitleColor, translatedSubtitleBackgroundColor] = await Promise.all([
      getStoredValue('originalSubtitleSize', '16'),
      getStoredValue('translatedSubtitleSize', '16'),
      getStoredValue('originalSubtitleColor', '#eeeeee'),
      getStoredValue('translatedSubtitleColor', '#FFFF00'),
      getStoredValue('translatedSubtitleBackgroundColor', '#232628')
    ]);

    // Cambia el estilo de los subtítulos originales
    const originalSubtitles = document.querySelectorAll('[data-purpose="captions-cue-text"]');
    originalSubtitles.forEach(subtitle => {
      if (originalSubtitleSize) subtitle.style.fontSize = originalSubtitleSize;
      if (originalSubtitleColor) subtitle.style.color = originalSubtitleColor;
    });

    // Cambia el estilo de los subtítulos traducidos
    const translatedSubtitles = document.querySelectorAll('.translated-subtitle');
    translatedSubtitles.forEach(subtitle => {
      if (translatedSubtitleSize) subtitle.style.fontSize = translatedSubtitleSize;
      if (translatedSubtitleColor) subtitle.style.color = translatedSubtitleColor;
      if (translatedSubtitleBackgroundColor) subtitle.style.backgroundColor = translatedSubtitleBackgroundColor;
    });

    // Devuelve los estilos aplicados
    return {
      originalSubtitleSize,
      translatedSubtitleSize,
      originalSubtitleColor,
      translatedSubtitleColor,
      translatedSubtitleBackgroundColor
    };
}

// Función para traducir los subtítulos
async function processSubtitles() {
    const subtitleContainer = document.querySelector('.captions-display--captions-container--PqdGQ');
  
    if (subtitleContainer) {
      console.log('Contenedor de subtítulos encontrado.');
  
      const subtitleElement = subtitleContainer.querySelector('[data-purpose="captions-cue-text"]');
  
      removeResidualTranslatedSubtitles();
  
      if (subtitleElement) {
        const originalSubtitle = subtitleElement.innerText.trim();
        console.log('Texto del subtítulo original:', subtitleElement.innerText);
        
        try {
          const translatedSubtitle = await translateText(originalSubtitle, 'en', 'es');
          if (translatedSubtitle === null) {
            console.warn('La traducción falló. No se creará un elemento traducido.');
            return; // Salir de la función
          }
  
          // Calcula la posición del subtítulo original
          const rect = subtitleElement.getBoundingClientRect();
  
          // Obtener los estilos almacenados
          const styles = await applyStoredStyles();

          // Crea un nuevo elemento para mostrar el subtítulo traducido
          let translatedElement = document.createElement('div');
          translatedElement.style.fontSize = styles.translatedSubtitleSize;
          translatedElement.style.opacity = getComputedStyle(subtitleElement).opacity;
          translatedElement.style.color = styles.translatedSubtitleColor;
          translatedElement.style.position = 'absolute';

          // Posicionamiento relativo al contenedor
          const containerRect = subtitleContainer.getBoundingClientRect();
          translatedElement.style.left = `${rect.left - containerRect.left}px`; 
          translatedElement.style.top = `${rect.bottom - containerRect.top}px`; 
          translatedElement.style.width = `${rect.width}px`;
          translatedElement.style.height = `${rect.height}px`;
          translatedElement.style.textAlign = getComputedStyle(subtitleElement).textAlign;
          translatedElement.style.zIndex = '9999';
          translatedElement.style.backgroundColor = styles.translatedSubtitleBackgroundColor;
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

// Configura el polling para verificar periódicamente
const pollingInterval2 = 5000; // Intervalo en milisegundos (5 segundos)
setInterval(removeAllTranslatedSubtitles, pollingInterval2);

// Listener para recibir mensajes de popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateStyles') {
      const {
        originalSubtitleSize,
        translatedSubtitleSize,
        originalSubtitleColor,
        translatedSubtitleColor,
        translatedSubtitleBackgroundColor
      } = request;
  
      // Guarda los estilos en el almacenamiento local
      chrome.storage.local.set({
        originalSubtitleSize,
        translatedSubtitleSize,
        originalSubtitleColor,
        translatedSubtitleColor,
        translatedSubtitleBackgroundColor
      });
  
      sendResponse({ status: 'success' });
    }
});
