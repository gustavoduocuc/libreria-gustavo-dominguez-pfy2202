import * as transitions from './inventoryTransitions';

const dune = {
  id: 'dune',
  title: 'Dune',
  author: 'Frank Herbert',
  category: 'Ciencia Ficción',
  price: 15990,
  stock: 9,
};

const hobbit = {
  id: 'el-hobbit',
  title: 'El Hobbit',
  author: 'J. R. R. Tolkien',
  category: 'Fantasía',
  price: 10990,
  stock: 18,
};

function createState() {
  return { books: [dune, hobbit], cartLines: [] };
}

test('registering a repeated book adds stock and keeps the existing price', () => {
  const next = transitions.registerBook(createState(), {
    title: ' dune ',
    author: 'FRANK HERBERT',
    category: 'Ciencia Ficción',
    price: 1,
    stock: 20,
  });

  expect(next.books).toHaveLength(2);
  expect(next.books[0].stock).toBe(29);
  expect(next.books[0].price).toBe(15990);
  expect(next.books[0].title).toBe('Dune');
});

test('the same title with another author stays separate', () => {
  const next = transitions.registerBook(createState(), {
    id: 'dune-2',
    title: 'Dune',
    author: 'Otro Autor',
    category: 'Ciencia Ficción',
    price: 5000,
    stock: 1,
  });

  expect(next.books).toHaveLength(3);
});

test('registering a new book appends a trimmed row with its id', () => {
  const next = transitions.registerBook(createState(), {
    id: 'pedro-paramo-1',
    title: ' Pedro Páramo ',
    author: 'Juan Rulfo',
    category: 'Ficción',
    price: 8990,
    stock: 20,
  });

  expect(next.books).toHaveLength(3);
  expect(next.books[2]).toEqual({
    id: 'pedro-paramo-1',
    title: 'Pedro Páramo',
    author: 'Juan Rulfo',
    category: 'Ficción',
    price: 8990,
    stock: 20,
  });
});

test('deleting a book also drops its cart lines without returning stock', () => {
  const state = {
    books: [{ ...dune, stock: 7 }, hobbit],
    cartLines: [
      { bookId: 'dune', quantity: 2 },
      { bookId: 'el-hobbit', quantity: 1 },
    ],
  };

  const next = transitions.deleteBook(state, 'dune');

  expect(next.books.map((book) => book.id)).toEqual(['el-hobbit']);
  expect(next.cartLines).toEqual([{ bookId: 'el-hobbit', quantity: 1 }]);
  expect(next.books[0].stock).toBe(18);
});

test('adding a unit moves one from the stock to a new cart line', () => {
  const next = transitions.addUnitToCart(createState(), 'dune');

  expect(next.books[0].stock).toBe(8);
  expect(next.cartLines).toEqual([{ bookId: 'dune', quantity: 1 }]);
});

test('adding a second unit increases the existing line', () => {
  const once = transitions.addUnitToCart(createState(), 'dune');
  const twice = transitions.addUnitToCart(once, 'dune');

  expect(twice.books[0].stock).toBe(7);
  expect(twice.cartLines).toEqual([{ bookId: 'dune', quantity: 2 }]);
});

test('adding a unit without stock leaves the state as it was', () => {
  const state = { books: [{ ...dune, stock: 0 }], cartLines: [] };

  expect(transitions.addUnitToCart(state, 'dune')).toBe(state);
});

test('adding a unit of an unknown book leaves the state as it was', () => {
  const state = createState();

  expect(transitions.addUnitToCart(state, 'xyz')).toBe(state);
});

test('removing a unit returns it to the stock', () => {
  const twice = transitions.addUnitToCart(
    transitions.addUnitToCart(createState(), 'dune'),
    'dune'
  );

  const next = transitions.removeUnitFromCart(twice, 'dune');

  expect(next.books[0].stock).toBe(8);
  expect(next.cartLines).toEqual([{ bookId: 'dune', quantity: 1 }]);
});

test('removing the last unit drops the line and restores the stock', () => {
  const once = transitions.addUnitToCart(createState(), 'dune');

  const next = transitions.removeUnitFromCart(once, 'dune');

  expect(next.books[0].stock).toBe(9);
  expect(next.cartLines).toEqual([]);
});

test('removing a unit without a line leaves the state as it was', () => {
  const state = createState();

  expect(transitions.removeUnitFromCart(state, 'dune')).toBe(state);
});

test('transitions do not mutate the previous state', () => {
  const state = createState();

  transitions.addUnitToCart(state, 'dune');

  expect(state.books[0].stock).toBe(9);
  expect(state.cartLines).toEqual([]);
});

test('counting cart units sums every line', () => {
  const lines = [
    { bookId: 'dune', quantity: 2 },
    { bookId: 'el-hobbit', quantity: 3 },
  ];

  expect(transitions.countCartUnits(lines)).toBe(5);
  expect(transitions.countCartUnits([])).toBe(0);
});

test('the cart total sums price times quantity of every line', () => {
  const lines = [
    { bookId: 'dune', quantity: 2 },
    { bookId: 'el-hobbit', quantity: 1 },
  ];

  expect(transitions.calculateCartTotal([dune, hobbit], lines)).toBe(42970);
  expect(transitions.calculateCartTotal([dune, hobbit], [])).toBe(0);
});

test('finding a book returns it by id or nothing', () => {
  const books = [dune, hobbit];

  expect(transitions.findBook(books, 'el-hobbit')).toBe(hobbit);
  expect(transitions.findBook(books, 'xyz')).toBeUndefined();
});
