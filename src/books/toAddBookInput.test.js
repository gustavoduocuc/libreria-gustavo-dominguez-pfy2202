import { toAddBookInput } from './toAddBookInput';

test('turns the form draft into the AddBook input with the category id', () => {
  expect(
    toAddBookInput({ title: 'Dune', author: 'Frank Herbert', category: 'Ciencia Ficción', price: '15990', stock: '3' })
  ).toEqual({ title: 'Dune', author: 'Frank Herbert', categoryId: '2', price: 15990, stock: 3 });
});

test('sends what was typed so the server can validate it', () => {
  const input = toAddBookInput({ title: '  ', author: '', category: 'Poesía', price: '', stock: '2.5' });

  expect(input).toEqual({ title: '  ', author: '', categoryId: '9', price: null, stock: 2.5 });
});

test('an unknown category has no id', () => {
  expect(toAddBookInput({ title: 'a', author: 'b', category: 'Otra', price: '1', stock: '1' }).categoryId).toBeNull();
});
