import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Forgot password', values);
    // TODO: call API to send reset code
    message.success('Một mã xác thực đã được gửi đến email (demo).');
    navigate('/auth');
  };

  return (
    <div>
      <div className="auth-card-wrap">
      <Card style={{ width: '100%' }}>
        <Title level={4}>Quên mật khẩu</Title>
        <Text>Vui lòng nhập địa chỉ email của bạn. Một mã xác thực sẽ được gửi để thiết lập lại mật khẩu.</Text>
        <Form layout="vertical" style={{ marginTop: 16 }} onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#20b06b', borderColor: '#20b06b' }} block>
              Gửi mã xác thực
            </Button>
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/auth">Đăng nhập</Link>
          <Link to="/auth/register">Đăng ký</Link>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
