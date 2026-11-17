import { unitsInCart } from '../cart/cartTransitions';

// Unidades disponibles = stock del catálogo (servidor) menos las unidades que ya están en el carrito.
export function getAvailableStock(book, cartLines) {
  return Math.max(0, book.stock - unitsInCart(cartLines, book.id));
}
