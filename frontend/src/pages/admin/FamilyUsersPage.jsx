import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Avatar, Tag, Select, Switch } from 'antd';
import { PlusOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

// --- DỮ LIỆU GIẢ LẬP THEO ĐÚNG CẤU TRÚC DATABASE ---
const initialData = [
  {
    id: 101,
    name: 'Nguyễn Văn An (Creator)',
    email: 'an.nguyen@family.com',
    phone: '0901112223',
    profile_url: null,
    created_at: '2025-09-20T10:00:00Z',
    is_locked: false,
    role: { id: 3, name: 'FAMILY_CREATOR' },
  },
  {
    id: 102,
    name: 'Trần Thị Bích (Member)',
    email: 'bich.tran@family.com',
    phone: '0904445556',
    profile_url: 'https://i.pravatar.cc/150?img=1',
    created_at: '2025-09-21T11:30:00Z',
    is_locked: false,
    role: { id: 4, name: 'FAMILY_MEMBER' },
  },
  {
    id: 103,
    name: 'Lê Văn Cường (Member)',
    email: 'cuong.le@family.com',
    phone: '0907778889',
    profile_url: 'https://i.pravatar.cc/150?img=3',
    created_at: '2025-09-22T14:00:00Z',
    is_locked: true,
    role: { id: 4, name: 'FAMILY_MEMBER' },
  },
];

// Giả lập danh sách vai trò lấy từ database
const availableRoles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'DOCTOR' },
    { id: 3, name: 'FAMILY_CREATOR' },
    { id: 4, name: 'FAMILY_MEMBER' },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

const FamilyUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    // *** Giả lập gọi API để lấy danh sách người dùng có role là FAMILY_CREATOR hoặc FAMILY_MEMBER ***
    setTimeout(() => {
        // Lọc để chỉ hiển thị người dùng gia đình
        const familyUsers = initialData.filter(u => u.role.id === 3 || u.role.id === 4);
        setUsers(familyUsers);
        setLoading(false);
    }, 1000);
  }, []);

  const showModal = (user) => {
    if (user) {
      setEditingUser(user);
      // setFieldsValue cần role_id thay vì object role
      form.setFieldsValue({ ...user, role_id: user.role.id }); 
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
        setLoading(true);
        // *** Giả lập gọi API để lưu dữ liệu ***
        setTimeout(() => {
          if (editingUser) {
            // Cập nhật người dùng
            const updatedUsers = users.map((user) =>
              user.id === editingUser.id ? { ...user, ...values, role: availableRoles.find(r => r.id === values.role_id) } : user
            );
            setUsers(updatedUsers);
            message.success('Cập nhật người dùng thành công!');
          } else {
            // Thêm người dùng mới
            const newUser = {
              id: Date.now(), // Tạo ID tạm thời
              ...values,
              created_at: new Date().toISOString(),
              is_locked: false,
              role: availableRoles.find(r => r.id === values.role_id),
            };
            setUsers([newUser, ...users]);
            message.success('Thêm người dùng thành công!');
          }
          setLoading(false);
          handleCancel();
        }, 500);
      });
  };

  const handleToggleLock = (userId, currentLockStatus) => {
    setLoading(true);
    // *** Giả lập gọi API để cập nhật trường is_locked ***
    setTimeout(() => {
        const updatedUsers = users.map(user => 
            user.id === userId ? { ...user, is_locked: !currentLockStatus } : user
        );
        setUsers(updatedUsers);
        message.success(currentLockStatus ? 'Mở khóa tài khoản thành công!' : 'Khóa tài khoản thành công!');
        setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
            <Avatar src={record.profile_url} icon={<UserOutlined />} />
            <span>{record.name}</span>
        </Space>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role.name === 'FAMILY_CREATOR' ? 'purple' : 'geekblue'}>{role.name}</Tag>,
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'is_locked',
        key: 'is_locked',
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
        <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
          Thêm người dùng
        </Button>
      </div>
      <Table columns={columns} dataSource={users} loading={loading} rowKey="id" />

      <Modal
        title={editingUser ? 'Chỉnh sửa thông tin' : 'Thêm người dùng mới'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role_id" label="Vai trò" rules={[{ required: true }]}>
            <Select placeholder="Chọn vai trò cho người dùng">
                {/* Lọc chỉ cho phép tạo vai trò gia đình */}
                {availableRoles.filter(r => r.id === 3 || r.id === 4).map(role => (
                    <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          {/* Mật khẩu thường được xử lý riêng, ví dụ: gửi link reset */}
          {/* Trường profile_url cũng nên được xử lý bằng chức năng upload ảnh riêng */}
        </Form>
      </Modal>
    </div>
  );
};

export default FamilyUsersPage;