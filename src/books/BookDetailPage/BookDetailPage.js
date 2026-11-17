import { useParams } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { BookNotFound } from '../BookNotFound/BookNotFound';
import { CategoryChip } from '../CategoryChip/CategoryChip';
import { CategoryTile } from '../CategoryTile/CategoryTile';
import { useBookInventory } from '../BookInventoryProvider/BookInventoryProvider';
import { findBook } from '../BookInventoryProvider/inventoryTransitions';
import { StockCount } from '../StockCount/StockCount';

export function BookDetailPage() {
  const params = useParams();
  const inventory = useBookInventory();
  const book = findBook(inventory.books, params.bookId);

  if (!book) {
    return <BookNotFound />;
  }

  const hasStock = book.quantity > 0;

  function addToCart() {
    inventory.addUnitToCart(book.id);
  }

  return (
    <section>
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:gap-8 lg:p-6">
        <div className="flex flex-col lg:w-2/5">
          <CategoryTile productType={book.productType} size="fill" />
        </div>
        <div className="flex flex-col gap-4 lg:flex-1 lg:justify-center">
          <PageTitle>{book.name}</PageTitle>
          <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 text-base">
            <dt className="text-muted">Marca</dt>
            <dd>{book.brand}</dd>
            <dt className="text-muted">Tipo</dt>
            <dd>
              <CategoryChip productType={book.productType} />
            </dd>
            <dt className="text-muted">Unidades disponibles</dt>
            <dd aria-live="polite">
              <StockCount quantity={book.quantity} />
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
