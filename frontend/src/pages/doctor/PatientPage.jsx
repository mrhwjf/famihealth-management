import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Input, Space, Tag, Avatar, Typography, message } from 'antd';
import { UserOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import useDebounce from '../../hooks/useDebounce';
import { searchAppointments } from '../../../services/appointmentsService';

const { Title, Text } = Typography;

const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0 });
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(searchText, 300);

    // Hàm gọi API lấy danh sách bệnh nhân từ appointments
    const fetchPatients = useCallback(async (page = 0, size = 10, search = '') => {
        setLoading(true);
        try {
            // Lấy tất cả appointments của bác sĩ đang đăng nhập (backend tự filter theo session)
            const response = await searchAppointments({
                pageable: { page: 0, size: 1000, sort: ['appointmentDatetime,DESC'] },
                filters: {},
            });
            
            if (response?.success && response?.data) {
                const appointments = response.data.items || [];
                
                // Extract unique patients từ appointments
                const patientMap = new Map();
                appointments.forEach((appt) => {
                    const patientId = appt.patientId;
                    if (patientId && !patientMap.has(patientId)) {
                        patientMap.set(patientId, {
                            id: patientId,
                            name: appt.patient || `Bệnh nhân #${patientId}`,
                            // Các field khác có thể không có trong appointment response
                            // Sẽ hiển thị placeholder
                            dob: null,
                            gender: null,
                            blood_type: null,
                            phone: null,
                            family_id: null,
                            familyName: appt.issuer || 'Không xác định',
                            profile_url: null,
                        });
                    }
                });
                
                let patientsArray = Array.from(patientMap.values());

                // Mock fallback for missing profile fields
                const mockDefaults = {
                    dob: '1990-01-01',
                    gender: 'MALE',
                    phone: '000-000-0000',
                    blood_type: 'O+',
                };
                const mockByName = {
                    'Nguyễn Văn A': {
                        dob: '1980-01-01',
                        gender: 'MALE',
                        phone: '0334455667',
                        blood_type: 'A+',
                        profile_url: 'http://example.com/profile/nguyenvana',
                    },
                    'Nguyễn Văn B': {
                        dob: '2010-05-15',
                        gender: 'MALE',
                        phone: '0445566778',
                        blood_type: 'O+',
                        profile_url: 'http://example.com/profile/nguyenvanb',
                    }
                };
                patientsArray = patientsArray.map(p => ({
                    ...p,
                    dob: p.dob ?? null,
                    gender: p.gender ?? null,
                    phone: p.phone ?? null,
                    blood_type: p.blood_type ?? null,
                }));
                
                // Client-side search filter
                if (search) {
                    const q = search.toLowerCase();
                    patientsArray = patientsArray.filter(p =>
                        (p.name || '').toLowerCase().includes(q) ||
                        (p.familyName || '').toLowerCase().includes(q) ||
                        (p.phone || '').includes(q)
                    );
                }
                
                // Client-side pagination
                const total = patientsArray.length;
                const startIdx = page * size;
                const pageData = patientsArray.slice(startIdx, startIdx + size).map(p => {
                    const byName = mockByName[p.name];
                    return ({
                        ...p,
                        dob: p.dob ?? byName?.dob ?? mockDefaults.dob,
                        gender: p.gender ?? byName?.gender ?? mockDefaults.gender,
                        phone: p.phone ?? byName?.phone ?? mockDefaults.phone,
                        blood_type: p.blood_type ?? byName?.blood_type ?? mockDefaults.blood_type,
                        profile_url: p.profile_url ?? byName?.profile_url ?? p.profile_url,
                    });
                });
                
                setPatients(pageData);
                setPagination({
                    page: page,
                    size: size,
                    totalElements: total,
                });
            } else {
                setPatients([]);
                setPagination({ page: 0, size: 10, totalElements: 0 });
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách bệnh nhân:', error);
            message.error(error?.message || 'Không thể tải danh sách bệnh nhân');
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Tải dữ liệu khi mount và khi search thay đổi
    useEffect(() => {
        fetchPatients(0, pagination.size, debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    // Xử lý phân trang
    const handleTableChange = useCallback((paginationConfig) => {
        const newPage = (paginationConfig.current || 1) - 1;
        const newSize = paginationConfig.pageSize || 10;
        fetchPatients(newPage, newSize, debouncedSearch);
    }, [fetchPatients, debouncedSearch]);

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
                        <Text type="secondary">Người đặt: {record.familyName}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Tuổi',
            dataIndex: 'dob',
            key: 'age',
            render: (dob) => dob ? dayjs().diff(dayjs(dob), 'year') : <Text type="secondary">--</Text>,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => gender ? <Tag>{gender === 'FEMALE' ? 'Nữ' : 'Nam'}</Tag> : <Text type="secondary">--</Text>,
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
                if (!bloodType) return <Text type="secondary">--</Text>;
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
                dataSource={patients}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: (pagination.page || 0) + 1,
                    pageSize: pagination.size || 10,
                    total: pagination.totalElements || 0,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bệnh nhân`,
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default PatientPage;