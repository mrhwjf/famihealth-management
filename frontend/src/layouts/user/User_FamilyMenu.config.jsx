import React, { Children } from "react";
import {
  AppstoreOutlined,
  TeamOutlined,
  SettingOutlined,
  HomeOutlined,
  PhoneOutlined,
  BugOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const User_FamilyMenuConfig = () => {
  const items = [
    {
      key: "0",
      label: "Dashboard",
      icon: <AppstoreOutlined />,
      path: "/user_family",
    },
    {
      key: "1",
      label: "Hồ sơ của tôi",
      icon: <TeamOutlined />,
      path: "/user_family/profile",
    },
    {
      key: "2",
      label: "Gia đình của tôi",
      icon: <HomeOutlined />,
      path: "/user_family/my-family",
      type: "submenu",
    },
    {
      key: "3",
      label: "Liên hệ bác sĩ",
      icon: <PhoneOutlined />,
      path: "/user_family/contact-doctor",
    },
    {
      key: "4",
      label: "Dị ứng",
      icon: <BugOutlined />,
      path: "/user_family/allergies",
    },
    {
      key: "5",
      label: "Tiêm chủng",
      icon: <MedicineBoxOutlined />,
      path: "/user_family/vaccinations",
    },
    {
      key: "6",
      label: "Cuộc hẹn",
      icon: <CalendarOutlined />,
      path: "/user_family/appointments",
    },
    {
      key: "7",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      path: "/user_family/settings",
    },
  ];

  return items;
};

export default User_FamilyMenuConfig;
