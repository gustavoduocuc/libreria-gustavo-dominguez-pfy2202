import { allCategories } from '../books/productTypes';

export function filterByCategory(books, category) {
  if (category === allCategories) {
    return books;
  }
  return books.filter(function isInCategory(book) {
    return book.productType === category;
  });
}
