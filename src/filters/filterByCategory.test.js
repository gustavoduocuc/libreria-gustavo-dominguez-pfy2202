import { allCategories, productTypes } from '../books/productTypes';
import { filterByCategory } from './filterByCategory';

const books = [
  { id: 'leche', productType: 'Lácteos' },
  { id: 'pan', productType: 'Panadería' },
  { id: 'queso', productType: 'Lácteos' },
];

test('Todas keeps every book', () => {
  expect(filterByCategory(books, allCategories)).toEqual(books);
});

test('a category keeps only its books', () => {
  const visible = filterByCategory(books, 'Lácteos');

  expect(visible.map(function readId(book) { return book.id; })).toEqual([
    'leche',
    'queso',
  ]);
});

test('a category without books gives an empty list', () => {
  expect(filterByCategory(books, 'Carnes')).toEqual([]);
});

test('filtering leaves the original list untouched', () => {
  const copy = books.slice();

  filterByCategory(books, 'Lácteos');

  expect(books).toEqual(copy);
});

test('there are ten closed categories', () => {
  expect(productTypes).toHaveLength(10);
});
