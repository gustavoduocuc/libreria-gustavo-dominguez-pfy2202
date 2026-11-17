function normalizeText(value) {
  return value.trim().toLocaleLowerCase('es');
}

function bookKey(book) {
  return [
    normalizeText(book.title),
    normalizeText(book.author),
    normalizeText(book.category),
  ].join('\n');
}

function hasCartLine(cartLines, bookId) {
  return cartLines.some(function isLine(line) {
    return line.bookId === bookId;
  });
}

function addOneToLine(cartLines, bookId) {
  if (!hasCartLine(cartLines, bookId)) {
    return cartLines.concat({ bookId, quantity: 1 });
  }
  return cartLines.map(function addUnit(line) {
    if (line.bookId !== bookId) {
      return line;
    }
    return { bookId, quantity: line.quantity + 1 };
  });
}

function removeOneFromLine(cartLines, bookId) {
  return cartLines
    .map(function takeUnit(line) {
      if (line.bookId !== bookId) {
        return line;
      }
      return { bookId, quantity: line.quantity - 1 };
    })
    .filter(function keepLine(line) {
      return line.quantity > 0;
    });
}

function changeBookStock(books, bookId, difference) {
  return books.map(function changeStock(book) {
    if (book.id !== bookId) {
      return book;
    }
    return { ...book, stock: book.stock + difference };
  });
}

export function findBook(books, bookId) {
  return books.find(function isBook(book) {
    return book.id === bookId;
  });
}

export function countCartUnits(cartLines) {
  return cartLines.reduce(function sumUnits(total, line) {
    return total + line.quantity;
  }, 0);
}

export function calculateCartTotal(books, cartLines) {
  return cartLines.reduce(function sumPrices(total, line) {
    const book = findBook(books, line.bookId);
    if (!book) {
      return total;
    }
    return total + book.price * line.quantity;
  }, 0);
}

export function registerBook(state, book) {
  const key = bookKey(book);
  const match = state.books.find(function sameBook(current) {
    return bookKey(current) === key;
  });
  if (match) {
    return {
      ...state,
      books: changeBookStock(state.books, match.id, book.stock),
    };
  }
  return {
    ...state,
    books: state.books.concat({
      id: book.id,
      title: book.title.trim(),
      author: book.author.trim(),
      category: book.category,
      price: book.price,
      stock: book.stock,
    }),
  };
}

export function deleteBook(state, bookId) {
  return {
    ...state,
    books: state.books.filter(function keepBook(book) {
      return book.id !== bookId;
    }),
    cartLines: state.cartLines.filter(function keepLine(line) {
      return line.bookId !== bookId;
    }),
  };
}

export function addUnitToCart(state, bookId) {
  const book = findBook(state.books, bookId);
  if (!book || book.stock < 1) {
    return state;
  }
  return {
    ...state,
    books: changeBookStock(state.books, bookId, -1),
    cartLines: addOneToLine(state.cartLines, bookId),
  };
}

export function removeUnitFromCart(state, bookId) {
  if (!hasCartLine(state.cartLines, bookId)) {
    return state;
  }
  return {
    ...state,
    books: changeBookStock(state.books, bookId, 1),
    cartLines: removeOneFromLine(state.cartLines, bookId),
  };
}
