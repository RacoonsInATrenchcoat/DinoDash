import React, { createContext, useState, useEffect, useContext } from "react";

export const MobileContext = createContext(false);

export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = () => {
    // Metadata detection:
    const metaMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    // Specific resolution detection:
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const resolutionMobile =
      (screenWidth < 500 && screenHeight < 900) ||
      (screenWidth < 900 && screenHeight < 500);

    // Set isMobile to true if either condition is met:
    setIsMobile(metaMobile || resolutionMobile);
  };

  useEffect(() => {
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>
      {children}
    </MobileContext.Provider>
  );
};

// Specifically export a hook to access the MobileContext
export const useMobileContext = () => {
  return useContext(MobileContext);
};
