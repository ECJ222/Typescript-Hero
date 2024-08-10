import { useState, useEffect } from 'react';

export const useResize = () => {
  // Initialize state with current window width/height
  const [windowSize, setWindowSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set document width/height to state
      setWindowSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
