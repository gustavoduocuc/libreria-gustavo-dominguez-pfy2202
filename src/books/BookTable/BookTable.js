import { Card } from '../../ui/Card/Card';
import { focusRingClass } from '../../ui/focusRing';
import { BookRow } from '../BookRow/BookRow';
import { headerCellClass, stickyCellClass } from '../tableCellClass';

const regionClass = `overflow-x-auto rounded-card ${focusRingClass}`;

export function BookTable(props) {
  return (
    <Card>
      <div
        aria-label="Inventario de artículos"
        className={regionClass}
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[36rem] border-collapse text-sm lg:min-w-0">
          <thead>
            <tr className="bg-background">
              <th className={`${headerCellClass} ${stickyCellClass}`} scope="col">
                Nombre
              </th>
              <th className={headerCellClass} scope="col">
                Marca
              </th>
              <th className={headerCellClass} scope="col">
                Tipo
              </th>
              <th className={headerCellClass} scope="col">
                Unidades
              </th>
              <th className={headerCellClass} scope="col">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {props.books.map(function renderBook(book) {
              return (
                <BookRow key={book.id} book={book} onRemove={props.onRemove} />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
