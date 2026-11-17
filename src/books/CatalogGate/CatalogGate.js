import { Button } from '../../ui/Button/Button';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { useBookCatalog } from '../BookCatalogProvider/BookCatalogProvider';

// Muestra la carga o el error del catálogo; solo deja pasar el contenido cuando hay datos.
export function CatalogGate(props) {
  const catalog = useBookCatalog();

  if (catalog.status === 'loading') {
    return <EmptyState message="Cargando libros…" role="status" />;
  }
  if (catalog.status === 'error') {
    return (
      <EmptyState message={`No se pudieron cargar los libros. ${catalog.error.message}`} role="alert">
        <Button variant="outline" onClick={catalog.reload}>
          Reintentar
        </Button>
      </EmptyState>
    );
  }
  return props.children;
}
