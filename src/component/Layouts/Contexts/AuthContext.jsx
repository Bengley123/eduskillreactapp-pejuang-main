import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const SessionExpiredModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  };
  const modalStyle = {
    backgroundColor: "white",
    padding: "30px 40px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    fontFamily: "sans-serif",
  };
  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 25px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, color: "#333" }}>Sesi Anda Telah Habis</h2>
        <p style={{ color: "#555" }}>
          Anda telah dikeluarkan karena tidak ada aktivitas.
        </p>
        <button style={buttonStyle} onClick={onConfirm}>
          Login Kembali
        </button>
      </div>
    </div>
  );
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  const login = (role, token) => {
    // Assuming you might pass a token here
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    if (token) localStorage.setItem("jwt", token); // Store token on login
    setIsLoggedIn(true);
    setUserRole(role);
    setIsSessionExpired(false); // Hide modal on login
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("jwt"); // Make sure to remove the token
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsSessionExpired(false); // Hide modal on manual logout
  };

  const handleConfirmLogout = () => {
    logout();
  };

  const expireSession = async () => {
    console.log("Session timer expired. Showing modal.");
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        // Invalidate the token on the backend
        await axios.post(
          "/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Backend token invalidated.");
      }
    } catch (error) {
      console.error("Failed to invalidate backend token.", error);
    }
    // Show the modal after attempting backend logout
    setIsSessionExpired(true);
  };

  // The value provided to consuming components
  const value = { isLoggedIn, userRole, login, logout, expireSession };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* The modal is now rendered here, at the highest level */}
      <SessionExpiredModal
        isOpen={isSessionExpired}
        onConfirm={handleConfirmLogout}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};