import { CategoryFilter } from '../../filters/CategoryFilter/CategoryFilter';
import { NoBooksMessage } from '../../filters/NoBooksMessage/NoBooksMessage';
import { useCategoryFilter } from '../../filters/useCategoryFilter/useCategoryFilter';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { BookTable } from '../BookTable/BookTable';
import { useBookInventory } from '../BookInventoryProvider/BookInventoryProvider';

export function BookInventoryPage() {
  const inventory = useBookInventory();
  const filter = useCategoryFilter(inventory.books);

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Inventario de libros</PageTitle>
      <CategoryFilter category={filter.category} onSelect={filter.selectCategory} />
      {filter.visibleBooks.length === 0 ? (
        <NoBooksMessage />
      ) : (
        <BookTable books={filter.visibleBooks} onRemove={inventory.removeBook} />
      )}
    </section>
  );
}
