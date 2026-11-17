export function unitsInCart(cartLines, bookId) {
  const line = cartLines.find(function isLine(current) {
    return current.bookId === bookId;
  });
  return line ? line.quantity : 0;
}

export function addUnit(cartLines, bookId) {
  if (unitsInCart(cartLines, bookId) === 0) {
    return cartLines.concat({ bookId, quantity: 1 });
  }
  return cartLines.map(function addToLine(line) {
    return line.bookId === bookId ? { bookId, quantity: line.quantity + 1 } : line;
  });
}

export function removeUnit(cartLines, bookId) {
  return cartLines
    .map(function takeFromLine(line) {
      return line.bookId === bookId ? { bookId, quantity: line.quantity - 1 } : line;
    })
    .filter(function keepLine(line) {
      return line.quantity > 0;
    });
}

export function clearBook(cartLines, bookId) {
  return cartLines.filter(function keepLine(line) {
    return line.bookId !== bookId;
  });
}

export function countCartUnits(cartLines) {
  return cartLines.reduce(function sumUnits(total, line) {
    return total + line.quantity;
  }, 0);
}

export function calculateCartTotal(books, cartLines) {
  return cartLines.reduce(function sumPrices(total, line) {
    const book = books.find(function isBook(current) {
      return current.id === line.bookId;
    });
    return book ? total + book.price * line.quantity : total;
  }, 0);
}
