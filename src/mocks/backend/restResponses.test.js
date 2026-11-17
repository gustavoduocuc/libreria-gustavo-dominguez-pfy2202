import { bookStore } from './bookStore';
import { executeOperation } from './graphqlResolvers';
import { booksByCategoryResponse, categoriesResponse } from './restResponses';

beforeEach(() => bookStore.reset());

test('categories respond 200 with the nine categories', () => {
  const response = categoriesResponse();

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(9);
});

test('books by category respond 200, [] , 404 and 400', () => {
  expect(booksByCategoryResponse('ficcion').body).toHaveLength(2);
  expect(booksByCategoryResponse('poesia')).toEqual({ status: 200, body: [] });
  expect(booksByCategoryResponse('no-existe').status).toBe(404);
  expect(booksByCategoryResponse('no-existe').body.message).toMatch(/no existe/);
  expect(booksByCategoryResponse(null).status).toBe(400);
});

test('REST books keep the category as a name', () => {
  expect(booksByCategoryResponse('ficcion').body[0].category).toBe('Ficción');
});

test('a book added with GraphQL shows up in its REST category', () => {
  executeOperation('AddBook', {
    input: { title: 'Versos', author: 'Alguien', categoryId: '9', price: 5000, stock: 3 },
  });

  expect(booksByCategoryResponse('poesia').body.map((book) => book.title)).toEqual(['Versos']);
});

test('a book deleted with GraphQL disappears from its REST category', () => {
  executeOperation('DeleteBook', { id: 'matilda' });

  expect(booksByCategoryResponse('infantil-juvenil').body.map((book) => book.title)).toEqual([
    'El principito',
  ]);
});

test('the simulated 500 only exists outside production', () => {
  expect(booksByCategoryResponse('error-500').status).toBe(500);
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    expect(booksByCategoryResponse('error-500').status).toBe(404);
  } finally {
    process.env.NODE_ENV = previous;
  }
});
