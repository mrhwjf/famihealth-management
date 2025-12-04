import React, { useState, useEffect, useCallback } from 'react';
import { Card, Avatar, Button, Descriptions, Tag, Typography, Modal, Form, Input, message, Upload, Space } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadDoctorCertificate } from '../../../services/uploadService.js';
import { getUserById } from '../../../services/usersService.js';

const { Title } = Typography;

// Helper: lấy current user id từ sessionStorage (được set sau khi login)
function getCurrentUserId() {
    try {
        const raw = sessionStorage.getItem('currentUserId');
        if (raw) return Number(raw);
    } catch {
        // ignore
    }
    return null;
}

const ProfileDoctorPage = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        (async () => {
            try {
                const id = getCurrentUserId();
                if (!id) {
                    message.warning('Không tìm thấy ID người dùng hiện tại. Vui lòng đăng nhập lại.');
                    return;
                }
                const resp = await getUserById({ id, headerName: 'X-Session-Id' });
                const d = resp?.data || {};
                const profile = d.doctorProfile || {};
                setDoctorData({
                    id: d.id,
                    name: d.name,
                    email: d.email,
                    phone: d.phone,
                    profile_url: d.profileUrl || '',
                    profile: {
                        license_number: profile.licenseNumber || '-',
                        certificateFileUrl: profile.certificateFileUrl || null,
                    },
                    verification: {
                        status: profile.verified ? 'APPROVED' : 'PENDING',
                    },
                });
            } catch (e) {
                message.error(e?.message || 'Không tải được hồ sơ bác sĩ');
            }
        })();
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
                    <Descriptions.Item label="Số giấy phép hành nghề">{doctorData.profile?.license_number}</Descriptions.Item>
                                        <Descriptions.Item label="Chứng chỉ hành nghề">
                                            <Space direction="vertical">
                                                {doctorData?.profile?.certificateFileUrl ? (
                                                    <a href={doctorData.profile.certificateFileUrl} target="_blank" rel="noreferrer">
                                                        Xem chứng chỉ hiện tại
                                                    </a>
                                                ) : (
                                                    <span>Chưa có tệp chứng chỉ</span>
                                                )}
                                                <Upload
                                                    accept=".pdf,image/*"
                                                    showUploadList={false}
                                                    beforeUpload={async (file) => {
                                                        try {
                                                            // Giả sử id người dùng trùng với doctorId theo thiết kế @MapsId
                                                            const doctorId = doctorData.id;
                                                            const res = await uploadDoctorCertificate({ doctorId, file });
                                                            const newUrl = res?.fileUrl || res?.data?.fileUrl || '';
                                                            if (!newUrl) {
                                                                message.warning('Upload thành công nhưng không nhận được fileUrl');
                                                            } else {
                                                                setDoctorData((prev) => ({
                                                                    ...prev,
                                                                    profile: {
                                                                        ...prev.profile,
                                                                        certificateFileUrl: newUrl,
                                                                    },
                                                                }));
                                                                message.success('Đã tải lên chứng chỉ hành nghề');
                                                            }
                                                        } catch (e) {
                                                            message.error(e?.message || 'Upload chứng chỉ thất bại');
                                                        }
                                                        // Ngăn antd tự upload
                                                        return false;
                                                    }}
                                                >
                                                    <Button icon={<UploadOutlined />}>Tải lên chứng chỉ</Button>
                                                </Upload>
                                                <small>Hỗ trợ *.pdf hoặc ảnh. Tệp sẽ được tải lên và gắn vào hồ sơ.</small>
                                            </Space>
                                        </Descriptions.Item>
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