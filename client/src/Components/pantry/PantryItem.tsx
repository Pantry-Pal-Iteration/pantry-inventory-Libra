import "./pantry.css";
import { useState } from "react";
import type { PantryItemType } from "./PantryItemContainer";

interface PantryItemProps {
  pantryItem: PantryItemType;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<PantryItemType>) => Promise<void>;
  onMarkExpired: (id: string) => Promise<void> | void;
}

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

export default function PantryItem({ pantryItem, onDelete, onUpdate, onMarkExpired }: PantryItemProps) {
  const { _id, name, category, quantity, unitType, threshold, expirationDate } = pantryItem;

  const expirationStatus = getExpirationStatus(expirationDate);

  const [isEditing, setIsEditing] = useState(false);
  const [newQty, setNewQty] = useState<number>(quantity);

  return (
    <article className="pantry-card">
      <h3 className="name">{name.toUpperCase()}</h3>

      <ul className="listItems">
        {category && <li className="category">Category: {category.toLowerCase()}</li>}
        <li className="quantity">Quantity: {quantity}</li>
        {unitType && <li className="unitType">Unit: {unitType.toLowerCase()}</li>}
        {threshold && <li className="threshold">Buy more if you have less than {threshold}</li>}

        {expirationDate && (
          <li className="expirationDate">
            Expiration date: {formatExpirationDate(expirationDate)}
          </li>
        )}

        {expirationStatus !== "no-date" && (
          <li className={`expiration-status ${expirationStatus}`}>
            {expirationStatus === "expired" && "Expired"}
            {expirationStatus === "expiring-soon" && "Expiring Soon"}
            {expirationStatus === "fresh" && "Fresh"}
          </li>
        )}
      </ul>

      {isEditing && (
        <div className="edit-row">
          <input
            type="number"
            value={newQty}
            onChange={(e) => setNewQty(Number(e.target.value))}
          />
          <button
            className="button"
            onClick={() => {
              onUpdate(_id, { quantity: newQty });
              setIsEditing(false);
            }}
            type="button"
          >
            Save
          </button>
        </div>
      )}

      <div className="button-container">
        <button
          className="button"
          onClick={() => setIsEditing((prev) => !prev)}
          type="button"
        >
          {isEditing ? "Cancel" : "Update Item"}
        </button>

        <button
          className="button button--danger"
          onClick={() => onDelete(_id)}
          type="button"
        >
          Delete Item
        </button>

        <button
          className="button button-expire"
          onClick={() => onMarkExpired(_id)}
          type="button"
        >
          Mark Expired
        </button>
      </div>
    </article>
  );
}
