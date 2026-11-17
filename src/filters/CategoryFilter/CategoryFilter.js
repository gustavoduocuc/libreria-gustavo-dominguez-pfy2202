import { allCategories, bookCategories } from '../../data';
import { SelectField } from '../../ui/SelectField/SelectField';

const options = [allCategories, ...bookCategories];

export function CategoryFilter(props) {
  function chooseCategory(event) {
    props.onSelect(event.target.value);
  }

  return (
    <div className="w-full max-w-xs">
      <SelectField
        label="Categoría"
        name="category"
        options={options}
        value={props.category}
        onChange={chooseCategory}
      />
    </div>
  );
}
