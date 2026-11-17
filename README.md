# Librería Tinta y Papel

Tienda de libros. Muestra un catálogo de libros por categoría, el detalle de cada libro, un carrito y la gestión del inventario. Los datos viven en memoria y se reinician al recargar.

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
| `/categorias` | Lista de categorías (API mock) |
| `/categorias/:slug` | Libros de una categoría (API mock) |
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

## API mock

Las páginas de categorías consumen una API REST simulada con [MSW](https://mswjs.io) que corre en el navegador (service worker). Está activa por defecto, también en el sitio publicado.

| Petición | Respuesta |
|---|---|
| `GET /api/categories` | Las 9 categorías (`id`, `slug`, `name`, `description`) |
| `GET /api/books?category=<slug>` | Libros de la categoría; `[]` si no tiene (p. ej. `poesia`); 404 si el slug no existe; 400 si falta `category` |

- **Desactivarla:** compila con `REACT_APP_USE_MOCKS=false` (ver `.env.example`). Si ya visitaste el sitio con el mock activo, des-registra el service worker en DevTools → Application → Service Workers.
- **Probar un error 500 (solo en desarrollo):** con `npm start`, abre `/libreria-gustavo-dominguez-pfy2202/categorias/error-500`. En el build publicado ese slug responde 404.
- **Limitación:** los libros agregados desde el formulario, el stock descontado por el carrito y los libros eliminados aún no se reflejan en las páginas de categoría, que muestran los datos semilla.
- `npm start` sirve la app bajo `/libreria-gustavo-dominguez-pfy2202/` (por el campo `homepage`).

## Publicación

El sitio se publica en [https://gustavoduocuc.github.io/libreria-gustavo-dominguez-pfy2202](https://gustavoduocuc.github.io/libreria-gustavo-dominguez-pfy2202).
