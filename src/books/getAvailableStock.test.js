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
