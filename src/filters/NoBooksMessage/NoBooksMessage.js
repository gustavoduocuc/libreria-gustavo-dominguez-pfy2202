import { EmptyState } from '../../ui/EmptyState/EmptyState';

export function NoBooksMessage() {
  return <EmptyState message="No hay artículos en esta categoría." role="status" />;
}
