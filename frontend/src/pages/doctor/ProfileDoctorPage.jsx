import React, { useState, useEffect, useCallback } from 'react';
import { Card, Avatar, Button, Descriptions, Tag, Typography, Modal, Form, Input, message, Upload, Space } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

// --- DỮ LIỆU GIẢ LẬP CHO BÁC SĨ ĐANG ĐĂNG NHẬP ---
// Dữ liệu này là sự kết hợp từ các bảng users, doctor_profiles, và doctor_verifications
const mockDoctorProfile = {
  id: 202,
  name: 'Bác sĩ Lê Thị Hoa',
  email: 'hoalt@hospital.vn', // Thường không cho phép sửa email
  phone: '0988123456',
  profile_url: 'https://i.pravatar.cc/150?img=6',
  profile: {
    license_number: 'CCHN-005678',
  },
  verification: {
    status: 'APPROVED', // PENDING, APPROVED, REJECTED
  },
};
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

const ProfileDoctorPage = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        // *** Giả lập gọi API để lấy thông tin của bác sĩ đang đăng nhập ***
        setDoctorData(mockDoctorProfile);
    }, []);

    const showEditModal = useCallback(() => {
        if (!doctorData) return message.error('Dữ liệu hồ sơ chưa sẵn sàng');
        form.setFieldsValue({
            name: doctorData.name || '',
            phone: doctorData.phone || '',
            profile_url: doctorData.profile_url || '',
        });
        setIsModalVisible(true);
    }, [doctorData, form]);

    const handleOk = useCallback(() => {
        form.validateFields().then(values => {
            // *** Giả lập gọi API để cập nhật thông tin ***
            setDoctorData(prevData => ({ ...prevData, ...values }));
            message.success('Cập nhật hồ sơ thành công!');
            setIsModalVisible(false);
            form.resetFields();
        }).catch(() => {
            message.error('Vui lòng kiểm tra thông tin nhập');
        });
    }, [form]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    // Hàm lấy màu và text cho tag trạng thái
    const getVerificationTag = (status) => {
        switch (status) {
            case 'APPROVED':
                return <Tag color="green">ĐÃ XÁC THỰC</Tag>;
            case 'PENDING':
                return <Tag color="orange">ĐANG CHỜ DUYỆT</Tag>;
            case 'REJECTED':
                return <Tag color="red">BỊ TỪ CHỐI</Tag>;
            default:
                return <Tag>KHÔNG RÕ</Tag>;
        }
    };

    if (!doctorData) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <>
            <Title level={2}>Hồ sơ của tôi</Title>
            <Card
                actions={[
                    <Button key="edit" type="primary" icon={<EditOutlined />} onClick={showEditModal}>
                        Chỉnh sửa thông tin
                    </Button>
                ]}
            >
                <Card.Meta
                    avatar={
                        <Avatar size={64} src={doctorData.profile_url} icon={!doctorData.profile_url && <UserOutlined />} alt={doctorData.name}>
                            {!doctorData.profile_url && doctorData.name ? doctorData.name.split(' ').map(n => n[0]).slice(-2).join('') : null}
                        </Avatar>
                    }
                    title={doctorData.name}
                    description={getVerificationTag(doctorData.verification.status)}
                    style={{ marginBottom: 24 }}
                />

                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Email">{doctorData.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{doctorData.phone}</Descriptions.Item>
                    <Descriptions.Item label="Số giấy phép hành nghề">{doctorData.profile.license_number}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Modal
                title="Chỉnh sửa hồ sơ"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="profile_url" label="URL ảnh đại diện">
                        <Input placeholder="https://example.com/path/to/avatar.jpg" />
                    </Form.Item>
                    <Form.Item label="Tải ảnh lên (tùy chọn)">
                        <Space direction="vertical">
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    // In a real app, upload to server and get URL
                                    const fakeUrl = URL.createObjectURL(file);
                                    form.setFieldsValue({ profile_url: fakeUrl });
                                    message.success('Ảnh đã được chọn (demo)');
                                    return false; // prevent automatic upload
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            <small>Chọn ảnh để xem preview (demo). Ảnh thực tế nên upload lên server.</small>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProfileDoctorPage;