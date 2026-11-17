import { act, renderHook } from '@testing-library/react';
import { CartProvider, useCart } from './CartProvider';

function wrapper(props) {
  return <CartProvider>{props.children}</CartProvider>;
}

const dune = { id: 'dune', stock: 2, price: 15990 };

test('adds units while there are available units and then stops', () => {
  const { result } = renderHook(() => useCart(), { wrapper });

  act(() => result.current.addUnit(dune));
  act(() => result.current.addUnit(dune));
  act(() => result.current.addUnit(dune));

  expect(result.current.cartLines).toEqual([{ bookId: 'dune', quantity: 2 }]);
  expect(result.current.cartUnitCount).toBe(2);
});

test('removes units and clears a book', () => {
  const { result } = renderHook(() => useCart(), { wrapper });
  act(() => result.current.addUnit(dune));
  act(() => result.current.addUnit(dune));

  act(() => result.current.removeUnit('dune'));
  expect(result.current.cartUnitCount).toBe(1);

  act(() => result.current.clearBook('dune'));
  expect(result.current.cartLines).toEqual([]);
});

test('useCart needs its provider', () => {
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useCart())).toThrow(/CartProvider/);
  errors.mockRestore();
});
