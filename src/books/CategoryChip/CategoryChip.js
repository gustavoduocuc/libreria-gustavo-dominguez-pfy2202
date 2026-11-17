import { getCategoryTone } from '../categoryTone';

export function CategoryChip(props) {
  const tone = getCategoryTone(props.category);

  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-0.5 text-sm font-semibold ${tone.toneClass}`}
    >
      {props.category}
    </span>
  );
}
