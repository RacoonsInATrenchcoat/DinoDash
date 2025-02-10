import React, { createContext, useState } from "react";


//Using this to have the Score value in the navbar (from Gamelogic.jsx)
export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
};
