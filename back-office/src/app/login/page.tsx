"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, Alert } from "antd";
import {
  BankOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const { initialized, authenticated, login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && authenticated) {
      router.replace("/dashboard");
    }
  }, [initialized, authenticated, router]);

  const onFinish = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    setError(null);
    const result = await login(values.username, values.password);
    setSubmitting(false);
    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card
        className="w-full max-w-md shadow-lg"
        styles={{ body: { padding: 32 } }}
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <BankOutlined style={{ fontSize: 28 }} />
          </div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Acme Back Office
          </Typography.Title>
          <Typography.Text type="secondary">
            Sign in to your account
          </Typography.Text>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            className="mb-4"
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400" />}
              placeholder="demo"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="••••••"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <Typography.Paragraph
          type="secondary"
          className="mt-6 text-center"
          style={{ fontSize: 12, marginBottom: 0 }}
        >
          Demo credentials: demo / demo
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
