import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from '../testing/renderAt';

async function goTo(router, path) {
  await act(async function navigate() {
    await router.navigate(path);
  });
}

async function addUnitsOfPrincipito(router, units) {
  await goTo(router, '/libros/el-principito');
  for (let unit = 0; unit < units; unit += 1) {
    userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));
  }
}

test('removing a book from the table also removes it from home, categories and the cart', async () => {
  const router = renderAt('/');
  await screen.findByRole('combobox', { name: 'Categoría' });
  await addUnitsOfPrincipito(router, 2);
  expect(await screen.findByRole('link', { name: 'Carrito 2' })).toBeInTheDocument();

  await goTo(router, '/gestion-libros/inventario-libros');
  const row = await screen.findByRole('row', { name: /El principito/ });
  userEvent.click(within(row).getByRole('button', { name: 'Eliminar El principito' }));

  await waitFor(() =>
    expect(screen.queryByRole('link', { name: 'El principito' })).not.toBeInTheDocument()
  );
  expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();

  await goTo(router, '/');
  expect(await screen.findByRole('link', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'El principito' })).not.toBeInTheDocument();

  await goTo(router, '/carrito');
  expect(await screen.findByText('Tu carrito está vacío.')).toBeInTheDocument();
});

test('a failed removal keeps the book and its cart lines and shows an alert', async () => {
  const router = renderAt('/');
  await screen.findByRole('combobox', { name: 'Categoría' });
  await addUnitsOfPrincipito(router, 1);
  await goTo(router, '/gestion-libros/inventario-libros');
  localStorage.setItem('mockFailOperation', 'DeleteBook');

  const row = await screen.findByRole('row', { name: /El principito/ });
  userEvent.click(within(row).getByRole('button', { name: 'Eliminar El principito' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo eliminar el libro');
  expect(screen.getByRole('row', { name: /El principito/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Carrito 1' })).toBeInTheDocument();
});
