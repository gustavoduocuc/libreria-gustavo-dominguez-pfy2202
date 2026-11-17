import { BookCover } from '../../books/BookCover/BookCover';
import { BookLink } from '../../books/BookLink/BookLink';
import { CategoryChip } from '../../books/CategoryChip/CategoryChip';
import { Price } from '../../books/Price/Price';
import { StockCount } from '../../books/StockCount/StockCount';
import { Card } from '../../ui/Card/Card';

export function BookCard(props) {
  return (
    <Card as="li" className="flex flex-col gap-3 p-4">
      <div className="mx-auto w-full max-w-48">
        <BookCover book={props.book} />
      </div>
      <div className="flex flex-col">
        <p className="font-serif text-lg font-bold leading-snug">
          <BookLink book={props.book} />
        </p>
        <p className="text-sm text-muted">{props.book.author}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <CategoryChip category={props.book.category} />
        <Price value={props.book.price} />
      </div>
      <div className="mt-auto">
        <StockCount stock={props.book.stock} />
      </div>
    </Card>
  );
}
