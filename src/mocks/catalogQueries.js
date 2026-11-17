import { categories } from '../data';
import { bookStore } from './backend/bookStore';

export function findCategoryBySlug(slug) {
  return categories.find(function hasSlug(category) {
    return category.slug === slug;
  });
}

// Devuelve null si el slug no existe, para distinguirlo de una categoría sin libros ([]).
export function listBooksByCategorySlug(slug) {
  const category = findCategoryBySlug(slug);
  if (!category) {
    return null;
  }
  return bookStore.listByCategoryName(category.name);
}
