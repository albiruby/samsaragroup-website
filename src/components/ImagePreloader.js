"use client";

import { useEffect } from "react";

const preloadMap = {
  "/": [
    "/ambiencesamsara/DSC08930.webp",
    "/ambiencesamsara/DSC08926.webp",
    "/ambiencesamsara/DSC08913.webp",
  ],
  "/about": [
    "/ambiencesamsara/DSC08913.webp",
    "/ambiencesamsara/DSC09006.webp",
    "/assetsvvara/SVVARA-03203.webp",
    "/assetsvarga/ADR (8 of 15).webp",
    "/assetacasa/ADR-06529.webp",
    "/ambiencesamsara/DSC09014.webp",
    "/ambiencesamsara/DSC09048.webp",
  ],
  "/samsara": [
    "/Black Logo/blackfullsamping.png",
    "/ambiencesamsara/DSC08187.webp",
    "/ambiencesamsara/DSC08177.webp",
    "/ambiencesamsara/DSC08930.webp",
    "/ambiencesamsara/DSC08926.webp",
    "/ambiencesamsara/DSC08913.webp",
    "/ambiencesamsara/DSC09006.webp",
    "/ambiencesamsara/DSC08998.webp",
    "/ambiencesamsara/DSC08568.webp",
    "/ambiencesamsara/DSC08420.webp",
    "/ambiencesamsara/DSC08635.webp",
    "/ambiencesamsara/DSC09003.webp",
    "/ambiencesamsara/DSC09354.webp",
  ],
  "/svvara": [
    "/assetsvvara/logosvvarablack.webp",
    "/assetsvvara/SAVVARA-01268.webp",
    "/assetsvvara/SAVVARA-01362.webp",
    "/assetsvvara/SAVVARA-01506.webp",
    "/assetsvvara/SAVVARA-01649.webp",
    "/assetsvvara/SAVVARA-01840.webp",
    "/assetsvvara/SVVARA-03220.webp",
    "/assetsvvara/SVVARA-03197.webp",
    "/assetsvvara/SVVARA-03168.webp",
    "/assetsvvara/SVVARA-03133.webp",
    "/assetsvvara/SVVARA-03089.webp",
    "/assetsvvara/SAVVARA-01320.webp",
    "/assetsvvara/SAVVARA-01683.webp",
  ],
  "/svarga": [
    "/assetsvarga/Svarga logo black.webp",
    "/assetsvarga/ADR (3 of 15).webp",
    "/assetsvarga/ADR (4 of 4).webp",
    "/assetsvarga/ADR (2 of 4).webp",
    "/assetsvarga/ADR (3 of 4).webp",
    "/assetsvarga/ADR (1 of 4).webp",
  ],
  "/acasa": [
    "/assetacasa/logoacasahitam.webp",
    "/assetacasa/ADR-06545.webp",
    "/assetacasa/ADR-06529.webp",
    "/assetacasa/ADR-06507.webp",
    "/assetacasa/ADR-06480.webp",
    "/assetacasa/ADR-06474.webp",
    "/assetacasa/ADR-06468.webp",
    "/assetacasa/ADR-06368.webp",
    "/assetacasa/ADR-06325.webp",
    "/assetacasa/ADR-06293.webp",
    "/assetacasa/ADR-06254.webp",
    "/assetacasa/ADR-06539.webp",
  ],
  "/outpace": [
    "/ambiencesamsara/DSC09052.webp",
  ],
  "/grove": [
    "/ambiencesamsara/DSC09058.webp",
  ],
  "/events": [
    "/ambiencesamsara/DSC09003.webp",
  ],
  "/events/nocturne": [
    "/ambiencesamsara/DSC09003.webp",
  ],
  "/events/moonlit-session": [
    "/ambiencesamsara/DSC08420.webp",
  ],
  "/collaborations": [
    "/ambiencesamsara/DSC08635.webp",
    "/ambiencesamsara/DSC08575.webp",
    "/ambiencesamsara/DSC08568.webp",
  ],
  "/hospitality": [
    "/ambiencesamsara/DSC08409.webp",
    "/ambiencesamsara/DSC08401.webp",
    "/ambiencesamsara/DSC08397.webp",
  ],
  "/journal/sanctuary-of-sound": [
    "/ambiencesamsara/DSC08482.webp",
  ],
  "/menu": [
    "/menusamsara/0001.webp",
    "/menusamsara/0002.webp",
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
