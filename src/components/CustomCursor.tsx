import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const position = useRef({ x: 0, y: 0, fx: 0, fy: 0 });

  useEffect(() => {
    const prefersNoHover = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (prefersNoHover) return;

    const updateCursor = () => {
      position.current.fx += (position.current.x - position.current.fx) * 0.25;
      position.current.fy += (position.current.y - position.current.fy) * 0.25;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${position.current.fx - 20}px, ${position.current.fy - 20}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (event: MouseEvent) => {
      position.current.x = event.clientX;
      position.current.y = event.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX - 6}px, ${event.clientY - 6}px, 0)`;
      }
    };

    const handlePointerEnter = () => {
      followerRef.current?.classList.add("active");
    };

    const handlePointerLeave = () => {
      followerRef.current?.classList.remove("active");
    };

    const interactiveElements = Array.from(document.querySelectorAll("a, button, input, textarea, [data-hover]"));

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handlePointerEnter);
      element.addEventListener("mouseleave", handlePointerLeave);
    });

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handlePointerEnter);
        element.removeEventListener("mouseleave", handlePointerLeave);
      });
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
};

export default CustomCursor;
