import './pantry.css';
import { useState } from "react";


interface PantryItemType {
  _id: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: string;
 onDelete?: (id: string) => void;
 onUpdate?: (id: string, updates: Partial<PantryItemType>) => void;
 onButtonClick?: () => void;
  // buttonText?: string;
  buttonDisabled?: boolean;
  }

interface PantryItemProps {
  pantryItem: PantryItemType;
}

// function to convert Date to a React readable format
// const formatExpirationDate = (date?: Date): string => {
//   if (!date) {
//     return "N/A";
//   }
//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).format(date);
// };

function formatExpirationDate(dateString?: string) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getExpirationStatus(expirationDate?: string) {
  if (!expirationDate) return "no-date";

  const today = new Date();
  const exp = new Date(expirationDate);

  const diffInMs = exp.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return "expired";
  if (diffInDays <= 3) return "expiring-soon";
  return "fresh";
}


const PantryItem = ({ pantryItem }: PantryItemProps) => {
  // deconstruct pantryItem
  const { 
    _id,
    name, 
    category, 
    quantity, 
    unitType, 
    threshold, 
    expirationDate,
    onDelete,
    onUpdate
    // onButtonClick, (lo quite porque pantryItem vine de mongoDB y este no guarda functions) 
    // buttonDisabled = false (es logica de React, no datos)
  } = pantryItem;

    // const handleClick = () => {
    //   if (onButtonClick) {
    //     onButtonClick();
    //   }
    //  console.log("button works"); 
    // }
//     const handleClick = (action: "update" | "delete") => {
//   console.log(`${action} clicked for:`, name);
// };
const expirationStatus = getExpirationStatus(expirationDate);
// console.log("expirationDate:", expirationDate, "status:", expirationStatus);

const [isEditing, setIsEditing] = useState(false);
const [newQty, setNewQty] = useState(quantity);


  return (
    <>
      <article className='pantry-card'>
        
          <h3 className='name'> { name.toUpperCase() }</h3>
          <ul className='listItems'>
            {category && <li className='category'>Category: { category.toLowerCase() }</li>}
            <li className='quantity'>Quantity: { quantity }</li>
           {unitType && <li className='unitType'>Unit: { unitType.toLowerCase() }</li>}
            {threshold && <li className='threshold'>Buy more if you have less than { threshold }</li>}
           {expirationDate && (
            <li className='expirationDate'>
            Expiration date: { formatExpirationDate(expirationDate) }
            </li> )}
            {expirationStatus !== "no-date" && (
              <li
            className={`expiration-status ${expirationStatus}`}
            >
                {expirationStatus === "expired" && "Expired"}
                {expirationStatus === "expiring-soon" && "Expiring Soon"}
                {expirationStatus === "fresh" && "Fresh"}
                </li>
              )}
          </ul>
          {isEditing && (
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <input
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
              style={{
                width: "90px",
                padding: "6px",
                border: "1px solid white",
                background: "white",
                color: "black",
                }}
                />
              
              <button
              className="button"
              onClick={() => {
                onUpdate && onUpdate(_id, { quantity: newQty });
                setIsEditing(false);
              }}
              >
                Save
                </button>
                </div>
              )}

          <div className="button-container">
           <button
           className="button"
           onClick={() => setIsEditing((prev) => !prev)}
           >
            {isEditing ? "Cancel" : "Update Item"}
            </button>

            <button
            className="button"
            onClick={() => onDelete && onDelete(_id)}
            >
              Delete Item
              </button>
          </div>
        
      </article>
    </>
  );
};

export default PantryItem;
