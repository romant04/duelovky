"use client";

import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

interface Props {
  children: ReactNode;
}

export const StoreProvider: FC<Props> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
