import { delay, graphql, http, HttpResponse } from 'msw';
import { executeOperation } from './backend/graphqlResolvers';
import { booksByCategoryResponse, categoriesResponse } from './backend/restResponses';

export const categoriesDelayMs = 600;
export const booksDelayMs = 800;

const graphqlDelaysMs = { Books: 500, Book: 300, AddBook: 600, DeleteBook: 500 };

// Fallos simulados (solo fuera de producción): ver restResponses.js y graphqlResolvers.js.
// REST: abrir /categorias/error-500. GraphQL: localStorage.mockFailOperation = 'Books' | 'Book' |
// 'AddBook' | 'DeleteBook', o el título "error-500" al agregar un libro.

function respondWith(response) {
  return HttpResponse.json(response.body, { status: response.status });
}

function listCategories() {
  return delay(categoriesDelayMs).then(function respond() {
    return respondWith(categoriesResponse());
  });
}

function listBooks(info) {
  const slug = new URL(info.request.url).searchParams.get('category');
  return delay(booksDelayMs).then(function respond() {
    return respondWith(booksByCategoryResponse(slug));
  });
}

const api = graphql.link('/graphql');

function resolveOperation(operationName) {
  return function resolve(info) {
    return delay(graphqlDelaysMs[operationName]).then(function respond() {
      return HttpResponse.json(executeOperation(operationName, info.variables));
    });
  };
}

export const handlers = [
  http.get('/api/categories', listCategories),
  http.get('/api/books', listBooks),
  api.query('Books', resolveOperation('Books')),
  api.query('Book', resolveOperation('Book')),
  api.mutation('AddBook', resolveOperation('AddBook')),
  api.mutation('DeleteBook', resolveOperation('DeleteBook')),
];
