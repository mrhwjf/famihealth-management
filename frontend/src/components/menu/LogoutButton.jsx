import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ collapsed, onAfterLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear common auth storage keys if present
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch {
      // ignore storage errors
    }
    if (onAfterLogout) onAfterLogout();
    navigate('/auth');
  };

  return (
    <Button
      danger
      type="primary"
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      style={{ width: '100%' }}
    >
      {collapsed ? null : 'Đăng xuất'}
    </Button>
  );
};

export default LogoutButton;
