import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const COLS = 12;

/**
 * Curtain on route change: orange columns fall from the top and lift from the
 * bottom, like a letterbox on a page turn. Skipped on first mount and for
 * reduced motion.
 */
const PageWipe = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 640);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="page-wipe" aria-hidden="true">
      {Array.from({ length: COLS }, (_, index) => (
        <span
          key={index}
          className="page-wipe-col"
          style={{ animationDelay: `${index * 18}ms` }}
        />
      ))}
    </div>
  );
};

export default PageWipe;
