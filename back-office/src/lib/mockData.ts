export interface Stat {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: number;
}

export const stats: Stat[] = [
  { title: "Total Revenue", value: 128430, prefix: "$", delta: 12.5 },
  { title: "Orders", value: 3421, delta: 8.2 },
  { title: "Active Users", value: 1893, delta: -2.4 },
  { title: "Conversion Rate", value: 4.7, suffix: "%", delta: 1.1 },
];

export interface RevenuePoint {
  month: string;
  value: number;
}

export const revenueByMonth: RevenuePoint[] = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 71 },
  { month: "May", value: 63 },
  { month: "Jun", value: 88 },
  { month: "Jul", value: 76 },
  { month: "Aug", value: 95 },
  { month: "Sep", value: 82 },
  { month: "Oct", value: 100 },
  { month: "Nov", value: 91 },
  { month: "Dec", value: 118 },
];

export interface UserRow {
  key: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "invited" | "suspended";
  lastActive: string;
}

export const users: UserRow[] = [
  { key: "1", name: "Alice Johnson", email: "alice@acme.io", role: "Admin", status: "active", lastActive: "2026-07-01" },
  { key: "2", name: "Bob Smith", email: "bob@acme.io", role: "Editor", status: "active", lastActive: "2026-06-29" },
  { key: "3", name: "Carla Diaz", email: "carla@acme.io", role: "Viewer", status: "invited", lastActive: "2026-06-20" },
  { key: "4", name: "David Lee", email: "david@acme.io", role: "Editor", status: "suspended", lastActive: "2026-05-11" },
  { key: "5", name: "Emma Wilson", email: "emma@acme.io", role: "Viewer", status: "active", lastActive: "2026-07-02" },
  { key: "6", name: "Frank Moore", email: "frank@acme.io", role: "Admin", status: "active", lastActive: "2026-06-30" },
  { key: "7", name: "Grace Kim", email: "grace@acme.io", role: "Editor", status: "invited", lastActive: "2026-06-18" },
  { key: "8", name: "Henry Clark", email: "henry@acme.io", role: "Viewer", status: "active", lastActive: "2026-06-28" },
];

export interface OrderRow {
  key: string;
  id: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "refunded";
  date: string;
}

export const orders: OrderRow[] = [
  { key: "1", id: "#10231", customer: "Alice Johnson", amount: 249.0, status: "paid", date: "2026-07-02" },
  { key: "2", id: "#10230", customer: "Bob Smith", amount: 89.5, status: "pending", date: "2026-07-02" },
  { key: "3", id: "#10229", customer: "Carla Diaz", amount: 1200.0, status: "paid", date: "2026-07-01" },
  { key: "4", id: "#10228", customer: "David Lee", amount: 42.0, status: "refunded", date: "2026-07-01" },
  { key: "5", id: "#10227", customer: "Emma Wilson", amount: 560.0, status: "paid", date: "2026-06-30" },
];
