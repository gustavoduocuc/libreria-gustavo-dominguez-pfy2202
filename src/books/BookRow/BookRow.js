import { Button } from '../../ui/Button/Button';
import { BookLink } from '../BookLink/BookLink';
import { bodyCellClass, stickyCellClass } from '../tableCellClass';
import { StockCount } from '../StockCount/StockCount';

export function BookRow(props) {
  function removeRow() {
    props.onRemove(props.book.id);
  }

  return (
    <tr className="bg-surface transition-colors duration-200 hover:bg-accent-soft">
      <td className={`${bodyCellClass} ${stickyCellClass}`}>
        <BookLink book={props.book} />
      </td>
      <td className={bodyCellClass}>{props.book.brand}</td>
      <td className={bodyCellClass}>{props.book.productType}</td>
      <td className={bodyCellClass}>
        <StockCount quantity={props.book.quantity} />
      </td>
      <td className={bodyCellClass}>
        <Button
          ariaLabel={`Eliminar ${props.book.name}`}
          variant="danger"
          onClick={removeRow}
        >
          Eliminar
        </Button>
      </td>
    </tr>
  );
}
