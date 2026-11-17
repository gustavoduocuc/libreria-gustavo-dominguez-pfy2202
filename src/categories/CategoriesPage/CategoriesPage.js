import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { StatusMessage } from '../StatusMessage/StatusMessage';
import { useCategories } from '../useCategories';

export function CategoriesPage() {
  const categories = useCategories();

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Categorías</PageTitle>
      {categories.status === 'loading' && (
        <StatusMessage kind="loading" message="Cargando categorías…" />
      )}
      {categories.status === 'error' && (
        <StatusMessage kind="error" message={categories.error.message} />
      )}
      {categories.status === 'empty' && (
        <StatusMessage kind="empty" message="No hay categorías disponibles." />
      )}
      {categories.status === 'success' && (
        <ul
          aria-label="Categorías"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {categories.data.map(function renderCategory(category) {
            return <CategoryCard key={category.id} category={category} />;
          })}
        </ul>
      )}
    </section>
  );
}
