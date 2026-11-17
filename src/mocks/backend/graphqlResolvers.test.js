import { bookStore } from './bookStore';
import { executeOperation } from './graphqlResolvers';

beforeEach(() => {
  bookStore.reset();
  localStorage.clear();
});

const validInput = {
  title: 'Pedro Páramo',
  author: 'Juan Rulfo',
  categoryId: '1',
  price: 8990,
  stock: 20,
};

test('Books without arguments returns every book', () => {
  const result = executeOperation('Books', {});

  expect(result.data.books).toHaveLength(16);
  expect(result.errors).toBeUndefined();
});

test('Books returns each book with its category as an object', () => {
  const dune = executeOperation('Books', {}).data.books.find((book) => book.id === 'dune');

  expect(dune.category).toEqual({
    id: '2',
    slug: 'ciencia-ficcion',
    name: 'Ciencia Ficción',
    description: expect.any(String),
  });
  expect(dune).toMatchObject({ price: 15990, stock: 9 });
});

test('Books by slug returns only that category and [] when it has none', () => {
  const fiction = executeOperation('Books', { category: 'ficcion' }).data.books;
  const poetry = executeOperation('Books', { category: 'poesia' });

  expect(fiction.map((book) => book.title)).toEqual([
    'Cien años de soledad',
    'La casa de los espíritus',
  ]);
  expect(poetry).toEqual({ data: { books: [] } });
});

test('Books with an unknown slug is a NOT_FOUND error', () => {
  const result = executeOperation('Books', { category: 'no-existe' });

  expect(result.data).toBeUndefined();
  expect(result.errors[0].extensions).toMatchObject({ code: 'NOT_FOUND', field: 'category' });
});

test('Book returns the book or null without errors', () => {
  expect(executeOperation('Book', { id: 'dune' }).data.book.title).toBe('Dune');
  expect(executeOperation('Book', { id: 'xyz' })).toEqual({ data: { book: null } });
});

test('AddBook creates a book that Books then lists', () => {
  const result = executeOperation('AddBook', { input: validInput });

  expect(result.data.addBook).toMatchObject({ id: 'libro-1', title: 'Pedro Páramo', stock: 20 });
  expect(result.data.addBook.category.name).toBe('Ficción');
  expect(executeOperation('Books', {}).data.books).toHaveLength(17);
});

test('AddBook with a repeated book adds stock and keeps the price', () => {
  const result = executeOperation('AddBook', {
    input: {
      title: 'el hobbit',
      author: 'j. r. r. tolkien',
      categoryId: '3',
      price: 1000,
      stock: 20,
    },
  });

  expect(result.data.addBook).toMatchObject({ id: 'el-hobbit', stock: 38, price: 10990 });
  expect(executeOperation('Books', {}).data.books).toHaveLength(16);
});

test('AddBook reports every invalid field and leaves the store untouched', () => {
  const result = executeOperation('AddBook', {
    input: { ...validInput, title: '   ', price: 0, stock: 2.5 },
  });

  expect(result.errors.map((error) => error.extensions.field)).toEqual(['title', 'price', 'stock']);
  result.errors.forEach((error) => expect(error.extensions.code).toBe('BAD_USER_INPUT'));
  expect(result.data).toBeUndefined();
  expect(bookStore.getAll()).toHaveLength(16);
});

test('AddBook with an unknown category id is a BAD_USER_INPUT error', () => {
  const result = executeOperation('AddBook', { input: { ...validInput, categoryId: '99' } });

  expect(result.errors[0].extensions).toEqual({ code: 'BAD_USER_INPUT', field: 'categoryId' });
});

test('DeleteBook returns the removed book and Book no longer finds it', () => {
  const result = executeOperation('DeleteBook', { id: 'matilda' });

  expect(result.data.deleteBook.title).toBe('Matilda');
  expect(executeOperation('Book', { id: 'matilda' }).data.book).toBeNull();
});

test('DeleteBook with an unknown id is a NOT_FOUND error', () => {
  const result = executeOperation('DeleteBook', { id: 'xyz' });

  expect(result.errors[0].extensions.code).toBe('NOT_FOUND');
});

test('an unknown operation is an error', () => {
  const result = executeOperation('Nope', {});

  expect(result.errors[0].extensions.code).toBe('BAD_REQUEST');
});

describe('simulated failures', () => {
  test('books(category: "error-500") fails with INTERNAL_SERVER_ERROR', () => {
    const result = executeOperation('Books', { category: 'error-500' });

    expect(result.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
  });

  test('addBook with title error-500 fails and does not create the book', () => {
    const result = executeOperation('AddBook', { input: { ...validInput, title: 'error-500' } });

    expect(result.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
    expect(bookStore.getAll()).toHaveLength(16);
  });

  test('mockFailOperation makes that operation fail', () => {
    localStorage.setItem('mockFailOperation', 'Books');

    expect(executeOperation('Books', {}).errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
    expect(executeOperation('Book', { id: 'dune' }).data.book.title).toBe('Dune');
  });

  test('all of them are ignored in production', () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    localStorage.setItem('mockFailOperation', 'Books');
    try {
      expect(executeOperation('Books', {}).data.books).toHaveLength(16);
      expect(executeOperation('Books', { category: 'error-500' }).errors[0].extensions.code).toBe(
        'NOT_FOUND'
      );
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});
