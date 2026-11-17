import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { TextLink } from '../../ui/TextLink/TextLink';

export function BookNotFound() {
  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Libro no encontrado</PageTitle>
      <EmptyState message="El libro que buscas no existe.">
        <TextLink to="/">Volver a Inicio</TextLink>
      </EmptyState>
    </section>
  );
}
