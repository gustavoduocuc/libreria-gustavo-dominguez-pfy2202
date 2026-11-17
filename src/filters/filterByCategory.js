import { allCategories } from '../data';

export function filterByCategory(books, category) {
  if (category === allCategories) {
    return books;
  }
  return books.filter(function isInCategory(book) {
    return book.category === category;
  });
}
