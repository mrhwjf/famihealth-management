import React from 'react';
import { Table, Typography, Alert } from 'antd';

const { Title, Text } = Typography;

// Danh sách này được lấy từ định nghĩa ENUM trong database
const bloodTypesData = [
    { key: '1', name: 'A+' },
    { key: '2', name: 'A-' },
    { key: '3', name: 'B+' },
    { key: '4', name: 'B-' },
    { key: '5', name: 'AB+' },
    { key: '6', name: 'AB-' },
    { key: '7', name: 'O+' },
    { key: '8', name: 'O-' },
];

const columns = [
    {
        title: 'Tên Nhóm Máu',
        dataIndex: 'name',
        key: 'name',
    },
];

const BloodTypesPage = () => {
    return (
        <div>
            <Title level={2}>Danh sách Nhóm máu</Title>
            <Alert
                message="Thông tin tham khảo"
                description="Đây là danh sách các nhóm máu được định nghĩa sẵn trong hệ thống (ENUM). Nó không thể được chỉnh sửa thông qua giao diện này."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />
            <Table 
                columns={columns} 
                dataSource={bloodTypesData} 
                rowKey="key"
                pagination={false} // Không cần phân trang cho danh sách ngắn
            />
        </div>
    );
};

export default BloodTypesPage;