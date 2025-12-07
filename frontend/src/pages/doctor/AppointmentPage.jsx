import React, { useState, useEffect, useCallback } from 'react';
import { Table, Modal, Typography, Button, Form, Select, DatePicker, Input, Row, Col, message, Tag, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { searchAppointments, createAppointment, updateAppointment, deleteAppointment, completeAppointment } from '../../../services/appointmentsService.js';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi'); // Set locale to Vietnamese for dates

const { Title, Text } = Typography;
const { TextArea } = Input;

// Status map theo SQL
const STATUS_LABEL = {
    PENDING: 'Chờ xử lý',
    SCHEDULED: 'Đã lên lịch',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn thành',
};


const AppointmentPage = () => {
        const [appointments, setAppointments] = useState([]);
        const [loading, setLoading] = useState(false);
        const [page, setPage] = useState({ page: 0, size: 10, totalElements: 0 });
        // Backend expects entity property names for sort (camelCase)
        const [sort, setSort] = useState(['appointmentDatetime,DESC']);
        const [formVisible, setFormVisible] = useState(false);
        const [detailVisible, setDetailVisible] = useState(false);
        const [editing, setEditing] = useState(null);
        const [form] = Form.useForm();

        // Filters UI state
        const [dateRange, setDateRange] = useState(null); // [startDayjs, endDayjs]
        const [statusFilter, setStatusFilter] = useState();
        const [currentFilters, setCurrentFilters] = useState({});

        const getCurrentUserId = () => {
            const raw = sessionStorage.getItem('currentUserId');
            const n = Number(raw);
            return Number.isFinite(n) ? n : undefined;
        };

        const fetchAppointments = useCallback(async (p = page.page, s = page.size, sortBy = sort, filters = {}) => {
            try {
                setLoading(true);
            const resp = await searchAppointments({ pageable: { page: p, size: s, sort: sortBy }, filters, headerName: 'X-Session-Id' });
                const payload = resp?.data || { items: [], content: [], page: 0, size: s, totalElements: 0 };
                const rows = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload.content) ? payload.content : []);
                const mapped = rows.map(a => ({
                    id: a.id,
                    patient_id: a.patientId ?? a.patient_id,
                    doctor_id: a.doctorId ?? a.doctor_id,
                    issuer_id: a.issuerId ?? a.issuer_id,
                    appointment_datetime: a.appointmentDatetime ?? a.appointment_datetime,
                    reason: a.reason ?? '',
                    status: a.status,
                    notes: a.notes ?? '',
                    // Swagger shows 'patient' as display name; prefer that
                    patient_name: a.patient ?? a.patientName ?? a.patient_name,
                }));
                setAppointments(mapped);
                setPage({ page: payload.page ?? payload.number ?? p, size: payload.size ?? s, totalElements: payload.totalElements ?? mapped.length });
            } catch (e) {
                message.error(e?.message || 'Không tải được danh sách lịch hẹn');
                setAppointments([]);
                setPage({ page: p, size: s, totalElements: 0 });
            } finally {
                setLoading(false);
            }
        }, [page.page, page.size, sort]);

        useEffect(() => {
            // Default very wide date range because backend may require it
            const startDate = '1900-01-01';
            const endDate = '2100-12-31';
            const filters = { doctorId: getCurrentUserId(), startDate, endDate };
            setCurrentFilters(filters);
            fetchAppointments(0, page.size, sort, filters);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const openAddModal = () => {
            setEditing(null);
            form.resetFields();
            setFormVisible(true);
        };

        const openEditModal = (record) => {
            setEditing(record);
            form.setFieldsValue({
                patient_id: record.patient_id,
                appointment_datetime: record.appointment_datetime ? dayjs(record.appointment_datetime) : null,
                reason: record.reason,
                notes: record.notes,
                status: record.status,
            });
            setFormVisible(true);
        };

        const handleFormOk = async () => {
            try {
                const values = await form.validateFields();
                const payload = {
                    patientId: values.patient_id,
                    appointmentDatetime: values.appointment_datetime?.toISOString(),
                    reason: values.reason,
                    notes: values.notes,
                    status: values.status || 'PENDING',
                };
                setLoading(true);
                if (editing) {
                    await updateAppointment({ appointmentId: editing.id, data: payload, headerName: 'X-Session-Id' });
                    message.success('Cập nhật lịch hẹn thành công');
                } else {
                    await createAppointment({ data: payload, headerName: 'X-Session-Id' });
                    message.success('Tạo lịch hẹn mới thành công');
                }
                setFormVisible(false);
                fetchAppointments(page.page, page.size, sort);
            } catch (e) {
                message.error(e?.message || 'Lưu lịch hẹn thất bại');
            } finally {
                setLoading(false);
            }
        };

        const handleDelete = async (record) => {
            try {
                setLoading(true);
                await deleteAppointment({ appointmentId: record.id, headerName: 'X-Session-Id' });
                message.success('Đã xoá lịch hẹn');
                fetchAppointments(page.page, page.size, sort);
            } catch (e) {
                message.error(e?.message || 'Xoá lịch hẹn thất bại');
            } finally {
                setLoading(false);
            }
        };

        const handleComplete = async (record) => {
            try {
                setLoading(true);
                await completeAppointment({ appointmentId: record.id, headerName: 'X-Session-Id' });
                message.success('Đã đánh dấu hoàn tất lịch hẹn');
                fetchAppointments(page.page, page.size, sort);
            } catch (e) {
                message.error(e?.message || 'Đánh dấu hoàn tất thất bại');
            } finally {
                setLoading(false);
            }
        };

    const columns = [
      { title: 'Bệnh nhân', dataIndex: 'patient_name', key: 'patient_name' },
    { title: 'Thời gian', dataIndex: 'appointment_datetime', key: 'appointment_datetime', render: (v) => v ? dayjs(v).format('HH:mm, DD/MM/YYYY') : '-' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s) => <Tag>{STATUS_LABEL[s] || s}</Tag> },
      { title: 'Thao tác', key: 'action', render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => { setDetailVisible(true); setEditing(record); }}>Chi tiết</Button>
          <Button size="small" onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm title="Xoá lịch hẹn này?" onConfirm={() => handleDelete(record)}>
            <Button size="small" danger>Xoá</Button>
          </Popconfirm>
          <Button size="small" onClick={() => handleComplete(record)}>Hoàn tất</Button>
        </Space>
      ) },
    ];

    return (
        <div>
                        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                                <Col>
                                        <Title level={2}>Cuộc hẹn</Title>
                                </Col>
                                <Col>
                                        <Space>
                                            <DatePicker.RangePicker
                                                allowClear
                                                value={dateRange}
                                                onChange={(val) => setDateRange(val)}
                                                format="YYYY-MM-DD"
                                            />
                                            <Select
                                                allowClear
                                                placeholder="Trạng thái"
                                                style={{ width: 160 }}
                                                value={statusFilter}
                                                onChange={setStatusFilter}
                                                options={[
                                                    { label: STATUS_LABEL.PENDING, value: 'PENDING' },
                                                    { label: STATUS_LABEL.SCHEDULED, value: 'SCHEDULED' },
                                                    { label: STATUS_LABEL.CANCELLED, value: 'CANCELLED' },
                                                    { label: STATUS_LABEL.COMPLETED, value: 'COMPLETED' },
                                                ]}
                                            />
                                            <Button
                                                onClick={() => {
                                                    const startDate = dateRange?.[0]?.format('YYYY-MM-DD') || '1900-01-01';
                                                    const endDate = dateRange?.[1]?.format('YYYY-MM-DD') || '2100-12-31';
                                                    const filters = {
                                                        doctorId: getCurrentUserId(),
                                                        startDate,
                                                        endDate,
                                                    };
                                                    if (statusFilter) filters.status = statusFilter;
                                                    setCurrentFilters(filters);
                                                    fetchAppointments(0, page.size, sort, filters);
                                                }}
                                            >
                                                Lọc
                                            </Button>
                                            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>Thêm lịch hẹn mới</Button>
                                        </Space>
                                </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={appointments}
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                current: (page.page || 0) + 1,
                                pageSize: page.size || 10,
                                total: page.totalElements || 0,
                                onChange: (p, ps) => {
                                    fetchAppointments(p - 1, ps, sort);
                                },
                            }}
                            onChange={(pagination, filters, sorter) => {
                                if (sorter && sorter.field) {
                                    const dir = sorter.order === 'ascend' ? 'ASC' : 'DESC';
                                    // Map UI field to backend property name
                                    let field = sorter.field;
                                    if (field === 'appointment_datetime') field = 'appointmentDatetime';
                                    if (field === 'patient_name') field = 'patientName';
                                    const s = [`${field},${dir}`];
                                    setSort(s);
                                    fetchAppointments((pagination.current || 1) - 1, pagination.pageSize || page.size, s, currentFilters);
                                }
                            }}
                        />

                        <Modal
                            title="Chi tiết cuộc hẹn"
                            open={detailVisible}
                            onCancel={() => { setDetailVisible(false); setEditing(null); }}
                            footer={[<Button key="close" onClick={() => { setDetailVisible(false); setEditing(null); }}>Đóng</Button>]}
                        >
                            {editing && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <Text><strong>Bệnh nhân:</strong> {editing.patient_name || editing.patient_id}</Text>
                                    <Text><strong>Thời gian:</strong> {editing.appointment_datetime ? dayjs(editing.appointment_datetime).format('HH:mm, dddd, DD/MM/YYYY') : '--'}</Text>
                                    <Text><strong>Lý do:</strong> {editing.reason || <Text type="secondary">--</Text>}</Text>
                                    <Text><strong>Ghi chú:</strong> {editing.notes || <Text type="secondary">--</Text>}</Text>
                                    <div>
                                        <Text strong>Trạng thái: </Text>
                                        <Tag>{STATUS_LABEL[editing.status] || editing.status}</Tag>
                                    </div>
                                </div>
                            )}
                        </Modal>
            
                        <Modal
                            title={editing ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn mới'}
                            open={formVisible}
                            onOk={handleFormOk}
                            onCancel={() => setFormVisible(false)}
                            okText={editing ? 'Lưu' : 'Tạo'}
                            cancelText="Hủy"
                            confirmLoading={loading}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item name="patient_id" label="Bệnh nhân" rules={[{ required: true }]}> 
                                    {/* TODO: thay bằng options từ getAppointmentFormData nếu backend cung cấp */}
                                    <Input placeholder="Nhập ID bệnh nhân" />
                                </Form.Item>
                                <Form.Item name="appointment_datetime" label="Thời gian" rules={[{ required: true }]}>
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name="reason" label="Lý do">
                                    <Input />
                                </Form.Item>
                                <Form.Item name="notes" label="Ghi chú">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                                <Form.Item name="status" label="Trạng thái">
                                    <Select options={[
                                        { label: STATUS_LABEL.PENDING, value: 'PENDING' },
                                        { label: STATUS_LABEL.SCHEDULED, value: 'SCHEDULED' },
                                        { label: STATUS_LABEL.CANCELLED, value: 'CANCELLED' },
                                        { label: STATUS_LABEL.COMPLETED, value: 'COMPLETED' },
                                    ]} />
                                </Form.Item>
                            </Form>
                        </Modal>
        </div>
    );
};

export default AppointmentPage;