import "./pantry.css";

interface PantryItemType {
  _id?: string;
  name: string;
  category?: string;
  quantity: number;
  unitType?: string;
  threshold?: number;
  expirationDate?: string;
}

type ExpirationStatus = "expired" | "expiring-soon" | "fresh" | "no-date";

interface PantryItemProps {
  pantryItem: PantryItemType;
  status?: ExpirationStatus; // passed from container (computed by getStatus)
}

const formatExpirationDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const statusLabel = (status: ExpirationStatus) => {
  switch (status) {
    case "expired":
      return "Expired";
    case "expiring-soon":
      return "Expiring Soon";
    case "fresh":
      return "Fresh";
    case "no-date":
    default:
      return "No Date";
  }
};

const PantryItem = ({ pantryItem, status = "no-date" }: PantryItemProps) => {
  const { name, category, quantity, unitType, threshold, expirationDate } = pantryItem;

  const handleClick = (action: "update" | "delete") => {
    console.log(`${action} clicked for:`, name);
  };

  return (
    <article className="pantry-card">
      <div className="pantry-card-header">
        <h3 className="name">{name.toUpperCase()}</h3>

        {/* Status pill */}
        <span className={`expiration-status ${status}`}>
          {statusLabel(status)}
        </span>
      </div>

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
      </ul>

      <div className="button-container">
        <button onClick={() => handleClick("update")} className="button">
          Update Item
        </button>
        <button onClick={() => handleClick("delete")} className="button danger">
          Delete Item
        </button>
      </div>
    </article>
  );
};

export default PantryItem;
