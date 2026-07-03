"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Spin,
  theme,
  App,
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

export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { initialized, authenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();

  const isAdmin = Boolean(user?.roles.includes("admin"));

  const menuItems = useMemo(
    () => [
      { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
      ...(isAdmin
        ? [{ key: "/users", icon: <TeamOutlined />, label: "Users" }]
        : []),
      { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
      { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    ],
    [isAdmin],
  );

  useEffect(() => {
    if (initialized && !authenticated) {
      router.replace("/login");
    }
  }, [initialized, authenticated, router]);

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      message.error("You don't have permission to access that page.");
      router.replace(pathname);
    }
  }, [searchParams, message, router, pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!initialized || !authenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Spin size="large" />
        <span className="text-sm text-slate-400">Loading…</span>
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
                  onClick: handleLogout,
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
