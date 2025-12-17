import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import './createContainer.css';

export type FormFields = {
  _id?: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: string; 
};

type Props = {
  onCreated: (newItem: FormFields) => void;
};

const CreatePantryItemForm = ({ onCreated }: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Create failed: ${response.status}`);
      }

      const created = await response.json()
      
      onCreated(created);
      reset();
    } catch (err) {
      setError('name', {
        message: 'Could not create item. Check server and endpoint.',
      });
      console.error(err);
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label>Item name</label>
        <input
          {...register('name', { required: 'Item name is required' })}
          type="text"
          placeholder="e.g., Rice"
        />
        {errors.name?.message ? (
          <p className="field-error">{errors.name.message}</p>
         ) : null}
      </div>

      <div className="field-row">
        <div className="field">
          <label>Category</label>
          <input {...register('category')} type="text" placeholder="e.g., Grains" />
        </div>

        <div className="field">
          <label>Unit</label>
          <input {...register('unitType')} type="text" placeholder="e.g., Ibs, bags" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Quantity</label>
          <input
            {...register('quantity', {
              required: 'Quantity is required',
              valueAsNumber: true,
              min: { value: 1, message: 'Quantity must be at least 1' },
            })}
            type="number"
            placeholder="e.g., 2"
          />
          {errors.quantity?.message ? <p className="field-error">{errors.quantity.message}</p> : null}
        </div>

        <div className="field">
          <label>Threshold</label>
          <input
            {...register('threshold', { valueAsNumber: true })}
            type="number"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="field">
        <label>Expiration date</label>
        <input {...register('expirationDate')} type="date" />
      </div>

      <button className="primary-btn create-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Adding…' : 'Add to pantry'}
      </button>
    </form>
  );
};

export default CreatePantryItemForm;


