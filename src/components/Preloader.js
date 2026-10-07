"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "samsara-preloaded";

const subscribeToNothing = () => () => {};

function hasPreloaded() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return true;
  }
}

function rememberPreloaded() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    return;
  }
}

export default function Preloader() {
  const preloaded = useSyncExternalStore(
    subscribeToNothing,
    hasPreloaded,
    () => true
  );

  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (preloaded || removed) return;

    const hideTimer = setTimeout(() => setHidden(true), 1600);
    const removeTimer = setTimeout(() => {
      rememberPreloaded();
      setRemoved(true);
    }, 2200);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [preloaded, removed]);

  if (preloaded || removed) return null;

  return (
    <div
      className={`preloader ${hidden ? "hidden" : ""}`}
      style={hidden ? { pointerEvents: "none" } : undefined}
    >
      <div className="preloader-logo">
        <img
          src="/White Logo Samsara/whitefullsamping-480.webp"
          alt="Samsara Group"
          className="h-20 w-auto object-contain"
        />
      </div>
      <div className="preloader-bar">
        <div className="preloader-bar-inner" />
      </div>
    </div>
  );
}
