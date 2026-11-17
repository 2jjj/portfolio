import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHash, scrollToTop } from "@/lib/scroll";

const HashScroll = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (scrollToHash(hash) || tries > 24) window.clearInterval(timer);
      }, 100);
      return () => window.clearInterval(timer);
    }

    scrollToTop();
    if (typeof document !== "undefined") document.documentElement.scrollTop = 0;
  }, [hash, pathname]);

  return null;
};

export default HashScroll;
