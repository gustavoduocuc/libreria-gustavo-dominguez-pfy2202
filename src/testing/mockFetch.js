// Respuestas simuladas de fetch para pruebas (sin msw/node, incompatible con Jest de CRA).
export function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

export function mockFetch(routes) {
  global.fetch = jest.fn(function fakeFetch(path, options) {
    // El catálogo del cascarón pide los libros al montar; por defecto responde sin libros.
    const handler = path === '/graphql' && !routes[path] ? jsonResponse(200, { data: { books: [] } }) : routes[path];
    if (!handler) {
      return Promise.reject(new TypeError(`Sin respuesta simulada para ${path}`));
    }
    return new Promise(function respond(resolve, reject) {
      if (options && options.signal) {
        options.signal.addEventListener('abort', function abort() {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
      Promise.resolve(typeof handler === 'function' ? handler() : handler).then(resolve, reject);
    });
  });
}

export function restoreFetch() {
  delete global.fetch;
}
