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
  expirationDate?: string;
}

function getStatus(item: PantryItemType) {
  if (!item.expirationDate) return "no-date";

  const today = new Date();
  const exp = new Date(item.expirationDate);

  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);

  const diffMs = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "expiring-soon";
  return "fresh";
}

function sortByExpiration(a: PantryItemType, b: PantryItemType) {
  const aTime = a.expirationDate ? new Date(a.expirationDate).getTime() : Infinity;
  const bTime = b.expirationDate ? new Date(b.expirationDate).getTime() : Infinity;
  return aTime - bTime; // soonest first
}


const PantryItemContainer = () => {
  const [pItems, setPItems] = useState<PantryItemType[]>([]);
  const [filter, setFilter] = useState<"all" | "expired" | "expiring-soon" | "fresh">("all");

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

const displayedItems = pItems
    .filter((item) => (filter === "all" ? true : getStatus(item) === filter))
    .slice()
    .sort(sortByExpiration);

  return (
   <> <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "12px" }}>
        <button className="button" onClick={() => setFilter("all")}>All</button>
        <button className="button" onClick={() => setFilter("expired")}>Expired</button>
        <button className="button" onClick={() => setFilter("expiring-soon")}>Expiring Soon</button>
        <button className="button" onClick={() => setFilter("fresh")}>Fresh</button>
      </div>

      <div className='pantry-container'>
        {displayedItems.map((pItem) => (
          <PantryItem key={pItem._id} pantryItem={pItem} />
        ))}
      </div>
    </>
  );
};

export default PantryItemContainer;


// interface PantryItemType {
//   _id?: string;
//   name: string;
//   category?: string;
//   quantity: number;
//   unitType?: string;
//   threshold?: number;
//   // expirationDate?: string;
// }

// const PantryItemContainer = () => {
//   const [pItems, setPItems] = useState<PantryItemType[]>([]);

//   useEffect(() => {
//     async function getPantryItems() {
//       const response = await fetch('http://localhost:3000');
//       if (!response.ok) {
//         const message = `An error occurred: ${response.statusText}`;
//         console.error(message);
//         return;
//       }
//       const items = await response.json();
//       setPItems(items);
//     }
//     getPantryItems();
//     return;
//   }, []);

//   console.log(`Items: ${pItems}`);

//   return (
//     <div className='pantry-container'>
//       {pItems.map((pItem) => (
//         <PantryItem key={pItem._id} pantryItem={pItem} />
//       ))}
//     </div>
//   );
// };

// export default PantryItemContainer;
