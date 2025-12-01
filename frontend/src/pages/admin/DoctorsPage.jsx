import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Avatar, Tag, Switch, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// --- DỮ LIỆU GIẢ LẬP PHỨC HỢP, JOIN TỪ NHIỀU BẢNG ---
const initialDoctorsData = [
  {
    id: 201,
    name: 'Bác sĩ Trần Công Minh',
    email: 'minhtc@hospital.vn',
    phone: '0912345678',
    profile_url: 'https://i.pravatar.cc/150?img=5',
    is_locked: false,
    role: { id: 2, name: 'DOCTOR' },
    profile: {
      license_number: 'CCHN-001234',
      certificate_file_url: '/path/to/certificate1.pdf',
    },
    verification: {
      status: 'PENDING', // PENDING, APPROVED, REJECTED
      remarks: null,
    },
  },
  {
    id: 202,
    name: 'Bác sĩ Lê Thị Hoa',
    email: 'hoalt@hospital.vn',
    phone: '0988123456',
    profile_url: 'https://i.pravatar.cc/150?img=6',
    is_locked: false,
    role: { id: 2, name: 'DOCTOR' },
    profile: {
      license_number: 'CCHN-005678',
      certificate_file_url: '/path/to/certificate2.pdf',
    },
    verification: {
      status: 'APPROVED',
      remarks: 'Hồ sơ đầy đủ, đã xác thực.',
    },
  },
  {
    id: 203,
    name: 'Bác sĩ Phạm Văn Dũng',
    email: 'dungpv@hospital.vn',
    phone: '0977888999',
    profile_url: null,
    is_locked: true,
    role: { id: 2, name: 'DOCTOR' },
    profile: {
      license_number: 'CCHN-009101',
      certificate_file_url: '/path/to/certificate3.pdf',
    },
    verification: {
      status: 'REJECTED',
      remarks: 'Bằng cấp không hợp lệ.',
    },
  },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---


const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State cho modal Sửa thông tin cơ bản
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    
    // State cho modal Xác thực
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const [verifyingDoctor, setVerifyingDoctor] = useState(null);

    // MỚI: State cho modal Thêm mới
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const [editForm] = Form.useForm();
    const [verificationForm] = Form.useForm();
    const [addForm] = Form.useForm(); // MỚI: Form cho việc thêm mới

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setDoctors(initialDoctorsData);
            setLoading(false);
        }, 1000);
    }, []);

    // --- Xử lý cho Modal Thêm mới --- MỚI
    const showAddModal = () => {
        addForm.resetFields();
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleAddOk = () => {
        addForm.validateFields().then(values => {
            setLoading(true);
            // *** Giả lập gọi API để tạo user, doctor_profile, doctor_verification ***
            setTimeout(() => {
                const newDoctor = {
                    id: Date.now(),
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    profile_url: null,
                    is_locked: false,
                    role: { id: 2, name: 'DOCTOR' },
                    profile: {
                        license_number: values.license_number,
                        certificate_file_url: values.certificate_file_url,
                    },
                    verification: {
                        status: 'PENDING',
                        remarks: null,
                    },
                };
                setDoctors([newDoctor, ...doctors]);
                message.success(`Đã thêm hồ sơ cho ${newDoctor.name}. Vui lòng duyệt hồ sơ để kích hoạt.`);
                setLoading(false);
                handleAddCancel();
            }, 500);
        });
    };

    // --- Xử lý cho Modal Sửa thông tin ---
    const showEditModal = (doctor) => {
        setEditingDoctor(doctor);
        editForm.setFieldsValue(doctor);
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingDoctor(null);
    };

    const handleEditOk = () => {
        editForm.validateFields().then(values => {
            message.success(`Cập nhật thông tin cho ${values.name} thành công!`);
            handleEditCancel();
        });
    };
    
    // --- Xử lý cho Modal Xác thực ---
    const showVerificationModal = (doctor) => {
        setVerifyingDoctor(doctor);
        verificationForm.setFieldsValue({ remarks: doctor.verification.remarks });
        setIsVerificationModalVisible(true);
    };

    const handleVerificationCancel = () => {
        setIsVerificationModalVisible(false);
        setVerifyingDoctor(null);
    };

    const handleVerification = (status) => {
        verificationForm.validateFields().then(values => {
            setLoading(true);
            setTimeout(() => {
                const updatedDoctors = doctors.map(doc =>
                    doc.id === verifyingDoctor.id
                        ? { ...doc, verification: { ...doc.verification, status, remarks: values.remarks } }
                        : doc
                );
                setDoctors(updatedDoctors);
                message.success(`Đã ${status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} hồ sơ của bác sĩ ${verifyingDoctor.name}.`);
                setLoading(false);
                handleVerificationCancel();
            }, 500);
        });
    };

    const handleToggleLock = (doctorId, currentLockStatus) => {
        message.success(currentLockStatus ? 'Mở khóa tài khoản thành công!' : 'Khóa tài khoản thành công!');
    };

    // (Code cho columns và render không thay đổi)
    const columns = [
        {
            title: 'Bác sĩ',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.profile_url} icon={<UserOutlined />} />
                    <span>{record.name}</span>
                </Space>
            ),
        },
        {
            title: 'Thông tin liên hệ',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <Text>{record.email}</Text><br/>
                    <Text type="secondary">{record.phone}</Text>
                </div>
            ),
        },
        {
            title: 'Số giấy phép',
            dataIndex: ['profile', 'license_number'],
            key: 'license',
        },
        {
            title: 'Trạng thái xác thực',
            dataIndex: ['verification', 'status'],
            key: 'verification_status',
            render: (status) => {
                const colors = { PENDING: 'orange', APPROVED: 'green', REJECTED: 'red' };
                return <Tag color={colors[status]}>{status}</Tag>;
            },
        },
        {
            title: 'Tài khoản',
            dataIndex: 'is_locked',
            key: 'account_status',
            render: (is_locked, record) => (
                <Switch
                    checked={!is_locked}
                    onChange={() => handleToggleLock(record.id, record.is_locked)}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Bị khóa"
                />
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem & Duyệt hồ sơ">
                        <Button
                            icon={<EyeOutlined style={{ color: record.verification.status === 'PENDING' ? '#fff' : undefined }} />}
                            onClick={() => showVerificationModal(record)}
                            type={record.verification.status === 'PENDING' ? 'primary' : 'default'}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa thông tin cơ bản">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* MỚI: Modal để thêm bác sĩ */}
            <Modal
                title="Thêm hồ sơ bác sĩ mới"
                visible={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                confirmLoading={loading}
                destroyOnClose
            >
                <Form form={addForm} layout="vertical" name="addDoctorForm">
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu ban đầu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                        <Input.Password placeholder="Bác sĩ sẽ đổi lại sau khi đăng nhập" />
                    </Form.Item>
                    <Form.Item name="license_number" label="Số giấy phép hành nghề" rules={[{ required: true, message: 'Vui lòng nhập số giấy phép' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="certificate_file_url" label="URL đến tệp chứng chỉ">
                        <Input placeholder="https://example.com/path/to/cert.pdf"/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal để sửa thông tin cơ bản */}
            <Modal
                title={`Sửa thông tin cho ${editingDoctor?.name}`}
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item name="name" label="Họ và tên"><Input /></Form.Item>
                    <Form.Item name="email" label="Email"><Input /></Form.Item>
                    <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
                </Form>
            </Modal>

            {/* Modal để xem và xác thực hồ sơ */}
            <Modal
                title={`Hồ sơ xác thực của ${verifyingDoctor?.name}`}
                visible={isVerificationModalVisible}
                onCancel={handleVerificationCancel}
                width={600}
                footer={[
                    <Button key="back" onClick={handleVerificationCancel}>Hủy</Button>,
                    <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => handleVerification('REJECTED')}>Từ chối</Button>,
                    <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVerification('APPROVED')}>Phê duyệt</Button>,
                ]}
            >
                {verifyingDoctor && (
                    <>
                        <Paragraph><strong>Số giấy phép:</strong> {verifyingDoctor.profile.license_number}</Paragraph>
                        <Paragraph><strong>Tệp chứng chỉ:</strong> <a href={verifyingDoctor.profile.certificate_file_url} target="_blank" rel="noopener noreferrer">Xem tệp đính kèm</a></Paragraph>
                        <Form form={verificationForm} layout="vertical">
                            <Form.Item name="remarks" label="Ghi chú của quản trị viên">
                                <TextArea rows={4} placeholder="Thêm ghi chú về quá trình xác thực..."/>
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Thêm bác sĩ
                </Button>
            </div>
            <Table columns={columns} dataSource={doctors} loading={loading} rowKey="id" />
        </div>
    );
};

export default DoctorsPage;