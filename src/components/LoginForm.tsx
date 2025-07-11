"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Layout,
} from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login, loading, error } = useAuth();
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginFormData) => {
    setLocalError(null);

    const result = await login(values.email, values.password);

    if (result.success) {
      onLoginSuccess?.();
    }
  };

  const displayError = localError || error;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
          }}
          bodyStyle={{ padding: "40px" }}
        >
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%", textAlign: "center" }}
          >
            {/* Logo/Header */}
            <div>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #52c41a, #389e0d)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "36px",
                  color: "white",
                }}
              >
                🌿
              </div>
              <Title level={2} style={{ margin: 0, color: "#52c41a" }}>
                Thảo Hương Xanh
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Hệ thống quản lý đơn hàng
              </Text>
            </div>

            {/* Error Alert */}
            {displayError && (
              <Alert
                message="Đăng nhập thất bại"
                description={displayError}
                type="error"
                showIcon
                style={{ textAlign: "left" }}
              />
            )}

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              style={{ width: "100%" }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Email"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Mật khẩu"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{
                    width: "100%",
                    height: "48px",
                    background: "linear-gradient(135deg, #52c41a, #389e0d)",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Form.Item>
            </Form>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                © 2024 Thảo Hương Xanh. Tất cả quyền được bảo lưu.
              </Text>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}
