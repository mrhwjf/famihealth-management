import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // TODO: call backend registration API
    console.log('Register values', values);
    // placeholder: after register navigate to login
    navigate('/auth');
  };

  const validatePasswordConfirm = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Mật khẩu không khớp'));
    }
  });

  return (
    <div>
      <div className="auth-card-wrap">
      <Card style={{ width: '100%' }}>
        <Title level={3} style={{ textAlign: 'left' }}>Đăng ký</Title>
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="email@example.com" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item name="confirm" label="Xác nhận mật khẩu" dependencies={[ 'password' ]} rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }, validatePasswordConfirm]} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <Text>Đã có tài khoản? <Link to="/auth">Đăng nhập</Link></Text>
      </Card>
      </div>
    </div>
  );
};

export default Register;
