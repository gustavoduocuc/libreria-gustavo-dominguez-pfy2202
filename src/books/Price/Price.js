import { formatPrice } from '../formatPrice';

const sizeClasses = {
  normal: 'whitespace-nowrap font-semibold text-highlight',
  large: 'whitespace-nowrap text-xl font-bold text-highlight',
};

export function Price(props) {
  return <span className={sizeClasses[props.size ?? 'normal']}>{formatPrice(props.value)}</span>;
}
