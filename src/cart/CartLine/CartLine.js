import { BookLink } from '../../books/BookLink/BookLink';
import { CategoryTile } from '../../books/CategoryTile/CategoryTile';
import { Card } from '../../ui/Card/Card';
import { QuantityButton } from '../QuantityButton/QuantityButton';

export function CartLine(props) {
  const book = props.book;

  function increase() {
    props.onIncrease(book.id);
  }

  function decrease() {
    props.onDecrease(book.id);
  }

  return (
    <Card as="li" className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-3 md:flex-1">
        <CategoryTile productType={book.productType} size="small" />
        <div className="flex flex-col">
          <BookLink book={book} />
          <span className="text-sm text-muted">
            {book.brand} · {book.productType}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <QuantityButton action="Disminuir" book={book} symbol="−" onClick={decrease} />
        <span aria-live="polite" className="min-w-24 text-center text-base font-semibold">
          {`Cantidad: ${props.quantity}`}
        </span>
        <QuantityButton
          action="Aumentar"
          book={book}
          disabled={book.quantity < 1}
          symbol="+"
          onClick={increase}
        />
      </div>
    </Card>
  );
}
