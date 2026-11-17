import { useState } from 'react';
import { allCategories } from '../../books/productTypes';
import { filterByCategory } from '../filterByCategory';

export function useCategoryFilter(books) {
  const [state, setState] = useState({ category: allCategories });

  function selectCategory(category) {
    setState(function replaceCategory(previous) {
      return { ...previous, category };
    });
  }

  return {
    category: state.category,
    visibleBooks: filterByCategory(books, state.category),
    selectCategory,
  };
}
