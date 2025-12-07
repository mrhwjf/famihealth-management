import React, { useState, useEffect, useCallback } from 'react';
import { Card, Avatar, Button, Descriptions, Tag, Typography, Modal, Form, Input, message, Upload, Space } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadDoctorCertificate, uploadProfileAvatar } from '../../../services/uploadService.js';
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
    const [pendingCertFile, setPendingCertFile] = useState(null);
    const [form] = Form.useForm();
    const [pendingAvatarFile, setPendingAvatarFile] = useState(null);

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

    const buildViewerUrl = (url) => {
        if (!url) return '#';
        try {
            const encoded = encodeURIComponent(url);
            return `https://docs.google.com/gview?embedded=1&url=${encoded}`;
        } catch {
            return url;
        }
    };

    const handleSaveCertificate = async () => {
        if (!pendingCertFile) {
            message.warning('Vui lòng chọn tệp chứng chỉ trước');
            return;
        }
        try {
            const doctorId = doctorData.id;
            const res = await uploadDoctorCertificate({ doctorId, file: pendingCertFile });
            const newUrl = res?.fileUrl || res?.data?.fileUrl || '';
            if (!newUrl) {
                message.warning('Upload thành công nhưng không nhận được fileUrl');
                return;
            }
            setDoctorData((prev) => ({
                ...prev,
                profile: { ...prev.profile, certificateFileUrl: newUrl },
            }));
            setPendingCertFile(null);
            message.success('Đã lưu chứng chỉ hành nghề');
        } catch (e) {
            message.error(e?.message || 'Lưu chứng chỉ thất bại');
        }
    };

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
                        <Space direction="vertical" align="center">
                            <Avatar size={64} src={doctorData.profile_url} icon={!doctorData.profile_url && <UserOutlined />} alt={doctorData.name}>
                                {!doctorData.profile_url && doctorData.name ? doctorData.name.split(' ').map(n => n[0]).slice(-2).join('') : null}
                            </Avatar>
                            <Space>
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        setPendingAvatarFile(file);
                                        message.success('Đã chọn ảnh. Nhấn Lưu để cập nhật.');
                                        return false;
                                    }}
                                >
                                    <Button size="small">Đổi</Button>
                                </Upload>
                                <Button
                                    size="small"
                                    type="primary"
                                    disabled={!pendingAvatarFile}
                                    onClick={async () => {
                                        if (!pendingAvatarFile) return;
                                        try {
                                            const res = await uploadProfileAvatar({ file: pendingAvatarFile });
                                            const newUrl = res?.fileUrl || res?.data?.fileUrl || '';
                                            if (!newUrl) {
                                                message.warning('Upload thành công nhưng không nhận được URL ảnh');
                                                return;
                                            }
                                            setDoctorData((prev) => ({ ...prev, profile_url: newUrl }));
                                            setPendingAvatarFile(null);
                                            message.success('Ảnh đại diện đã được cập nhật (chỉ hiển thị tạm thời).');
                                        } catch (e) {
                                            message.error(e?.message || 'Cập nhật ảnh đại diện thất bại');
                                        }
                                    }}
                                >
                                    Lưu
                                </Button>
                            </Space>
                        </Space>
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
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                {doctorData?.profile?.certificateFileUrl ? (
                                                    <a href={buildViewerUrl(doctorData.profile.certificateFileUrl)} target="_blank" rel="noreferrer">
                                                        Xem chứng chỉ hiện tại
                                                    </a>
                                                ) : (
                                                    <span>Chưa có tệp chứng chỉ</span>
                                                )}
                                                <Space>
                                                    <Upload
                                                        accept=".pdf,image/*"
                                                        showUploadList={false}
                                                        beforeUpload={(file) => {
                                                            setPendingCertFile(file);
                                                            message.success('Đã chọn tệp. Nhấn Lưu để cập nhật.');
                                                            return false; // ngăn antd upload tự động
                                                        }}
                                                    >
                                                        <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                                                    </Upload>
                                                    <Button type="primary" onClick={handleSaveCertificate} disabled={!pendingCertFile}>
                                                        Lưu
                                                    </Button>
                                                    {pendingCertFile && <span>{pendingCertFile.name}</span>}
                                                </Space>
                                                <small>Hỗ trợ *.pdf hoặc ảnh. Chọn tệp rồi bấm Lưu để cập nhật.</small>
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
                </Form>
            </Modal>
        </>
    );
};

export default ProfileDoctorPage;