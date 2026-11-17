import { useBookInventory } from '../../books/BookInventoryProvider/BookInventoryProvider';
import { CategoryFilter } from '../../filters/CategoryFilter/CategoryFilter';
import { NoBooksMessage } from '../../filters/NoBooksMessage/NoBooksMessage';
import { useCategoryFilter } from '../../filters/useCategoryFilter/useCategoryFilter';
import { TextLink } from '../../ui/TextLink/TextLink';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { BookCard } from '../BookCard/BookCard';

export function HomePage() {
  const inventory = useBookInventory();
  const filter = useCategoryFilter(inventory.books);

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Libros</PageTitle>
      <div>
        <TextLink to="/categorias">Explorar por categorías</TextLink>
      </div>
      <CategoryFilter category={filter.category} onSelect={filter.selectCategory} />
      {filter.visibleBooks.length === 0 ? (
        <NoBooksMessage />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {filter.visibleBooks.map(function renderBook(book) {
            return <BookCard key={book.id} book={book} />;
          })}
        </ul>
      )}
    </section>
  );
}
