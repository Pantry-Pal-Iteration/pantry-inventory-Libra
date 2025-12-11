import styles from './createContainer.css';
import { useForm } from 'react-hook-form';

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
  // const { register } = useForm<FormFields>;
  // return (
  //   <>
  //     <div className='create-form'>CreatePantryItemForm</div>
  //     <form>
  //       <input {...register('name')} type='text' placeholder='Item Name' />
  //       <input {...register('category')} type='text' placeholder='Category' />
  //       <input {...register('quantity')} type='number' placeholder='Quantity' />
  //       <input {...register('unitType')} type='text' placeholder='Unit Type' />
  //       <input {...register('threshold')} type='text' placeholder='Threshold' />
  //       <input
  //         {...register('expirationDate')}
  //         type='Date'
  //         placeholder='Expiration Date'
  //       />
  //       <button type='submit'>Submit</button>
  //     </form>
  //   </>
  // );
};

export default CreatePantryItemForm;

/*useForm notes

*/
