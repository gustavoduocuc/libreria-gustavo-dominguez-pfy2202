import { seedBooks } from '../../data';

function normalize(value) {
  return value.trim().toLocaleLowerCase('es');
}

function bookKey(book) {
  return [normalize(book.title), normalize(book.author), normalize(book.category)].join('\n');
}

// Almacén en memoria: única fuente de verdad del backend mock (REST y GraphQL).
export function createBookStore(seed) {
  let books = seed.map(function copy(book) {
    return { ...book };
  });
  let nextId = 1;

  function getAll() {
    return books.map(function copy(book) {
      return { ...book };
    });
  }

  function findById(id) {
    const book = books.find(function hasId(current) {
      return current.id === id;
    });
    return book ? { ...book } : undefined;
  }

  function listByCategoryName(name) {
    return getAll().filter(function isInCategory(book) {
      return book.category === name;
    });
  }

  function register(input) {
    const key = bookKey(input);
    const match = books.find(function sameBook(current) {
      return bookKey(current) === key;
    });
    if (match) {
      match.stock += input.stock;
      return { book: { ...match }, created: false };
    }
    const book = {
      id: `libro-${nextId}`,
      title: input.title.trim(),
      author: input.author.trim(),
      category: input.category,
      price: input.price,
      stock: input.stock,
    };
    nextId += 1;
    books = books.concat(book);
    return { book: { ...book }, created: true };
  }

  function remove(id) {
    const book = findById(id);
    if (book) {
      books = books.filter(function keepBook(current) {
        return current.id !== id;
      });
    }
    return book;
  }

  function reset() {
    books = seed.map(function copy(book) {
      return { ...book };
    });
    nextId = 1;
  }

  return { getAll, findById, listByCategoryName, register, remove, reset };
}

export const bookStore = createBookStore(seedBooks);
