"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  Button,
  Space,
  Typography,
  Avatar,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { users, type UserRow } from "@/lib/mockData";

const roleColor: Record<UserRow["role"], string> = {
  Admin: "purple",
  Editor: "blue",
  Viewer: "default",
};

const statusColor: Record<UserRow["status"], string> = {
  active: "green",
  invited: "gold",
  suspended: "red",
};

export default function UsersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [query]);

  const columns: ColumnsType<UserRow> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, row) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} style={{ background: "#e0e7ff", color: "#4f46e5" }} />
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{name}</span>
            <span className="text-xs text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Editor", value: "Editor" },
        { text: "Viewer", value: "Viewer" },
      ],
      onFilter: (value, row) => row.role === value,
      render: (role: UserRow["role"]) => <Tag color={roleColor[role]}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: UserRow["status"]) => (
        <Tag color={statusColor[s]}>{s.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Last active",
      dataIndex: "lastActive",
      key: "lastActive",
      sorter: (a, b) => a.lastActive.localeCompare(b.lastActive),
    },
    {
      title: "",
      key: "actions",
      width: 48,
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Edit" },
              { key: "reset", label: "Reset password" },
              { key: "remove", label: "Remove", danger: true },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Space orientation="vertical" size="large" style={{ display: "flex" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Users
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage team members and their permissions.
          </Typography.Text>
        </div>
        <Space>
          <Input
            allowClear
            placeholder="Search users…"
            prefix={<SearchOutlined />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 240 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Add user
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </Space>
  );
}
