const bookFields = `
  id
  title
  author
  price
  stock
  category {
    id
    slug
    name
  }
`;

export const booksOperation = {
  operationName: 'Books',
  query: `query Books($category: String) {
  books(category: $category) {${bookFields}}
}`,
};

export const bookOperation = {
  operationName: 'Book',
  query: `query Book($id: ID!) {
  book(id: $id) {${bookFields}}
}`,
};

export const addBookOperation = {
  operationName: 'AddBook',
  query: `mutation AddBook($input: AddBookInput!) {
  addBook(input: $input) {${bookFields}}
}`,
};

export const deleteBookOperation = {
  operationName: 'DeleteBook',
  query: `mutation DeleteBook($id: ID!) {
  deleteBook(id: $id) {${bookFields}}
}`,
};
