import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, message, Space, Popconfirm, Tag, Tabs, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP THEO ĐÚNG CẤU TRÚC DATABASE ---

// Giả lập danh sách bác sĩ, gia đình, và thành viên để chọn trong form
const mockDoctors = [
    { id: 201, name: 'Bác sĩ Trần Công Minh' },
    { id: 202, name: 'Bác sĩ Lê Thị Hoa' },
];
const mockFamilies = [
    { id: 301, name: 'Gia đình Nguyễn Văn An' },
    { id: 302, name: 'Gia đình Lê Văn Cường' },
];
const mockFamilyMembers = [
    { id: 401, name: 'Nguyễn Thị Bích (Con)', familyName: 'Gia đình Nguyễn Văn An' },
    { id: 402, name: 'Nguyễn Văn Hùng (Chồng)', familyName: 'Gia đình Nguyễn Văn An' },
    { id: 403, name: 'Lê Thu Trang (Vợ)', familyName: 'Gia đình Lê Văn Cường' },
];

// Giả lập dữ liệu từ bảng family_access
const initialFamilyAccessData = [
    { key: 'fa1', family_id: 301, user_id: 201, userName: 'Bác sĩ Trần Công Minh', familyName: 'Gia đình Nguyễn Văn An' },
];

// Giả lập dữ liệu từ bảng member_access
const initialMemberAccessData = [
    { key: 'ma1', member_id: 403, doctor_id: 202, doctorName: 'Bác sĩ Lê Thị Hoa', memberName: 'Lê Thu Trang (Vợ)' },
];

// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

const AccessManagementPage = () => {
    const [loading, setLoading] = useState(false);
    
    // State cho tab 1: Family Access
    const [familyAccessList, setFamilyAccessList] = useState([]);
    const [isFamilyModalVisible, setIsFamilyModalVisible] = useState(false);
    const [familyForm] = Form.useForm();

    // State cho tab 2: Member Access
    const [memberAccessList, setMemberAccessList] = useState([]);
    const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
    const [memberForm] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setFamilyAccessList(initialFamilyAccessData);
            setMemberAccessList(initialMemberAccessData);
            setLoading(false);
        }, 500);
    }, []);

    // --- Xử lý cho Tab 1: Family Access ---
    const handleGrantFamilyAccess = () => {
        familyForm.validateFields().then(values => {
            // 'values' ở đây sẽ là { user_id: 201, family_id: 301 }

            // TÌM TÊN DỰA TRÊN ID ĐỂ HIỂN THỊ ĐẸP HƠN
            const user = mockDoctors.find(d => d.id === values.user_id);
            const family = mockFamilies.find(f => f.id === values.family_id);

            // TẠO BẢN GHI MỚI
            const newRecord = {
                key: `fa_${Date.now()}`,
                family_id: values.family_id,
                user_id: values.user_id,
                userName: user.name,
                familyName: family.name,
            };

            // CẬP NHẬT LẠI BẢNG
            setFamilyAccessList(prev => [newRecord, ...prev]);
            
            message.success('Cấp quyền truy cập gia đình thành công!');
            setIsFamilyModalVisible(false);
        });
    };
    const handleRevokeFamilyAccess = (key) => {
        setFamilyAccessList(prev => prev.filter(item => item.key !== key));
        message.success('Thu hồi quyền truy cập gia đình thành công!');
    };
    const familyColumns = [
        { title: 'Tên Bác sĩ / Người dùng', dataIndex: 'userName', key: 'userName' },
        { title: 'Gia đình được cấp quyền', dataIndex: 'familyName', key: 'familyName' },
        {
            title: 'Hành động', key: 'action',
            render: (_, record) => (
                <Popconfirm title="Thu hồi quyền truy cập này?" onConfirm={() => handleRevokeFamilyAccess(record.key)}>
                    <Button danger icon={<DeleteOutlined />}>Thu hồi</Button>
                </Popconfirm>
            ),
        },
    ];

    // --- Xử lý cho Tab 2: Member Access ---
    // Sửa lại hàm này
    const handleGrantMemberAccess = () => {
        memberForm.validateFields().then(values => {
            // 'values' ở đây sẽ là { doctor_id: 202, member_id: 401 }

            // TÌM TÊN DỰA TRÊN ID
            const doctor = mockDoctors.find(d => d.id === values.doctor_id);
            const member = mockFamilyMembers.find(m => m.id === values.member_id);

            // TẠO BẢN GHI MỚI
            const newRecord = {
                key: `ma_${Date.now()}`,
                member_id: values.member_id,
                doctor_id: values.doctor_id,
                doctorName: doctor.name,
                memberName: member.name,
            };

            // CẬP NHẬT LẠI BẢNG
            setMemberAccessList(prev => [newRecord, ...prev]);

            message.success('Cấp quyền truy cập thành viên thành công!');
            setIsMemberModalVisible(false);
        });
    };
    const handleRevokeMemberAccess = (key) => {
        setMemberAccessList(prev => prev.filter(item => item.key !== key));
        message.success('Thu hồi quyền truy cập thành viên thành công!');
    };
    const memberColumns = [
        { title: 'Tên Bác sĩ', dataIndex: 'doctorName', key: 'doctorName' },
        { title: 'Thành viên được cấp quyền', dataIndex: 'memberName', key: 'memberName' },
        {
            title: 'Hành động', key: 'action',
            render: (_, record) => (
                <Popconfirm title="Thu hồi quyền truy cập này?" onConfirm={() => handleRevokeMemberAccess(record.key)}>
                    <Button danger icon={<DeleteOutlined />}>Thu hồi</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            {/* Modal cho Family Access */}
            <Modal title="Cấp quyền truy cập theo Gia đình" visible={isFamilyModalVisible} onOk={handleGrantFamilyAccess} onCancel={() => setIsFamilyModalVisible(false)}>
                <Form form={familyForm} layout="vertical">
                    <Form.Item name="user_id" label="Chọn Bác sĩ" rules={[{ required: true }]}>
                        <Select options={mockDoctors.map(d => ({ label: d.name, value: d.id }))} />
                    </Form.Item>
                    <Form.Item name="family_id" label="Chọn Gia đình" rules={[{ required: true }]}>
                        <Select options={mockFamilies.map(f => ({ label: f.name, value: f.id }))} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal cho Member Access */}
            <Modal title="Cấp quyền truy cập theo Thành viên" visible={isMemberModalVisible} onOk={handleGrantMemberAccess} onCancel={() => setIsMemberModalVisible(false)}>
                <Form form={memberForm} layout="vertical">
                    <Form.Item name="doctor_id" label="Chọn Bác sĩ" rules={[{ required: true }]}>
                        <Select options={mockDoctors.map(d => ({ label: d.name, value: d.id }))} />
                    </Form.Item>
                    <Form.Item name="member_id" label="Chọn Thành viên" rules={[{ required: true }]}>
                         <Select 
                            options={mockFamilyMembers.map(m => ({ label: `${m.name} (${m.familyName})`, value: m.id }))} 
                         />
                    </Form.Item>
                </Form>
            </Modal>

            <Tabs defaultActiveKey="1" tabBarExtraContent={
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFamilyModalVisible(true)}>Cấp quyền cho Gia đình</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsMemberModalVisible(true)}>Cấp quyền cho Thành viên</Button>
                </Space>
            }>
                <TabPane tab="Quyền truy cập theo Gia đình" key="1">
                    <Table columns={familyColumns} dataSource={familyAccessList} loading={loading} rowKey="key" />
                </TabPane>
                <TabPane tab="Quyền truy cập theo Thành viên" key="2">
                    <Table columns={memberColumns} dataSource={memberAccessList} loading={loading} rowKey="key" />
                </TabPane>
            </Tabs>
        </>
    );
};

export default AccessManagementPage;