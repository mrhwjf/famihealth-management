// Appointments.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import {
  Badge,
  Calendar,
  Layout,
  Card,
  Space,
  Button,
  Row,
  Col,
  Modal,
  Form,
  DatePicker,
  Input,
  Select,
  List,
  Typography,
  message,
} from "antd";
import useIsMobile from "../../hooks/useIsMobile";
import { appointmentService } from "../../services/appointmentService";

const { Title, Text } = Typography;
const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

// DEV doctors for testing
const DEV_DOCTORS = [
  { id: 1, name: "Dr. Lê Văn Long" },
  { id: 2, name: "Dr. Trần Thị Hương" },
  { id: 3, name: "Dr. Nguyễn Thị Lan" },
];

const normalizeDoctor = (raw = {}) => {
  const id =
    raw.id ?? raw.doctorId ?? raw.userId ?? raw.user?.id ?? raw.value ?? null;
  const fallback = id ? `Bác sĩ #${id}` : "Bác sĩ";
  const name =
    raw.name ??
    raw.doctorName ??
    raw.fullName ??
    raw.displayName ??
    raw.user?.name ??
    fallback;
  return {
    ...raw,
    id,
    name,
  };
};

const mergeDoctorLists = (primary = [], secondary = []) => {
  const map = new Map();
  [...primary, ...secondary].forEach((doc) => {
    if (!doc || doc.id === undefined || doc.id === null) return;
    const key = String(doc.id);
    if (!map.has(key)) {
      map.set(key, doc);
    }
  });
  return Array.from(map.values());
};

const normalizeFamilyMember = (raw = {}) => {
  const id = raw.id ?? raw.memberId ?? raw.familyMemberId ?? null;
  const name = raw.name ?? raw.fullName ?? raw.displayName ?? "Thành viên";
  return { ...raw, id, name };
};

const normalizeStatus = (raw) => {
  if (!raw && raw !== 0) return null;
  if (typeof raw === "string") {
    return { value: raw, label: raw };
  }
  const value =
    raw.value ??
    raw.code ??
    raw.key ??
    raw.id ??
    raw.status ??
    raw.name ??
    null;
  if (value === null) return null;
  const label = raw.label ?? raw.name ?? raw.displayName ?? String(value);
  return { ...raw, value, label };
};

const STORAGE_PREFIX = "fh-upcoming-appts";
const buildStorageKey = (userId) =>
  `${STORAGE_PREFIX}-${
    userId !== null && userId !== undefined ? String(userId) : "guest"
  }`;

const loadStoredAppointments = (userId) => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(buildStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Không đọc được lịch hẹn từ localStorage:", err);
    return [];
  }
};

const saveStoredAppointments = (userId, items) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      buildStorageKey(userId),
      JSON.stringify(Array.isArray(items) ? items : [])
    );
  } catch (err) {
    console.warn("Không ghi được lịch hẹn vào localStorage:", err);
  }
};

const appointmentIdentity = (item) =>
  String(
    item?.id ??
      item?.localId ??
      `${item?.patientId}-${item?.doctorId}-$
        {item?.appointmentDatetime || item?.appointmentDate || item?.date || ""}
      `
  );

const upsertStoredAppointment = (userId, appointment, limit = 50) => {
  if (!appointment) return;
  const existing = loadStoredAppointments(userId);
  const filtered = existing.filter(
    (item) => appointmentIdentity(item) !== appointmentIdentity(appointment)
  );
  filtered.unshift({
    ...appointment,
    localId: appointment.localId ?? Date.now(),
  });
  saveStoredAppointments(userId, filtered.slice(0, limit));
};

const mergeAppointmentLists = (...lists) => {
  const map = new Map();
  lists
    .flat()
    .filter(Boolean)
    .forEach((item) => {
      const key = appointmentIdentity(item);
      if (!map.has(key)) map.set(key, item);
    });
  return Array.from(map.values());
};

const extractAppointments = (payload) => {
  if (!payload) return [];
  const candidates = [
    payload?.data?.items,
    payload?.data?.data,
    payload?.data,
    payload?.items,
    payload,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

export default function Appointments() {
  const [eventsByDate, setEventsByDate] = useState({});
  const [doctorList, setDoctorList] = useState(
    DEV_DOCTORS.map((doc) => normalizeDoctor(doc))
  );
  const [familyMembers, setFamilyMembers] = useState([]);
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const defaultStatusValue = useMemo(
    () => appointmentStatuses[0]?.value ?? "PENDING",
    [appointmentStatuses]
  );
  const isMobile = useIsMobile();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId =
    sessionStorage.getItem("session_id") ||
    "3d2c4b28-1bed-4aa2-9298-2fcad169182b";
  const rawUserId = sessionStorage.getItem("user_id");
  const currentUserId = rawUserId ? Number(rawUserId) : null;

  // build events map from appointment items - show doctorId only (#<id>)
  const buildEventsMap = (items) => {
    const map = {};
    (items || []).forEach((it) => {
      const dt =
        it.appointmentDatetime || it.appointmentDate || it.date || null;
      const key = dt ? dayjs(dt).format("YYYY-MM-DD") : "_unknown";
      const doctorId = it.doctorId ?? (it.doctor && it.doctor.id) ?? "_";
      const label = it.reason
        ? `${it.reason} · #${doctorId}`
        : `Appointment · #${doctorId}`;
      const type =
        (it.status || "PENDING").toLowerCase() === "pending"
          ? "warning"
          : "success";
      map[key] = map[key] || [];
      map[key].push({
        type,
        content: label,
        source: "appointment",
        meta: it,
      });
    });
    return map;
  };

  useEffect(() => {
    const stored = loadStoredAppointments(currentUserId);
    if (stored.length > 0) {
      setEventsByDate(buildEventsMap(stored));
    }
  }, [currentUserId]);

  // load doctors and upcoming appointments
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [formDataRes, apptRes] = await Promise.all([
          appointmentService
            .getAppointmentFormData(sessionId)
            .catch(() => null),
          appointmentService
            .getAppointments(sessionId, {
              patientId: currentUserId,
              upcoming: true,
            })
            .catch(() => null),
        ]);

        if (mounted && formDataRes) {
          const payload = formDataRes.data ?? formDataRes;
          const members = Array.isArray(payload?.familyMembers)
            ? payload.familyMembers
                .map((m) => normalizeFamilyMember(m))
                .filter((m) => m.id !== null)
            : [];
          const doctors = Array.isArray(payload?.doctors)
            ? payload.doctors
                .map((d) => normalizeDoctor(d))
                .filter((d) => d.id !== null)
            : [];
          const statuses = Array.isArray(payload?.statuses)
            ? payload.statuses
                .map((s) => normalizeStatus(s))
                .filter((s) => s && s.value !== null)
            : [];

          setFamilyMembers(members);
          if (doctors.length > 0) {
            setDoctorList((prev) => mergeDoctorLists(doctors, prev));
          }
          setAppointmentStatuses(statuses);
        }

        if (mounted && apptRes) {
          const serverItems = extractAppointments(apptRes);
          const stored = loadStoredAppointments(currentUserId);
          const merged = mergeAppointmentLists(serverItems, stored);
          setEventsByDate(buildEventsMap(merged));
          saveStoredAppointments(currentUserId, merged);
        }
      } catch (err) {
        console.error("Failed to load appointments/doctors", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [sessionId, currentUserId]);
  useEffect(() => {
    const state = location?.state ?? {};
    if (!state.openModal) return;

    const doctorIdFromNav = state.doctorId ?? null;
    const doctorNameFromNav = state.doctorName ?? "";

    if (doctorIdFromNav) {
      const injected = normalizeDoctor({
        id: doctorIdFromNav,
        name: doctorNameFromNav,
      });
      setDoctorList((prev) => mergeDoctorLists([injected], prev));
    }

    const defaultPatientId = state.patientId ?? familyMembers[0]?.id ?? null;

    form.setFieldsValue({
      patientId: defaultPatientId,
      doctorId:
        doctorIdFromNav ?? (doctorList.length > 0 ? doctorList[0].id : null),
      appointmentDatetime: dayjs().add(1, "day").hour(9).minute(0),
      reason: state.reason ?? "",
      notes: state.notes ?? "",
      status: state.status ?? defaultStatusValue,
    });

    setModalVisible(true);
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location,
    doctorList.length,
    familyMembers.length,
    currentUserId,
    form,
    navigate,
    defaultStatusValue,
  ]);
  const addEvent = ({
    date,
    content,
    type = "warning",
    source = "appointment",
    meta = {},
  }) => {
    const key = dayjs(date).format("YYYY-MM-DD");
    setEventsByDate((prev) => {
      const prevList = prev[key] ? [...prev[key]] : [];
      return { ...prev, [key]: [...prevList, { type, content, source, meta }] };
    });
  };

  useEffect(() => {
    if (!modalVisible) return;
    const currentStatus = form.getFieldValue("status");
    if (!currentStatus && defaultStatusValue) {
      form.setFieldsValue({ status: defaultStatusValue });
    }
  }, [defaultStatusValue, modalVisible, form]);

  // open modal & prefill
  const openAddModal = () => {
    form.resetFields();
    form.setFieldsValue({
      patientId: familyMembers[0]?.id ?? null,
      doctorId: doctorList.length > 0 ? doctorList[0].id : null,
      appointmentDatetime: dayjs().add(1, "day").hour(9).minute(0),
      reason: "",
      notes: "",
      status: defaultStatusValue,
    });
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const defaultStatus = appointmentStatuses[0] || "PENDING";
      const payload = {
        patientId: Number(values.patientId),
        doctorId: Number(values.doctorId),
        appointmentDatetime: dayjs(values.appointmentDatetime).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        reason: values.reason || "",
        notes: values.notes || "",
        status: values.status || defaultStatus,
      };
      console.log(payload);
      setLoading(true);

      let created = null;
      try {
        const res = await appointmentService.createAppointment(
          sessionId,
          payload
        );
        created = res?.data ?? res ?? payload;
      } catch (err) {
        console.warn("API createAppointment lỗi, fallback cục bộ:", err);
        created = {
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        message.warning(
          "Backend không trả lời — lịch được thêm cục bộ để test."
        );
      }

      // add event text: reason · #doctorId
      addEvent({
        date: payload.appointmentDatetime,
        content: `${payload.reason || "Lịch hẹn"} · #${payload.doctorId}`,
        type: "warning",
        source: "appointment",
        meta: created,
      });
      upsertStoredAppointment(currentUserId, created);

      message.success("Đặt lịch thành công (hiển thị cục bộ).");
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error("Validate / tạo lịch thất bại:", err);
      message.error(err?.message || "Không thể tạo lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const getListData = (value) => {
    const key = dayjs(value).format("YYYY-MM-DD");
    return eventsByDate[key] ? [...eventsByDate[key]] : [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    if (!listData || listData.length === 0) return null;
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {listData.map((item, idx) => (
          <li key={`${item.content}-${idx}`} style={{ marginBottom: 6 }}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info && info.type === "date") return dateCellRender(current);
    return info?.originNode ?? null;
  };

  const upcoming = useMemo(() => {
    const arr = [];
    Object.entries(eventsByDate).forEach(([dateKey, items]) => {
      items.forEach((it) => arr.push({ date: dateKey, ...it }));
    });
    arr.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
    return arr.slice(0, 8);
  }, [eventsByDate]);

  return (
    <Layout style={layoutStyle}>
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              Lịch trình sức khỏe gia đình
            </Title>
            <Text type="secondary">
              Quản lý lịch hẹn và lịch uống thuốc của gia đình.
            </Text>
          </Col>

          <Col>
            <Space>
              <Button type="primary" onClick={openAddModal}>
                Đặt lịch hẹn
              </Button>
            </Space>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card size="small" title="Sự kiện sắp tới" style={{ marginTop: 8 }}>
              {upcoming.length === 0 ? (
                <Text type="secondary">Không có sự kiện.</Text>
              ) : (
                <List
                  dataSource={upcoming}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <span>
                            <Badge status={item.type} />{" "}
                            <Text strong>{item.content}</Text>
                          </span>
                        }
                        description={
                          item.meta?.appointmentDatetime
                            ? dayjs(item.meta.appointmentDatetime).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : dayjs(item.date).format("DD/MM/YYYY")
                        }
                      />
                      <Text
                        type="secondary"
                        style={{ textTransform: "capitalize" }}>
                        {item.source}
                      </Text>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      <Card>
        <div
          style={{
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
          }}>
          <div style={{ width: isMobile ? "700px" : "100%", maxWidth: "100%" }}>
            <Calendar cellRender={cellRender} />
          </div>
        </div>
      </Card>

      <Modal
        title="Đặt lịch hẹn"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
        destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item
            name="patientId"
            label="Thành viên gia đình"
            rules={[{ required: true, message: "Chọn thành viên" }]}
            initialValue={familyMembers[0]?.id ?? null}>
            <Select
              placeholder="Chọn thành viên"
              optionLabelProp="label"
              notFoundContent="Không có thành viên"
              options={familyMembers.map((member) => ({
                value: member.id,
                label: member.name ?? "Thành viên",
              }))}
            />
          </Form.Item>

          <Form.Item
            name="doctorId"
            label="Bác sĩ"
            rules={[{ required: true, message: "Chọn bác sĩ" }]}>
            <Select
              placeholder="Chọn bác sĩ"
              optionLabelProp="label"
              options={doctorList.map((d) => ({
                value: d.id,
                label: d.name ?? d.fullName ?? "Không rõ tên",
              }))}
              notFoundContent="Không có bác sĩ"
            />
          </Form.Item>

          <Form.Item
            name="appointmentDatetime"
            label="Ngày & giờ"
            rules={[
              { required: true, message: "Chọn thời gian" },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.reject();
                  if (dayjs(value).isBefore(dayjs(), "minute"))
                    return Promise.reject(
                      new Error("Không thể chọn thời gian trước hiện tại")
                    );
                  return Promise.resolve();
                },
              }),
            ]}>
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: "Nhập lý do" }]}>
            <Input placeholder="Ví dụ: Tên bệnh nhân - Khám định kỳ" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="PENDING">
            <Input disabled value="PENDING" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
