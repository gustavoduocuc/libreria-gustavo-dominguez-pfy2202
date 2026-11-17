import { categories, seedBooks } from '../data';
import { bookStore } from './backend/bookStore';
import { findCategoryBySlug, listBooksByCategorySlug } from './catalogQueries';

beforeEach(() => bookStore.reset());

test('finds a category by slug or nothing', () => {
  expect(findCategoryBySlug('ficcion').name).toBe('Ficción');
  expect(findCategoryBySlug('no-existe')).toBeUndefined();
});

test('lists the seed books of a category', () => {
  const books = listBooksByCategorySlug('ficcion');

  expect(books.map((book) => book.title)).toEqual([
    'Cien años de soledad',
    'La casa de los espíritus',
  ]);
  expect(books).toEqual(seedBooks.filter((book) => book.category === 'Ficción'));
});

test('a category without books gives an empty list', () => {
  expect(listBooksByCategorySlug('poesia')).toEqual([]);
});

test('an unknown slug gives null so it can be told apart from an empty list', () => {
  expect(listBooksByCategorySlug('no-existe')).toBeNull();
});

test('every category slug resolves to a list', () => {
  categories.forEach((category) => {
    expect(Array.isArray(listBooksByCategorySlug(category.slug))).toBe(true);
  });
});
