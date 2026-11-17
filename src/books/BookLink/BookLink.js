import { TextLink } from '../../ui/TextLink/TextLink';

export function BookLink(props) {
  return <TextLink to={`/libros/${props.book.id}`}>{props.book.title}</TextLink>;
}
