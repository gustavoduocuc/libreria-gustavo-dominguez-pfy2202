import { useState } from 'react';
import { bookCategories } from '../../data';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { PageTitle } from '../../ui/PageTitle/PageTitle';
import { SelectField } from '../../ui/SelectField/SelectField';
import { TextField } from '../../ui/TextField/TextField';
import { useBookCatalog } from '../BookCatalogProvider/BookCatalogProvider';
import { toAddBookInput } from '../toAddBookInput';

const emptyDraft = {
  title: '',
  author: '',
  category: bookCategories[0],
  price: '',
  stock: '1',
};

const noFeedback = { fieldErrors: {}, generalError: null, confirmation: null };

export function AddBookPage() {
  const catalog = useBookCatalog();
  const [draft, setDraft] = useState(emptyDraft);
  const [feedback, setFeedback] = useState(noFeedback);
  const [isSending, setIsSending] = useState(false);

  function updateDraft(event) {
    const field = event.target.name;
    const value = event.target.value;
    setDraft(function replaceField(currentDraft) {
      return { ...currentDraft, [field]: value };
    });
  }

  async function submitBook(event) {
    event.preventDefault();
    setIsSending(true);
    setFeedback(noFeedback);
    try {
      await catalog.addBook(toAddBookInput(draft));
      setDraft(emptyDraft);
      setFeedback({ ...noFeedback, confirmation: 'Libro agregado.' });
    } catch (error) {
      const fieldErrors = error.fieldErrors ?? {};
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      setFeedback({
        ...noFeedback,
        fieldErrors,
        generalError: hasFieldErrors ? null : error.message,
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="flex flex-col gap-section">
      <PageTitle>Agregar libro</PageTitle>
      <Card className="w-full max-w-form p-4 md:p-6">
        <form className="flex flex-col gap-4" noValidate onSubmit={submitBook}>
          <TextField
            error={feedback.fieldErrors.title}
            label="Título"
            name="title"
            value={draft.title}
            onChange={updateDraft}
          />
          <TextField
            error={feedback.fieldErrors.author}
            label="Autor"
            name="author"
            value={draft.author}
            onChange={updateDraft}
          />
          <SelectField
            error={feedback.fieldErrors.categoryId}
            label="Categoría"
            name="category"
            options={bookCategories}
            value={draft.category}
            onChange={updateDraft}
          />
          <TextField
            error={feedback.fieldErrors.price}
            label="Precio (CLP)"
            min="1"
            name="price"
            step="1"
            type="number"
            value={draft.price}
            onChange={updateDraft}
          />
          <TextField
            error={feedback.fieldErrors.stock}
            label="Stock"
            min="1"
            name="stock"
            step="1"
            type="number"
            value={draft.stock}
            onChange={updateDraft}
          />
          {feedback.generalError && (
            <p className="text-danger" role="alert">
              {feedback.generalError}
            </p>
          )}
          {feedback.confirmation && (
            <p className="text-accent" role="status">
              {feedback.confirmation}
            </p>
          )}
          <div>
            <Button disabled={isSending} type="submit">
              {isSending ? 'Agregando…' : 'Agregar'}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
