"use client";

import { App } from "antd";

interface AntdProviderProps {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
  return <App>{children}</App>;
}
