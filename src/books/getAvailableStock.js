import { unitsInCart } from '../cart/cartTransitions';

// Unidades disponibles = stock del catálogo (servidor) menos las unidades que ya están en el carrito.
export function getAvailableStock(book, cartLines) {
  return Math.max(0, book.stock - unitsInCart(cartLines, book.id));
}

// Copia de los libros con `stock` igual a las unidades disponibles (solo para mostrar).
export function withAvailableStock(books, cartLines) {
  return books.map(function toAvailable(book) {
    return { ...book, stock: getAvailableStock(book, cartLines) };
  });
}
