import { act, renderHook, waitFor } from '@testing-library/react';
import { GraphQLError } from '../../api/GraphQLError';
import { installFakeBackend, restoreBackend } from '../../testing/fakeBackend';
import { BookCatalogProvider, useBookCatalog } from './BookCatalogProvider';

function wrapper(props) {
  return <BookCatalogProvider>{props.children}</BookCatalogProvider>;
}

const validInput = { title: 'Pedro Páramo', author: 'Juan Rulfo', categoryId: '1', price: 8990, stock: 20 };

beforeEach(installFakeBackend);
afterEach(restoreBackend);

async function renderLoaded() {
  const view = renderHook(() => useBookCatalog(), { wrapper });
  await waitFor(() => expect(view.result.current.status).toBe('success'));
  return view;
}

test('starts loading and then exposes the books', async () => {
  const { result } = renderHook(() => useBookCatalog(), { wrapper });

  expect(result.current.status).toBe('loading');
  await waitFor(() => expect(result.current.status).toBe('success'));
  expect(result.current.books).toHaveLength(16);
  expect(result.current.books[0].category).toBe('Ficción');
});

test('a failed load is an error that reload can recover from', async () => {
  localStorage.setItem('mockFailOperation', 'Books');
  const { result } = renderHook(() => useBookCatalog(), { wrapper });

  await waitFor(() => expect(result.current.status).toBe('error'));
  expect(result.current.error.message).toMatch(/servidor/i);

  localStorage.clear();
  act(() => result.current.reload());

  expect(result.current.status).toBe('loading');
  await waitFor(() => expect(result.current.status).toBe('success'));
  expect(result.current.books).toHaveLength(16);
});

test('adding a book resolves with it and refreshes the list', async () => {
  const { result } = await renderLoaded();

  let added;
  await act(async () => {
    added = await result.current.addBook(validInput);
  });

  expect(added).toMatchObject({ id: 'libro-1', title: 'Pedro Páramo', category: 'Ficción' });
  expect(result.current.books).toHaveLength(17);
  expect(result.current.status).toBe('success');
});

test('adding a repeated book adds stock without a new row', async () => {
  const { result } = await renderLoaded();

  await act(async () => {
    await result.current.addBook({
      title: 'el hobbit',
      author: 'j. r. r. tolkien',
      categoryId: '3',
      price: 1,
      stock: 20,
    });
  });

  expect(result.current.books).toHaveLength(16);
  expect(result.current.books.find((book) => book.id === 'el-hobbit').stock).toBe(38);
});

test('an invalid book rejects with the field errors and leaves the list alone', async () => {
  const { result } = await renderLoaded();

  let failure;
  await act(async () => {
    failure = await result.current.addBook({ ...validInput, price: 0 }).catch((error) => error);
  });

  expect(failure).toBeInstanceOf(GraphQLError);
  expect(failure.fieldErrors).toHaveProperty('price');
  expect(result.current.books).toHaveLength(16);
});

test('removing a book refreshes the list', async () => {
  const { result } = await renderLoaded();

  await act(async () => {
    await result.current.removeBook('matilda');
  });

  expect(result.current.books).toHaveLength(15);
  expect(result.current.books.find((book) => book.id === 'matilda')).toBeUndefined();
});

test('a failed removal rejects and keeps the book', async () => {
  const { result } = await renderLoaded();
  localStorage.setItem('mockFailOperation', 'DeleteBook');

  let failure;
  await act(async () => {
    failure = await result.current.removeBook('matilda').catch((error) => error);
  });

  expect(failure).toBeInstanceOf(GraphQLError);
  expect(result.current.books).toHaveLength(16);
});

test('useBookCatalog needs its provider', () => {
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useBookCatalog())).toThrow(/BookCatalogProvider/);
  errors.mockRestore();
});
