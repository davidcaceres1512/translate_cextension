document.addEventListener('DOMContentLoaded', () => {
    const originalSizeInput = document.getElementById('original-size');
    const translatedSizeInput = document.getElementById('translated-size');
    const originalColorInput = document.getElementById('original-color');
    const translatedColorInput = document.getElementById('translated-color');
    const translatedBgColorInput = document.getElementById('translated-bg-color');
    
    const originalSizeValue = document.getElementById('original-size-value');
    const translatedSizeValue = document.getElementById('translated-size-value');
  
    // Verifica si jQuery está cargado
    if (typeof jQuery === 'undefined') {
      console.error('jQuery is not loaded');
      return;
    }
  
    // Inicializa Spectrum color pickers
    $(originalColorInput).spectrum({
      color: "#eeeeee",
      change: sendMessageToContent
    });
  
    $(translatedColorInput).spectrum({
      color: "#0f0",
      change: sendMessageToContent
    });
  
    $(translatedBgColorInput).spectrum({
      color: "#232628",
      change: sendMessageToContent
    });
  
    // Inicializa valores de tamaño de fuente desde almacenamiento local
    chrome.storage.local.get(['originalSubtitleSize', 'translatedSubtitleSize'], (result) => {
        originalSizeInput.value = result.originalSubtitleSize || 16; // Establece un valor predeterminado si no existe
        translatedSizeInput.value = result.translatedSubtitleSize || 16; // Establece un valor predeterminado si no existe
        originalSizeValue.textContent = originalSizeInput.value;
        translatedSizeValue.textContent = translatedSizeInput.value;
    });
    
    // Event Listeners para los inputs de tamaño
    originalSizeInput.addEventListener('input', (e) => {
      originalSizeValue.textContent = e.target.value;
      sendMessageToContent();
    });
  
    translatedSizeInput.addEventListener('input', (e) => {
      translatedSizeValue.textContent = e.target.value;
      sendMessageToContent();
    });
  
    function sendMessageToContent() {
      chrome.runtime.sendMessage({
        action: 'updateStyles',
        originalSubtitleSize: originalSizeInput.value,
        translatedSubtitleSize: translatedSizeInput.value,
        originalSubtitleColor: $(originalColorInput).spectrum("get").toHexString(),
        translatedSubtitleColor: $(translatedColorInput).spectrum("get").toHexString(),
        translatedSubtitleBackgroundColor: $(translatedBgColorInput).spectrum("get").toHexString()
      });
    }
  });
  