import { BookCover } from '../../books/BookCover/BookCover';
import { BookLink } from '../../books/BookLink/BookLink';
import { Price } from '../../books/Price/Price';
import { formatPrice } from '../../books/formatPrice';
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
        <div className="shrink-0">
          <BookCover book={book} size="small" />
        </div>
        <div className="flex flex-col">
          <BookLink book={book} />
          <span className="text-sm text-muted">
            {book.author} · {book.category}
          </span>
          <span className="text-sm text-muted">
            <Price value={book.price} /> c/u
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
          disabled={book.stock < 1}
          symbol="+"
          onClick={increase}
        />
      </div>
      <p className="whitespace-nowrap text-base font-semibold md:min-w-28 md:text-right">
        {`Subtotal: ${formatPrice(book.price * props.quantity)}`}
      </p>
    </Card>
  );
}
