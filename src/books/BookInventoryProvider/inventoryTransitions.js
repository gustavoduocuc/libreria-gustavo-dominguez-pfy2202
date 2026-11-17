function normalizeText(value) {
  return value.trim().toLocaleLowerCase('es');
}

function bookKey(book) {
  return [
    normalizeText(book.name),
    normalizeText(book.brand),
    normalizeText(book.productType),
  ].join('\n');
}

function withQuantity(book, quantity) {
  return { ...book, quantity };
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

function changeBookQuantity(books, bookId, difference) {
  return books.map(function changeQuantity(book) {
    if (book.id !== bookId) {
      return book;
    }
    return withQuantity(book, book.quantity + difference);
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

export function registerBook(state, book) {
  const key = bookKey(book);
  const match = state.books.find(function sameBook(current) {
    return bookKey(current) === key;
  });
  if (match) {
    return {
      ...state,
      books: changeBookQuantity(state.books, match.id, book.quantity),
    };
  }
  return {
    ...state,
    books: state.books.concat({
      id: book.id,
      name: book.name,
      brand: book.brand,
      productType: book.productType,
      quantity: book.quantity,
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
  if (!book || book.quantity < 1) {
    return state;
  }
  return {
    ...state,
    books: changeBookQuantity(state.books, bookId, -1),
    cartLines: addOneToLine(state.cartLines, bookId),
  };
}

export function removeUnitFromCart(state, bookId) {
  if (!hasCartLine(state.cartLines, bookId)) {
    return state;
  }
  return {
    ...state,
    books: changeBookQuantity(state.books, bookId, 1),
    cartLines: removeOneFromLine(state.cartLines, bookId),
  };
}
