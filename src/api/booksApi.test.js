import { createBook, fetchBook, fetchBooks, removeBook } from './booksApi';

const graphqlDune = {
  id: 'dune',
  title: 'Dune',
  author: 'Frank Herbert',
  category: { id: '2', slug: 'ciencia-ficcion', name: 'Ciencia Ficción' },
  price: 15990,
  stock: 9,
};
const uiDune = {
  id: 'dune',
  title: 'Dune',
  author: 'Frank Herbert',
  category: 'Ciencia Ficción',
  price: 15990,
  stock: 9,
};

function respondWithData(data) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data }),
  });
}

function sentBody() {
  return JSON.parse(global.fetch.mock.calls[0][1].body);
}

afterEach(() => {
  delete global.fetch;
});

test('fetchBooks sends the Books operation and maps the category to its name', async () => {
  respondWithData({ books: [graphqlDune] });

  await expect(fetchBooks()).resolves.toEqual([uiDune]);
  expect(sentBody().operationName).toBe('Books');
  expect(sentBody().query).toMatch(/query Books/);
});

test('fetchBook sends the id and returns null when the book does not exist', async () => {
  respondWithData({ book: graphqlDune });
  await expect(fetchBook('dune')).resolves.toEqual(uiDune);
  expect(sentBody()).toMatchObject({ operationName: 'Book', variables: { id: 'dune' } });

  respondWithData({ book: null });
  await expect(fetchBook('xyz')).resolves.toBeNull();
});

test('createBook sends the AddBook mutation with the input and returns the book', async () => {
  respondWithData({ addBook: graphqlDune });
  const input = { title: 'Dune', author: 'Frank Herbert', categoryId: '2', price: 15990, stock: 9 };

  await expect(createBook(input)).resolves.toEqual(uiDune);
  expect(sentBody()).toMatchObject({ operationName: 'AddBook', variables: { input } });
  expect(sentBody().query).toMatch(/mutation AddBook/);
});

test('removeBook sends the DeleteBook mutation with the id', async () => {
  respondWithData({ deleteBook: graphqlDune });

  await expect(removeBook('dune')).resolves.toEqual(uiDune);
  expect(sentBody()).toMatchObject({ operationName: 'DeleteBook', variables: { id: 'dune' } });
});

test('passes the abort signal to the request', async () => {
  respondWithData({ books: [] });
  const controller = new AbortController();

  await fetchBooks({ signal: controller.signal });

  expect(global.fetch.mock.calls[0][1].signal).toBe(controller.signal);
});
