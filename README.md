Para instalar y utilizar la API de **LibreTranslate** directamente desde un entorno virtual en Python, sigue los pasos a continuación.

### **1. Crear y Activar un Entorno Virtual**

Si aún no tienes un entorno virtual configurado, es una buena práctica crearlo para mantener tus dependencias organizadas. Aquí te muestro cómo hacerlo:

1. **Crear el Entorno Virtual**:

   En la terminal, navega a tu proyecto y crea un entorno virtual con el siguiente comando:

   ```bash
   python -m venv env
   ```

   Esto creará una carpeta llamada `env` en tu directorio actual, que contendrá una instalación aislada de Python.

2. **Activar el Entorno Virtual**:

   - En Windows, activa el entorno con:

     ```bash
     .\env\Scripts\activate
     ```

   - En macOS o Linux, usa:

     ```bash
     source env/bin/activate
     ```

   Una vez activado, deberías ver el nombre del entorno (`env`) en el prompt de tu terminal.

   > Nota: el entorno virtual se ha creado en "D:\scripts\scripts-github-projects\trans_local_server", así que ejecutarlo desde ahí.

### **2. Instalar la Librería `libretranslate-py`**

La API de **LibreTranslate** tiene un cliente oficial para Python llamado `libretranslate-py`. Para instalarlo, usa el siguiente comando dentro de tu entorno virtual activado:

```bash
pip install libretranslate-py
```

### **3. Uso de `libretranslate-py` en Tu Proyecto**

Una vez que hayas instalado la librería, puedes usarla en tu proyecto para hacer traducciones con la API de LibreTranslate. Aquí tienes un ejemplo básico de cómo usarla:

```python
from libretranslatepy import LibreTranslateAPI

# Conectar a la API de LibreTranslate (usando el servidor predeterminado)
lt = LibreTranslateAPI("https://libretranslate.com")

# Traducir texto
translated_text = lt.translate("Hello, world!", "en", "es")
print(translated_text)
```

Este código enviará una solicitud a la API de **LibreTranslate** para traducir el texto `"Hello, world!"` del inglés al español.

### **4. Desplegar tu Proyecto**

Si planeas usar esta configuración en un proyecto más grande o compartirlo con otras personas, es importante congelar las dependencias en un archivo `requirements.txt`:

1. **Generar `requirements.txt`**:

   Con el entorno virtual activado, ejecuta:

   ```bash
   pip freeze > requirements.txt
   ```

   Esto guardará todas las dependencias de tu entorno en un archivo `requirements.txt`.

2. **Ejecutar el servidor local de traducciones "libretranslate"**:

   En el terminal, ejecuta:
   ```bash
   libretranslate --debug
   ```
   > OBS:
   > revisar los argumentos posibles en el siguiente [link](https://github.com/LibreTranslate/LibreTranslate?tab=readme-ov-file#settings--flags)

3. **Comprobar que tu servidor está en servicio**:
   En el terminal de windows, ejecuta:

   ```
   curl -X POST "https://libretranslate.com/translate" -H "Content-Type: application/json" -d "{\"q\": \"Hello, world!\", \"source\": \"en\", \"target\": \"es\"}"
   ```

   O también puedes probarlo ingresando en tu navegador web:
   http://localhost:5000
   
> Opcional
> 
> 4. **Desplegar el Proyecto en Otro Entorno**:
> 
>    Para instalar las dependencias en otro entorno (por ejemplo, en producción o en otro equipo), simplemente activa el entorno virtual en ese lugar y ejecuta:
> 
>    ```bash
>    pip install -r requirements.txt
>    ```

### **Conclusión**

Siguiendo estos pasos, podrás instalar y usar la API de **LibreTranslate** en tu entorno virtual de Python para realizar traducciones. Esto te permitirá trabajar con traducciones directamente desde Python y mantener tu entorno de trabajo limpio y aislado.

Si tienes alguna duda adicional o te encuentras con algún problema durante el proceso, no dudes en preguntar.

# REFERENCES

requirements.txt
```cmd
appdirs==1.4.4
APScheduler==3.9.1
argos-translate-files==1.1.4
argostranslate==1.9.6
async-timeout==4.0.3
babel==2.16.0
beautifulsoup4==4.9.3
cachelib==0.13.0
certifi==2024.8.30
charset-normalizer==3.3.2
click==8.1.7
colorama==0.4.6
commonmark==0.9.1
ctranslate2==4.3.1
Deprecated==1.2.14
expiringdict==1.2.2
filelock==3.15.4
Flask==2.2.5
flask-babel==3.1.0
Flask-Cors==5.0.0
Flask-Limiter==2.6.3
Flask-Session==0.4.0
flask-swagger==0.2.14
flask-swagger-ui==4.11.1
fsspec==2024.6.1
idna==3.8
importlib_resources==6.4.4
itsdangerous==2.1.2
Jinja2==3.1.4
joblib==1.4.2
langdetect==1.0.9
LexiLang==1.0.1
libretranslate==1.6.0
limits==3.13.0
lxml==5.3.0
MarkupSafe==2.1.5
Morfessor==2.0.6
mpmath==1.3.0
networkx==3.3
numpy==1.23.5
packaging==23.1
polib==1.1.1
prometheus-client==0.15.0
protobuf==5.28.0
Pygments==2.18.0
pytz==2024.1
PyYAML==6.0.2
redis==4.4.4
regex==2024.7.24
requests==2.31.0
rich==12.6.0
sacremoses==0.0.53
sentencepiece==0.2.0
six==1.16.0
soupsieve==2.6
stanza==1.1.1
sympy==1.13.2
torch==2.0.1
tqdm==4.66.5
translatehtml==1.5.2
typing_extensions==4.12.2
tzdata==2024.1
tzlocal==5.2
urllib3==2.2.2
waitress==2.1.2
Werkzeug==2.3.8
wrapt==1.16.0

```