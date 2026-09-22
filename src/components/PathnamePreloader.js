"use client";

import { usePathname } from "next/navigation";
import ImagePreloader from "./ImagePreloader";

export default function PathnamePreloader() {
  const pathname = usePathname();
  return <ImagePreloader pathname={pathname} />;
}
