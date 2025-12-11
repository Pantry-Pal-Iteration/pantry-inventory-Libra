import { useForm, type SubmitHandler } from 'react-hook-form';
// import { z } from 'zod';
import './createContainer.css';

//I'll go down a rabbit hole if I keep looking at data validation.
// const schema = z.object({
//   name: z.string().required("Item is required");

// });

type FormFields = {
  _id?: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: Date;
};

const CreatePantryItemForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Response: ', result);
    } catch (err) {
      setError('name', {
        message: 'You entered something wrong - endpoint issues',
      });
      console.log(err);
    }
  };
  return (
    <>
      <div>CreatePantryItemForm</div>
      <form className='create-form' onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name', {
            required: true,
          })}
          type='text'
          placeholder='Item Name'
        />
        <input {...register('category')} type='text' placeholder='Category' />
        <input
          {...register('quantity', {
            required: true,
          })}
          type='number'
          placeholder='Quantity'
        />
        <input {...register('unitType')} type='text' placeholder='Unit Type' />
        <input {...register('threshold')} type='text' placeholder='Threshold' />
        <input
          {...register('expirationDate')}
          type='date'
          placeholder='Expiration Date'
        />
        <button disabled={isSubmitting} type='submit'>
          {isSubmitting ? 'Filling your pantry!' : 'Submit'}
        </button>
      </form>
    </>
  );
};

export default CreatePantryItemForm;

/*useForm notes


*/
