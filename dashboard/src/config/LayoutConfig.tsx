import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const menuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/courses",
    icon: <BookOutlined />,
    label: "Courses",
  },
  {
    key: "/profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];
