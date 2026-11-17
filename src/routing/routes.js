import { createBrowserRouter } from 'react-router';
import { AboutPage } from '../about/AboutPage/AboutPage';
import {
  BookManagementIndex,
  BookManagementLayout,
} from '../books/BookManagementLayout/BookManagementLayout';
import { AddBookPage } from '../books/AddBookPage/AddBookPage';
import { BookDetailPage } from '../books/BookDetailPage/BookDetailPage';
import { BookInventoryPage } from '../books/BookInventoryPage/BookInventoryPage';
import { CartPage } from '../cart/CartPage/CartPage';
import { ContactPage } from '../contact/ContactPage/ContactPage';
import { bookstoreProfile } from '../content/bookstoreProfile';
import { HomePage } from '../home/HomePage/HomePage';
import { AppShell } from '../shell/AppShell/AppShell';
import { NotFoundPage } from './NotFoundPage/NotFoundPage';
import { getRouterBasename } from './routerBasename';

export function loadAbout() {
  return bookstoreProfile.aboutParagraphs;
}

export function loadContact() {
  return {
    address: bookstoreProfile.address,
    phone: bookstoreProfile.phone,
    email: bookstoreProfile.email,
  };
}

function ShellHydrateFallback() {
  return null;
}

export const routes = [
  {
    path: '/',
    Component: AppShell,
    HydrateFallback: ShellHydrateFallback,
    children: [
      { index: true, Component: HomePage },
      { path: 'quienes-somos', Component: AboutPage, loader: loadAbout },
      { path: 'contacto', Component: ContactPage, loader: loadContact },
      {
        path: 'gestion-articulos',
        Component: BookManagementLayout,
        children: [
          { index: true, Component: BookManagementIndex },
          { path: 'agregar-articulo', Component: AddBookPage },
          { path: 'inventario-articulos', Component: BookInventoryPage },
        ],
      },
      { path: 'articulos/:bookId', Component: BookDetailPage },
      { path: 'carrito', Component: CartPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];

export const appRouter = createBrowserRouter(routes, {
  basename: getRouterBasename(process.env.PUBLIC_URL),
});
