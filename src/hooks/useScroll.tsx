import { useEffect, useState, useRef } from "react";

export const useScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  // Store the timeout ID
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    // Clear the timeout if it exists
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    setIsScrolling(true);
    // Set a new timeout
    scrollTimeout.current = setTimeout(() => {
      // After 100ms of no scrolling, setIsScrolling to false
      setIsScrolling(false);
    }, 100);
  };

  useEffect(() => {
    // Add event listener
    window.addEventListener("scroll", handleScroll);
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return { isScrolling, handleScroll };
};
