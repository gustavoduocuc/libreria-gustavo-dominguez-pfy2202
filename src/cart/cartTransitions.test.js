import {
  addUnit,
  calculateCartTotal,
  clearBook,
  countCartUnits,
  removeUnit,
  unitsInCart,
} from './cartTransitions';

const dune = { id: 'dune', price: 15990 };
const hobbit = { id: 'el-hobbit', price: 10990 };

test('adding a unit creates a line and then increases it', () => {
  const once = addUnit([], 'dune');
  const twice = addUnit(once, 'dune');

  expect(once).toEqual([{ bookId: 'dune', quantity: 1 }]);
  expect(twice).toEqual([{ bookId: 'dune', quantity: 2 }]);
});

test('removing a unit decreases the line and drops it at zero', () => {
  const lines = [{ bookId: 'dune', quantity: 2 }];

  expect(removeUnit(lines, 'dune')).toEqual([{ bookId: 'dune', quantity: 1 }]);
  expect(removeUnit(removeUnit(lines, 'dune'), 'dune')).toEqual([]);
  expect(removeUnit(lines, 'xyz')).toEqual(lines);
});

test('clearing a book drops its line and keeps the others', () => {
  const lines = [
    { bookId: 'dune', quantity: 2 },
    { bookId: 'el-hobbit', quantity: 1 },
  ];

  expect(clearBook(lines, 'dune')).toEqual([{ bookId: 'el-hobbit', quantity: 1 }]);
});

test('transitions do not mutate the previous lines', () => {
  const lines = [{ bookId: 'dune', quantity: 1 }];

  addUnit(lines, 'dune');
  removeUnit(lines, 'dune');
  clearBook(lines, 'dune');

  expect(lines).toEqual([{ bookId: 'dune', quantity: 1 }]);
});

test('counts units and finds the units of a book', () => {
  const lines = [
    { bookId: 'dune', quantity: 2 },
    { bookId: 'el-hobbit', quantity: 3 },
  ];

  expect(countCartUnits(lines)).toBe(5);
  expect(countCartUnits([])).toBe(0);
  expect(unitsInCart(lines, 'el-hobbit')).toBe(3);
  expect(unitsInCart(lines, 'xyz')).toBe(0);
});

test('the total sums price times quantity and skips books that no longer exist', () => {
  const lines = [
    { bookId: 'dune', quantity: 2 },
    { bookId: 'el-hobbit', quantity: 1 },
    { bookId: 'gone', quantity: 4 },
  ];

  expect(calculateCartTotal([dune, hobbit], lines)).toBe(42970);
  expect(calculateCartTotal([dune, hobbit], [])).toBe(0);
});
