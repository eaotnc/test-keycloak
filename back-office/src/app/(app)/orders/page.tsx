"use client";

import { Card, Table, Tag, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { orders, type OrderRow } from "@/lib/mockData";

const statusColor: Record<OrderRow["status"], string> = {
  paid: "green",
  pending: "gold",
  refunded: "red",
};

const columns: ColumnsType<OrderRow> = [
  { title: "Order", dataIndex: "id", key: "id" },
  { title: "Customer", dataIndex: "customer", key: "customer" },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    sorter: (a, b) => a.amount - b.amount,
    render: (v: number) => `$${v.toFixed(2)}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Paid", value: "paid" },
      { text: "Pending", value: "pending" },
      { text: "Refunded", value: "refunded" },
    ],
    onFilter: (value, row) => row.status === value,
    render: (s: OrderRow["status"]) => (
      <Tag color={statusColor[s]}>{s.toUpperCase()}</Tag>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => a.date.localeCompare(b.date),
  },
];

export default function OrdersPage() {
  return (
    <Space orientation="vertical" size="large" style={{ display: "flex" }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Orders
        </Typography.Title>
        <Typography.Text type="secondary">
          Track and manage customer orders.
        </Typography.Text>
      </div>
      <Card>
        <Table columns={columns} dataSource={orders} />
      </Card>
    </Space>
  );
}
