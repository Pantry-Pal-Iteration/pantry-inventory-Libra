import { useState, useEffect } from 'react'
import './pantry.css'

import PantryItem from './PantryItem.tsx';

interface PantryItemType {
  _id?: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  // expirationDate?: string;
}

const PantryItemContainer = () => {
  const [pItems, setPItems] = useState<PantryItemType[]>([]);

  useEffect(() => {
    async function getPantryItems() {
      const response = await fetch('http://localhost:3000');
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const items = await response.json();
      setPItems(items);
    }
    getPantryItems();
    return;
  }, []);

  console.log(`Items: ${pItems}`);

  return (
    <div className='pantry-container'>
      {pItems.map((pItem) => (
        <PantryItem key={pItem._id} pantryItem={pItem} />
      ))}
    </div>
  );
};

export default PantryItemContainer;
