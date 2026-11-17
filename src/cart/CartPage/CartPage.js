import { useBookInventory } from '../../books/BookInventoryProvider/BookInventoryProvider';
import { findBook } from '../../books/BookInventoryProvider/inventoryTransitions';
import { StockCount } from '../../books/StockCount/StockCount';
import { Price } from '../../books/Price/Price';
import { Card } from '../../ui/Card/Card';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { TextLink } from '../../ui/TextLink/TextLink';
import { CartLine } from '../CartLine/CartLine';

export function CartPage() {
  const inventory = useBookInventory();

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Carrito</PageTitle>
      {inventory.cartLines.length === 0 ? (
        <EmptyState message="Tu carrito está vacío.">
          <TextLink to="/">Ver libros</TextLink>
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-section lg:flex-row lg:items-start">
          <ul aria-label="Carrito" className="flex flex-1 flex-col gap-3">
            {inventory.cartLines.map(function renderLine(line) {
              return (
                <CartLine
                  key={line.bookId}
                  book={findBook(inventory.books, line.bookId)}
                  quantity={line.quantity}
                  onDecrease={inventory.removeUnitFromCart}
                  onIncrease={inventory.addUnitToCart}
                />
              );
            })}
          </ul>
          <Card as="aside" className="flex flex-col gap-2 p-4 lg:sticky lg:top-24 lg:w-72">
            <StockCount size="large" stock={inventory.cartUnitCount} />
            <p className="text-sm text-muted">
              Total: <Price size="large" value={inventory.cartTotal} />
            </p>
          </Card>
        </div>
      )}
    </section>
  );
}
