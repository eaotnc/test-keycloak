"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Spin,
  Typography,
  theme,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/providers/AuthProvider";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/users", icon: <TeamOutlined />, label: "Users" },
  { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { initialized, authenticated, user, login, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();

  if (!initialized) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Spin size="large" />
        <span className="text-sm text-slate-400">Connecting to Keycloak…</span>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <BankOutlined style={{ fontSize: 28 }} />
          </div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Acme Back Office
          </Typography.Title>
          <Typography.Text type="secondary">
            Please sign in with your Keycloak account to continue.
          </Typography.Text>
        </div>
        <Button type="primary" size="large" onClick={login}>
          Sign in with Keycloak
        </Button>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <div className="flex h-16 items-center gap-2 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <BankOutlined />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-slate-800">
              Acme Admin
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-between px-4"
          style={{ background: colorBgContainer, borderBottom: `1px solid ${colorBorderSecondary}` }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((c) => !c)}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: user?.email ?? user?.username ?? "Profile",
                  disabled: true,
                },
                { type: "divider" },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Sign out",
                  onClick: logout,
                },
              ],
            }}
          >
            <div className="flex cursor-pointer items-center gap-2">
              <Avatar style={{ background: "#4f46e5" }} icon={<UserOutlined />} />
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {user?.name ?? user?.username ?? "User"}
              </span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-4">
          <div
            style={{ background: "transparent", borderRadius: borderRadiusLG }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
