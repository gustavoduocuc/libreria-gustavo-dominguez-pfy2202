import { validateBookInput } from './validateBookInput';

const valid = { title: 'Rayuela', author: 'Julio Cortázar', categoryId: '1', price: 9990, stock: 3 };

function fieldsOf(input) {
  return validateBookInput(input).map((error) => error.field);
}

test('a valid input has no errors', () => {
  expect(validateBookInput(valid)).toEqual([]);
  expect(validateBookInput({ ...valid, categoryId: 9 })).toEqual([]);
});

test('blank title or author are rejected after trimming', () => {
  expect(fieldsOf({ ...valid, title: '   ' })).toEqual(['title']);
  expect(fieldsOf({ ...valid, author: '' })).toEqual(['author']);
});

test('an unknown category id is rejected', () => {
  expect(fieldsOf({ ...valid, categoryId: '99' })).toEqual(['categoryId']);
  expect(fieldsOf({ ...valid, categoryId: null })).toEqual(['categoryId']);
});

test('price and stock must be integers of at least 1', () => {
  [0, -3, 2.5, null, undefined, '12', NaN].forEach((value) => {
    expect(fieldsOf({ ...valid, price: value })).toEqual(['price']);
    expect(fieldsOf({ ...valid, stock: value })).toEqual(['stock']);
  });
});

test('reports one error per invalid field, with a Spanish message', () => {
  const errors = validateBookInput({ ...valid, title: '   ', price: 0, stock: 2.5 });

  expect(errors.map((error) => error.field)).toEqual(['title', 'price', 'stock']);
  errors.forEach((error) => expect(error.message).toMatch(/[a-záéíóú]/i));
});
