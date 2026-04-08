import React, { useState } from "react";
import { Layout, Menu, Button, Typography } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Layout.css";
import { menuItems } from "../config/LayoutConfig";
import { COLORS } from "../constants/colors";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: COLORS.NAVY,
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        trigger={null}
      >
        <div
          className="logo-container"
          style={{ padding: "16px", textAlign: "center" }}
        >
          {!collapsed ? (
            <Title level={4} style={{ color: COLORS.SAFFRON, margin: 0 }}>
              Course Critique
            </Title>
          ) : (
            <Title
              level={4}
              style={{ color: COLORS.SAFFRON, margin: 0, fontSize: 20 }}
            >
              Cc
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            background: COLORS.NAVY,
            borderRight: "none",
          }}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.key),
          }))}
        />

        {/* Logout button at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            padding: "0 16px",
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            style={{ background: "transparent", borderRight: "none" }}
            items={[
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Logout",
                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </Sider>

      {/* Main Content */}
      <Layout
        style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}
      >
        {/* Top Header */}
        <Header
          style={{
            background: COLORS.WHITE,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: COLORS.NAVY, fontWeight: 500 }}>
              Welcome, Admin
            </span>
          </div>
        </Header>

        {/* Page Content - This is where Dashboard or Courses will render */}
        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: COLORS.WHITE,
            borderRadius: "8px",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
