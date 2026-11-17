import { useParams } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { BookCover } from '../BookCover/BookCover';
import { BookNotFound } from '../BookNotFound/BookNotFound';
import { CategoryChip } from '../CategoryChip/CategoryChip';
import { useBookInventory } from '../BookInventoryProvider/BookInventoryProvider';
import { findBook } from '../BookInventoryProvider/inventoryTransitions';
import { Price } from '../Price/Price';
import { StockCount } from '../StockCount/StockCount';

export function BookDetailPage() {
  const params = useParams();
  const inventory = useBookInventory();
  const book = findBook(inventory.books, params.bookId);

  if (!book) {
    return <BookNotFound />;
  }

  const hasStock = book.stock > 0;

  function addToCart() {
    inventory.addUnitToCart(book.id);
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
              <StockCount stock={book.stock} />
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
