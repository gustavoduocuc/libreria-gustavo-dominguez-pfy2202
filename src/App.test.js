import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from './routing/routes';
import { renderAt } from './testing/renderAt';

async function fillBookForm({ title, author, category, price, stock }) {
  await userEvent.type(screen.getByLabelText('Título'), title);
  await userEvent.type(screen.getByLabelText('Autor'), author);
  await userEvent.selectOptions(screen.getByLabelText('Categoría'), category);
  await userEvent.clear(screen.getByLabelText('Precio (CLP)'));
  await userEvent.type(screen.getByLabelText('Precio (CLP)'), price);
  await userEvent.clear(screen.getByLabelText('Stock'));
  await userEvent.type(screen.getByLabelText('Stock'), stock);
  await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByRole('button', { name: 'Agregar' });
}

test('route table exposes the shell sections', () => {
  expect(routes[0].children.map(function childPath(child) {
    return child.index ? 'index' : child.path;
  })).toEqual([
    'index',
    'quienes-somos',
    'contacto',
    'gestion-libros',
    'libros/:bookId',
    'categorias',
    'categorias/:slug',
    'carrito',
    '*',
  ]);
});

test('home marks only Inicio as current', async () => {
  renderAt('/');

  expect(await screen.findByRole('link', { name: 'Inicio' })).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: 'Quiénes somos' })).not.toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: 'Contáctanos' })).not.toHaveAttribute(
    'aria-current',
    'page'
  );
});

test('choosing Quiénes somos shows that section', async () => {
  renderAt('/');

  await screen.findByRole('link', { name: 'Quiénes somos' });
  await userEvent.click(screen.getByRole('link', { name: 'Quiénes somos' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Quiénes somos' })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Quiénes somos' })).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute(
    'aria-current',
    'page'
  );
});

test('unknown address keeps the menu and explains the miss', () => {
  renderAt('/no-existe');

  expect(
    screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })
  ).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Volver a Inicio' })).toBeInTheDocument();
});

test('every screen has a single main heading', async () => {
  renderAt('/');

  await screen.findByRole('list');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('home lists the shared books and no edit controls', async () => {
  renderAt('/');

  expect(await screen.findByRole('list')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Libros' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Cien años de soledad' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(16);
  expect(screen.getByText('14 unidades')).toBeInTheDocument();
  expect(screen.getByText('9 unidades')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test('a book card shows its title, author, category, price and units', async () => {
  renderAt('/');

  const card = (await screen.findByRole('link', { name: 'Cien años de soledad' })).closest('li');

  expect(within(card).getAllByText('Gabriel García Márquez').length).toBeGreaterThan(0);
  expect(within(card).getByText('Ficción')).toBeInTheDocument();
  expect(within(card).getByText('$12.990')).toBeInTheDocument();
  expect(within(card).getByText('14 unidades')).toBeInTheDocument();
});

test('book covers are decorative and use no images', async () => {
  renderAt('/');

  await screen.findByRole('list');

  expect(screen.queryAllByRole('img')).toHaveLength(0);
  expect(screen.getAllByText('Dune')).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'Dune' })).toHaveLength(1);
});

test('about and contact show their content', async () => {
  renderAt('/');

  await screen.findByRole('link', { name: 'Quiénes somos' });
  await userEvent.click(screen.getByRole('link', { name: 'Quiénes somos' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Quiénes somos' })
  ).toBeInTheDocument();
  expect(screen.getByText(/Librería Tinta y Papel es una librería de barrio/)).toBeInTheDocument();

  await userEvent.click(screen.getByRole('link', { name: 'Contáctanos' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Contáctanos' })
  ).toBeInTheDocument();
  expect(screen.getByText('Avenida Providencia 1234, Santiago')).toBeInTheDocument();
  expect(screen.getByText('+56 2 2555 0142')).toBeInTheDocument();
  expect(screen.getByText('contacto@tintaypapel.cl')).toBeInTheDocument();
  expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test('book pages stay inside Gestión de libros', async () => {
  renderAt('/');

  await screen.findByRole('link', { name: 'Gestión de libros' });
  expect(screen.queryByRole('link', { name: 'Agregar libro' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Inventario de libros' })).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('link', { name: 'Gestión de libros' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Inventario de libros' })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Gestión de libros' })).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: 'Agregar libro' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Inventario de libros' })).toBeInTheDocument();
});

test('the add form offers the nine categories and the right fields', async () => {
  renderAt('/gestion-libros/agregar-libro');

  const select = await screen.findByLabelText('Categoría');

  expect(within(select).getAllByRole('option')).toHaveLength(9);
  expect(within(select).getByRole('option', { name: 'Poesía' })).toBeInTheDocument();
  expect(screen.getByLabelText('Título')).toBeInTheDocument();
  expect(screen.getByLabelText('Autor')).toBeInTheDocument();
  expect(screen.getByLabelText('Precio (CLP)')).toBeInTheDocument();
  expect(screen.getByLabelText('Stock')).toBeInTheDocument();
});

test('submitting a book shows it in the table and on home', async () => {
  renderAt('/gestion-libros/inventario-libros');

  expect(await screen.findByRole('cell', { name: 'Dune' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('link', { name: 'Agregar libro' }));
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Agregar libro' })
  ).toBeInTheDocument();

  await fillBookForm({
    title: 'Pedro Páramo',
    author: 'Juan Rulfo',
    category: 'Poesía',
    price: '8950',
    stock: '17',
  });

  expect(screen.getByLabelText('Título')).toHaveValue('');
  expect(screen.getByLabelText('Autor')).toHaveValue('');
  expect(screen.getByLabelText('Categoría')).toHaveValue('Ficción');
  expect(screen.getByLabelText('Precio (CLP)')).toHaveValue(null);
  expect(screen.getByLabelText('Stock')).toHaveValue(1);

  await userEvent.click(screen.getByRole('link', { name: 'Inventario de libros' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Inventario de libros' })
  ).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Pedro Páramo' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Juan Rulfo' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '$8.950' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '17 unidades' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('link', { name: 'Inicio' }));

  expect(await screen.findByRole('link', { name: 'Pedro Páramo' })).toBeInTheDocument();
});

test('initial books show their price and units in the table', async () => {
  renderAt('/gestion-libros/inventario-libros');

  const row = await screen.findByRole('row', { name: /Dune/ });

  expect(within(row).getByRole('cell', { name: 'Frank Herbert' })).toBeInTheDocument();
  expect(within(row).getByRole('cell', { name: 'Ciencia Ficción' })).toBeInTheDocument();
  expect(within(row).getByRole('cell', { name: '$15.990' })).toBeInTheDocument();
  expect(within(row).getByRole('cell', { name: '9 unidades' })).toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(17);
});

test('invalid stock, price or title show the server errors, keep the draft and add nothing', async () => {
  renderAt('/gestion-libros/agregar-libro');

  await screen.findByRole('heading', { level: 1, name: 'Agregar libro' });
  await fillBookForm({
    title: 'Rayuela',
    author: 'Julio Cortázar',
    category: 'Ficción',
    price: '9990',
    stock: '0',
  });

  expect(screen.getByLabelText('Título')).toHaveValue('Rayuela');
  expect(screen.getByLabelText('Stock')).toHaveValue(0);
  expect(screen.getByLabelText('Stock')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Stock')).toHaveAccessibleDescription(/stock debe ser/i);
  expect(screen.getByLabelText('Título')).not.toHaveAttribute('aria-invalid');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();

  await userEvent.clear(screen.getByLabelText('Stock'));
  await userEvent.type(screen.getByLabelText('Stock'), '3');
  await userEvent.clear(screen.getByLabelText('Precio (CLP)'));
  await userEvent.type(screen.getByLabelText('Precio (CLP)'), '0');
  await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByRole('button', { name: 'Agregar' });

  expect(screen.getByLabelText('Título')).toHaveValue('Rayuela');
  expect(screen.getByLabelText('Precio (CLP)')).toHaveAccessibleDescription(/precio debe ser/i);
  expect(screen.getByLabelText('Stock')).not.toHaveAttribute('aria-invalid');

  await userEvent.clear(screen.getByLabelText('Precio (CLP)'));
  await userEvent.type(screen.getByLabelText('Precio (CLP)'), '9990');
  await userEvent.clear(screen.getByLabelText('Título'));
  await userEvent.type(screen.getByLabelText('Título'), '   ');
  await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByRole('button', { name: 'Agregar' });

  expect(screen.getByLabelText('Título')).toHaveAccessibleDescription(/título es obligatorio/i);
  expect(screen.getByLabelText('Autor')).toHaveValue('Julio Cortázar');

  await userEvent.click(screen.getByRole('link', { name: 'Inventario de libros' }));
  expect(await screen.findByRole('cell', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.queryByRole('cell', { name: 'Rayuela' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(17);
});

test('several invalid fields at once are all marked', async () => {
  renderAt('/gestion-libros/agregar-libro');

  await screen.findByRole('heading', { level: 1, name: 'Agregar libro' });
  await userEvent.clear(screen.getByLabelText('Stock'));
  await userEvent.type(screen.getByLabelText('Stock'), '0');
  await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByRole('button', { name: 'Agregar' });

  ['Título', 'Autor', 'Precio (CLP)', 'Stock'].forEach((label) => {
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true');
  });
  expect(screen.getByLabelText('Categoría')).not.toHaveAttribute('aria-invalid');
});

test('the form shows a pending state while the book is being added', async () => {
  renderAt('/gestion-libros/agregar-libro');

  await screen.findByRole('heading', { level: 1, name: 'Agregar libro' });
  await userEvent.type(screen.getByLabelText('Título'), 'Rayuela');
  await userEvent.type(screen.getByLabelText('Autor'), 'Julio Cortázar');
  await userEvent.type(screen.getByLabelText('Precio (CLP)'), '9990');
  userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

  expect(screen.getByRole('button', { name: 'Agregando…' })).toBeDisabled();
  expect(await screen.findByRole('status')).toHaveTextContent('Libro agregado.');
  expect(screen.getByRole('button', { name: 'Agregar' })).toBeEnabled();
});

test('a server failure shows an alert and keeps the draft', async () => {
  renderAt('/gestion-libros/agregar-libro');

  await screen.findByRole('heading', { level: 1, name: 'Agregar libro' });
  await fillBookForm({
    title: 'error-500',
    author: 'Alguien',
    category: 'Ficción',
    price: '1000',
    stock: '1',
  });

  expect(screen.getByRole('alert')).toHaveTextContent('Error simulado del servidor.');
  expect(screen.getByLabelText('Título')).toHaveValue('error-500');
});

test('a book added with the form appears in its category page and one removed disappears', async () => {
  const router = renderAt('/gestion-libros/agregar-libro');

  await screen.findByRole('heading', { level: 1, name: 'Agregar libro' });
  await fillBookForm({
    title: 'Versos sencillos',
    author: 'José Martí',
    category: 'Poesía',
    price: '5990',
    stock: '4',
  });
  await act(async () => {
    await router.navigate('/categorias/poesia');
  });

  expect(await screen.findByRole('link', { name: 'Versos sencillos' })).toBeInTheDocument();
  expect(screen.queryByText('No hay libros en esta categoría.')).not.toBeInTheDocument();
});

test('a matching book adds stock and keeps its price; another author stays separate', async () => {
  renderAt('/gestion-libros/agregar-libro');

  await screen.findByLabelText('Título');
  await fillBookForm({
    title: 'el hobbit',
    author: 'j. r. r. tolkien',
    category: 'Fantasía',
    price: '1000',
    stock: '20',
  });
  await fillBookForm({
    title: 'El Hobbit',
    author: 'Otra Persona',
    category: 'Fantasía',
    price: '5000',
    stock: '13',
  });

  await userEvent.click(screen.getByRole('link', { name: 'Inventario de libros' }));

  expect(await screen.findByRole('cell', { name: '38 unidades' })).toBeInTheDocument();
  expect(screen.getAllByRole('cell', { name: 'El Hobbit' })).toHaveLength(2);
  expect(screen.getByRole('cell', { name: 'Otra Persona' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '13 unidades' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: '$10.990' })).toBeInTheDocument();
  expect(screen.queryByRole('cell', { name: 'el hobbit' })).not.toBeInTheDocument();
});

test('removing a book drops it from the table and from home', async () => {
  renderAt('/gestion-libros/inventario-libros');

  const row = await screen.findByRole('row', { name: /Matilda/ });
  await userEvent.click(within(row).getByRole('button', { name: /Eliminar/ }));

  await waitFor(() => expect(screen.queryByRole('cell', { name: 'Matilda' })).not.toBeInTheDocument());

  await userEvent.click(screen.getByRole('link', { name: 'Inicio' }));

  expect(await screen.findByRole('link', { name: 'Dune' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Matilda' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Eliminar/ })).not.toBeInTheDocument();
});

test('home links to the categories page', async () => {
  renderAt('/');

  expect(await screen.findByRole('link', { name: 'Explorar por categorías' })).toHaveAttribute(
    'href',
    '/categorias'
  );
});
