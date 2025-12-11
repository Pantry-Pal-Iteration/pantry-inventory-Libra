import styles from './pantry.css';

interface PantryItemType {
  _id?: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: Date;
}

interface PantryItemProps {
  pantryItem: PantryItemType;
}

// function to convert Date to a React readable format
const formatExpirationDate = (date?: Date): string => {
  if (!date) {
    return 'N/A';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const PantryItem = ({ pantryItem }: PantryItemProps) => {
  //commented out for testing form purposes
  // deconstruct pantryItem
  // const { name, category, quantity, unitType, threshold, expirationDate } = pantryItem;
  // added conditional rendering for optional items
  // return (
  //   <>
  //     <article className='pantry-card'>
  //       <h3 className='name'>Item name: {name}</h3>
  //       <ul className='listItems'>
  //         {category && <li className='category'>Category: {category}</li>}
  //         <li className='quantity'>Quantity: {quantity}</li>
  //         {unitType && <li className='unitType'>Unit Type: {unitType}</li>}
  //         {threshold && (
  //           <li className='threshold'>
  //             Buy more if quantity is less than {threshold}
  //           </li>
  //         )}
  //         {expirationDate && (
  //           <li className='expirationDate'>
  //             Expiration date: {formatExpirationDate(expirationDate)}
  //           </li>
  //         )}
  //       </ul>
  //     </article>
  //   </>
  // );
};

export default PantryItem;
