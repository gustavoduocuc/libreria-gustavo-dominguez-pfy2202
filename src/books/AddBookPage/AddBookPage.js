import { useState } from 'react';
import { bookCategories } from '../../data';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { SelectField } from '../../ui/SelectField/SelectField';
import { TextField } from '../../ui/TextField/TextField';
import { useBookInventory } from '../BookInventoryProvider/BookInventoryProvider';

const emptyDraft = {
  title: '',
  author: '',
  category: bookCategories[0],
  price: '',
  stock: '1',
};

function isPositiveInteger(value) {
  return /^\d+$/.test(value) && Number(value) >= 1;
}

function isFilled(value) {
  return value.trim() !== '';
}

function isValidDraft(draft) {
  return (
    isFilled(draft.title) &&
    isFilled(draft.author) &&
    isPositiveInteger(draft.price) &&
    isPositiveInteger(draft.stock)
  );
}

export function AddBookPage() {
  const inventory = useBookInventory();
  const [draft, setDraft] = useState(emptyDraft);

  function updateDraft(event) {
    const field = event.target.name;
    const value = event.target.value;
    setDraft(function replaceField(currentDraft) {
      return { ...currentDraft, [field]: value };
    });
  }

  function submitBook(event) {
    event.preventDefault();
    if (!isValidDraft(draft)) {
      return;
    }
    inventory.addBook({
      title: draft.title,
      author: draft.author,
      category: draft.category,
      price: Number(draft.price),
      stock: Number(draft.stock),
    });
    setDraft(emptyDraft);
  }

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Agregar libro</PageTitle>
      <Card className="w-full max-w-form p-4 md:p-6">
        <form className="flex flex-col gap-4" onSubmit={submitBook}>
          <TextField label="Título" name="title" value={draft.title} onChange={updateDraft} />
          <TextField label="Autor" name="author" value={draft.author} onChange={updateDraft} />
          <SelectField
            label="Categoría"
            name="category"
            options={bookCategories}
            value={draft.category}
            onChange={updateDraft}
          />
          <TextField
            label="Precio (CLP)"
            min="1"
            name="price"
            step="1"
            type="number"
            value={draft.price}
            onChange={updateDraft}
          />
          <TextField
            label="Stock"
            min="1"
            name="stock"
            step="1"
            type="number"
            value={draft.stock}
            onChange={updateDraft}
          />
          <div>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
