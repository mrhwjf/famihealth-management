import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Card, Statistic, List, Tag, Typography, Avatar, Timeline, Empty } from 'antd';
import { CalendarOutlined, TeamOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { searchAppointments } from '../../../services/appointmentsService.js';
import { getLatestVerification } from '../../../services/doctorsService.js';

const { Title, Text } = Typography;

function getCurrentUserId() {
    try { const v = Number(sessionStorage.getItem('currentUserId')); return Number.isFinite(v) ? v : undefined; } catch { return undefined; }
}


const DoctorDashboard = () => {
    const [stats, setStats] = useState({ appointmentsToday: 0, totalPatients: 0, upcomingAppointments: 0, verificationStatus: 'PENDING' });
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const doctorId = getCurrentUserId();
        const today = dayjs();
        const startDate = today.format('YYYY-MM-DD');
        const endDate = today.format('YYYY-MM-DD');

        async function load() {
            try {
                setLoading(true);
                // 1) Total patients: derive unique patientIds from upcoming window
                // We fetch a larger range (last 30 days + next 30 days) and count unique patientIds
                const rangeStart = today.subtract(30, 'day').format('YYYY-MM-DD');
                const rangeEnd = today.add(30, 'day').format('YYYY-MM-DD');
                const patientsSourceResp = await searchAppointments({
                    pageable: { page: 0, size: 1000, sort: ['appointmentDatetime,DESC'] },
                    filters: { doctorId, startDate: rangeStart, endDate: rangeEnd },
                    headerName: 'X-Session-Id',
                });
                const patientsSourcePayload = patientsSourceResp?.data || patientsSourceResp || {};
                const patientRows = Array.isArray(patientsSourcePayload.items) ? patientsSourcePayload.items : (Array.isArray(patientsSourcePayload.content) ? patientsSourcePayload.content : []);
                const uniquePatientIds = new Set();
                patientRows.forEach(r => { if (r.patientId) uniquePatientIds.add(r.patientId); });
                const totalPatients = uniquePatientIds.size;
                // 2) Today's appointments for this doctor
                const resp = await searchAppointments({
                    pageable: { page: 0, size: 20, sort: ['appointmentDatetime,ASC'] },
                    filters: { doctorId, startDate, endDate },
                    headerName: 'X-Session-Id',
                });
                const payload = resp?.data || resp || {};
                const rows = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload.content) ? payload.content : []);
                let mapped = rows.map(a => ({
                    id: a.id,
                    time: a.appointmentDatetime ?? a.appointment_datetime,
                    patientName: a.patient ?? a.patientName ?? a.patient_name,
                    status: a.status,
                }));
                // Mock today appointments if empty
                if (!mapped || mapped.length === 0) {
                    mapped = [
                        { id: 1001, time: `${startDate}T09:00:00`, patientName: 'Nguyễn Văn A', status: 'SCHEDULED' },
                        { id: 1002, time: `${startDate}T14:30:00`, patientName: 'Nguyễn Văn B', status: 'SCHEDULED' },
                    ];
                }
                setTodaysAppointments(mapped);
                const appointmentsToday = mapped.length;
                // 3) Upcoming appointments next 7 days
                const next7Start = today.format('YYYY-MM-DD');
                const next7End = today.add(7, 'day').format('YYYY-MM-DD');
                const nextResp = await searchAppointments({
                    pageable: { page: 0, size: 100, sort: ['appointmentDatetime,ASC'] },
                    filters: { doctorId, startDate: next7Start, endDate: next7End },
                    headerName: 'X-Session-Id',
                });
                const nextPayload = nextResp?.data || nextResp || {};
                const nextRows = Array.isArray(nextPayload.items) ? nextPayload.items : (Array.isArray(nextPayload.content) ? nextPayload.content : []);
                let upcomingAppointments = nextRows.length;
                if (!upcomingAppointments || upcomingAppointments === 0) {
                    // Mock upcoming count
                    upcomingAppointments = 3;
                }
                // 4) Verification status via doctorsService
                let verificationStatus = 'PENDING';
                try {
                    const verResp = await getLatestVerification({ doctorId, headerName: 'X-Session-Id' });
                    const ver = verResp?.data || verResp || {};
                    verificationStatus = ver.status || ver.verificationStatus || verificationStatus;
                } catch (err) {
                    console.warn('Verification status load failed:', err);
                }
                // If totalPatients is 0, mock from patient names used elsewhere
                const mockedTotalPatients = totalPatients && totalPatients > 0 ? totalPatients : 2;
                setStats({ appointmentsToday, totalPatients: mockedTotalPatients, upcomingAppointments, verificationStatus });
                // 3) Recent activity (optional): reuse latest appointments as placeholder if no dedicated API
                setRecentActivity(mapped.slice(0, 5).map(m => ({ id: m.id, patientName: m.patientName, date: dayjs(m.time).format('YYYY-MM-DD'), diagnosis: '' })));
            } catch (e) {
                console.warn('Dashboard load failed:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
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