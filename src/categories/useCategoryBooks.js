import { fetchBooksByCategory } from '../api/catalogApi';
import { useRemoteData } from '../api/useRemoteData';

export function useCategoryBooks(slug) {
  return useRemoteData(
    function loadBooks(signal) {
      return fetchBooksByCategory(slug, { signal });
    },
    [slug]
  );
}
