import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHash } from "@/lib/scroll";

const HashScroll = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (scrollToHash(hash) || tries > 24) window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, [hash, pathname]);

  return null;
};

export default HashScroll;
