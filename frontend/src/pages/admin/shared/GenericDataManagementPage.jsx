import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const GenericDataManagementPage = ({
    pageTitle,
    itemName,
    initialData,
    formFields,
    // Optional CRUD handlers for real API integration
    fetchList, // () => Promise<Array<{id: any}>>
    createItem, // (values) => Promise<void | object>
    updateItem, // (itemId, values) => Promise<void | object>
    deleteItem, // (itemId) => Promise<void>
    rowKey = 'id',
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                if (typeof fetchList === 'function') {
                    const items = await fetchList();
                    if (mounted) {
                        const arr = Array.isArray(items) ? items : [];
                        setData(arr);
                    }
                } else {
                    // Only use mock when no API handler provided
                    if (mounted) setData(initialData || []);
                }
            } catch (e) {
                message.error(`Không thể tải danh sách ${itemName}`);
                console.error(e);
                // Do not fallback to mock on API error; keep as empty to reflect real status
                if (mounted) setData([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [initialData, fetchList, itemName]);

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
        form.validateFields().then(async (values) => {
            setLoading(true);
            try {
                if (editingItem) {
                    if (typeof updateItem === 'function') {
                        await updateItem(editingItem[rowKey], values);
                        message.success(`Cập nhật ${itemName} thành công!`);
                        // reload list
                        if (typeof fetchList === 'function') {
                            const items = await fetchList();
                            setData(items || []);
                        } else {
                            const updatedData = data.map((item) =>
                                item[rowKey] === editingItem[rowKey] ? { ...item, ...values } : item
                            );
                            setData(updatedData);
                        }
                    } else {
                        const updatedData = data.map((item) =>
                            item[rowKey] === editingItem[rowKey] ? { ...item, ...values } : item
                        );
                        setData(updatedData);
                        message.success(`Cập nhật ${itemName} thành công!`);
                    }
                } else {
                    if (typeof createItem === 'function') {
                        await createItem(values);
                        message.success(`Thêm ${itemName} mới thành công!`);
                        if (typeof fetchList === 'function') {
                            const items = await fetchList();
                            setData(items || []);
                        } else {
                            const newItem = { [rowKey]: `new_${Date.now()}`, ...values };
                            setData([newItem, ...data]);
                        }
                    } else {
                        const newItem = { [rowKey]: `new_${Date.now()}`, ...values };
                        setData([newItem, ...data]);
                        message.success(`Thêm ${itemName} mới thành công!`);
                    }
                }
                handleCancel();
            } catch (e) {
                console.error(e);
                message.error(`Thao tác với ${itemName} thất bại`);
            } finally {
                setLoading(false);
            }
        });
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            if (typeof deleteItem === 'function') {
                await deleteItem(id);
                message.success(`Xóa ${itemName} thành công!`);
                if (typeof fetchList === 'function') {
                    const items = await fetchList();
                    setData(items || []);
                } else {
                    const newData = data.filter((item) => item[rowKey] !== id);
                    setData(newData);
                }
            } else {
                const newData = data.filter((item) => item[rowKey] !== id);
                setData(newData);
                message.success(`Xóa ${itemName} thành công!`);
            }
        } catch (e) {
            console.error(e);
            message.error(`Xóa ${itemName} thất bại`);
        } finally {
            setLoading(false);
        }
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
                        onConfirm={() => handleDelete(record[rowKey])}
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
            <Table columns={columns} dataSource={data} loading={loading} rowKey={rowKey} />

            <Modal
                title={editingItem ? `Chỉnh sửa ${itemName}` : `Thêm ${itemName} mới`}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                destroyOnHidden
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