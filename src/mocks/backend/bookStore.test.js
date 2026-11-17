import { seedBooks } from '../../data';
import { bookStore, createBookStore } from './bookStore';

const newBook = {
  title: 'Pedro Páramo',
  author: 'Juan Rulfo',
  category: 'Ficción',
  price: 8990,
  stock: 20,
};

test('starts from the seed books without mutating them', () => {
  const store = createBookStore(seedBooks);

  store.register(newBook);

  expect(store.getAll()).toHaveLength(17);
  expect(seedBooks).toHaveLength(16);
});

test('registering a new book gives it a sequential id and reports it as created', () => {
  const store = createBookStore(seedBooks);

  const first = store.register(newBook);
  const second = store.register({ ...newBook, title: 'Otro libro' });

  expect(first.created).toBe(true);
  expect(first.book).toEqual({ ...newBook, id: 'libro-1' });
  expect(second.book.id).toBe('libro-2');
});

test('a repeated book adds stock, keeps its price and is not created again', () => {
  const store = createBookStore(seedBooks);

  const result = store.register({
    title: ' el hobbit ',
    author: 'J. R. R. TOLKIEN',
    category: 'Fantasía',
    price: 1,
    stock: 20,
  });

  expect(result.created).toBe(false);
  expect(result.book).toMatchObject({ id: 'el-hobbit', stock: 38, price: 10990 });
  expect(store.getAll()).toHaveLength(16);
});

test('the same title with another author is a different book', () => {
  const store = createBookStore(seedBooks);

  store.register({ ...newBook, title: 'El Hobbit', category: 'Fantasía' });

  expect(store.getAll()).toHaveLength(17);
});

test('removing returns the removed book or nothing', () => {
  const store = createBookStore(seedBooks);

  expect(store.remove('matilda')).toMatchObject({ id: 'matilda' });
  expect(store.findById('matilda')).toBeUndefined();
  expect(store.remove('matilda')).toBeUndefined();
});

test('lists the books of a category by name', () => {
  const store = createBookStore(seedBooks);

  expect(store.listByCategoryName('Ficción')).toHaveLength(2);
  expect(store.listByCategoryName('Poesía')).toEqual([]);
});

test('reset restores the seed', () => {
  const store = createBookStore(seedBooks);
  store.register(newBook);
  store.remove('dune');

  store.reset();

  expect(store.getAll()).toEqual(seedBooks);
});

test('the shared store starts with the seed', () => {
  expect(bookStore.getAll()).toHaveLength(16);
});
