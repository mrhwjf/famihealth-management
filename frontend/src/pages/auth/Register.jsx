import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import registerAdmin from '../../../services/auth/registerAdminService.js';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // TODO: call backend registration API (user register)
    // Hiện tại chưa có API đăng ký user thường, giữ nguyên điều hướng về đăng nhập
    console.log('Register values', values);
    navigate('/auth');
  };

  const onRegisterAdmin = async (values) => {
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
      };
      const res = await registerAdmin(payload);
      message.success(res?.message || 'Đăng ký quản trị thành công');
      // Sau khi đăng ký quản trị thành công có sessionId, điều hướng vào trang admin
      navigate('/admin');
    } catch (err) {
      message.error(err?.message || 'Đăng ký quản trị thất bại');
    }
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
          <Form form={form} name="register" layout="vertical" onFinish={onFinish}
              onFinishFailed={() => message.error('Vui lòng điền đầy đủ thông tin')}
        >
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input placeholder="Số điện thoại" />
          </Form.Item>
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
          <Form.Item>
            <Button type="default" block onClick={async () => {
              try {
                const values = await form.validateFields();
                await onRegisterAdmin(values);
              } catch {
                // validation error already shown
              }
            }} style={{ marginTop: 8 }}>
              Đăng ký quản trị
            </Button>
          </Form.Item>
        </Form>
        {/* Hidden form submit for admin: reuse same fields */}
        {/* We use Form instance from antd to get values and call onRegisterAdmin */}
        <Text>Đã có tài khoản? <Link to="/auth">Đăng nhập</Link></Text>
      </Card>
      </div>
    </div>
  );
};

export default Register;
