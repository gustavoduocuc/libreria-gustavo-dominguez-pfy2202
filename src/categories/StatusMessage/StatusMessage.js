import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { TextLink } from '../../ui/TextLink/TextLink';

// Carga y vacío se anuncian con role="status"; los errores con role="alert".
export function StatusMessage(props) {
  if (props.kind === 'error') {
    return (
      <EmptyState message={props.message} role="alert">
        <TextLink to="/categorias">Volver a Categorías</TextLink>
      </EmptyState>
    );
  }
  if (props.kind === 'empty') {
    return (
      <EmptyState message={props.message} role="status">
        <TextLink to="/categorias">Volver a Categorías</TextLink>
      </EmptyState>
    );
  }
  return <EmptyState message={props.message} role="status" />;
}
