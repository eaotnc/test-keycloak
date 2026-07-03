"use client";

import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Space,
  Descriptions,
  Tag,
  App,
} from "antd";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  const { message } = App.useApp();

  return (
    <Space orientation="vertical" size="large" style={{ display: "flex" }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Settings
        </Typography.Title>
        <Typography.Text type="secondary">
          Manage your profile and application preferences.
        </Typography.Text>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: "profile",
              label: "Profile",
              children: (
                <div className="max-w-xl">
                  <Descriptions
                    column={1}
                    bordered
                    size="small"
                    className="mb-6"
                    title="Keycloak account"
                  >
                    <Descriptions.Item label="Username">
                      {user?.username ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">
                      {user?.name ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {user?.email ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Realm roles">
                      <Space size={[0, 4]} wrap>
                        {(user?.roles ?? []).length
                          ? user!.roles.map((r) => <Tag key={r}>{r}</Tag>)
                          : "—"}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>

                  <Form
                    layout="vertical"
                    initialValues={{
                      displayName: user?.name,
                      email: user?.email,
                    }}
                    onFinish={() => message.success("Profile saved (mock)")}
                  >
                    <Form.Item label="Display name" name="displayName">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                      <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save changes
                    </Button>
                  </Form>
                </div>
              ),
            },
            {
              key: "preferences",
              label: "Preferences",
              children: (
                <Form layout="horizontal" className="max-w-xl">
                  <Form.Item label="Email notifications">
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item label="Weekly summary">
                    <Switch />
                  </Form.Item>
                  <Form.Item label="Compact tables">
                    <Switch defaultChecked />
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
