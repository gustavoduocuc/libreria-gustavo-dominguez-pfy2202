import { categories } from '../../data';
import { listBooksByCategorySlug } from '../catalogQueries';

// Slug reservado: en desarrollo provoca un 500; en producción es un slug inexistente (404).
export const simulatedErrorSlug = 'error-500';

export function categoriesResponse() {
  return { status: 200, body: categories };
}

export function booksByCategoryResponse(slug) {
  if (!slug) {
    return { status: 400, body: { message: 'Falta el parámetro category.' } };
  }
  if (process.env.NODE_ENV !== 'production' && slug === simulatedErrorSlug) {
    return { status: 500, body: { message: 'Error simulado del servidor.' } };
  }
  const books = listBooksByCategorySlug(slug);
  if (books === null) {
    return { status: 404, body: { message: `La categoría «${slug}» no existe.` } };
  }
  return { status: 200, body: books };
}
