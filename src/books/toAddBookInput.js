import { categories } from '../data';

function toNumber(value) {
  return value.trim() === '' ? null : Number(value);
}

function findCategoryId(name) {
  const category = categories.find(function hasName(current) {
    return current.name === name;
  });
  return category ? String(category.id) : null;
}

// Envía lo que escribió la persona; la validación la hace el servidor.
export function toAddBookInput(draft) {
  return {
    title: draft.title,
    author: draft.author,
    categoryId: findCategoryId(draft.category),
    price: toNumber(draft.price),
    stock: toNumber(draft.stock),
  };
}
