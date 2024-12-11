// Código de fondo básico para la extensión
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensión instalada y lista.');
  });
  
  // Escucha los mensajes del popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Mensaje recibido en background.js:', request);
  
    if (request.action === 'updateStyles') {

      console.log('Preferencias recibidas:', request);
      // Guarda las preferencias en el almacenamiento local
      chrome.storage.local.set({
        originalSubtitleSize: request.originalSubtitleSize,
        translatedSubtitleSize: request.translatedSubtitleSize,
        originalSubtitleColor: request.originalSubtitleColor,
        translatedSubtitleColor: request.translatedSubtitleColor,
        translatedSubtitleBackgroundColor: request.translatedSubtitleBackgroundColor
      }, () => {
        console.log('Preferencias guardadas en almacenamiento local.');
        // Envía un mensaje al script de contenido para actualizar los estilos
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateStyles',
            originalSubtitleSize: request.originalSubtitleSize,
            translatedSubtitleSize: request.translatedSubtitleSize,
            originalSubtitleColor: request.originalSubtitleColor,
            translatedSubtitleColor: request.translatedSubtitleColor,
            translatedSubtitleBackgroundColor: request.translatedSubtitleBackgroundColor
          });
        });
      });
  
      sendResponse({ status: 'success' });
    }
  });
  