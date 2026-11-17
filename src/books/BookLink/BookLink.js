import { TextLink } from '../../ui/TextLink/TextLink';

export function BookLink(props) {
  return <TextLink to={`/articulos/${props.book.id}`}>{props.book.name}</TextLink>;
}
