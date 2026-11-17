import { useBookCatalog } from '../../books/BookCatalogProvider/BookCatalogProvider';
import { CatalogGate } from '../../books/CatalogGate/CatalogGate';
import { getAvailableStock } from '../../books/getAvailableStock';
import { Price } from '../../books/Price/Price';
import { StockCount } from '../../books/StockCount/StockCount';
import { Card } from '../../ui/Card/Card';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { TextLink } from '../../ui/TextLink/TextLink';
import { CartLine } from '../CartLine/CartLine';
import { useCart } from '../CartProvider/CartProvider';
import { calculateCartTotal, countCartUnits } from '../cartTransitions';

function findLineBooks(books, cartLines) {
  return cartLines.flatMap(function toLineBook(line) {
    const book = books.find(function isBook(current) {
      return current.id === line.bookId;
    });
    return book ? [{ book, quantity: line.quantity }] : [];
  });
}

function CartContent() {
  const catalog = useBookCatalog();
  const cart = useCart();
  const lines = findLineBooks(catalog.books, cart.cartLines);
  const visibleLines = lines.map(function readLine(line) {
    return { bookId: line.book.id, quantity: line.quantity };
  });

  if (lines.length === 0) {
    return (
      <EmptyState message="Tu carrito está vacío.">
        <TextLink to="/">Ver libros</TextLink>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-section lg:flex-row lg:items-start">
      <ul aria-label="Carrito" className="flex flex-1 flex-col gap-3">
        {lines.map(function renderLine(line) {
          return (
            <CartLine
              key={line.book.id}
              availableStock={getAvailableStock(line.book, cart.cartLines)}
              book={line.book}
              quantity={line.quantity}
              onDecrease={cart.removeUnit}
              onIncrease={cart.addUnit}
            />
          );
        })}
      </ul>
      <Card as="aside" className="flex flex-col gap-2 p-4 lg:sticky lg:top-24 lg:w-72">
        <StockCount size="large" stock={countCartUnits(visibleLines)} />
        <p className="text-sm text-muted">
          Total: <Price size="large" value={calculateCartTotal(catalog.books, visibleLines)} />
        </p>
      </Card>
    </div>
  );
}

export function CartPage() {
  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Carrito</PageTitle>
      <CatalogGate>
        <CartContent />
      </CatalogGate>
    </section>
  );
}
