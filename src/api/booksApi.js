import {
  addBookOperation,
  bookOperation,
  booksOperation,
  deleteBookOperation,
} from './bookOperations';
import { graphqlRequest } from './graphqlClient';

// El libro de GraphQL trae la categoría como objeto; la UI trabaja con su nombre.
function toBook(graphqlBook) {
  return { ...graphqlBook, category: graphqlBook.category.name };
}

export async function fetchBooks(options = {}) {
  const data = await graphqlRequest({ ...booksOperation, variables: {}, signal: options.signal });
  return data.books.map(toBook);
}

export async function fetchBook(id, options = {}) {
  const data = await graphqlRequest({ ...bookOperation, variables: { id }, signal: options.signal });
  return data.book ? toBook(data.book) : null;
}

export async function createBook(input, options = {}) {
  const data = await graphqlRequest({
    ...addBookOperation,
    variables: { input },
    signal: options.signal,
  });
  return toBook(data.addBook);
}

export async function removeBook(id, options = {}) {
  const data = await graphqlRequest({
    ...deleteBookOperation,
    variables: { id },
    signal: options.signal,
  });
  return toBook(data.deleteBook);
}
