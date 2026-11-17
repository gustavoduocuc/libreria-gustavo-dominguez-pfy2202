import { useParams } from 'react-router';
import { withAvailableStock } from '../../books/getAvailableStock';
import { useCart } from '../../cart/CartProvider/CartProvider';
import { BookCard } from '../../home/BookCard/BookCard';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { StatusMessage } from '../StatusMessage/StatusMessage';
import { useCategoryBooks } from '../useCategoryBooks';
import { findCategoryName } from '../findCategoryName';

function readTitle(status, slug) {
  if (status === 'success' || status === 'empty') {
    return findCategoryName(slug);
  }
  return 'Categoría';
}

export function CategoryBooksPage() {
  const params = useParams();
  const books = useCategoryBooks(params.slug);
  const cart = useCart();

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>{readTitle(books.status, params.slug)}</PageTitle>
      {books.status === 'loading' && (
        <StatusMessage kind="loading" message="Cargando libros…" />
      )}
      {books.status === 'error' && <StatusMessage kind="error" message={books.error.message} />}
      {books.status === 'empty' && (
        <StatusMessage kind="empty" message="No hay libros en esta categoría." />
      )}
      {books.status === 'success' && (
        <ul
          aria-label="Libros"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {withAvailableStock(books.data, cart.cartLines).map(function renderBook(book) {
            return <BookCard key={book.id} book={book} />;
          })}
        </ul>
      )}
    </section>
  );
}
