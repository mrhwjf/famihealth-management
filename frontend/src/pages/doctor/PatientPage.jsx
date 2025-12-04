import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Input, Space, Tag, Avatar, Typography, message } from 'antd';
import { UserOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import useDebounce from '../../hooks/useDebounce';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP THEO ĐÚNG CẤU TRÚC DATABASE ---
// This data simulates a JOIN between family_members and member_access for the logged-in doctor
const mockPatientsData = [
    {
        id: 401, // family_members.id
        name: 'Nguyễn Thị Bích',
        dob: '2010-05-15',
        gender: 'FEMALE',
        blood_type: 'O+',
        phone: '0912345678',
        family_id: 301,
        familyName: 'Gia đình Nguyễn Văn An',
        profile_url: 'https://i.pravatar.cc/150?img=7',
    },
    {
        id: 403, // family_members.id
        name: 'Lê Thu Trang',
        dob: '1985-11-20',
        gender: 'FEMALE',
        blood_type: 'A+',
        phone: '0987654321',
        family_id: 302,
        familyName: 'Gia đình Lê Văn Cường',
        profile_url: 'https://i.pravatar.cc/150?img=8',
    },
    {
        id: 402, // family_members.id
        name: 'Nguyễn Văn Hùng',
        dob: '1982-02-10',
        gender: 'MALE',
        blood_type: 'B-',
        phone: '0909090909',
        family_id: 301,
        familyName: 'Gia đình Nguyễn Văn An',
        profile_url: null,
    },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(searchText, 300);

    useEffect(() => {
        setLoading(true);
        // *** Giả lập gọi API lấy danh sách bệnh nhân của bác sĩ ***
        setTimeout(() => {
            setPatients(mockPatientsData);
            setLoading(false);
        }, 1000);
    }, []);

    // Memoized filtering to prevent re-calculation on every render
    const filteredPatients = useMemo(() => {
        if (!debouncedSearch) return patients;
        const q = debouncedSearch.toLowerCase();
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(q) ||
            (patient.phone || '').includes(q) ||
            (patient.familyName || '').toLowerCase().includes(q)
        );
    }, [debouncedSearch, patients]);

    const handleViewDetails = useCallback((patientId) => {
        // In the future, this will navigate to a detailed patient profile page
        // For now, it can just show a message or open a modal
        message.info(`Điều hướng đến trang chi tiết của bệnh nhân ID: ${patientId}`);
        navigate(`/doctor/patients/${patientId}`);
    }, [navigate]);

    const columns = useMemo(() => [
        {
            title: 'Bệnh nhân',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={record.profile_url}
                        icon={!record.profile_url && <UserOutlined />}
                        alt={record.name}
                    >
                        {!record.profile_url && record.name ? record.name.split(' ').map(n=>n[0]).slice(-2).join('') : null}
                    </Avatar>
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary">Gia đình: {record.familyName}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Tuổi',
            dataIndex: 'dob',
            key: 'age',
            render: (dob) => dayjs().diff(dayjs(dob), 'year'),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => <Tag>{gender === 'FEMALE' ? 'Nữ' : 'Nam'}</Tag>,
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || <Text type="secondary">--</Text>,
        },
        {
            title: 'Nhóm máu',
            dataIndex: 'blood_type',
            key: 'blood_type',
            render: (bloodType) => {
                const colorMap = { 'A+': 'volcano', 'A-': 'orange', 'B+': 'gold', 'B-': 'lime', 'O+': 'green', 'O-': 'cyan', 'AB+': 'blue', 'AB-': 'purple' };
                return <Tag color={colorMap[bloodType] || 'red'}>{bloodType}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewDetails(record.id)}
                >
                    Xem hồ sơ
                </Button>
            ),
        },
    ], [handleViewDetails]);

    return (
        <div>
            <Title level={2}>Quản lý Bệnh nhân</Title>
            <Input
                placeholder="Tìm kiếm bệnh nhân theo tên, gia đình hoặc số điện thoại..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 360, marginBottom: 24 }}
                allowClear
            />
            <Table
                columns={columns}
                dataSource={filteredPatients}
                loading={loading}
                rowKey="id"
            />
        </div>
    );
};

export default PatientPage;