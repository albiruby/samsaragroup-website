"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MIN = 1;
const MAX = 5;

export default function ZoomableImage({ src, alt, className = "" }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !open) return;
    const onWheel = (e) => {
      e.preventDefault();
      setScale((s) => Math.min(MAX, Math.max(MIN, +(s - e.deltaY * 0.002).toFixed(3))));
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [open]);

  const zoomBy = (delta) => {
    setScale((s) => {
      const next = Math.min(MAX, Math.max(MIN, +(s + delta).toFixed(3)));
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  };

  const onPointerDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragRef.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
    e.target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    setPos({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onDoubleClick = () => {
    if (scale > 1) reset();
    else {
      setScale(2);
      setPos({ x: 0, y: 0 });
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-zoom-in`}
        onClick={() => setOpen(true)}
      />
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-black/95"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/15 px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <span className="truncate text-label-caps-sm uppercase tracking-widest text-white/70">{alt}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => zoomBy(-0.5)}
                  className="h-9 w-9 border border-white/30 text-white transition-colors hover:bg-white hover:text-black"
                >
                  −
                </button>
                <span className="w-14 text-center text-body-sm tabular-nums text-white/80">{Math.round(scale * 100)}%</span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => zoomBy(0.5)}
                  className="h-9 w-9 border border-white/30 text-white transition-colors hover:bg-white hover:text-black"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="ml-2 h-9 border border-white/30 px-3 text-label-caps-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
                >
                  Reset
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="ml-2 h-9 w-9 border border-white/30 text-white transition-colors hover:bg-white hover:text-black"
                >
                  ×
                </button>
              </div>
            </div>

            <div
              ref={stageRef}
              className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                draggable={false}
                onDoubleClick={onDoubleClick}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="max-h-full max-w-full select-none"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                  cursor: scale > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in",
                  transformOrigin: "center",
                  transition: dragRef.current ? "none" : "transform 0.15s ease-out",
                }}
              />
            </div>

            <div className="border-t border-white/15 px-4 py-3 text-center text-body-sm text-white/50" onClick={(e) => e.stopPropagation()}>
              Scroll to zoom · Drag to pan · Double-click to reset · Esc to close
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
