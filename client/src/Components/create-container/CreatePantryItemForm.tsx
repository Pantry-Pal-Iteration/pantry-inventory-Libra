import styles from './createContainer.css';
import { useForm, type SubmitHandler } from 'react-hook-form';

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
  // const { register, handleSubmit } = useForm<FormFields>();

  // const onSubmit: SubmitHandler<FormFields> = (data) => {
  //   console.log(data);
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
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
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default CreatePantryItemForm;

/*useForm notes


*/
