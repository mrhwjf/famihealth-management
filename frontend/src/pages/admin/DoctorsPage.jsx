import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Avatar, Tag, Switch, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import rejectDoctorVerification from '../../../services/doctor-verifications/rejectService.js';
import approveDoctorVerification from '../../../services/doctor-verifications/approveService.js';
import getDoctorVerificationHistory from '../../../services/doctor-verifications/historyService.js';
import getRejectedVerifications from '../../../services/doctor-verifications/rejected.js';
import getPendingVerifications from '../../../services/doctor-verifications/pending.js';
import { searchUsers, getUserFilterOptions, getUserById, getUserCreateFormData, updateUserById } from '../../../services/usersService.js';
import { createDoctor } from '../../../services/doctorsService.js';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;


const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctorsPage, setDoctorsPage] = useState({ page: 0, size: 10, totalElements: 0 });
    const [doctorsSort, setDoctorsSort] = useState(['id,DESC']);
    const [doctorRoleId, setDoctorRoleId] = useState(null);
    
    // State cho modal Sửa thông tin cơ bản
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    
    // State cho modal Xác thực
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const [verifyingDoctor, setVerifyingDoctor] = useState(null);

    // MỚI: State cho modal Thêm mới
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const [editForm] = Form.useForm();
    const [verificationForm] = Form.useForm();
    const [addForm] = Form.useForm(); // MỚI: Form cho việc thêm mới
    const [history, setHistory] = useState({ items: [], page: 0, size: 0, totalElements: 0 });
    const [historyLoading, setHistoryLoading] = useState(false);
    const [rejected, setRejected] = useState({ items: [], page: 0, size: 10, totalElements: 0 });
    const [rejectedLoading, setRejectedLoading] = useState(false);
    const [rejectedSort, setRejectedSort] = useState(['reviewedAt,DESC']);
    // Pending list state
    const [pending, setPending] = useState({ items: [], page: 0, size: 10, totalElements: 0 });
    const [pendingLoading, setPendingLoading] = useState(false);
    const [pendingSort, setPendingSort] = useState(['submittedAt,DESC']);
    // Options cho facility & specialization
    const [facilityOptions, setFacilityOptions] = useState([]);
    const [specializationOptions, setSpecializationOptions] = useState([]);

    // Mở xem chứng chỉ trong tab mới qua Google Viewer để tránh trình duyệt tự tải xuống
    const openCertificatePreview = (url) => {
        if (!url) return;
        const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
        const w = window.open(viewerUrl, '_blank', 'noopener,noreferrer');
        if (!w) {
            message.warning('Trình duyệt đang chặn cửa sổ mới. Hãy cho phép pop-up.');
        }
    };

    const fetchPending = async (page = pending.page, size = pending.size, sort = pendingSort) => {
        try {
            setPendingLoading(true);
            const resp = await getPendingVerifications({ page, size, sort, headerName: 'X-Session-Id' });
            const payload = resp?.data || { items: [], page: 0, size: 0, totalElements: 0 };
            setPending(payload);
        } catch (e) {
            setPending({ items: [], page, size, totalElements: 0 });
            message.error(e?.message || 'Không tải được danh sách chờ duyệt');
        } finally {
            setPendingLoading(false);
        }
    };

    const fetchRejected = async (page = rejected.page, size = rejected.size, sort = rejectedSort) => {
        try {
            setRejectedLoading(true);
            const resp = await getRejectedVerifications({ page, size, sort, headerName: 'X-Session-Id' });
            const payload = resp?.data || { items: [], page: 0, size: 0, totalElements: 0 };
            setRejected(payload);
        } catch (e) {
            setRejected({ items: [], page, size, totalElements: 0 });
            message.error(e?.message || 'Không tải được danh sách bị từ chối');
        } finally {
            setRejectedLoading(false);
        }
    };

    const fetchDoctors = async (page = doctorsPage.page, size = doctorsPage.size, sort = doctorsSort) => {
        try {
            setLoading(true);
            const resp = await searchUsers({
                pageable: { page, size, sort },
                // Backend hỗ trợ lọc theo roleId (UserFilterRequest.java). Nếu đã có doctorRoleId thì dùng;
                // nếu chưa, tạm không gửi để fallback lọc client.
                filters: doctorRoleId ? { roleId: doctorRoleId } : {},
                headerName: 'X-Session-Id',
            });
            const payload = resp?.data || { items: [], content: [], page: 0, size: 0, totalElements: 0 };
            // Hỗ trợ cả dạng Spring Page (content) và dạng items
            const rows = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload.content) ? payload.content : []);
            const mappedAll = rows.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                profile_url: u.profileUrl || null,
                is_locked: u.locked,
                // Backend trả về role là string (UserSummaryDto.role)
                role: { name: (u?.role ?? '-') },
                // Map đúng theo swagger: data.doctorProfile.{licenseNumber, certificateFileUrl, verified}
                profile: { 
                    license_number: u?.doctorProfile?.licenseNumber ?? u?.licenseNumber ?? '-', 
                    certificate_file_url: u?.doctorProfile?.certificateFileUrl ?? u?.certificateFileUrl ?? null 
                },
                verification: (u?.doctorProfile?.verified != null)
                    ? { status: u.doctorProfile.verified ? 'APPROVED' : 'PENDING' }
                    : (u.verification || null),
            }));
            // Lọc ở client (thêm an toàn): chỉ giữ những user có role name là 'DOCTOR' (không phân biệt hoa/thường)
            const roleName = (v) => String(v || '').trim().toUpperCase();
            const mapped = mappedAll.filter(d => {
                const rn = roleName(d?.role?.name);
                return rn === 'DOCTOR' || rn.includes('DOCTOR');
            });
            // Nếu danh sách trả về không có doctorProfile (chỉ là summary), gọi API chi tiết để bổ sung license và verified
            const needEnrich = mapped.filter(d => !d.profile.license_number || d.profile.license_number === '-' || d.verification == null);
            if (needEnrich.length > 0) {
                const enriched = await Promise.all(mapped.map(async (d) => {
                    try {
                        const detailResp = await getUserById({ id: d.id, headerName: 'X-Session-Id' });
                        const detail = detailResp?.data || {};
                        const dp = detail.doctorProfile || {};
                        return {
                            ...d,
                            profile: {
                                license_number: dp.licenseNumber ?? d.profile.license_number ?? '-',
                                certificate_file_url: dp.certificateFileUrl ?? d.profile.certificate_file_url ?? null,
                            },
                            verification: (dp.verified != null)
                                ? { status: dp.verified ? 'APPROVED' : 'PENDING' }
                                : d.verification,
                        };
                    } catch {
                        return d;
                    }
                }));
                setDoctors(enriched);
            } else {
                setDoctors(mapped);
            }
            // Cập nhật tổng: ưu tiên giá trị từ server khi đã lọc roleId, ngược lại dùng số lượng sau lọc client
            const total = doctorRoleId && typeof payload.totalElements === 'number' ? payload.totalElements : mapped.length;
            // Hỗ trợ Spring Page: number thay vì page
            const currentPage = (payload.page ?? payload.number ?? 0);
            setDoctorsPage({ page: currentPage, size: payload.size || size, totalElements: total });
        } catch (e) {
            setDoctors([]);
            setDoctorsPage({ page, size, totalElements: 0 });
            message.error(e?.message || 'Không tải được danh sách bác sĩ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Lấy roleId cho DOCTOR từ filter-options trước khi tải danh sách
        (async () => {
            try {
                const opts = await getUserFilterOptions({ headerName: 'X-Session-Id' });
                const roles = opts?.data?.roles || opts?.data?.roleOptions || [];
                const doctorRole = roles.find(r => (r?.name === 'DOCTOR' || r === 'DOCTOR' || r?.label === 'DOCTOR'));
                const id = typeof doctorRole === 'object' ? (doctorRole.id ?? doctorRole.value) : null;
                if (id) setDoctorRoleId(id);
            } catch {
                // ignore; sẽ fallback lọc client
            }
        })();
        // Tải danh sách từ DB khi vào trang
        fetchDoctors(0, doctorsPage.size, doctorsSort);
        // Tải danh sách bị từ chối khi vào trang
        fetchRejected(0, rejected.size, rejectedSort);
        // Tải danh sách chờ duyệt khi vào trang
        fetchPending(0, pending.size, pendingSort);
        // Lấy options cho facility & specialization
        (async () => {
            try {
                const res = await getUserCreateFormData({ headerName: 'X-Session-Id' });
                const data = res?.data || {};
                setFacilityOptions(Array.isArray(data.facilities) ? data.facilities : []);
                setSpecializationOptions(Array.isArray(data.specializations) ? data.specializations : []);
            } catch {
                setFacilityOptions([]);
                setSpecializationOptions([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Xử lý cho Modal Thêm mới --- MỚI
    const showAddModal = () => {
        addForm.resetFields();
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleAddOk = () => {
        addForm.validateFields().then(async (values) => {
            try {
                setLoading(true);
                const roleId = doctorRoleId || 2; // fallback nếu chưa lấy được từ filter-options
                const facilityId = values.facilityId ?? null;
                const specializationId = values.specializationId ?? null;
                // Gửi API tạo bác sĩ theo Swagger
                const resp = await createDoctor({
                    user: {
                        roleId,
                        password: values.password,
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        profileUrl: null,
                    },
                    doctorProfile: {
                        facilityId,
                        specializationId,
                        licenseNumber: values.license_number,
                        certificateFileUrl: values.certificate_file_url || null,
                        verified: false,
                    },
                });
                const created = resp?.data || {};
                message.success(`Đã tạo hồ sơ bác sĩ: ${created?.name || values.name}`);
                handleAddCancel();
                // Reload danh sách từ DB để hiển thị bền vững
                await fetchDoctors(0, doctorsPage.size, doctorsSort);
            } catch (e) {
                message.error(e?.message || 'Tạo hồ sơ bác sĩ thất bại');
            } finally {
                setLoading(false);
            }
        });
    };

    // --- Xử lý cho Modal Sửa thông tin ---
    const showEditModal = (doctor) => {
        setEditingDoctor(doctor);
        editForm.setFieldsValue(doctor);
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingDoctor(null);
    };

    const handleEditOk = () => {
        editForm.validateFields().then(async (values) => {
            if (!editingDoctor) return;
            try {
                setLoading(true);
                await updateUserById({
                    id: editingDoctor.id,
                    data: {
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                    },
                    headerName: 'X-Session-Id',
                });

                // Cập nhật lại danh sách trên UI
                setDoctors((prev) => prev.map((d) => (
                    d.id === editingDoctor.id
                        ? { ...d, name: values.name, email: values.email, phone: values.phone }
                        : d
                )));

                message.success(`Cập nhật thông tin cho ${values.name} thành công!`);
                handleEditCancel();
            } catch (e) {
                message.error(e?.message || 'Cập nhật thông tin thất bại');
            } finally {
                setLoading(false);
            }
        });
    };
    
    // --- Xử lý cho Modal Xác thực ---
    const showVerificationModal = (doctor) => {
        setVerifyingDoctor(doctor);
        verificationForm.setFieldsValue({ remarks: doctor?.verification?.remarks });
        setIsVerificationModalVisible(true);
        // Tải lịch sử thẩm định khi mở modal
        (async () => {
            try {
                setHistoryLoading(true);
                const resp = await getDoctorVerificationHistory({ doctorId: doctor.id, page: 0, size: 5 });
                const payload = resp?.data || { items: [], page: 0, size: 0, totalElements: 0 };
                setHistory(payload);
            } catch (e) {
                setHistory({ items: [], page: 0, size: 0, totalElements: 0 });
                message.warning(e?.message || 'Không tải được lịch sử thẩm định');
            } finally {
                setHistoryLoading(false);
            }
        })();
    };

    const handleVerificationCancel = () => {
        setIsVerificationModalVisible(false);
        setVerifyingDoctor(null);
    };

    // Deprecated local simulation (replaced by API handlers)

    const handleRejectViaAPI = async () => {
        try {
            const values = await verificationForm.validateFields();
            if (!verifyingDoctor) return;
            setLoading(true);
            const resp = await rejectDoctorVerification({
                doctorId: verifyingDoctor.id,
                adminId: values.adminId,
                remarks: values.remarks || 'Không có ghi chú',
            });
            // Cập nhật UI sau khi gọi API thành công
            const updatedDoctors = doctors.map(doc =>
                doc.id === verifyingDoctor.id
                    ? { ...doc, verification: { ...doc.verification, status: 'REJECTED', remarks: values.remarks } }
                    : doc
            );
            setDoctors(updatedDoctors);
            message.success(resp?.message || `Đã từ chối hồ sơ của bác sĩ ${verifyingDoctor.name}.`);
            handleVerificationCancel();
        } catch (e) {
            message.error(e?.message || 'Từ chối hồ sơ thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLock = (doctorId, currentLockStatus) => {
        message.success(currentLockStatus ? 'Mở khóa tài khoản thành công!' : 'Khóa tài khoản thành công!');
    };

    const handleApproveViaAPI = async () => {
        try {
            const values = await verificationForm.validateFields();
            if (!verifyingDoctor) return;
            setLoading(true);
            const resp = await approveDoctorVerification({
                doctorId: verifyingDoctor.id,
                adminId: values.adminId,
                remarks: values.remarks || '',
            });
            const updatedDoctors = doctors.map(doc =>
                doc.id === verifyingDoctor.id
                    ? { ...doc, verification: { ...doc.verification, status: 'APPROVED', remarks: values.remarks } }
                    : doc
            );
            setDoctors(updatedDoctors);
            message.success(resp?.message || `Đã phê duyệt hồ sơ của bác sĩ ${verifyingDoctor.name}.`);
            handleVerificationCancel();
        } catch (e) {
            message.error(e?.message || 'Phê duyệt hồ sơ thất bại');
        } finally {
            setLoading(false);
        }
    };

    // (Code cho columns và render không thay đổi)
    const columns = [
        {
            title: 'Bác sĩ',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.profile_url} icon={<UserOutlined />} />
                    <span>{record.name}</span>
                </Space>
            ),
        },
        {
            title: 'Thông tin liên hệ',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <Text>{record.email}</Text><br/>
                    <Text type="secondary">{record.phone}</Text>
                </div>
            ),
        },
        {
            title: 'Số giấy phép',
            key: 'license',
            render: (_, record) => (record?.profile?.license_number || '-'),
        },
        {
            title: 'Trạng thái xác thực',
            key: 'verification_status',
            render: (_, record) => {
                const status = record?.verification?.status;
                const colors = { PENDING: 'orange', APPROVED: 'green', REJECTED: 'red' };
                const label = status || '-';
                return <Tag color={colors[status]}>{label}</Tag>;
            },
        },
        {
            title: 'Tài khoản',
            dataIndex: 'is_locked',
            key: 'account_status',
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
                <Space>
                    <Tooltip title="Xem & Duyệt hồ sơ">
                        <Button
                            icon={<EyeOutlined style={{ color: (record?.verification?.status) === 'PENDING' ? '#fff' : undefined }} />}
                            onClick={() => showVerificationModal(record)}
                            type={(record?.verification?.status) === 'PENDING' ? 'primary' : 'default'}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa thông tin cơ bản">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* MỚI: Modal để thêm bác sĩ */}
            <Modal
                title="Thêm hồ sơ bác sĩ mới"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                confirmLoading={loading}
                destroyOnClose
            >
                <Form form={addForm} layout="vertical" name="addDoctorForm">
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu ban đầu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                        <Input.Password placeholder="Bác sĩ sẽ đổi lại sau khi đăng nhập" />
                    </Form.Item>
                    <Form.Item name="facilityId" label="Cơ sở y tế" rules={[{ required: true, message: 'Vui lòng chọn cơ sở y tế' }]}>
                        <select style={{ width: '100%', padding: '6px 8px' }}>
                            <option value="">-- Chọn cơ sở --</option>
                            {facilityOptions.map((f) => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </Form.Item>
                    <Form.Item name="specializationId" label="Chuyên khoa" rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}>
                        <select style={{ width: '100%', padding: '6px 8px' }}>
                            <option value="">-- Chọn chuyên khoa --</option>
                            {specializationOptions.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </Form.Item>
                    <Form.Item name="license_number" label="Số giấy phép hành nghề" rules={[{ required: true, message: 'Vui lòng nhập số giấy phép' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="certificate_file_url" label="URL đến tệp chứng chỉ" rules={[{ required: true, message: 'Vui lòng nhập URL chứng chỉ (không được để trống)' }] }>
                        <Input placeholder="https://example.com/path/to/cert.pdf"/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal để sửa thông tin cơ bản */}
            <Modal
                title={`Sửa thông tin cho ${editingDoctor?.name}`}
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item name="name" label="Họ và tên"><Input /></Form.Item>
                    <Form.Item name="email" label="Email"><Input /></Form.Item>
                    <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
                </Form>
            </Modal>

            {/* Modal để xem và xác thực hồ sơ */}
            <Modal
                title={`Hồ sơ xác thực của ${verifyingDoctor?.name}`}
                open={isVerificationModalVisible}
                onCancel={handleVerificationCancel}
                width={600}
                footer={[
                    <Button key="back" onClick={handleVerificationCancel}>Hủy</Button>,
                    <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={handleRejectViaAPI}>Từ chối</Button>,
                    <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={handleApproveViaAPI}>Phê duyệt</Button>,
                ]}
            >
                {verifyingDoctor && (
                    <>
                                 <Paragraph><strong>Số giấy phép:</strong> {verifyingDoctor?.profile?.license_number || '-'}</Paragraph>
                                 <Paragraph><strong>Tệp chứng chỉ:</strong> {verifyingDoctor?.profile?.certificate_file_url ? (
                                     <Button type="link" style={{ padding: 0 }} onClick={() => openCertificatePreview(verifyingDoctor.profile.certificate_file_url)}>
                                         Xem tệp đính kèm
                                     </Button>
                                 ) : (
                                     '-' 
                                 )}
                                 </Paragraph>
                        <Form form={verificationForm} layout="vertical">
                            <Form.Item name="adminId" label="Mã quản trị viên" rules={[{ required: true, message: 'Vui lòng nhập adminId' }]}>
                                <Input placeholder="Ví dụ: 5" />
                            </Form.Item>
                            <Form.Item name="remarks" label="Ghi chú của quản trị viên" rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}>
                                <TextArea rows={4} placeholder="Thêm ghi chú về quá trình xác thực..."/>
                            </Form.Item>
                        </Form>
                        <div style={{ marginTop: 16 }}>
                            <Typography.Title level={5} style={{ marginBottom: 8 }}>Lịch sử thẩm định</Typography.Title>
                            <Table
                                size="small"
                                loading={historyLoading}
                                dataSource={(history.items || []).map((it, idx) => ({ key: idx, ...it }))}
                                pagination={false}
                                columns={[
                                    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
                                    { title: 'Quản trị', dataIndex: 'adminName', key: 'adminName' },
                                    { title: 'Gửi lúc', dataIndex: 'submittedAt', key: 'submittedAt' },
                                    { title: 'Duyệt lúc', dataIndex: 'reviewedAt', key: 'reviewedAt' },
                                    { title: 'Ghi chú', dataIndex: 'remarks', key: 'remarks' },
                                ]}
                            />
                        </div>
                    </>
                )}
            </Modal>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginRight: 8 }}>
                        Thêm bác sĩ
                    </Button>
                    <Button onClick={() => fetchRejected(0, rejected.size, rejectedSort)}>
                        Tải hồ sơ bị từ chối
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => fetchPending(0, pending.size, pendingSort)}>
                        Tải hồ sơ chờ duyệt
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={doctors}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: (doctorsPage.page || 0) + 1,
                    pageSize: doctorsPage.size || 10,
                    total: doctorsPage.totalElements || 0,
                    onChange: (page, pageSize) => {
                        fetchDoctors(page - 1, pageSize, doctorsSort);
                    },
                }}
                onChange={(pagination, filters, sorter) => {
                    if (sorter && sorter.field) {
                        const dir = sorter.order === 'ascend' ? 'ASC' : 'DESC';
                        const s = [`${sorter.field},${dir}`];
                        setDoctorsSort(s);
                        fetchDoctors((pagination.current || 1) - 1, pagination.pageSize || doctorsPage.size, s);
                    }
                }}
            />
            <div style={{ marginTop: 16 }}>
                <Typography.Title level={5} style={{ marginBottom: 8 }}>Danh sách hồ sơ bị từ chối</Typography.Title>
                <Table
                    size="small"
                    loading={rejectedLoading}
                    dataSource={(rejected.items || []).map((it, idx) => ({ key: idx, ...it }))}
                    pagination={{
                        current: (rejected.page || 0) + 1,
                        pageSize: rejected.size || 10,
                        total: rejected.totalElements || 0,
                        onChange: (page, pageSize) => {
                            fetchRejected(page - 1, pageSize, rejectedSort);
                        },
                    }}
                    columns={[
                        { title: 'Tên', dataIndex: 'name', key: 'name', sorter: true },
                        { title: 'Email', dataIndex: 'email', key: 'email' },
                        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                        { title: 'Ảnh hồ sơ', dataIndex: 'profileUrl', key: 'profileUrl' },
                        { title: 'Khoá', dataIndex: 'locked', key: 'locked', render: v => (v ? 'Bị khoá' : 'Hoạt động') },
                    ]}
                    onChange={(pagination, filters, sorter) => {
                        if (sorter && sorter.field) {
                            const dir = sorter.order === 'ascend' ? 'ASC' : 'DESC';
                            const s = [`${sorter.field},${dir}`];
                            setRejectedSort(s);
                            fetchRejected((pagination.current || 1) - 1, pagination.pageSize || rejected.size, s);
                        }
                    }}
                />
            </div>
            <div style={{ marginTop: 16 }}>
                <Typography.Title level={5} style={{ marginBottom: 8 }}>Danh sách hồ sơ chờ duyệt</Typography.Title>
                <Table
                    size="small"
                    loading={pendingLoading}
                    dataSource={(pending.items || []).map((it, idx) => ({ key: idx, ...it }))}
                    pagination={{
                        current: (pending.page || 0) + 1,
                        pageSize: pending.size || 10,
                        total: pending.totalElements || 0,
                        onChange: (page, pageSize) => {
                            fetchPending(page - 1, pageSize, pendingSort);
                        },
                    }}
                    columns={[
                        { title: 'Tên', dataIndex: 'name', key: 'name', sorter: true },
                        { title: 'Email', dataIndex: 'email', key: 'email' },
                        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                        { title: 'Ảnh hồ sơ', dataIndex: 'profileUrl', key: 'profileUrl' },
                        { title: 'Khoá', dataIndex: 'locked', key: 'locked', render: v => (v ? 'Bị khoá' : 'Hoạt động') },
                    ]}
                    onChange={(pagination, filters, sorter) => {
                        if (sorter && sorter.field) {
                            const dir = sorter.order === 'ascend' ? 'ASC' : 'DESC';
                            const s = [`${sorter.field},${dir}`];
                            setPendingSort(s);
                            fetchPending((pagination.current || 1) - 1, pagination.pageSize || pending.size, s);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default DoctorsPage;