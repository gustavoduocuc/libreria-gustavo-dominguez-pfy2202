import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from '../testing/renderAt';

test('the table title links to the book detail', async () => {
  renderAt('/gestion-libros/inventario-libros');

  const row = await screen.findByRole('row', { name: /Dune/ });

  expect(within(row).getByRole('link', { name: 'Dune' })).toHaveAttribute('href', '/libros/dune');
});

test('the home title links to the book detail', async () => {
  renderAt('/');

  expect(await screen.findByRole('link', { name: 'Dune' })).toHaveAttribute(
    'href',
    '/libros/dune'
  );
});

test('clicking a title opens the detail of that book', async () => {
  renderAt('/');

  userEvent.click(await screen.findByRole('link', { name: 'Dune' }));

  expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument();
});

test('the detail shows title, author, category, price and units', async () => {
  renderAt('/libros/dune');

  expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument();
  expect(screen.getAllByText('Frank Herbert').length).toBeGreaterThan(0);
  expect(screen.getByText('Ciencia Ficción')).toBeInTheDocument();
  expect(screen.getByText('$15.990')).toBeInTheDocument();
  expect(screen.getByText('9 unidades')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeEnabled();
});

test('adding to the cart takes one unit from the stock', async () => {
  renderAt('/libros/dune');

  userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));

  expect(screen.getByText('8 unidades')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

  expect(screen.getByText('7 unidades')).toBeInTheDocument();
});

test('a book without stock shows a disabled Agotado button', async () => {
  renderAt('/libros/matilda');

  userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));

  expect(screen.getByText('0 unidades')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Agotado' })).toBeDisabled();
});

test('an unknown book shows a notice, a link home and the menu', async () => {
  renderAt('/libros/xyz');

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Libro no encontrado' })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Volver a Inicio' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
});
