import { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { BookLink } from '../BookLink/BookLink';
import { Price } from '../Price/Price';
import { StockCount } from '../StockCount/StockCount';
import { bodyCellClass, stickyCellClass } from '../tableCellClass';

export function BookRow(props) {
  const [isRemoving, setIsRemoving] = useState(false);

  async function removeRow() {
    setIsRemoving(true);
    await props.onRemove(props.book.id);
    setIsRemoving(false);
  }

  return (
    <tr className="bg-surface transition-colors duration-200 hover:bg-accent-soft">
      <td className={`${bodyCellClass} ${stickyCellClass}`}>
        <BookLink book={props.book} />
      </td>
      <td className={bodyCellClass}>{props.book.author}</td>
      <td className={bodyCellClass}>{props.book.category}</td>
      <td className={bodyCellClass}>
        <Price value={props.book.price} />
      </td>
      <td className={bodyCellClass}>
        <StockCount stock={props.book.stock} />
      </td>
      <td className={bodyCellClass}>
        <Button
          ariaLabel={`Eliminar ${props.book.title}`}
          disabled={isRemoving}
          variant="danger"
          onClick={removeRow}
        >
          {isRemoving ? 'Eliminando…' : 'Eliminar'}
        </Button>
      </td>
    </tr>
  );
}
