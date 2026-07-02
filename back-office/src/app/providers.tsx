"use client";

import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, App as AntApp, theme } from "antd";
import { AuthProvider } from "@/providers/AuthProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 8,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        },
      }}
    >
      <AntApp>
        <AuthProvider>{children}</AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}
