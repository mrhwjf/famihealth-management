import React from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // TODO: integrate with backend auth API
    console.log('Login submitted', values);
    // placeholder: route to admin dashboard
    navigate('/admin');
  };

  return (
    <div>
      <div className="auth-card-wrap">
        <Card style={{ width: '100%' }}>
        <Title level={3} style={{ textAlign: 'left' }}>Đăng nhập</Title>
        <Form name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập hoặc email" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <div style={{ float: 'right' }}>
              <Link to="/auth/forgot" style={{ marginRight: 12 }}>Quên mật khẩu?</Link>
              <Link to="/auth/register">Đăng ký</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ background: '#20b06b', borderColor: '#20b06b' }}>
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider>Hoặc</Divider>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Button block style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="google" style={{ width: 18, marginRight: 8 }} />
              Đăng nhập bằng Google
            </Button>
          </Space>
        </Form>
        <Text type="secondary">Bạn có thể liên hệ quản trị để được cấp quyền.</Text>
      </Card>
      </div>
    </div>
  );
};

export default Login;
