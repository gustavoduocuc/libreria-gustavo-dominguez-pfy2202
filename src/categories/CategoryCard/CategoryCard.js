import { Link } from 'react-router';
import { Card } from '../../ui/Card/Card';
import { focusRingClass } from '../../ui/focusRing';

export function CategoryCard(props) {
  return (
    <Card as="li" className="flex flex-col gap-2 p-4">
      <Link
        className={`inline-flex min-h-11 items-center rounded font-serif text-lg font-bold text-accent underline underline-offset-2 hover:text-accent-strong ${focusRingClass}`}
        to={`/categorias/${props.category.slug}`}
      >
        {props.category.name}
      </Link>
      <p className="text-sm text-muted">{props.category.description}</p>
    </Card>
  );
}
