import { fetchCategories } from '../api/catalogApi';
import { useRemoteData } from '../api/useRemoteData';

function loadCategories(signal) {
  return fetchCategories({ signal });
}

export function useCategories() {
  return useRemoteData(loadCategories, []);
}
