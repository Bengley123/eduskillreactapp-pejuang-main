import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import axios from "axios"; // Or your preferred API client
import { AuthContext } from "./AuthContext";

// --- 1. Create a Context (Optional but good practice) ---
const SessionContext = createContext(null);

// --- 2. The Main Session Manager Component ---
// This component contains the timer logic and the modal.
export const SessionTimeoutProvider = ({ children, timeoutInMinutes = 15 }) => {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef(null);

  const { logout: mainLogout } = useContext(AuthContext);

  // --- Logout Logic ---
  const logout = useCallback(async () => {
    console.log("User is idle. Initiating logout...");

    // Immediately show the modal
    setIsIdle(true);

    try {
      const token = localStorage.getItem("jwt"); // Or your preferred token key
      if (token) {
        // Tell the backend to invalidate the token
        await axios.post(
          "/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Token successfully invalidated on backend.");
      }
    } catch (error) {
      console.error(
        "Failed to invalidate token on backend, but proceeding with client-side logout.",
        error
      );
    } finally {
      if (mainLogout) {
        mainLogout();
      }
    }
  }, [mainLogout]);

  // --- Timer Reset Logic ---
  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(logout, timeoutInMinutes * 60 * 1000);
  }, [logout, timeoutInMinutes]);

  // --- Event Listener Setup ---
  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const addEventListeners = () =>
      events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    const removeEventListeners = () =>
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );

    // The timer should only run if a user is logged in.
    // This logic is now handled by placing the Provider conditionally in UserLayout.
    addEventListeners();
    resetIdleTimer(); // Start the timer

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      clearTimeout(idleTimer.current);
      removeEventListeners();
    };
  }, [resetIdleTimer]);

  return (
    <SessionContext.Provider value={null}>
      {children}
      <SessionExpiredModal isOpen={isIdle} />
    </SessionContext.Provider>
  );
};

// --- 3. The Modal Component ---
const SessionExpiredModal = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  const handleLoginRedirect = () => {
    // Force a full page reload to the login page to clear all state
    window.location.href = "/login";
  };

  // Styles for the modal
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
        <button style={buttonStyle} onClick={handleLoginRedirect}>
          Login Kembali
        </button>
      </div>
    </div>
  );
};
