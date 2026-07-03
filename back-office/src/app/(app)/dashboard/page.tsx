"use client";

import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  Progress,
  Space,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { stats, orders, type OrderRow } from "@/lib/mockData";
import RevenueChart from "@/components/RevenueChart";

const orderStatusColor: Record<OrderRow["status"], string> = {
  paid: "green",
  pending: "gold",
  refunded: "red",
};

const orderColumns: ColumnsType<OrderRow> = [
  { title: "Order", dataIndex: "id", key: "id" },
  { title: "Customer", dataIndex: "customer", key: "customer" },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (v: number) => `$${v.toFixed(2)}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (s: OrderRow["status"]) => (
      <Tag color={orderStatusColor[s]}>{s.toUpperCase()}</Tag>
    ),
  },
  { title: "Date", dataIndex: "date", key: "date" },
];

export default function DashboardPage() {
  return (
    <Space orientation="vertical" size="large" style={{ display: "flex" }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Dashboard
        </Typography.Title>
        <Typography.Text type="secondary">
          Welcome back — here is what is happening today.
        </Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col xs={24} sm={12} xl={6} key={s.title}>
            <Card>
              <Statistic
                title={s.title}
                value={s.value}
                precision={s.suffix === "%" ? 1 : 0}
                prefix={s.prefix}
                suffix={s.suffix}
              />
              <div
                className={`mt-2 flex items-center gap-1 text-sm ${
                  s.delta >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {s.delta >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span>{Math.abs(s.delta)}%</span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Revenue (last 12 months)">
            <RevenueChart />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Goals">
            <Space orientation="vertical" size="large" style={{ display: "flex" }}>
              <div>
                <Typography.Text>Monthly target</Typography.Text>
                <Progress percent={78} strokeColor="#4f46e5" />
              </div>
              <div>
                <Typography.Text>New signups</Typography.Text>
                <Progress percent={64} strokeColor="#10b981" />
              </div>
              <div>
                <Typography.Text>Support SLA</Typography.Text>
                <Progress percent={92} strokeColor="#f59e0b" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="Recent orders">
        <Table
          columns={orderColumns}
          dataSource={orders}
          pagination={false}
          size="middle"
        />
      </Card>
    </Space>
  );
}
