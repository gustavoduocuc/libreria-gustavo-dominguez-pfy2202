import { allCategories } from '../../data';
import { EmptyState } from '../../ui/EmptyState/EmptyState';

export function NoBooksMessage(props) {
  const message =
    props.category === allCategories
      ? 'No hay libros en el inventario.'
      : 'No hay libros en esta categoría.';

  return <EmptyState message={message} role="status" />;
}
