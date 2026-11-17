import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { installFakeBackend } from '../testing/fakeBackend';
import { renderAt } from '../testing/renderAt';

async function goTo(router, path) {
  await act(async function navigate() {
    await router.navigate(path);
  });
}

describe.each([
  ['Inicio', '/'],
  ['Inventario', '/gestion-libros/inventario-libros'],
  ['Carrito', '/carrito'],
])('%s waits for the catalog', (name, path) => {
  test('shows a loading status first and then its content', async () => {
    renderAt(path);

    expect(screen.getByRole('status')).toHaveTextContent('Cargando libros…');
    await waitFor(() => expect(screen.queryByText('Cargando libros…')).not.toBeInTheDocument());
  });

  test('a failed load shows an alert with Reintentar that recovers', async () => {
    localStorage.setItem('mockFailOperation', 'Books');
    renderAt(path);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar los libros');
    expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();

    localStorage.clear();
    userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Cargando libros…');
    await waitFor(() => expect(screen.queryByText('Cargando libros…')).not.toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

test('home shows the empty message when every book was deleted', async () => {
  const router = renderAt('/gestion-libros/inventario-libros');
  await screen.findByRole('table');

  const rows = () => screen.queryAllByRole('button', { name: /^Eliminar / });
  while (rows().length > 0) {
    const count = rows().length;
    userEvent.click(rows()[0]);
    await waitFor(() => expect(rows()).toHaveLength(count - 1));
  }

  expect(screen.getByText('No hay libros en el inventario.')).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();

  await goTo(router, '/');
  expect(await screen.findByText('No hay libros en el inventario.')).toBeInTheDocument();
});

test('the detail shows a loading status, then the book', async () => {
  renderAt('/libros/dune');

  expect(screen.getByRole('status')).toHaveTextContent('Cargando libro…');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument();
});

test('a failed detail load shows an alert and keeps the menu', async () => {
  localStorage.setItem('mockFailOperation', 'Book');
  renderAt('/libros/dune');

  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('a deleted book has no detail', async () => {
  const router = renderAt('/gestion-libros/inventario-libros');
  const row = await screen.findByRole('row', { name: /Matilda/ });
  userEvent.click(within(row).getByRole('button', { name: /Eliminar/ }));
  await waitFor(() => expect(screen.queryByRole('cell', { name: 'Matilda' })).not.toBeInTheDocument());

  await goTo(router, '/libros/matilda');

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Libro no encontrado' })
  ).toBeInTheDocument();
});

test('a book added from the form appears at home without reloading', async () => {
  const router = renderAt('/gestion-libros/agregar-libro');
  await userEvent.type(await screen.findByLabelText('Título'), 'Rayuela');
  await userEvent.type(screen.getByLabelText('Autor'), 'Julio Cortázar');
  await userEvent.type(screen.getByLabelText('Precio (CLP)'), '9990');
  await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByRole('status');

  await goTo(router, '/');

  expect(await screen.findByRole('link', { name: 'Rayuela' })).toBeInTheDocument();
});

describe('available units', () => {
  test('are the stock minus the cart in home, inventory, detail and category pages', async () => {
    const router = renderAt('/libros/dune');
    userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));
    userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(screen.getByText('7 unidades')).toBeInTheDocument();

    await goTo(router, '/');
    const card = (await screen.findByRole('link', { name: 'Dune' })).closest('li');
    expect(within(card).getByText('7 unidades')).toBeInTheDocument();

    await goTo(router, '/gestion-libros/inventario-libros');
    const row = await screen.findByRole('row', { name: /Dune/ });
    expect(within(row).getByRole('cell', { name: '7 unidades' })).toBeInTheDocument();

    await goTo(router, '/categorias/ciencia-ficcion');
    const categoryCard = (await screen.findByRole('link', { name: 'Dune' })).closest('li');
    expect(within(categoryCard).getByText('7 unidades')).toBeInTheDocument();
  });

  test('the server stock does not change when adding to the cart', async () => {
    const router = renderAt('/libros/dune');
    userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));

    await goTo(router, '/libros/matilda');
    await screen.findByRole('heading', { level: 1, name: 'Matilda' });
    await goTo(router, '/libros/dune');

    expect(await screen.findByText('8 unidades')).toBeInTheDocument();
    const calls = global.fetch.mock.calls.filter(([path]) => path === '/graphql');
    const operations = calls.map(([, options]) => JSON.parse(options.body).operationName);
    expect(operations).not.toContain('AddBook');
    expect(operations).not.toContain('DeleteBook');
  });
});

test('the cart ignores lines whose book no longer exists in the catalog', async () => {
  installFakeBackend();
  const router = renderAt('/libros/matilda');
  userEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));
  await goTo(router, '/carrito');
  const line = await screen.findByRole('listitem');
  expect(within(line).getByText('Cantidad: 1')).toBeInTheDocument();
});
