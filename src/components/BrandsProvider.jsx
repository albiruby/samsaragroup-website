"use client";

import { createContext, useContext } from "react";

const EMPTY = { categories: [], all: [], seeAllLabel: "", emptyLabel: "" };

const BrandsContext = createContext(EMPTY);

export function BrandsProvider({ value, children }) {
  return <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>;
}

export function useBrandNav() {
  return useContext(BrandsContext);
}