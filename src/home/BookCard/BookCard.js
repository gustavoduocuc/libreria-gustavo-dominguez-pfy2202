import { BookLink } from '../../books/BookLink/BookLink';
import { CategoryChip } from '../../books/CategoryChip/CategoryChip';
import { CategoryTile } from '../../books/CategoryTile/CategoryTile';
import { StockCount } from '../../books/StockCount/StockCount';
import { Card } from '../../ui/Card/Card';

export function BookCard(props) {
  return (
    <Card as="li" className="flex flex-col gap-3 p-4">
      <CategoryTile productType={props.book.productType} />
      <div className="flex flex-col">
        <p className="text-lg font-semibold leading-snug">
          <BookLink book={props.book} />
        </p>
        <p className="text-sm text-muted">{props.book.brand}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <CategoryChip productType={props.book.productType} />
        <StockCount quantity={props.book.quantity} />
      </div>
    </Card>
  );
}
