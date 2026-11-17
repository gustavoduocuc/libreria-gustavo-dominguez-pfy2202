import { useBookCatalog } from '../../books/BookCatalogProvider/BookCatalogProvider';
import { CatalogGate } from '../../books/CatalogGate/CatalogGate';
import { withAvailableStock } from '../../books/getAvailableStock';
import { useCart } from '../../cart/CartProvider/CartProvider';
import { CategoryFilter } from '../../filters/CategoryFilter/CategoryFilter';
import { NoBooksMessage } from '../../filters/NoBooksMessage/NoBooksMessage';
import { useCategoryFilter } from '../../filters/useCategoryFilter/useCategoryFilter';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { TextLink } from '../../ui/TextLink/TextLink';
import { BookCard } from '../BookCard/BookCard';

function HomeBooks() {
  const catalog = useBookCatalog();
  const cart = useCart();
  const filter = useCategoryFilter(withAvailableStock(catalog.books, cart.cartLines));

  return (
    <>
      <CategoryFilter category={filter.category} onSelect={filter.selectCategory} />
      {filter.visibleBooks.length === 0 ? (
        <NoBooksMessage category={filter.category} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {filter.visibleBooks.map(function renderBook(book) {
            return <BookCard key={book.id} book={book} />;
          })}
        </ul>
      )}
    </>
  );
}

export function HomePage() {
  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Libros</PageTitle>
      <div>
        <TextLink to="/categorias">Explorar por categorías</TextLink>
      </div>
      <CatalogGate>
        <HomeBooks />
      </CatalogGate>
    </section>
  );
}
