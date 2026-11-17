import { createContext, useContext, useState } from 'react';
import { defaultBooks } from '../defaultBooks';
import * as transitions from './inventoryTransitions';

const BookInventoryContext = createContext(null);

export function BookInventoryProvider(props) {
  const [state, setState] = useState({ books: defaultBooks, cartLines: [] });

  function addBook(book) {
    const bookWithId = { ...book, id: crypto.randomUUID() };
    setState(function storeBook(previous) {
      return transitions.registerBook(previous, bookWithId);
    });
  }

  function removeBook(bookId) {
    setState(function dropBook(previous) {
      return transitions.deleteBook(previous, bookId);
    });
  }

  function addUnitToCart(bookId) {
    setState(function moveUnitToCart(previous) {
      return transitions.addUnitToCart(previous, bookId);
    });
  }

  function removeUnitFromCart(bookId) {
    setState(function moveUnitToInventory(previous) {
      return transitions.removeUnitFromCart(previous, bookId);
    });
  }

  const inventory = {
    books: state.books,
    cartLines: state.cartLines,
    cartStockCount: transitions.countCartUnits(state.cartLines),
    addBook,
    removeBook,
    addUnitToCart,
    removeUnitFromCart,
  };

  return (
    <BookInventoryContext.Provider value={inventory}>
      {props.children}
    </BookInventoryContext.Provider>
  );
}

export function useBookInventory() {
  const inventory = useContext(BookInventoryContext);
  if (!inventory) {
    throw new Error('useBookInventory needs an BookInventoryProvider');
  }
  return inventory;
}
