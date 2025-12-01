import React from 'react';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const doctorMenuItems = [
  {
    key: '0',
    path: '/doctor',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '1',
    path: '/doctor/appointments',
    icon: <CalendarOutlined />,
    label: 'Cuộc hẹn',
  },
  {
    key: '2',
    path: '/doctor/patients',
    icon: <TeamOutlined />,
    label: 'Quản lý Bệnh nhân',
  },
  {
    key: '3',
    path: '/doctor/profile',
    icon: <UserOutlined />,
    label: 'Hồ sơ của tôi',
  },
  {
    key: '4',
    path: '/doctor/settings',
    icon: <SettingOutlined />,
    label: 'Cài đặt',
  },
];