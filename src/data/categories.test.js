import { bookCategories, categories } from './index';

test('there are nine categories with all their fields', () => {
  expect(categories).toHaveLength(9);
  categories.forEach((category) => {
    expect(Number.isInteger(category.id)).toBe(true);
    expect(category.slug).toBeTruthy();
    expect(category.name).toBeTruthy();
    expect(category.description).toBeTruthy();
  });
});

test('slugs are unique and kebab-case without accents', () => {
  const slugs = categories.map((category) => category.slug);

  expect(new Set(slugs).size).toBe(9);
  slugs.forEach((slug) => expect(slug).toMatch(/^[a-z]+(-[a-z]+)*$/));
  expect(slugs).toContain('ciencia-ficcion');
  expect(slugs).toContain('poesia');
});

test('book categories are the category names in order', () => {
  expect(bookCategories).toEqual(categories.map((category) => category.name));
  expect(bookCategories[0]).toBe('Ficción');
  expect(bookCategories[8]).toBe('Poesía');
});
