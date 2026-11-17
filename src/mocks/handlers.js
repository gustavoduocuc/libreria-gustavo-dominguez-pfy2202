import { delay, http, HttpResponse } from 'msw';
import { categories } from '../data';
import { listBooksByCategorySlug } from './catalogQueries';

export const categoriesDelayMs = 600;
export const booksDelayMs = 800;

// Slug reservado para probar el estado de error: solo responde 500 fuera de producción.
// En desarrollo, abrir /categorias/error-500. En producción es un slug inexistente (404).
export const simulatedErrorSlug = 'error-500';

function isSimulatedError(slug) {
  return process.env.NODE_ENV !== 'production' && slug === simulatedErrorSlug;
}

function listCategories() {
  return delay(categoriesDelayMs).then(function respond() {
    return HttpResponse.json(categories);
  });
}

function listBooks(info) {
  const slug = new URL(info.request.url).searchParams.get('category');

  return delay(booksDelayMs).then(function respond() {
    if (!slug) {
      return HttpResponse.json({ message: 'Falta el parámetro category.' }, { status: 400 });
    }
    if (isSimulatedError(slug)) {
      return HttpResponse.json({ message: 'Error simulado del servidor.' }, { status: 500 });
    }
    const books = listBooksByCategorySlug(slug);
    if (books === null) {
      return HttpResponse.json(
        { message: `La categoría «${slug}» no existe.` },
        { status: 404 }
      );
    }
    return HttpResponse.json(books);
  });
}

export const handlers = [
  http.get('/api/categories', listCategories),
  http.get('/api/books', listBooks),
];
