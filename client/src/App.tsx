import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import CreatePantryItemContainer from "./Components/create-container/CreatePantryItemContainer";
import PantryItemContainer, { type PantryItemType } from "./Components/pantry/PantryItemContainer";
import LoginPage from "./Components/LoginPage"; // You'll create this

// REMOVE these duplicate imports - they conflict with the imports above
// import PantryItemContainer from './components/pantry/PantryItemContainer';
// import type { PantryItemType } from './components/pantry/PantryItem';
// import CreatePantryItemContainer from './components/create-container/CreatePantryItemContainer';
// import type { FormFields } from './components/create-container/CreatePantryItemForm';

const API_BASE = 'http://localhost:3000';

const App = () => {
  const [items, setItems] = useState<PantryItemType[]>([]);
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

  // FIXED: Removed duplicate fetchItems call - use fetchPantryItems instead
  useEffect(() => {
    if (isAuthenticated) {
      fetchPantryItems();
    }
  }, [isAuthenticated]);

  // FIXED: Single onDelete function (removed duplicate)
  const onDelete = useCallback(async (id: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Could not delete item.');
    } finally {
      setBusyId("");
    }
  }, []);

  // FIXED: Single onCreated function with proper typing
  const onCreated = useCallback((newItem: PantryItemType) => {
    // put newest on top
    setItems((prev) => [newItem, ...prev]);
  }, []);

  // FIXED: Single onUpdate function (removed duplicate and fixed syntax)
  const onUpdate = useCallback(async (id: string, updates: Partial<PantryItemType>) => {
    if (!updates || Object.keys(updates).length === 0) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      setItems((prev) => prev.map((x) => (x._id === id ? updated : x)));
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Update failed. Check your server route + request body.");
    } finally {
      setBusyId("");
    }
  }, []);

  const containerProps = useMemo(
    () => ({
      items,
      loading,
      busyId,
      error,
      onUpdate,
      onDelete,
    }),
    [items, loading, busyId, error, onUpdate, onDelete]
  );

  // Render login page if not authenticated
  if (showLogin) {
    return (
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <LoginPage
            onLogin={handleLogin}
            onSignup={handleSignup}
            error={error}
            loading={loading}
          />
        </main>
        {/* Footer without props on login page since user is not logged in */}
        <Footer />
      </div>
    );
  }

  // Update the authenticated view
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
  );
};

export default App;  // FIXED: Added export default