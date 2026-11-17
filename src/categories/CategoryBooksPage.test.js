import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { seedBooks } from '../data';
import { jsonResponse, mockFetch, restoreFetch } from '../testing/mockFetch';
import { renderAt } from '../testing/renderAt';

afterEach(restoreFetch);

const fiction = seedBooks.filter((book) => book.category === 'Ficción');

test('shows a loading status first', async () => {
  mockFetch({ '/api/books?category=ficcion': () => new Promise(() => {}) });

  renderAt('/categorias/ficcion');

  expect(await screen.findByRole('status')).toHaveTextContent('Cargando libros…');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('lists the books of the category with their data and detail links', async () => {
  mockFetch({ '/api/books?category=ficcion': jsonResponse(200, fiction) });

  renderAt('/categorias/ficcion');

  expect(await screen.findByRole('heading', { level: 1, name: 'Ficción' })).toBeInTheDocument();
  const link = screen.getByRole('link', { name: 'Cien años de soledad' });
  const card = link.closest('li');

  expect(link).toHaveAttribute('href', '/libros/cien-anos-de-soledad');
  expect(within(card).getAllByText('Gabriel García Márquez').length).toBeGreaterThan(0);
  expect(within(card).getByText('$12.990')).toBeInTheDocument();
  expect(within(card).getByText('14 unidades')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'La casa de los espíritus' })).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('the menu keeps Categorías as the current section', async () => {
  mockFetch({ '/api/books?category=ficcion': jsonResponse(200, fiction) });

  renderAt('/categorias/ficcion');

  await screen.findByRole('link', { name: 'Cien años de soledad' });
  const menu = screen.getByRole('navigation', { name: 'Secciones' });

  expect(within(menu).getByRole('link', { name: 'Categorías' })).toHaveAttribute(
    'aria-current',
    'page'
  );
});

test('an empty category shows a status message and not an alert', async () => {
  mockFetch({ '/api/books?category=poesia': jsonResponse(200, []) });

  renderAt('/categorias/poesia');

  expect(await screen.findByRole('heading', { level: 1, name: 'Poesía' })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('No hay libros en esta categoría.');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Volver a Categorías' })).toHaveAttribute(
    'href',
    '/categorias'
  );
});

test('an unknown slug shows the 404 message in an alert and keeps the app', async () => {
  mockFetch({
    '/api/books?category=no-existe': jsonResponse(404, {
      message: 'La categoría «no-existe» no existe.',
    }),
  });

  renderAt('/categorias/no-existe');

  expect(await screen.findByRole('alert')).toHaveTextContent('La categoría «no-existe» no existe.');
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
  expect(screen.queryByRole('list', { name: 'Libros' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('a server error shows an alert', async () => {
  mockFetch({
    '/api/books?category=error-500': jsonResponse(500, { message: 'Error simulado del servidor.' }),
  });

  renderAt('/categorias/error-500');

  expect(await screen.findByRole('alert')).toHaveTextContent('Error simulado del servidor.');
});

test('changing the category reloads and shows only its books', async () => {
  const fantasy = seedBooks.filter((book) => book.category === 'Fantasía');
  mockFetch({
    '/api/books?category=ficcion': jsonResponse(200, fiction),
    '/api/books?category=fantasia': jsonResponse(200, fantasy),
  });

  const router = renderAt('/categorias/ficcion');
  await screen.findByRole('link', { name: 'Cien años de soledad' });

  await userEvent.click(screen.getByRole('link', { name: 'Categorías' }));
  router.navigate('/categorias/fantasia');

  expect(await screen.findByRole('link', { name: 'El Hobbit' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Cien años de soledad' })).not.toBeInTheDocument();
});

test('leaving before the response aborts the request without errors', async () => {
  mockFetch({ '/api/books?category=ficcion': () => new Promise(() => {}) });
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});

  renderAt('/categorias/ficcion');
  await screen.findByRole('status');
  const signal = global.fetch.mock.calls[0][1].signal;

  await userEvent.click(screen.getByRole('link', { name: 'Inicio' }));

  expect(signal.aborted).toBe(true);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(errors).not.toHaveBeenCalled();
  errors.mockRestore();
});

test('a non-existent nested address shows the not found page', () => {
  mockFetch({});

  renderAt('/categorias/ficcion/extra');

  expect(
    screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Volver a Inicio' })).toBeInTheDocument();
});
