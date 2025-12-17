import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';

import PantryItemContainer from './components/pantry/PantryItemContainer';
import type { PantryItemType } from './components/pantry/PantryItem';
import CreatePantryItemContainer from './components/create-container/CreatePantryItemContainer';
import type { FormFields } from './components/create-container/CreatePantryItemForm';


const API_BASE = 'http://localhost:3000'

const App = () => {
  const [items, setItems] = useState<PantryItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [busyName, setBusyName] = useState<string>(''); // disables update/delete per-card

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Unexpected inventory response format');
      setItems(data);
    } catch (e) {
      console.error(e);
      setError('Could not load pantry items. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const onCreated = useCallback((newItem: FormFields) => {
    // put newest on top
    setItems((prev) => [newItem as PantryItemType, ...prev]);
  }, []);

  const onDelete = useCallback(async (name: string) => {
    const ok = window.confirm(`Delete "${name}" from your pantry?`);
    if (!ok) return;

    setBusyName(name);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      setItems((prev) => prev.filter((x) => x.name !== name));
    } catch (e) {
      console.error(e);
      setError('Delete failed. Check server route + item name.');
    } finally {
      setBusyName('');
    }
  }, []);

  const onUpdate = useCallback(
  async (name: string, updates?: Partial<PantryItemType>) => {
    // If no updates were provided, fall back to the existing "update quantity" 
    let payload: Partial<PantryItemType> | null = updates ?? null;

    if (!payload || Object.keys(payload).length === 0) {
      const raw = window.prompt(`New quantity for "${name}"?`);
      if (raw === null) return;

      const nextQty = Number(raw);
      if (!Number.isFinite(nextQty) || nextQty < 1) {
        window.alert("Quantity must be a number >= 1");
        return;
      }

      payload = { quantity: nextQty };
    }

    setBusyName(name);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Update failed: ${res.status}`);

      const updated = await res.json();
      setItems((prev) => prev.map((x) => (x.name === name ? updated : x)));
    } catch (e) {
      console.error(e);
      setError("Update failed. Check server route + request body.");
    } finally {
      setBusyName("");
    }
  }, []
  );


  const containerProps = useMemo(
    () => ({
      items,
      loading,
      error,
      onUpdate: (name: string, updates: Partial<PantryItemType>) => onUpdate(name, updates),
      onDelete: (name: string) => onDelete(name),
    }),
    [items, loading, error, onUpdate, onDelete]
  );

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <div className="app-inner">
          <CreatePantryItemContainer onCreated={onCreated} />

          <PantryItemContainer
            {...containerProps}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;