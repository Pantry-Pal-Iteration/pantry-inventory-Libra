// Components/login/LoginPage.tsx
import { useState } from "react";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSignup: (username: string, password: string) => Promise<void>;
  error: string;
}

export default function LoginPage({ onLogin, onSignup, error }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    setLoading(true);
    
    try {
      if (isSignup) {
        await onSignup(username, password);
      } else {
        await onLogin(username, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "100px auto",
      padding: "2rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        {isSignup ? "Create Account" : "Pantry App Login"}
      </h2>
      
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
        {isSignup ? "Sign up to get started" : "Log in to manage your pantry"}
      </p>
      
      {error && (
        <div style={{
          padding: "0.75rem",
          backgroundColor: "#fee",
          color: "#c00",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading || !username.trim() || !password.trim()}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: isSignup ? "#28a745" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1rem",
            opacity: loading ? 0.7 : 1,
            marginBottom: "1rem"
          }}
        >
          {loading ? (isSignup ? "Creating Account..." : "Logging in...") : (isSignup ? "Sign Up" : "Login")}
        </button>
        
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setUsername("");
              setPassword("");
            }}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              fontSize: "0.9rem",
              textDecoration: "underline"
            }}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
      
      {!isSignup && (
        <div style={{ 
          marginTop: "1.5rem", 
          paddingTop: "1rem", 
          borderTop: "1px solid #ddd", 
          textAlign: "center", 
          fontSize: "0.9rem",
          color: "#666"
        }}>
          <p>Test credentials: <strong>test</strong> / <strong>test</strong></p>
        </div>
      )}
    </div>
  );
}