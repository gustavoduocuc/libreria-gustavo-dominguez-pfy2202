import { useState } from 'react';
import { CategoryFilter } from '../../filters/CategoryFilter/CategoryFilter';
import { NoBooksMessage } from '../../filters/NoBooksMessage/NoBooksMessage';
import { useCategoryFilter } from '../../filters/useCategoryFilter/useCategoryFilter';
import { useCart } from '../../cart/CartProvider/CartProvider';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { BookTable } from '../BookTable/BookTable';
import { useBookCatalog } from '../BookCatalogProvider/BookCatalogProvider';
import { CatalogGate } from '../CatalogGate/CatalogGate';
import { withAvailableStock } from '../getAvailableStock';
import { useRemoveBook } from '../useRemoveBook';

function InventoryBooks() {
  const catalog = useBookCatalog();
  const cart = useCart();
  const removeBook = useRemoveBook();
  const filter = useCategoryFilter(withAvailableStock(catalog.books, cart.cartLines));
  const [removeError, setRemoveError] = useState(null);

  async function handleRemove(bookId) {
    setRemoveError(null);
    try {
      await removeBook(bookId);
    } catch (error) {
      setRemoveError(error.message);
    }
  }

  return (
    <>
      <CategoryFilter category={filter.category} onSelect={filter.selectCategory} />
      {removeError && (
        <p
          className="rounded-control border border-danger bg-danger-soft px-4 py-3 text-danger"
          role="alert"
        >
          {`No se pudo eliminar el libro. ${removeError}`}
        </p>
      )}
      {filter.visibleBooks.length === 0 ? (
        <NoBooksMessage category={filter.category} />
      ) : (
        <BookTable books={filter.visibleBooks} onRemove={handleRemove} />
      )}
    </>
  );
}

export function BookInventoryPage() {
  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Inventario de libros</PageTitle>
      <CatalogGate>
        <InventoryBooks />
      </CatalogGate>
    </section>
  );
}
