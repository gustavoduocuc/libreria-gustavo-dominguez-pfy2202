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

test('the menu has six destinations in order', async () => {
  renderAt('/');

  const menu = await screen.findByRole('navigation', { name: 'Secciones' });
  const names = within(menu)
    .getAllByRole('link')
    .map(function readName(link) {
      return link.textContent;
    });

  expect(names).toEqual([
    'Inicio',
    'Categorías',
    'Quiénes somos',
    'Contáctanos',
    'Carrito',
    'Gestión de libros',
  ]);
});

test('only the visible section is marked in the menu', async () => {
  renderAt('/carrito');

  const menu = await screen.findByRole('navigation', { name: 'Secciones' });
  const marked = within(menu)
    .getAllByRole('link')
    .filter(function isMarked(link) {
      return link.getAttribute('aria-current') === 'page';
    });

  expect(marked).toHaveLength(1);
  expect(marked[0]).toHaveTextContent('Carrito');
});

test('the cart destination shows the total units only when there are some', async () => {
  const router = renderAt('/');
  const menu = await screen.findByRole('navigation', { name: 'Secciones' });

  expect(within(menu).getByRole('link', { name: 'Carrito' })).toBeInTheDocument();

  await addUnits(router, 'dune', 2);
  await addUnits(router, 'el-hobbit', 3);

  expect(within(menu).getByRole('link', { name: 'Carrito 5' })).toBeInTheDocument();
});

test('an address with a book segment but no id shows the not found notice', async () => {
  renderAt('/libros');

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Página no encontrada' })
  ).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
});
