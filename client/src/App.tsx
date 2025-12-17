import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer"
import CreatePantryItemContainer from "./Components/create-container/CreatePantryItemContainer";
import PantryItemContainer, { type PantryItemType } from "./Components/pantry/PantryItemContainer";

const API_BASE = "http://localhost:3000";

export default function App() {
  const [items, setItems] = useState<PantryItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  // initial load
  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (!ignore) setError("Failed to load pantry items.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // this show immediately + put first
  const onCreated = useCallback((created: PantryItemType) => {
    setItems((prev) => [created, ...prev.filter((x) => x._id !== created._id)]);
  }, []);

  // delete by id
  const onDelete = useCallback(async (id: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error(e);
      setError("Delete failed. Check your server route.");
    } finally {
      setBusyId("");
    }
  }, []);

  // update by id 
  const onUpdate = useCallback(
    async (id: string, updates: Partial<PantryItemType>) => {
      if (!updates || Object.keys(updates).length === 0) return;

      setBusyId(id);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) throw new Error(`Update failed: ${res.status}`);

        const updated = await res.json();
        setItems((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } catch (e) {
        console.error(e);
        setError("Update failed. Check your server route + request body.");
      } finally {
        setBusyId("");
      }
    },
    []
  );

  const containerProps = useMemo(
    () => ({
      items,
      loading,
      error,
      onUpdate: (id: string, updates: Partial<PantryItemType>) => onUpdate(id, updates),
      onDelete: (id: string) => onDelete(id),
      busyId,
    }),
    [items, loading, error, onUpdate, onDelete, busyId]
  );

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <div className="app-inner">
          <CreatePantryItemContainer onCreated={onCreated} />
          <PantryItemContainer {...containerProps} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
