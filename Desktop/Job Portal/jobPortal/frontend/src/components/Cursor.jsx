import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const rafId   = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // lerp
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 3.5}px, ${e.clientY - 3.5}px)`;
    };

    const onEnter = () => {
      dot.classList.add("hovering");
      ring.classList.add("hovering");
    };
    const onLeave = () => {
      dot.classList.remove("hovering");
      ring.classList.remove("hovering");
    };
    const onDown = () => {
      dot.classList.add("clicking");
      ring.classList.add("clicking");
    };
    const onUp = () => {
      dot.classList.remove("clicking");
      ring.classList.remove("clicking");
    };

    const animate = () => {
      ring.current = {
        x: lerp(ring.current.x ?? mouse.current.x, mouse.current.x, 0.11),
        y: lerp(ring.current.y ?? mouse.current.y, mouse.current.y, 0.11),
      };
      ringRef.current.style.transform = `translate(${ring.current.x - 15}px, ${ring.current.y - 15}px)`;
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    const interactives = "a, button, input, textarea, select, [data-cursor]";
    const addHover = () => {
      document.querySelectorAll(interactives).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);
    addHover();

    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
