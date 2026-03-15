import { useState, useEffect, useRef } from 'react';

export const useMetrics = (isActive) => {
  const [events, setEvents] = useState([]);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      setEvents((prev) => [
        ...prev,
        { key: e.key, timestamp: Date.now(), eventType: 'keydown' }
      ]);
    };

    const handleKeyUp = (e) => {
      setEvents((prev) => [
        ...prev,
        { key: e.key, timestamp: Date.now(), eventType: 'keyup' }
      ]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive]);

  const clearMetrics = () => setEvents([]);

  return { events, sessionId: sessionId.current, clearMetrics };
};
