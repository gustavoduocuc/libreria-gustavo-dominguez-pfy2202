import { bookStore } from '../mocks/backend/bookStore';
import { executeOperation } from '../mocks/backend/graphqlResolvers';
import { booksByCategoryResponse, categoriesResponse } from '../mocks/backend/restResponses';

// fetch simulado que recorre la lógica real del backend mock (sin msw/node, incompatible con Jest de CRA).
function toResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

function route(path, options) {
  const url = new URL(path, 'http://localhost');
  if (url.pathname === '/graphql') {
    const { operationName, variables } = JSON.parse(options.body);
    return toResponse(200, executeOperation(operationName, variables));
  }
  if (url.pathname === '/api/categories') {
    const response = categoriesResponse();
    return toResponse(response.status, response.body);
  }
  if (url.pathname === '/api/books') {
    const response = booksByCategoryResponse(url.searchParams.get('category'));
    return toResponse(response.status, response.body);
  }
  throw new TypeError(`Sin respuesta simulada para ${path}`);
}

export function installFakeBackend() {
  bookStore.reset();
  global.fetch = jest.fn(function fakeFetch(path, options = {}) {
    return new Promise(function respond(resolve, reject) {
      if (options.signal && options.signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      try {
        resolve(route(path, options));
      } catch (error) {
        reject(error);
      }
    });
  });
}

export function restoreBackend() {
  delete global.fetch;
  bookStore.reset();
}
