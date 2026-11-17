import { EmptyState } from '../../ui/EmptyState/EmptyState';

export function NoBooksMessage() {
  return <EmptyState message="No hay libros en esta categoría." role="status" />;
}
