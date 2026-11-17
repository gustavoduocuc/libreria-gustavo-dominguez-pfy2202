import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '../routing/routes';
import { installFakeBackend } from './fakeBackend';

// Si la prueba no instaló su propio fetch, se usa el backend mock simulado.
export function renderAt(path) {
  if (!global.fetch) {
    installFakeBackend();
  }
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}
