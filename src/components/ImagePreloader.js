"use client";

import { useEffect } from "react";

const preloadMap = {
  "/": [
    "/ambiencesamsara/DSC08930.jpg",
    "/ambiencesamsara/DSC08926.jpg",
    "/ambiencesamsara/DSC08913.jpg",
  ],
  "/about": [
    "/ambiencesamsara/DSC08913.jpg",
    "/ambiencesamsara/DSC09006.jpg",
    "/assetsvvara/SVVARA-03203.jpg",
    "/assetsvarga/ADR (8 of 15).jpg",
    "/assetacasa/ADR-06529.jpg",
    "/ambiencesamsara/DSC09014.jpg",
    "/ambiencesamsara/DSC09048.jpg",
  ],
  "/samsara": [
    "/Black Logo/blackfullsamping.png",
    "/ambiencesamsara/DSC08187.jpg",
    "/ambiencesamsara/DSC08177.jpg",
    "/ambiencesamsara/DSC08930.jpg",
    "/ambiencesamsara/DSC08926.jpg",
    "/ambiencesamsara/DSC08913.jpg",
    "/ambiencesamsara/DSC08906.jpg",
    "/ambiencesamsara/DSC09006.jpg",
    "/ambiencesamsara/DSC08998.jpg",
    "/ambiencesamsara/DSC08980.jpg",
    "/ambiencesamsara/DSC08960.jpg",
  ],
  "/svvara": [
    "/assetsvvara/logosvvara.png",
    "/assetsvvara/SAVVARA-01268.jpg",
    "/assetsvvara/SAVVARA-01362.jpg",
    "/assetsvvara/SAVVARA-01506.jpg",
    "/assetsvvara/SAVVARA-01649.jpg",
    "/assetsvvara/SAVVARA-01840.jpg",
    "/assetsvvara/SVVARA-03220.jpg",
    "/assetsvvara/SVVARA-03197.jpg",
    "/assetsvvara/SVVARA-03168.jpg",
    "/assetsvvara/SVVARA-03133.jpg",
    "/assetsvvara/SVVARA-03089.jpg",
  ],
  "/svarga": [
    "/assetsvarga/Svarga logo black.png",
    "/assetsvarga/ADR-07604.jpg",
    "/assetsvarga/ADR (9 of 15).jpg",
    "/assetsvarga/ADR (8 of 15).jpg",
    "/assetsvarga/ADR (7 of 15).jpg",
    "/assetsvarga/ADR (6 of 15).jpg",
    "/assetsvarga/ADR (5 of 15).jpg",
    "/assetsvarga/ADR (4 of 15).jpg",
    "/assetsvarga/ADR (3 of 15).jpg",
    "/assetsvarga/ADR (2 of 15).jpg",
    "/assetsvarga/ADR (1 of 15).jpg",
  ],
  "/acasa": [
    "/assetacasa/logoacasahitam.png",
    "/assetacasa/ADR-06545.jpg",
    "/assetacasa/ADR-06529.jpg",
    "/assetacasa/ADR-06507.jpg",
    "/assetacasa/ADR-06480.jpg",
    "/assetacasa/ADR-06474.jpg",
    "/assetacasa/ADR-06468.jpg",
    "/assetacasa/ADR-06394.jpg",
    "/assetacasa/ADR-06368.jpg",
    "/assetacasa/ADR-06325.jpg",
    "/assetacasa/ADR-06293.jpg",
    "/assetacasa/ADR-06539.jpg",
  ],
  "/outpace": [
    "/ambiencesamsara/DSC09052.jpg",
  ],
  "/groove": [
    "/ambiencesamsara/DSC09058.jpg",
  ],
  "/events": [
    "/ambiencesamsara/DSC09003.jpg",
  ],
  "/events/nocturne": [
    "/ambiencesamsara/DSC09003.jpg",
  ],
  "/events/moonlit-session": [
    "/ambiencesamsara/DSC08420.jpg",
  ],
  "/collaborations": [
    "/ambiencesamsara/DSC08635.jpg",
    "/ambiencesamsara/DSC08575.jpg",
    "/ambiencesamsara/DSC08568.jpg",
  ],
  "/hospitality": [
    "/ambiencesamsara/DSC08409.jpg",
    "/ambiencesamsara/DSC08401.jpg",
    "/ambiencesamsara/DSC08397.jpg",
  ],
  "/journal/sanctuary-of-sound": [
    "/ambiencesamsara/DSC08482.jpg",
  ],
  "/menu": [],
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
