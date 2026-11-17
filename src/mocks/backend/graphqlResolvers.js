import { categories } from '../../data';
import { bookStore } from './bookStore';
import { validateBookInput } from './validateBookInput';

const simulatedErrorValue = 'error-500';
const failureStorageKey = 'mockFailOperation';

function failure(message, code, field) {
  return { errors: [{ message, extensions: field ? { code, field } : { code } }] };
}

function isDevelopment() {
  return process.env.NODE_ENV !== 'production';
}

function isForcedToFail(operationName) {
  if (!isDevelopment() || typeof localStorage === 'undefined') {
    return false;
  }
  return localStorage.getItem(failureStorageKey) === operationName;
}

function serverFailure() {
  return failure('Error simulado del servidor.', 'INTERNAL_SERVER_ERROR');
}

function toGraphqlBook(book) {
  const category = categories.find(function hasName(current) {
    return current.name === book.category;
  });
  return { ...book, category: { ...category, id: String(category.id) } };
}

function findCategoryById(categoryId) {
  return categories.find(function hasId(category) {
    return String(category.id) === String(categoryId);
  });
}

function books(variables) {
  const slug = variables.category;
  if (slug === undefined || slug === null) {
    return { data: { books: bookStore.getAll().map(toGraphqlBook) } };
  }
  if (isDevelopment() && slug === simulatedErrorValue) {
    return serverFailure();
  }
  const category = categories.find(function hasSlug(current) {
    return current.slug === slug;
  });
  if (!category) {
    return failure(`La categoría «${slug}» no existe.`, 'NOT_FOUND', 'category');
  }
  return { data: { books: bookStore.listByCategoryName(category.name).map(toGraphqlBook) } };
}

function book(variables) {
  const found = bookStore.findById(variables.id);
  return { data: { book: found ? toGraphqlBook(found) : null } };
}

function addBook(variables) {
  const input = variables.input ?? {};
  if (isDevelopment() && input.title === simulatedErrorValue) {
    return serverFailure();
  }
  const problems = validateBookInput(input);
  if (problems.length > 0) {
    return {
      errors: problems.map(function toGraphqlError(problem) {
        return {
          message: problem.message,
          extensions: { code: 'BAD_USER_INPUT', field: problem.field },
        };
      }),
    };
  }
  const category = findCategoryById(input.categoryId);
  const result = bookStore.register({
    title: input.title,
    author: input.author,
    category: category.name,
    price: input.price,
    stock: input.stock,
  });
  return { data: { addBook: toGraphqlBook(result.book) } };
}

function deleteBook(variables) {
  const removed = bookStore.remove(variables.id);
  if (!removed) {
    return failure(`El libro «${variables.id}» no existe.`, 'NOT_FOUND', 'id');
  }
  return { data: { deleteBook: toGraphqlBook(removed) } };
}

const operations = {
  Books: books,
  Book: book,
  AddBook: addBook,
  DeleteBook: deleteBook,
};

// Ejecuta una operación GraphQL del mock; devuelve { data } o { errors }.
export function executeOperation(operationName, variables = {}) {
  const operation = operations[operationName];
  if (!operation) {
    return failure(`Operación desconocida: ${operationName}.`, 'BAD_REQUEST');
  }
  if (isForcedToFail(operationName)) {
    return serverFailure();
  }
  return operation(variables);
}
