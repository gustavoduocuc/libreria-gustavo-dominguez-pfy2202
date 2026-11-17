import { bookCategories, seedBooks } from './index';

function booksOf(category) {
  return seedBooks.filter(function isInCategory(book) {
    return book.category === category;
  });
}

test('the catalog has the nine fixed categories', () => {
  expect(bookCategories).toEqual([
    'Ficción',
    'Ciencia Ficción',
    'Fantasía',
    'Misterio y Suspenso',
    'Romance',
    'Historia',
    'Ciencia y Tecnología',
    'Infantil y Juvenil',
    'Poesía',
  ]);
});

test('every category except Poesía has at least two seed books', () => {
  bookCategories
    .filter((category) => category !== 'Poesía')
    .forEach((category) => {
      expect(booksOf(category).length).toBeGreaterThanOrEqual(2);
    });
});

test('Poesía has no seed books', () => {
  expect(booksOf('Poesía')).toHaveLength(0);
});

test('seed book ids are unique', () => {
  const ids = seedBooks.map((book) => book.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('every seed book has a valid shape', () => {
  seedBooks.forEach((book) => {
    expect(book.title).toBeTruthy();
    expect(book.author).toBeTruthy();
    expect(bookCategories).toContain(book.category);
    expect(Number.isInteger(book.price) && book.price >= 1).toBe(true);
    expect(Number.isInteger(book.stock) && book.stock >= 0).toBe(true);
  });
});

test('some seed books have low stock', () => {
  expect(seedBooks.some((book) => book.stock <= 5)).toBe(true);
});
