import React from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Divider, Space, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login, getSessionId } from '../../../services/auth/loginService.js';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Login submitted', values);
    try {
      const resp = await login({
        phoneOrEmail: values.username,
        password: values.password,
      });
      console.log('Backend response:', resp);
      console.log('Saved sessionId:', getSessionId());
      const role = resp?.data?.session?.role || resp?.data?.user?.role?.name;
      if (role === 'ADMIN') {
        message.success('Đăng nhập quản trị thành công');
        navigate('/admin');
      } else if (role === 'DOCTOR') {
        message.success('Đăng nhập bác sĩ thành công');
        navigate('/doctor');
      } else {
        message.success('Đăng nhập thành công');
        navigate('/');
      }
    } catch (e) {
      console.error('Login error:', e);
      message.error(e?.message || 'Đăng nhập thất bại');
    }
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
        </Form>
        <Text type="secondary">Bạn có thể liên hệ quản trị để được cấp quyền.</Text>
      </Card>
      </div>
    </div>
  );
};

export default Login;
