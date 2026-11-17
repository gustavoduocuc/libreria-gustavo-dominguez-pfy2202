import { Card } from '../../ui/Card/Card';
import { focusRingClass } from '../../ui/focusRing';
import { BookRow } from '../BookRow/BookRow';
import { headerCellClass, stickyCellClass } from '../tableCellClass';

const regionClass = `overflow-x-auto rounded-card ${focusRingClass}`;
const columns = ['Autor', 'Categoría', 'Precio', 'Stock', 'Acciones'];

export function BookTable(props) {
  return (
    <Card>
      <div aria-label="Inventario de libros" className={regionClass} role="region" tabIndex={0}>
        <table className="w-full min-w-[44rem] border-collapse text-sm lg:min-w-0">
          <thead>
            <tr className="bg-background">
              <th className={`${headerCellClass} ${stickyCellClass}`} scope="col">
                Título
              </th>
              {columns.map(function renderColumn(column) {
                return (
                  <th key={column} className={headerCellClass} scope="col">
                    {column}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {props.books.map(function renderBook(book) {
              return <BookRow key={book.id} book={book} onRemove={props.onRemove} />;
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
