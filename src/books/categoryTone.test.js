import { bookCategories } from '../data';
import { getCategoryTone } from './categoryTone';

test('every category has its own background and text classes', () => {
  const toneClasses = bookCategories.map(function toneOf(category) {
    return getCategoryTone(category).toneClass;
  });

  toneClasses.forEach(function checkTone(toneClass) {
    expect(toneClass).toMatch(/\bbg-category-[a-z-]+-bg\b/);
    expect(toneClass).toMatch(/\btext-category-[a-z-]+-fg\b/);
    expect(toneClass).not.toMatch(/neutral/);
  });
  expect(new Set(toneClasses).size).toBe(bookCategories.length);
});

test('Ciencia Ficción and Poesía use their own named tones', () => {
  expect(getCategoryTone('Ciencia Ficción').toneClass).toBe(
    'bg-category-ciencia-ficcion-bg text-category-ciencia-ficcion-fg'
  );
  expect(getCategoryTone('Poesía').toneClass).toBe(
    'bg-category-poesia-bg text-category-poesia-fg'
  );
});

test('an unknown category falls back to the neutral tone without failing', () => {
  expect(getCategoryTone('Juguetes').toneClass).toBe(
    'bg-category-neutral-bg text-category-neutral-fg'
  );
});
