import { useMemo, useState } from "react";
import "./pantry.css";
import PantryItem from "./PantryItem";

export interface PantryItemType {
  _id: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: string;
}

type Props = {
  items: PantryItemType[];
  loading: boolean;
  error: string;
  onUpdate: (id: string, updates: Partial<PantryItemType>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

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

export default function PantryItemContainer({
  items,
  loading,
  error,
  onUpdate,
  onDelete,
}: Props) {
  const [filter, setFilter] = useState<"all" | "expired" | "expiring-soon" | "fresh">("all");

  const displayedItems = useMemo(() => {
    return items.filter((item) => {
      const status = getStatus(item);

      // All = everything NOT expired
      if (filter === "all") return status !== "expired";

      return status === filter;
    });
  }, [items, filter]);

  const handleMarkExpired = async (id: string) => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await onUpdate(id, { expirationDate: yesterday });
    setFilter("expired");
  };

  const handleClearExpired = async () => {
    const expiredItems = items.filter((it) => getStatus(it) === "expired");
    if (expiredItems.length === 0) return;

    const ok = window.confirm(
      `Clear ALL expired items (${expiredItems.length})? This can’t be undone.`
    );
    if (!ok) return;

    for (const it of expiredItems) {
      await onDelete(it._id);
    }
  };

  return (
    <div className="pantry-container">
      <div className="pantry-filters">
        <button className="button" onClick={() => setFilter("all")}>All</button>
        <button className="button" onClick={() => setFilter("expired")}>Expired</button>
        <button className="button" onClick={() => setFilter("expiring-soon")}>Expiring Soon</button>
        <button className="button" onClick={() => setFilter("fresh")}>Fresh</button>
      </div>

      {filter === "expired" && !loading && !error && (
        <div className="expired-actions">
          <button className="button button--danger" onClick={handleClearExpired}>
            Clear Expired
          </button>
        </div>
      )}

      {loading && <p className="status">Loading…</p>}
      {!loading && error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <div className="pantry-grid">
          {displayedItems.map((pItem) => (
            <PantryItem
              key={pItem._id}
              pantryItem={pItem}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMarkExpired={handleMarkExpired}
            />
          ))}
        </div>
      )}
    </div>
  );
}
