import { categories } from './categories';

export const allCategories = 'Todas';

export const bookCategories = categories.map(function readName(category) {
  return category.name;
});
