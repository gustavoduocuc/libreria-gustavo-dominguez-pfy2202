import { fetchBooksByCategory, fetchCategories } from './catalogApi';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve([]),
  });
});

afterEach(() => {
  delete global.fetch;
});

test('fetchCategories asks for the categories endpoint', async () => {
  const controller = new AbortController();

  await fetchCategories({ signal: controller.signal });

  expect(global.fetch).toHaveBeenCalledWith('/api/categories', { signal: controller.signal });
});

test('fetchBooksByCategory asks for the books of the slug', async () => {
  const controller = new AbortController();

  await fetchBooksByCategory('ficcion', { signal: controller.signal });

  expect(global.fetch).toHaveBeenCalledWith('/api/books?category=ficcion', {
    signal: controller.signal,
  });
});

test('the slug is encoded in the query string', async () => {
  await fetchBooksByCategory('a b&c');

  expect(global.fetch).toHaveBeenCalledWith('/api/books?category=a%20b%26c', {
    signal: undefined,
  });
});
