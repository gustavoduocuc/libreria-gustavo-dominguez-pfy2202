import { getCategoryTone } from '../categoryTone';

const baseClass =
  'flex aspect-[2/3] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-r-control rounded-l-sm border-l-[0.75rem] px-4 py-6 text-center shadow-card';

const sizeClasses = {
  small: 'w-12 gap-0 border-l-[0.25rem] px-1 py-1',
  large: '',
};

// Portada decorativa: el título ya se anuncia en el enlace, por eso se oculta a lectores de pantalla.
export function BookCover(props) {
  const tone = getCategoryTone(props.book.category);
  const isSmall = props.size === 'small';

  return (
    <div
      aria-hidden="true"
      className={`${baseClass} ${sizeClasses[props.size ?? 'large']} ${tone.toneClass} ${tone.spineClass}`}
    >
      <span
        className={`font-serif font-bold leading-tight ${isSmall ? 'text-[0.5rem]' : 'text-xl'}`}
      >
        {props.book.title}
      </span>
      {!isSmall && <span className="text-sm">{props.book.author}</span>}
    </div>
  );
}
