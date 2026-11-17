import { getJson } from './httpClient';

export function fetchCategories(options) {
  return getJson('/api/categories', options);
}

export function fetchBooksByCategory(slug, options) {
  return getJson(`/api/books?category=${encodeURIComponent(slug)}`, options);
}
