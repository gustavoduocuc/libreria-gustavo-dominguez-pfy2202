# Librería Tinta y Papel

Tienda de libros desarrollada para la asignatura PFY2202 (Desarrollo Frontend II). Muestra un catálogo de libros por categoría, el detalle de cada libro, un carrito y la gestión del inventario. Los datos viven en memoria y se reinician al recargar.

## Stack

- React 19 con Create React App (`react-scripts`)
- React Router
- Tailwind CSS
- API REST mock con MSW

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Catálogo con filtro por categoría |
| `/libros/:bookId` | Detalle del libro |
| `/carrito` | Carrito |
| `/quienes-somos`, `/contacto` | Información de la librería |
| `/gestion-libros/agregar-libro` | Formulario para agregar un libro |
| `/gestion-libros/inventario-libros` | Tabla de libros con eliminación |

## Requisitos

- Node.js según la versión indicada en `.nvmrc`
- npm

## Instalación y ejecución

```bash
npm ci          # instala las dependencias
npm start       # servidor de desarrollo en http://localhost:3000
npm test        # pruebas en modo interactivo
npm run build   # build de producción en la carpeta build/
```

## Publicación

El sitio se publica en [https://gustavoduocuc.github.io/libreria-gustavo-dominguez-pfy2202](https://gustavoduocuc.github.io/libreria-gustavo-dominguez-pfy2202).
