import { createContext, useContext, useState } from 'react';
import { getAvailableStock } from '../../books/getAvailableStock';
import * as transitions from '../cartTransitions';

const CartContext = createContext(null);

export function CartProvider(props) {
  const [cartLines, setCartLines] = useState([]);

  // Solo agrega si el libro tiene unidades disponibles (stock menos carrito).
  function addUnit(book) {
    if (getAvailableStock(book, cartLines) < 1) {
      return;
    }
    setCartLines(function addToCart(previous) {
      return transitions.addUnit(previous, book.id);
    });
  }

  function removeUnit(bookId) {
    setCartLines(function takeFromCart(previous) {
      return transitions.removeUnit(previous, bookId);
    });
  }

  function clearBook(bookId) {
    setCartLines(function dropBook(previous) {
      return transitions.clearBook(previous, bookId);
    });
  }

  const cart = {
    cartLines,
    cartUnitCount: transitions.countCartUnits(cartLines),
    addUnit,
    removeUnit,
    clearBook,
  };

  return <CartContext.Provider value={cart}>{props.children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error('useCart needs a CartProvider');
  }
  return cart;
}
