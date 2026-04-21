# Landing Page Uriel Tattoo

Sitio web para el estudio de tatuajes de Uriel Ibarra Reyes en Santiago Centro.

## Estructura del Proyecto

```
Landing-tattoo/
├── index.html              # Página principal
├── faltante.rtf            # Archivo de notas (posiblemente temporal)
├── assets/                 # Recursos estáticos
│   ├── images/             # Imágenes estáticas
│   │   ├── logo.png
│   │   ├── mi-flecha.svg
│   │   ├── mi-mano.svg
│   │   └── sobre-mi.PNG
│   └── media/              # Medios optimizados
│       ├── Fotos/          # Galería de fotos
│       │   └── optimized/
│       ├── diseños/        # Diseños flash
│       │   └── optimized/
│       └── videos/         # Videos del portafolio
│           └── optimized/
├── css/                    # Hojas de estilo
│   └── style.css
├── js/                     # JavaScript
│   └── main.js
├── pages/                  # Páginas adicionales
│   ├── accesibilidad.html
│   ├── politica-cookies.html
│   ├── politica-privacidad.html
│   └── terminos-uso.html
└── scripts/                # Utilidades
    └── optimize_media.sh
```

## Cómo ejecutar

1. Abre `index.html` en un navegador web.
2. Las páginas adicionales están en la carpeta `pages/`.

## Optimización de medios

Ejecuta el script `scripts/optimize_media.sh` para optimizar imágenes y videos en las carpetas `assets/media/*/`.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- EmailJS para formularios