# Sierpe River Camp

Una sola página adaptable a móvil y computadora, en español e inglés. Fotografías reales optimizadas, parallax suave en computadora, filtros de experiencias, detalles de tours, galería ampliable, preguntas frecuentes y consultas de reserva por WhatsApp.

## Subir a GitHub y publicar

1. Crea un repositorio en GitHub.
2. Sube **el contenido** de esta carpeta a la raíz del repositorio: `index.html`, `styles.css`, `app.js`, `content.json`, `assets/` y los demás archivos incluidos. No subas solamente el ZIP.
3. Para publicar con GitHub Pages, abre **Settings → Pages**, elige **Deploy from a branch**, selecciona la rama `main` y la carpeta **/(root)**. Guarda.
4. Cuando termine la publicación, abre **Visit site** desde Pages.

Este proyecto no requiere compilación ni instalación. `.nojekyll` permite servir directamente los archivos estáticos. GitHub Pages requiere un repositorio público para GitHub Free; consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) para otras opciones.

## Editar el contenido

Abre `content.json`. No necesitas modificar el HTML para cambiar los textos, servicios, experiencias, fotos o contacto.

- `brand`: nombre, ubicación, correo, número de WhatsApp y enlace al mapa. WhatsApp usa código de país y número, solo dígitos: `50686634386`.
- `images`: fotografías principales, con rutas relativas al directorio de la página.
- `locales.es` y `locales.en`: todo el contenido visible en español e inglés. Mantén los mismos identificadores de experiencias y categorías en ambos idiomas.
- `amenities.items`: servicios y amenidades.
- `experiences.items`: experiencias; `id` debe ser único, `category` debe coincidir con una categoría existente. Añadir una experiencia aquí agrega su tarjeta y su detalle automáticamente.
- `gallery.items`: fotografías de la galería, descripciones accesibles y títulos.
- `faq.items`: preguntas y respuestas.
- `sources`: referencias de investigación; no se muestran en la página.

El archivo es JSON: usa comillas dobles, no agregues comentarios ni comas después del último elemento. Guarda ambos idiomas para mantener la página completa. Al editar una copia local, publica también el JSON actualizado en el alojamiento; el sitio recibe los cambios en la próxima carga. No incluye un panel de administración.

Para agregar una foto, colócala en `assets` y agrega su ruta en el JSON. Se recomienda WebP, hasta 1800 px para la portada y 1100 px para otras fotos. Las fotos originales proporcionadas se conservaron fuera de este proyecto; aquí se incluyen copias optimizadas.

## Reservas

Todos los botones usan el número de `brand.whatsapp`, tomado de `public/resumeData.json` del proyecto original. El formulario valida nombre, personas y fechas, y abre WhatsApp con un mensaje preparado. El visitante debe enviar el mensaje personalmente. No procesa pagos ni confirma reservas, no se conecta a Booking y no guarda consultas en un servidor.

Las fechas son opcionales; si completas una, debes completar la otra. La salida debe ser posterior a la llegada. La fecha mínima usa la zona horaria de Costa Rica.

## Abrir o alojar la página

Publica el contenido de esta carpeta en un alojamiento web estático. No requiere instalación de dependencias ni compilación. Para una vista local, sirve esta carpeta con un servidor HTTP, por ejemplo:

```sh
python3 -m http.server 4173
```

Después abre `http://localhost:4173`. No abras `index.html` con doble clic: los navegadores restringen la lectura de JSON desde archivos locales.

`app.js` carga el contenido con `loadContent()`. Para conectar una base de datos en el futuro, reemplaza esta función por una llamada a tu API que devuelva la misma estructura JSON. No coloques credenciales de una base de datos en el navegador.

## Diseño y accesibilidad

Sin librerías de interfaz, fuentes remotas ni recursos externos de carga. Fotografías WebP con carga diferida y portada móvil reducida. Interacciones con teclado, diálogos accesibles y etiquetas de formulario. Se respeta la preferencia del dispositivo de reducir movimiento; en móvil se omite el parallax. Las animaciones usan transformaciones y un único ciclo por cuadro de desplazamiento.

## Datos para revisar con el anfitrión

La investigación confirma el carácter familiar y rústico, las comidas por coordinar, cocina compartida, hamacas, muelle y experiencias de naturaleza. Algunas fuentes describen una visita en 2023. No se publican precios, capacidades exactas ni horarios de entrada y salida. Consultar disponibilidad, estado de instalaciones, condiciones de mascotas, traslados y detalles de los tours antes de anunciar condiciones definitivas.

Se usó el nombre **Sierpe River Camp**, presente en el proyecto y las fotografías compartidas. Las fotografías de las tarjetas de Corcovado e Isla del Caño muestran el entorno del camp, no los destinos; sus descripciones accesibles lo indican. Pueden sustituirse desde el JSON por fotografías específicas de los tours.
