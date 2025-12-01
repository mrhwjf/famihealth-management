import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, Badge, Modal, Typography, Button, Form, Select, DatePicker, Input, Row, Col, Alert, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi'); // Set locale to Vietnamese for dates

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- DỮ LIỆU GIẢ LẬP THEO ĐÚNG CẤU TRÚC DATABASE ---
const mockAppointments = [
  {
    id: 1,
    patient_id: 401,
    patient_name: 'Nguyễn Thị Bích',
    doctor_id: 202,
    appointment_datetime: '2025-10-20T10:00:00',
    location: 'Phòng khám A, Bệnh viện Y Dược',
    status: 'APPOINTED',
    notes: 'Tái khám định kỳ.',
  },
  {
    id: 2,
    patient_id: 403,
    patient_name: 'Lê Thu Trang',
    doctor_id: 202,
    appointment_datetime: '2025-10-20T14:30:00',
    location: 'Online - Video Call',
    status: 'COMPLETED',
    notes: 'Tư vấn về kết quả xét nghiệm.',
  },
  {
    id: 3,
    patient_id: 401,
    patient_name: 'Nguyễn Thị Bích',
    doctor_id: 202,
    appointment_datetime: '2025-10-22T09:00:00',
    location: 'Phòng khám A, Bệnh viện Y Dược',
    status: 'CANCELLED',
    notes: 'Bệnh nhân báo bận, đã hủy.',
  },
];

// Giả lập danh sách bệnh nhân của bác sĩ này
const mockPatients = [
    { id: 401, name: 'Nguyễn Thị Bích' },
    { id: 403, name: 'Lê Thu Trang' },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---


const AppointmentPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [addForm] = Form.useForm();

    const statusColorMap = useMemo(() => ({
        SCHEDULED: 'processing',
        APPOINTED: 'processing',
        COMPLETED: 'success',
        CANCELLED: 'error'
    }), []);

    const statusLabelMap = useMemo(() => ({
        SCHEDULED: 'Đã lên lịch',
        APPOINTED: 'Hẹn',
        COMPLETED: 'Hoàn thành',
        CANCELLED: 'Đã hủy'
    }), []);

    useEffect(() => {
        // Giả lập fetch data
        setAppointments(mockAppointments);
    }, []);

    const handleShowDetail = useCallback((appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailModalVisible(true);
    }, []);

    const handleAddOk = () => {
        addForm.validateFields().then(values => {
            const patient = mockPatients.find(p => p.id === values.patient_id);
            const newAppointment = {
                id: Date.now(),
                ...values,
                appointment_datetime: values.appointment_datetime.toISOString(),
                patient_name: patient.name,
                status: 'SCHEDULED'
            };
            setAppointments(prev => [...prev, newAppointment]);
            message.success('Tạo lịch hẹn mới thành công!');
            setIsAddModalVisible(false);
            addForm.resetFields();
        });
    };

    // Hàm render các cuộc hẹn trên từng ngày của lịch
    const dateCellRender = useCallback((value) => {
        const dateStr = value.format('YYYY-MM-DD');
        const listData = appointments.filter(app => dayjs(app.appointment_datetime).format('YYYY-MM-DD') === dateStr);

        return (
            <ul className="events" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {listData.map(item => {
                    const statusColor = statusColorMap[item.status] || 'default';
                    const time = item.appointment_datetime ? dayjs(item.appointment_datetime).format('HH:mm') : '';
                    // Use a button (link style) for accessibility (keyboard focusable)
                    return (
                        <li key={item.id} style={{ marginBottom: 6 }}>
                            <Button
                                type="link"
                                onClick={() => handleShowDetail(item)}
                                style={{ padding: 0 }}
                                aria-label={`Mở chi tiết cuộc hẹn ${item.patient_name} lúc ${time}`}
                            >
                                <Badge status={statusColor} text={`${time} - ${item.patient_name}`} />
                            </Button>
                        </li>
                    )
                })}
            </ul>
        );
    }, [appointments, handleShowDetail, statusColorMap]);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2}>Lịch làm việc</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
                        Thêm lịch hẹn mới
                    </Button>
                </Col>
            </Row>

            <Calendar dateCellRender={dateCellRender} />

            {/* Modal xem chi tiết cuộc hẹn */}
            <Modal
                title="Chi tiết cuộc hẹn"
                visible={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>]}
            >
                {selectedAppointment && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Text><strong>Bệnh nhân:</strong> {selectedAppointment.patient_name}</Text>
                        <Text><strong>Thời gian:</strong> {selectedAppointment.appointment_datetime ? dayjs(selectedAppointment.appointment_datetime).format('HH:mm, dddd, DD/MM/YYYY') : '--'}</Text>
                        <Text><strong>Địa điểm:</strong> {selectedAppointment.location}</Text>
                        <Text><strong>Ghi chú:</strong> {selectedAppointment.notes || <Text type="secondary">--</Text>}</Text>
                        <div>
                            <Text strong>Trạng thái: </Text>
                            <Tag color={statusColorMap[selectedAppointment.status] === 'processing' ? 'blue' : undefined}>
                                {statusLabelMap[selectedAppointment.status] || selectedAppointment.status}
                            </Tag>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Modal thêm cuộc hẹn mới */}
            <Modal
                title="Thêm lịch hẹn mới"
                visible={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={() => setIsAddModalVisible(false)}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form form={addForm} layout="vertical">
                    <Form.Item name="patient_id" label="Bệnh nhân" rules={[{ required: true }]}>
                        <Select options={mockPatients.map(p => ({ label: p.name, value: p.id }))} />
                    </Form.Item>
                    <Form.Item name="appointment_datetime" label="Thời gian" rules={[{ required: true }]}>
                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }}/>
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="notes" label="Ghi chú">
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AppointmentPage;