import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from '../testing/renderAt';

async function goTo(router, path) {
  await act(async function navigate() {
    await router.navigate(path);
  });
}

async function addUnits(router, bookId, units) {
  await goTo(router, `/libros/${bookId}`);
  for (let unit = 0; unit < units; unit += 1) {
    userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));
  }
}

async function openCartWithDuneAndHobbit() {
  const router = renderAt('/');
  await screen.findByRole('combobox', { name: 'Categoría' });
  await addUnits(router, 'dune', 2);
  await addUnits(router, 'el-hobbit', 1);
  await goTo(router, '/carrito');
  return router;
}

test('the cart lists each line with its data and quantity', async () => {
  await openCartWithDuneAndHobbit();

  const lines = within(await screen.findByRole('list', { name: 'Carrito' })).getAllByRole(
    'listitem'
  );

  expect(lines).toHaveLength(2);
  expect(within(lines[0]).getByRole('link', { name: 'Dune' })).toBeInTheDocument();
  expect(within(lines[0]).getByText('Frank Herbert · Ciencia Ficción')).toBeInTheDocument();
  expect(within(lines[0]).getByText('Cantidad: 2')).toBeInTheDocument();
  expect(within(lines[0]).getByText('Subtotal: $31.980')).toBeInTheDocument();
  expect(within(lines[1]).getByRole('link', { name: 'El Hobbit' })).toBeInTheDocument();
  expect(within(lines[1]).getByText('J. R. R. Tolkien · Fantasía')).toBeInTheDocument();
  expect(within(lines[1]).getByText('Cantidad: 1')).toBeInTheDocument();
  expect(within(lines[1]).getByText('Subtotal: $10.990')).toBeInTheDocument();
});

test('increasing a line adds one unit and takes one from the inventory', async () => {
  const router = await openCartWithDuneAndHobbit();

  userEvent.click(screen.getByRole('button', { name: 'Aumentar Dune' }));

  expect(screen.getByText('Cantidad: 3')).toBeInTheDocument();

  await goTo(router, '/libros/dune');

  expect(await screen.findByText('6 unidades')).toBeInTheDocument();
});

test('increasing is disabled when the inventory has no units left', async () => {
  const router = renderAt('/');
  await screen.findByRole('combobox', { name: 'Categoría' });
  await addUnits(router, 'matilda', 1);
  await goTo(router, '/carrito');

  expect(await screen.findByText('Cantidad: 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Aumentar Matilda' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Disminuir Matilda' })).toBeEnabled();
});

test('decreasing a line gives one unit back to the inventory', async () => {
  const router = await openCartWithDuneAndHobbit();

  userEvent.click(screen.getByRole('button', { name: 'Disminuir Dune' }));

  const firstLine = screen.getAllByRole('listitem')[0];
  expect(within(firstLine).getByText('Cantidad: 1')).toBeInTheDocument();

  await goTo(router, '/libros/dune');

  expect(await screen.findByText('8 unidades')).toBeInTheDocument();
});

test('a line disappears when its quantity reaches zero', async () => {
  const router = await openCartWithDuneAndHobbit();

  userEvent.click(screen.getByRole('button', { name: 'Disminuir El Hobbit' }));

  expect(screen.queryByRole('link', { name: 'El Hobbit' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Dune' })).toBeInTheDocument();

  await goTo(router, '/libros/el-hobbit');

  expect(await screen.findByText('18 unidades')).toBeInTheDocument();
});

test('an empty cart shows a message and a link to see books', async () => {
  renderAt('/carrito');

  expect(await screen.findByText('Tu carrito está vacío.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ver libros' })).toHaveAttribute('href', '/');
});

test('the cart shows a summary with the total units', async () => {
  const router = renderAt('/');
  await screen.findByRole('combobox', { name: 'Categoría' });
  await addUnits(router, 'dune', 2);
  await addUnits(router, 'el-hobbit', 3);
  await goTo(router, '/carrito');

  const summary = await screen.findByRole('complementary');
  const lines = within(screen.getByRole('list', { name: 'Carrito' })).getAllByRole('listitem');

  expect(within(summary).getByText('5 unidades')).toBeInTheDocument();
  expect(within(summary).getByText('$64.950')).toBeInTheDocument();
  expect(within(lines[0]).getByRole('link', { name: 'Dune' })).toBeInTheDocument();
});

test('an empty cart has no summary', async () => {
  renderAt('/carrito');

  await screen.findByText('Tu carrito está vacío.');

  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
});
