import React, { createContext, useContext, useMemo, useState } from 'react';

const LoyaltyContext = createContext();

export function LoyaltyProvider({ children }) {
  const [points, setPoints] = useState(0);

  const addPoints = (amount) => setPoints((prev) => prev + amount);
  const resetPoints = () => setPoints(0);

  const value = useMemo(() => ({ points, addPoints, resetPoints }), [points]);
  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  return useContext(LoyaltyContext);
}
