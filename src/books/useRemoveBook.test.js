import { act, renderHook, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../cart/CartProvider/CartProvider';
import { installFakeBackend, restoreBackend } from '../testing/fakeBackend';
import { BookCatalogProvider, useBookCatalog } from './BookCatalogProvider/BookCatalogProvider';
import { useRemoveBook } from './useRemoveBook';

function wrapper(props) {
  return (
    <CartProvider>
      <BookCatalogProvider>{props.children}</BookCatalogProvider>
    </CartProvider>
  );
}

beforeEach(installFakeBackend);
afterEach(restoreBackend);

async function renderWithTwoUnits() {
  const view = renderHook(
    () => ({ remove: useRemoveBook(), cart: useCart(), catalog: useBookCatalog() }),
    { wrapper }
  );
  await waitFor(() => expect(view.result.current.catalog.status).toBe('success'));
  const matilda = view.result.current.catalog.books.find((book) => book.id === 'matilda');
  act(() => view.result.current.cart.addUnit(matilda));
  expect(view.result.current.cart.cartUnitCount).toBe(1);
  return view;
}

test('removing a book also clears its cart lines', async () => {
  const { result } = await renderWithTwoUnits();

  await act(async () => {
    await result.current.remove('matilda');
  });

  expect(result.current.catalog.books.find((book) => book.id === 'matilda')).toBeUndefined();
  expect(result.current.cart.cartLines).toEqual([]);
});

test('a failed removal keeps the book and the cart lines', async () => {
  const { result } = await renderWithTwoUnits();
  localStorage.setItem('mockFailOperation', 'DeleteBook');

  let failure;
  await act(async () => {
    failure = await result.current.remove('matilda').catch((error) => error);
  });

  expect(failure).toBeInstanceOf(Error);
  expect(result.current.catalog.books.find((book) => book.id === 'matilda')).toBeDefined();
  expect(result.current.cart.cartLines).toEqual([{ bookId: 'matilda', quantity: 1 }]);
});
