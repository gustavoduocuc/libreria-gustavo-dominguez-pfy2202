import { categories } from '../../data';

function isFilled(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value >= 1;
}

function knowsCategory(categoryId) {
  return categories.some(function hasId(category) {
    return String(category.id) === String(categoryId);
  });
}

// Devuelve un error por campo inválido; una lista vacía significa entrada válida.
export function validateBookInput(input) {
  const errors = [];
  if (!isFilled(input.title)) {
    errors.push({ field: 'title', message: 'El título es obligatorio.' });
  }
  if (!isFilled(input.author)) {
    errors.push({ field: 'author', message: 'El autor es obligatorio.' });
  }
  if (input.categoryId == null || !knowsCategory(input.categoryId)) {
    errors.push({ field: 'categoryId', message: 'La categoría elegida no existe.' });
  }
  if (!isPositiveInteger(input.price)) {
    errors.push({ field: 'price', message: 'El precio debe ser un número entero mayor o igual a 1.' });
  }
  if (!isPositiveInteger(input.stock)) {
    errors.push({ field: 'stock', message: 'El stock debe ser un número entero mayor o igual a 1.' });
  }
  return errors;
}
