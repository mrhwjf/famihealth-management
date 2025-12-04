import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../../../services/auth/resetPassService.js';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('request'); // 'request' | 'reset'
  const [emailValue, setEmailValue] = useState('');
  const [loading, setLoading] = useState(false);

  const onRequest = async (values) => {
    try {
      setLoading(true);
      const res = await requestPasswordReset(values.email);
      message.success(res?.message || 'Đã gửi mã OTP đến email');
      setEmailValue(values.email);
      setMode('reset');
    } catch (e) {
      message.error(e?.message || 'Gửi yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (values) => {
    try {
      setLoading(true);
      const res = await resetPassword({
        email: emailValue || values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      message.success(res?.message || 'Đặt lại mật khẩu thành công');
      navigate('/auth');
    } catch (e) {
      message.error(e?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="auth-card-wrap">
      <Card style={{ width: '100%' }}>
        <Title level={4}>Quên mật khẩu</Title>
        {mode === 'request' && (
          <>
            <Text>Vui lòng nhập email. Hệ thống sẽ gửi mã OTP để đặt lại mật khẩu.</Text>
            <Form layout="vertical" style={{ marginTop: 16 }} onFinish={onRequest}>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                <Input prefix={<MailOutlined />} placeholder="email@example.com" disabled={loading} />
              </Form.Item>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit" style={{ background: '#20b06b', borderColor: '#20b06b' }} block>
                  Gửi mã xác thực
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {mode === 'reset' && (
          <>
            <Text>Nhập mã OTP đã gửi tới <b>{emailValue}</b> và mật khẩu mới.</Text>
            <Form layout="vertical" style={{ marginTop: 16 }} onFinish={onReset}>
              <Form.Item label="Email" name="email" initialValue={emailValue} rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                <Input disabled={!!emailValue || loading} />
              </Form.Item>
              <Form.Item label="Mã OTP" name="otp" rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}>
                <Input maxLength={10} disabled={loading} />
              </Form.Item>
              <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}>
                <Input.Password disabled={loading} />
              </Form.Item>
              <Form.Item shouldUpdate>
                {() => (
                  <Button loading={loading} type="primary" htmlType="submit" style={{ background: '#20b06b', borderColor: '#20b06b' }} block>
                    Đặt lại mật khẩu
                  </Button>
                )}
              </Form.Item>
              <Divider />
              <Button type="link" onClick={() => setMode('request')} disabled={loading}>
                Gửi lại mã OTP
              </Button>
            </Form>
          </>
        )}
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
