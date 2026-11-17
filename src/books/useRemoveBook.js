import { useCart } from '../cart/CartProvider/CartProvider';
import { useBookCatalog } from './BookCatalogProvider/BookCatalogProvider';

// Elimina el libro en el backend y, solo si salió bien, quita sus líneas del carrito.
export function useRemoveBook() {
  const catalog = useBookCatalog();
  const cart = useCart();

  return async function removeBookAndCartLines(bookId) {
    await catalog.removeBook(bookId);
    cart.clearBook(bookId);
  };
}
