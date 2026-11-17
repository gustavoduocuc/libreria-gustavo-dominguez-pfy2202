import { useParams } from 'react-router';
import { fetchBook } from '../../api/booksApi';
import { useRemoteData } from '../../api/useRemoteData';
import { useCart } from '../../cart/CartProvider/CartProvider';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { BookCover } from '../BookCover/BookCover';
import { BookNotFound } from '../BookNotFound/BookNotFound';
import { CategoryChip } from '../CategoryChip/CategoryChip';
import { getAvailableStock } from '../getAvailableStock';
import { Price } from '../Price/Price';
import { StockCount } from '../StockCount/StockCount';

function BookDetail(props) {
  const cart = useCart();
  const book = props.book;
  const available = getAvailableStock(book, cart.cartLines);
  const hasStock = available > 0;

  function addToCart() {
    cart.addUnit(book);
  }

  return (
    <section>
      <Card className="flex flex-col gap-6 p-4 lg:flex-row lg:gap-10 lg:p-8">
        <div className="mx-auto w-full max-w-64 lg:mx-0 lg:w-2/5 lg:max-w-none">
          <BookCover book={book} />
        </div>
        <div className="flex flex-col gap-4 lg:flex-1 lg:justify-center">
          <PageTitle>{book.title}</PageTitle>
          <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 text-base">
            <dt className="text-muted">Autor</dt>
            <dd>{book.author}</dd>
            <dt className="text-muted">Categoría</dt>
            <dd>
              <CategoryChip category={book.category} />
            </dd>
            <dt className="text-muted">Precio</dt>
            <dd>
              <Price size="large" value={book.price} />
            </dd>
            <dt className="text-muted">Unidades disponibles</dt>
            <dd aria-live="polite">
              <StockCount stock={available} />
            </dd>
          </dl>
          <div>
            <Button disabled={!hasStock} onClick={addToCart}>
              {hasStock ? 'Agregar al carrito' : 'Agotado'}
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

export function BookDetailPage() {
  const params = useParams();
  const result = useRemoteData(
    function loadBook(signal) {
      return fetchBook(params.bookId, { signal });
    },
    [params.bookId]
  );

  if (result.status === 'loading') {
    return (
      <section className="flex flex-col gap-section">
        <PageTitle>Libro</PageTitle>
        <EmptyState message="Cargando libro…" role="status" />
      </section>
    );
  }
  if (result.status === 'error') {
    return (
      <section className="flex flex-col gap-section">
        <PageTitle>Libro</PageTitle>
        <EmptyState message={result.error.message} role="alert" />
      </section>
    );
  }
  if (result.data === null) {
    return <BookNotFound />;
  }
  return <BookDetail book={result.data} />;
}
