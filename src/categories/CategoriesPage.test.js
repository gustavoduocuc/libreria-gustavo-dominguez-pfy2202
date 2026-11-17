import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { categories } from '../data';
import { jsonResponse, mockFetch, restoreFetch } from '../testing/mockFetch';
import { renderAt } from '../testing/renderAt';

afterEach(restoreFetch);

test('shows a loading status and no list while waiting', async () => {
  mockFetch({ '/api/categories': () => new Promise(() => {}) });

  renderAt('/categorias');

  expect(await screen.findByRole('status')).toHaveTextContent('Cargando categorías…');
  expect(screen.queryByRole('list', { name: 'Categorías' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('lists the nine categories with their description and link', async () => {
  mockFetch({ '/api/categories': jsonResponse(200, categories) });

  renderAt('/categorias');

  const list = await screen.findByRole('list', { name: 'Categorías' });
  const items = within(list).getAllByRole('listitem');

  expect(items).toHaveLength(9);
  expect(within(items[0]).getByRole('link', { name: 'Ficción' })).toHaveAttribute(
    'href',
    '/categorias/ficcion'
  );
  expect(within(items[0]).getByText(categories[0].description)).toBeInTheDocument();
  expect(within(items[8]).getByRole('link', { name: 'Poesía' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Categorías' })).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('the menu marks Categorías as current', async () => {
  mockFetch({ '/api/categories': jsonResponse(200, categories) });

  renderAt('/categorias');

  await screen.findByRole('list', { name: 'Categorías' });
  const menu = screen.getByRole('navigation', { name: 'Secciones' });

  expect(within(menu).getByRole('link', { name: 'Categorías' })).toHaveAttribute(
    'aria-current',
    'page'
  );
});

test('a failed request shows an alert and no list', async () => {
  mockFetch({ '/api/categories': jsonResponse(500, { message: 'Error simulado del servidor.' }) });

  renderAt('/categorias');

  expect(await screen.findByRole('alert')).toHaveTextContent('Error simulado del servidor.');
  expect(screen.queryByRole('list', { name: 'Categorías' })).not.toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('choosing a category opens its address', async () => {
  mockFetch({
    '/api/categories': jsonResponse(200, categories),
    '/api/books?category=ficcion': jsonResponse(200, []),
  });

  renderAt('/categorias');

  await userEvent.click(await screen.findByRole('link', { name: 'Ficción' }));

  expect(await screen.findByRole('heading', { level: 1, name: 'Ficción' })).toBeInTheDocument();
});
