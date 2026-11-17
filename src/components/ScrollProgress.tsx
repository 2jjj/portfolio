import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <div className="scroll-progress-line">
        <div className="scroll-progress-fill" style={{ height: `${scrollPercent}%` }} />
      </div>
    </div>
  );
};

export default ScrollProgress;
