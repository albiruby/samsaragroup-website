"use client";

import { useEffect } from "react";

const preloadMap = {
  // The homepage hero used to be preloaded from here, but it can now be chosen in
  // the Studio, so its address is only known at render time. The <img> sits in the
  // first bytes of the HTML with fetchpriority=high, so Chrome starts it on its own.
  "/about": [
    "/ASSETS-SAMSARA/ambience/DSC08913.webp",
  ],
  "/samsara": [
    "/ASSETS-SAMSARA/logo/blackfullsamping-480.webp",
    "/ASSETS-SAMSARA/ambience/DSC08187.webp",
    "/ASSETS-SAMSARA/ambience/DSC08177.webp",
    "/ASSETS-SAMSARA/ambience/DSC08930.webp",
    "/ASSETS-SAMSARA/ambience/DSC08926.webp",
    "/ASSETS-SAMSARA/ambience/DSC08913.webp",
    "/ASSETS-SAMSARA/ambience/DSC09006.webp",
    "/ASSETS-SAMSARA/ambience/DSC08998.webp",
    "/ASSETS-SAMSARA/ambience/DSC08568.webp",
    "/ASSETS-SAMSARA/ambience/DSC08420.webp",
    "/ASSETS-SAMSARA/ambience/DSC08635.webp",
    "/ASSETS-SAMSARA/ambience/DSC09003.webp",
    "/ASSETS-SAMSARA/ambience/DSC09354.webp",
    "/ASSETS-SAMSARA/menu/0001.webp",
  ],
  "/svarga": [
    "/ASSETS-SVARGA/Svarga logo black-480.webp",
    "/ASSETS-SVARGA/ADR (3 of 15).webp",
    "/ASSETS-SVARGA/ADR (4 of 4).webp",
    "/ASSETS-SVARGA/ADR (2 of 4).webp",
    "/ASSETS-SVARGA/ADR (3 of 4).webp",
    "/ASSETS-SVARGA/ADR (1 of 4).webp",
  ],
  "/acasa": [
    "/ASSETS-ACASA/logoacasahitam-480.webp",
    "/ASSETS-ACASA/ADR-06545.webp",
    "/ASSETS-ACASA/ADR-06529.webp",
    "/ASSETS-ACASA/ADR-06507.webp",
    "/ASSETS-ACASA/ADR-06480.webp",
    "/ASSETS-ACASA/ADR-06474.webp",
    "/ASSETS-ACASA/ADR-06468.webp",
    "/ASSETS-ACASA/ADR-06368.webp",
    "/ASSETS-ACASA/ADR-06325.webp",
    "/ASSETS-ACASA/ADR-06293.webp",
    "/ASSETS-ACASA/ADR-06254.webp",
    "/ASSETS-ACASA/ADR-06539.webp",
  ],
  "/outpace": [
    "/ASSETS-SAMSARA/ambience/DSC09052.webp",
  ],
  "/grove": [
    "/ASSETS-SAMSARA/ambience/DSC09058.webp",
  ],
  "/events": [
    "/ASSETS-SAMSARA/ambience/DSC09003.webp",
  ],
};

export default function ImagePreloader({ pathname }) {
  useEffect(() => {
    const images = preloadMap[pathname];
    if (!images || images.length === 0) return;

    const links = [];
    images.forEach((src) => {
      const existing = document.querySelector(`link[rel="preload"][href="${src}"]`);
      if (existing) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, [pathname]);

  return null;
}
