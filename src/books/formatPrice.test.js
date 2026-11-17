import { formatPrice } from './formatPrice';

test('formats whole Chilean pesos with a dot as thousands separator', () => {
  expect(formatPrice(12990)).toBe('$12.990');
  expect(formatPrice(6990)).toBe('$6.990');
  expect(formatPrice(1250000)).toBe('$1.250.000');
});
