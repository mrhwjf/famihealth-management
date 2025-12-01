import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const GenericDataManagementPage = ({ pageTitle, itemName, initialData, formFields }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        // Giả lập tải dữ liệu
        setTimeout(() => {
            setData(initialData);
            setLoading(false);
        }, 500);
    }, [initialData]);

    const showModal = (item) => {
        if (item) {
            setEditingItem(item);
            form.setFieldsValue(item);
        } else {
            setEditingItem(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            setLoading(true);
            setTimeout(() => {
                if (editingItem) {
                    const updatedData = data.map(item =>
                        item.key === editingItem.key ? { ...item, ...values } : item
                    );
                    setData(updatedData);
                    message.success(`Cập nhật ${itemName} thành công!`);
                } else {
                    const newItem = { key: `new_${Date.now()}`, ...values };
                    setData([newItem, ...data]);
                    message.success(`Thêm ${itemName} mới thành công!`);
                }
                setLoading(false);
                handleCancel();
            }, 500);
        });
    };

    const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        message.success(`Xóa ${itemName} thành công!`);
    };
    
    // Tự động tạo cột dựa trên formFields
    const columns = [
        ...formFields.map(field => ({
            title: field.label,
            dataIndex: field.name,
            key: field.name,
            // chỉ hiển thị cột mô tả nếu có
            ellipsis: field.name === 'description', 
        })),
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm
                        title={`Bạn chắc chắn muốn xóa ${itemName} này?`}
                        onConfirm={() => handleDelete(record.key)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>{pageTitle}</h2>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
                    Thêm {itemName} mới
                </Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="key" />

            <Modal
                title={editingItem ? `Chỉnh sửa ${itemName}` : `Thêm ${itemName} mới`}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name={`${itemName}Form`}>
                    {formFields.map(field => (
                        <Form.Item key={field.name} {...field}>
                            {field.type === 'textarea' ? <TextArea rows={4} /> : <Input />}
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
        </div>
    );
};

export default GenericDataManagementPage;