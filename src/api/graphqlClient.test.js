import { ApiError } from './ApiError';
import { GraphQLError } from './GraphQLError';
import { graphqlRequest } from './graphqlClient';

function respondWith(status, body) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => (body === undefined ? Promise.reject(new SyntaxError('bad')) : Promise.resolve(body)),
  });
}

afterEach(() => {
  delete global.fetch;
});

const operation = {
  operationName: 'Books',
  query: 'query Books { books { id } }',
  variables: { category: 'ficcion' },
};

test('posts the operation as JSON to /graphql and returns data', async () => {
  respondWith(200, { data: { books: [] } });
  const controller = new AbortController();

  const data = await graphqlRequest({ ...operation, signal: controller.signal });

  expect(data).toEqual({ books: [] });
  const [path, options] = global.fetch.mock.calls[0];
  expect(path).toBe('/graphql');
  expect(options.method).toBe('POST');
  expect(options.headers['Content-Type']).toBe('application/json');
  expect(options.signal).toBe(controller.signal);
  expect(JSON.parse(options.body)).toEqual({
    operationName: 'Books',
    query: operation.query,
    variables: { category: 'ficcion' },
  });
});

test('a non successful HTTP response is an ApiError', async () => {
  respondWith(500, { message: 'caído' });

  const failure = await graphqlRequest(operation).catch((error) => error);

  expect(failure).toBeInstanceOf(ApiError);
  expect(failure).not.toBeInstanceOf(GraphQLError);
  expect(failure.status).toBe(500);
});

test('a 200 response with errors is a GraphQLError with the list, message and field errors', async () => {
  const errors = [
    { message: 'El precio no es válido.', extensions: { code: 'BAD_USER_INPUT', field: 'price' } },
    { message: 'El stock no es válido.', extensions: { code: 'BAD_USER_INPUT', field: 'stock' } },
  ];
  respondWith(200, { errors });

  const failure = await graphqlRequest(operation).catch((error) => error);

  expect(failure).toBeInstanceOf(GraphQLError);
  expect(failure).toBeInstanceOf(ApiError);
  expect(failure.errors).toEqual(errors);
  expect(failure.message).toBe('El precio no es válido.');
  expect(failure.fieldErrors).toEqual({
    price: 'El precio no es válido.',
    stock: 'El stock no es válido.',
  });
  expect(failure.code).toBe('BAD_USER_INPUT');
});

test('errors without a field have no field errors', async () => {
  respondWith(200, { errors: [{ message: 'Falló.', extensions: { code: 'INTERNAL_SERVER_ERROR' } }] });

  const failure = await graphqlRequest(operation).catch((error) => error);

  expect(failure.fieldErrors).toEqual({});
  expect(failure.code).toBe('INTERNAL_SERVER_ERROR');
});

test('a network failure is an ApiError without status', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

  const failure = await graphqlRequest(operation).catch((error) => error);

  expect(failure).toBeInstanceOf(ApiError);
  expect(failure.status).toBeUndefined();
});

test('an invalid body is an ApiError', async () => {
  respondWith(200, undefined);

  await expect(graphqlRequest(operation)).rejects.toBeInstanceOf(ApiError);
});

test('an abort error is passed through', async () => {
  const abort = new DOMException('Aborted', 'AbortError');
  global.fetch = jest.fn().mockRejectedValue(abort);

  await expect(graphqlRequest(operation)).rejects.toBe(abort);
});
