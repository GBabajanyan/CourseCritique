import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import client from "../../api/client";
import { COLORS } from "../../constants/colors";

const { Title, Text } = Typography;

interface LoginFormValues {
  login: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.post("/auth/user_login", {
        login: values.login,
        password: values.password,
      });

      const { authToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Set auth header for future requests
      client.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      message.success("Login successful!");

      // Navigate to dashboard
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid username or password");
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} style={{ color: COLORS.NAVY, marginBottom: 0 }}>
            Course Critique
          </Title>
          <Text type="secondary">Admin Dashboard</Text>
        </div>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="login"
            rules={[
              {
                required: true,
                message: "Please input your username or email!",
              },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username or Email"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              block
              style={{
                backgroundColor: COLORS.SAFFRON,
                borderColor: COLORS.SAFFRON,
                height: 44,
                fontSize: 16,
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary">Demo credentials: admin / admin123</Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
