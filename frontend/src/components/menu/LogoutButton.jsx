import React from 'react';
import { Button, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/auth/logoutService';

const LogoutButton = ({ collapsed, onAfterLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // sends X-Session-Id header and clears sessionId on success
      // Clear common auth storage keys if present
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } catch (err) {
        // ignore storage errors but avoid empty catch for lint
        console.warn('Không xóa được storage:', err);
      }
      if (onAfterLogout) onAfterLogout();
      message.success('Đã đăng xuất');
      navigate('/auth');
    } catch {
      message.error('Đăng xuất thất bại');
      // Điều hướng về trang đăng nhập vẫn có thể hợp lý
      navigate('/auth');
    }
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
