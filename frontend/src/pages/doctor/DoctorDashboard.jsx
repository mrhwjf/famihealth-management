import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Card, Statistic, List, Tag, Typography, Avatar, Timeline, Empty } from 'antd';
import { CalendarOutlined, TeamOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP CHO TRANG DASHBOARD ---
const mockDoctorStats = {
    appointmentsToday: 5,
    totalPatients: 82,
    upcomingAppointments: 12,
    verificationStatus: 'APPROVED' // PENDING, APPROVED, REJECTED
};

const mockTodaysAppointments = [
    { id: 1, time: '2025-10-17T09:00:00', patientName: 'Nguyễn Thị Bích', status: 'COMPLETED' },
    { id: 2, time: '2025-10-17T10:30:00', patientName: 'Lê Thu Trang', status: 'SCHEDULED' },
    { id: 3, time: '2025-10-17T11:00:00', patientName: 'Nguyễn Văn Hùng', status: 'SCHEDULED' },
    { id: 4, time: '2025-10-17T14:00:00', patientName: 'Trần Minh Anh', status: 'SCHEDULED' },
    { id: 5, time: '2025-10-17T15:30:00', patientName: 'Phạm Gia Hân', status: 'CANCELLED' },
];

const mockRecentActivity = [
    { id: 101, patientName: 'Lê Thu Trang', date: '2025-10-16', diagnosis: 'Chẩn đoán: Viêm họng cấp' },
    { id: 102, patientName: 'Nguyễn Thị Bích', date: '2025-10-16', diagnosis: 'Kê đơn thuốc Paracetamol' },
    { id: 103, patientName: 'Phạm Gia Hân', date: '2025-10-15', diagnosis: 'Chẩn đoán: Cảm cúm thông thường' },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---


const DoctorDashboard = () => {
    const [stats, setStats] = useState({ appointmentsToday: 0, totalPatients: 0, upcomingAppointments: 0, verificationStatus: 'PENDING' });
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // *** Giả lập gọi API để lấy tất cả dữ liệu cho dashboard ***
        // Simulate small delay
        const t = setTimeout(() => {
            setStats(mockDoctorStats);
            setTodaysAppointments(mockTodaysAppointments);
            setRecentActivity(mockRecentActivity);
            setLoading(false);
        }, 300);
        return () => clearTimeout(t);
    }, []);

    const statusMap = useMemo(() => ({
        COMPLETED: { color: 'green', label: 'Hoàn thành' },
        SCHEDULED: { color: 'blue', label: 'Đã lên lịch' },
        CANCELLED: { color: 'red', label: 'Đã hủy' }
    }), []);

    const getStatusTag = useCallback((status) => {
        const s = statusMap[status];
        if (s) return <Tag color={s.color}>{s.label}</Tag>;
        return <Tag>{status || '--'}</Tag>;
    }, [statusMap]);

    return (
        <div>
            <Title level={2}>Bảng điều khiển</Title>
            
            {/* Hàng chứa các thẻ thống kê */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Cuộc hẹn hôm nay" value={stats.appointmentsToday || 0} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Tổng số Bệnh nhân" value={stats.totalPatients || 0} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Lịch hẹn sắp tới" value={stats.upcomingAppointments || 0} suffix="/ 7 ngày" prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Title level={5}>Trạng thái Hồ sơ</Title>
                        <Tag icon={<CheckCircleOutlined />} color={stats.verificationStatus === 'APPROVED' ? 'success' : 'orange'} style={{ fontSize: '16px', padding: '5px 10px' }}>
                            {stats.verificationStatus === 'APPROVED' ? 'Đã xác thực' : stats.verificationStatus === 'REJECTED' ? 'Bị từ chối' : 'Chờ duyệt'}
                        </Tag>
                    </Card>
                </Col>
            </Row>

            {/* Hàng chứa danh sách cuộc hẹn và hoạt động gần đây */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Lịch hẹn hôm nay">
                        <List
                            loading={loading}
                            locale={{ emptyText: <Empty description="Không có lịch hôm nay" /> }}
                            itemLayout="horizontal"
                            dataSource={todaysAppointments}
                            renderItem={useCallback((item) => {
                                const time = item.time && dayjs(item.time).isValid() ? dayjs(item.time).format('HH:mm') : '--';
                                return (
                                    <List.Item
                                        key={item.id}
                                        actions={[getStatusTag(item.status)]}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => console.log('Open appointment', item.id)}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={<Text strong>{item.patientName}</Text>}
                                            description={`Thời gian: ${time}`}
                                        />
                                    </List.Item>
                                );
                            }, [getStatusTag])}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Hoạt động gần đây">
                        {recentActivity && recentActivity.length > 0 ? (
                            <Timeline>
                                {recentActivity.map(activity => (
                                    <Timeline.Item key={activity.id}>
                                        <Text strong>{activity.patientName}</Text>
                                        <Text type="secondary" style={{ display: 'block' }}>{activity.date ? dayjs(activity.date).format('DD/MM/YYYY') : '--'}</Text>
                                        <Text>{activity.diagnosis}</Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <Empty description="Không có hoạt động gần đây" />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DoctorDashboard;