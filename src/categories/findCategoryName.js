import { categories } from '../data';

// La API de libros no devuelve el nombre de la categoría (menos aún si está vacía),
// así que se toma del módulo de datos compartido; si el slug no existe se usa el slug.
export function findCategoryName(slug) {
  const category = categories.find(function hasSlug(current) {
    return current.slug === slug;
  });
  return category ? category.name : slug;
}
