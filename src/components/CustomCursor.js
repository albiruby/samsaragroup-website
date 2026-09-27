"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let halfW = 16, halfH = 16;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    let rafId;
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.transform = `translate(${cursorX - halfW}px, ${cursorY - halfH}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver((entries) => {
      const box = entries[0].borderBoxSize?.[0];
      if (box) {
        halfW = box.inlineSize / 2;
        halfH = box.blockSize / 2;
      } else {
        halfW = cursor.offsetWidth / 2;
        halfH = cursor.offsetHeight / 2;
      }
    });
    ro.observe(cursor);

    let current = null;
    const onOver = (e) => {
      const target = e.target?.closest?.("a, button, [data-cursor]");
      if (target === current) return;
      current = target;
      cursor.classList.toggle("cursor-hover", !!target);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onOver);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onOver);
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[9999] mix-blend-difference transition-[width,height,border-color,background-color] duration-300 hidden lg:block"
      />
      <div
        ref={dotRef}
        className="custom-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      />
    </>
  );
}
