import { useState, useEffect } from "react";
import "./pantry.css";
import PantryItem from "./PantryItem";

interface PantryItemType {
  _id?: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: string;
}

type FilterType = "all" | "expired" | "expiring-soon" | "fresh";

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
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function getPantryItems() {
      const response = await fetch("http://localhost:3000"); // keeping your existing endpoint :contentReference[oaicite:4]{index=4}
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const items = await response.json();
      setPItems(items);
    }

    getPantryItems();
  }, []);

  const displayedItems = pItems
    .filter((item) => (filter === "all" ? true : getStatus(item) === filter))
    .slice()
    .sort(sortByExpiration);

  return (
    <>
      <div className="pantry-filters">
        <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={`filter-button ${filter === "expired" ? "active" : ""}`} onClick={() => setFilter("expired")}>
          Expired
        </button>
        <button className={`filter-button ${filter === "expiring-soon" ? "active" : ""}`} onClick={() => setFilter("expiring-soon")}>
          Expiring Soon
        </button>
        <button className={`filter-button ${filter === "fresh" ? "active" : ""}`} onClick={() => setFilter("fresh")}>
          Fresh
        </button>
      </div>

      <div className="pantry-container">
        {displayedItems.map((pItem, idx) => (
          <PantryItem
            key={pItem._id ?? `${pItem.name}-${idx}`}
            pantryItem={pItem}
            status={getStatus(pItem)}
          />
        ))}
      </div>
    </>
  );
};

export default PantryItemContainer;
