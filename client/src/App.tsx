import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

<<<<<<< Updated upstream
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
=======
import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import CreatePantryItemContainer from "./Components/create-container/CreatePantryItemContainer";
import PantryItemContainer, { type PantryItemType } from "./Components/pantry/PantryItemContainer";
import LoginPage from "./Components/LoginPage"; // You'll create this
>>>>>>> Stashed changes

import PantryItemContainer from './components/pantry/PantryItemContainer';
import type { PantryItemType } from './components/pantry/PantryItem';
import CreatePantryItemContainer from './components/create-container/CreatePantryItemContainer';
import type { FormFields } from './components/create-container/CreatePantryItemForm';


const API_BASE = 'http://localhost:3000'

const App = () => {
  const [items, setItems] = useState<PantryItemType[]>([]);
<<<<<<< Updated upstream
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
=======
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true); // Start with login page

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/check`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser(data.username);
          setShowLogin(false);
          fetchPantryItems(); // Load items if authenticated
        }
      } catch (err) {
        console.log("Not authenticated");
      }
    };
    checkAuth();
  }, []);

  const fetchPantryItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/`, {
        credentials: "include", // Important for cookies
      });
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setShowLogin(true);
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Fetch failed: ${res.status}`);
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to load pantry items.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const handleLogin = useCallback(async (username: string, password: string) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Critical for cookies
      });

      if (!res.ok) throw new Error("Login failed");

      setIsAuthenticated(true);
      setUser(username);
      setShowLogin(false);
      await fetchPantryItems(); // Load items after login
    } catch (err: any) {
      setError(err.message || "Login failed. Check credentials.");
    }
  }, [fetchPantryItems]);

  // Signup function
  const handleSignup = useCallback(async (username: string, password: string) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Signup failed");

      // Auto-login after signup
      await handleLogin(username, password);
    } catch (err: any) {
      setError(err.message || "Signup failed. Username may be taken.");
    }
  }, [handleLogin]);

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setItems([]);
      setShowLogin(true);
      setError("");
    }
  }, []);

  // Update all fetch calls to include credentials
  const onDelete = useCallback(async (id: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include", // Add this
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
    async (id: string, updates: Partial<PantryItemType>) => {
      if (!updates || Object.keys(updates).length === 0) return;
      setBusyId(id);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
          credentials: "include", // Add this
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        const updated = await res.json();
        setItems((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } catch (e) {
        console.error(e);
        setError("Update failed. Check your server route + request body.");
      } finally {
        setBusyId("");
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  const onCreated = useCallback((created: PantryItemType) => {
    setItems((prev) => [created, ...prev.filter((x) => x._id !== created._id)]);
  }, []);
>>>>>>> Stashed changes

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

  // Render login page if not authenticated
if (showLogin) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
<<<<<<< Updated upstream
        <div className="app-inner">
          <CreatePantryItemContainer onCreated={onCreated} />

          <PantryItemContainer
            {...containerProps}
          />
        </div>
=======
        <LoginPage
          onLogin={handleLogin}
          onSignup={handleSignup}
          error={error}
          loading={loading}
        />
>>>>>>> Stashed changes
      </main>
      {/* Footer without props on login page since user is not logged in */}
      <Footer />
    </div>
  );
<<<<<<< Updated upstream
};

export default App;
=======
}

// Update the authenticated view (around line 148-163):
return (
  <div className="app-shell">
    <Header user={user} onLogout={handleLogout} />

    <main className="app-main">
      <div className="app-inner">
        <CreatePantryItemContainer onCreated={onCreated} />
        <PantryItemContainer {...containerProps} />
      </div>
    </main>

    {/* Updated: Pass user and logout function to Footer */}
    <Footer user={user} onLogout={handleLogout} />
  </div>
)};
>>>>>>> Stashed changes
