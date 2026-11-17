import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from '../testing/renderAt';

async function openTable() {
  renderAt('/gestion-libros/inventario-libros');
  return screen.findByRole('combobox', { name: 'Categoría' });
}

async function openHome() {
  renderAt('/');
  return screen.findByRole('combobox', { name: 'Categoría' });
}

test('the table filter offers Todas and the nine categories', async () => {
  const select = await openTable();

  const options = within(select).getAllByRole('option');

  expect(options).toHaveLength(10);
  expect(options[0]).toHaveTextContent('Todas');
  expect(select).toHaveValue('Todas');
});

test('filtering the table by Ciencia Ficción keeps only that category and Todas restores all', async () => {
  const select = await openTable();

  userEvent.selectOptions(select, 'Ciencia Ficción');

  expect(screen.getByRole('cell', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.queryByRole('cell', { name: 'El Hobbit' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(3);

  userEvent.selectOptions(select, 'Todas');

  expect(screen.getAllByRole('row')).toHaveLength(17);
});

test('filtering the table does not remove books from the inventory', async () => {
  const select = await openTable();

  userEvent.selectOptions(select, 'Ciencia Ficción');
  userEvent.click(screen.getByRole('link', { name: 'Inicio' }));

  expect(await screen.findByRole('link', { name: 'El Hobbit' })).toBeInTheDocument();
});

test('the table shows a message when the category has no books', async () => {
  const select = await openTable();

  userEvent.selectOptions(select, 'Poesía');

  expect(screen.getByText('No hay libros en esta categoría.')).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('home offers the same filter and keeps its read-only controls', async () => {
  const select = await openHome();

  expect(within(select).getAllByRole('option')).toHaveLength(10);

  userEvent.selectOptions(select, 'Ciencia Ficción');

  expect(screen.getByRole('link', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'El Hobbit' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  userEvent.selectOptions(select, 'Todas');

  expect(screen.getByRole('link', { name: 'El Hobbit' })).toBeInTheDocument();
});

test('home shows a message when the category has no books', async () => {
  const select = await openHome();

  userEvent.selectOptions(select, 'Poesía');

  expect(screen.getByText('No hay libros en esta categoría.')).toBeInTheDocument();
});
