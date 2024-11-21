# City TASEP

Para ejecutar el sandbox se puede hacer de la siguiente manera:

Instalación de dependencias:

0. Descargar Node.js de la página oficial: https://nodejs.org/es/download/ y clonar el repositorio.

1. Crear un entorno virtual de python usando conda o virtualenv e instalar las dependencias del archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

2. Instalar las dependencias de Node.js: Abrir una terminal en la carpeta `/PAGINA_TASEP` y ejecutar el siguiente comando:

```bash
npm install
```

Ejecución:

3. Abrir una terminal en la carpeta `/PAGINA_TASEP` y ejecutar el siguiente comando:

```bash
npm run dev
```

y abrir en el navegador la dirección que se muestra en la terminal. (Para detener el servidor, presionar `Ctrl + C` en la terminal)

4. Abrir una termina en la carpeta `/BACKEND`, activar el entorno virtual creado anteriormente y ejecutar el siguiente comando:

```bash
python app.py
```

5. Disfrutar de las simulaciones.

