import React, { useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from './AuthContext'; 

export const SessionTimeoutProvider = ({ children, timeoutInMinutes = 15 }) => {
  const idleTimer = useRef(null);
  

  const { expireSession } = useContext(AuthContext); 


  const handleIdle = useCallback(() => {
    console.log("Inactivity detected. Calling expireSession from context.");
    if (expireSession) {
      expireSession();
    }
  }, [expireSession]);


  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(handleIdle, timeoutInMinutes * 60 * 1000);
  }, [handleIdle, timeoutInMinutes]);


  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const addEventListeners = () => events.forEach(event => window.addEventListener(event, resetIdleTimer));
    const removeEventListeners = () => events.forEach(event => window.removeEventListener(event, resetIdleTimer));

    console.log("SessionTimeoutProvider is active. Starting timer.");
    addEventListeners();
    resetIdleTimer(); 

    return () => {
      console.log("SessionTimeoutProvider is cleaning up. Stopping timer.");
      clearTimeout(idleTimer.current);
      removeEventListeners();
    };
  }, [resetIdleTimer]);

  return <>{children}</>;
};
