import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt } from '../testing/renderAt';

async function goTo(router, path) {
  await act(async function navigate() {
    await router.navigate(path);
  });
}

test('removing an book from the table also removes it from home and the cart', async () => {
  const router = renderAt('/libros/el-principito');

  userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));
  userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

  await goTo(router, '/gestion-libros/inventario-libros');
  const row = await screen.findByRole('row', { name: /El principito/ });
  userEvent.click(within(row).getByRole('button', { name: 'Eliminar El principito' }));

  expect(screen.queryByRole('link', { name: 'El principito' })).not.toBeInTheDocument();

  await goTo(router, '/');

  expect(await screen.findByRole('link', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'El principito' })).not.toBeInTheDocument();

  await goTo(router, '/carrito');

  expect(await screen.findByText('Tu carrito está vacío.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();
});
