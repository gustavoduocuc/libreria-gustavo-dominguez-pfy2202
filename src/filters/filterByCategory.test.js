import { allCategories, bookCategories } from '../data';
import { filterByCategory } from './filterByCategory';

const books = [
  { id: 'hobbit', category: 'Fantasía' },
  { id: 'orgullo', category: 'Romance' },
  { id: 'dune-fantasy', category: 'Fantasía' },
];

test('Todas keeps every book', () => {
  expect(filterByCategory(books, allCategories)).toEqual(books);
});

test('a category keeps only its books', () => {
  const visible = filterByCategory(books, 'Fantasía');

  expect(visible.map(function readId(book) { return book.id; })).toEqual([
    'hobbit',
    'dune-fantasy',
  ]);
});

test('a category without books gives an empty list', () => {
  expect(filterByCategory(books, 'Poesía')).toEqual([]);
});

test('filtering leaves the original list untouched', () => {
  const copy = books.slice();

  filterByCategory(books, 'Fantasía');

  expect(books).toEqual(copy);
});

test('there are nine closed categories', () => {
  expect(bookCategories).toHaveLength(9);
});
