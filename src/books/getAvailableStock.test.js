import { getAvailableStock } from './getAvailableStock';

const dune = { id: 'dune', stock: 9 };

test('available units are the catalog stock minus the units in the cart', () => {
  expect(getAvailableStock(dune, [])).toBe(9);
  expect(getAvailableStock(dune, [{ bookId: 'dune', quantity: 2 }])).toBe(7);
  expect(getAvailableStock(dune, [{ bookId: 'other', quantity: 5 }])).toBe(9);
});

test('available units are never negative', () => {
  expect(getAvailableStock(dune, [{ bookId: 'dune', quantity: 12 }])).toBe(0);
});

test('withAvailableStock copies the books showing available units', async () => {
  const { withAvailableStock } = await import('./getAvailableStock');
  const books = [dune, { id: 'el-hobbit', stock: 4 }];

  const shown = withAvailableStock(books, [{ bookId: 'dune', quantity: 2 }]);

  expect(shown.map((book) => book.stock)).toEqual([7, 4]);
  expect(books[0].stock).toBe(9);
});
