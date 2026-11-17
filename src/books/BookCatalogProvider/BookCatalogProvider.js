import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createBook, fetchBooks, removeBook as requestRemoveBook } from '../../api/booksApi';

const BookCatalogContext = createContext(null);

const loadingState = { status: 'loading', books: [], error: null };

function isAbort(error) {
  return error instanceof DOMException && error.name === 'AbortError';
}

// Estado de servidor: la lista de libros viene del backend GraphQL y se recarga tras cada mutación.
export function BookCatalogProvider(props) {
  const [state, setState] = useState(loadingState);
  const [version, setVersion] = useState(0);
  const isMounted = useRef(true);

  useEffect(function trackMount() {
    isMounted.current = true;
    return function untrack() {
      isMounted.current = false;
    };
  }, []);

  useEffect(
    function loadBooks() {
      const controller = new AbortController();
      fetchBooks({ signal: controller.signal })
        .then(function showBooks(books) {
          setState({ status: 'success', books, error: null });
        })
        .catch(function showError(error) {
          if (!isAbort(error)) {
            setState({ status: 'error', books: [], error });
          }
        });
      return function cancel() {
        controller.abort();
      };
    },
    [version]
  );

  function reload() {
    setState(loadingState);
    setVersion(function next(current) {
      return current + 1;
    });
  }

  // Recarga la lista sin mostrar «cargando» (para después de una mutación exitosa).
  async function refresh() {
    try {
      const books = await fetchBooks();
      if (isMounted.current) {
        setState({ status: 'success', books, error: null });
      }
    } catch (error) {
      if (isMounted.current) {
        setState({ status: 'error', books: [], error });
      }
    }
  }

  async function addBook(input) {
    const book = await createBook(input);
    await refresh();
    return book;
  }

  async function removeBook(bookId) {
    await requestRemoveBook(bookId);
    await refresh();
  }

  const catalog = { ...state, reload, addBook, removeBook };

  return <BookCatalogContext.Provider value={catalog}>{props.children}</BookCatalogContext.Provider>;
}

export function useBookCatalog() {
  const catalog = useContext(BookCatalogContext);
  if (!catalog) {
    throw new Error('useBookCatalog needs a BookCatalogProvider');
  }
  return catalog;
}
