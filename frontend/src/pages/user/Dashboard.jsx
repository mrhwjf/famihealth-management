// StoreLayout.jsx
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useIsMobile from "../../hooks/useIsMobile";
import { appointmentService } from "../../services/appointmentService";
import { getMyFamily } from "../../services/myFamily";
import { vaccineService } from "../../services/vaccineService";
import {
  loadStoredAppointments,
  mergeAppointmentLists,
  saveStoredAppointments,
  appointmentIdentity,
} from "../../utils/upcomingAppointmentsStorage";
import {
  Layout,
  Menu,
  Input,
  Badge,
  Drawer,
  Button,
  Row,
  Col,
  Card,
  Avatar,
  Space,
  Select,
  Flex,
  Calendar,
  theme,
  List,
  Typography,
  Table,
  Empty,
  Descriptions,
  message,
} from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;
const { Meta } = Card;
const { Text } = Typography;
dayjs.extend(relativeTime);
//Calendar onPanelChange function
const onPanelChange = (value, mode) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

const toBadgeStatus = (status = "") => {
  const normalized = String(status || "").toLowerCase();
  if (!normalized || normalized === "pending") return "warning";
  if (["confirmed", "done", "completed", "approved"].includes(normalized)) {
    return "success";
  }
  if (["cancelled", "canceled", "rejected"].includes(normalized)) {
    return "error";
  }
  return "processing";
};

const formatDoctorName = (meta = {}) => {
  const doctorId = meta.doctorId ?? meta.doctor?.id ?? null;
  return (
    meta.doctorName ??
    meta.doctor?.name ??
    (doctorId ? `Bác sĩ #${doctorId}` : "Không rõ bác sĩ")
  );
};

const formatPatientName = (meta = {}, currentUserId) => {
  const patientId = meta.patientId ?? meta.patient?.id ?? null;
  if (patientId && patientId === currentUserId) return "Bạn";
  return (
    meta.patientName ??
    meta.patient?.name ??
    (patientId ? `#${patientId}` : "Thành viên")
  );
};

const formatAppointmentDate = (meta = {}) => {
  const source =
    meta.appointmentDatetime ||
    meta.appointmentDate ||
    meta.date ||
    meta.start ||
    meta.createdAt ||
    null;
  return source
    ? dayjs(source).format("DD/MM/YYYY HH:mm")
    : "Chưa rõ thời gian";
};

const normalizeUpcomingItems = (items = [], currentUserId) =>
  (Array.isArray(items) ? items : []).map((item, index) => {
    const meta = item?.meta ?? item ?? {};
    const key =
      appointmentIdentity(meta) ??
      appointmentIdentity(item) ??
      `local-${index}`;
    const reason =
      meta.reason || meta.content || item.reason || "Không có ghi chú";
    const status = (meta.status || item.status || "pending").toLowerCase();

    return {
      key,
      patientName: formatPatientName(meta, currentUserId),
      doctorName: formatDoctorName(meta),
      displayDate: formatAppointmentDate(meta),
      statusLabel: status,
      reason,
      badgeStatus: toBadgeStatus(status),
    };
  });
const ensureArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeVaccinationRecord = (record = {}, memberFallback = {}) => {
  const administeredRaw =
    record.administeredDate || record.administered_date || record.date || null;
  const intervalDays =
    record.intervalDays || record.interval_days || record.interval || null;

  return {
    key:
      record.id ??
      `${memberFallback.id ?? record.familyMemberId ?? "m"}-` +
        `${record.vaccineId ?? record.vaccine?.id ?? Date.now()}`,
    id: record.id ?? "",
    familyMemberId: record.familyMemberId ?? memberFallback.id ?? "",
    familyMemberName:
      record.familyMemberName ??
      memberFallback.name ??
      memberFallback.fullName ??
      "Thành viên",
    vaccineId: record.vaccineId ?? record.vaccine?.id ?? "",
    vaccineName: record.vaccineName ?? record.vaccine?.name ?? "",
    administered_date: administeredRaw ?? "",
    interval_days: intervalDays,
    nextDueDate: record.nextDueDate ?? record.next_due_date ?? "",
    notes: record.notes ?? record.note ?? record.description ?? "",
  };
};

const formatGenderLabel = (value = "") => {
  const normalized = String(value || "").toUpperCase();
  if (normalized.includes("FEMALE") || normalized === "F") return "Nữ";
  if (normalized.includes("MALE") || normalized === "M") return "Nam";
  if (!normalized) return "";
  return value;
};

const formatBloodTypeLabel = (value = "") => {
  const map = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
  };
  return map[value] || value || "";
};

const formatDateDisplay = (value) =>
  value ? dayjs(value).format("DD/MM/YYYY") : "—";

const computeAgeFromDate = (value) => {
  if (!value) return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return dayjs().diff(parsed, "year");
};

const normalizeFamilyMember = (source = {}) => {
  const relationshipValue =
    source.relationship ?? source.relationshipToCreator ?? source.role ?? "";
  const dob = source.dateofBirth ?? source.dob ?? source.birthDate ?? "";
  const rawGender = source.gender ?? source.sex ?? source.user?.gender ?? "";
  const rawBlood =
    source.bloodType ?? source.blood_type ?? source.user?.bloodType ?? "";

  return {
    id: source.id ?? source.memberId ?? `member-${Date.now()}-${Math.random()}`,
    familyId: source.familyID ?? source.familyId ?? source.family?.id ?? "",
    name:
      source.name ??
      source.fullName ??
      source.user?.name ??
      (`${source.firstName ?? ""} ${source.lastName ?? ""}`.trim() ||
        "Thành viên"),
    relationship: relationshipValue,
    dateOfBirth: dob,
    age:
      source.age ??
      source.ageYears ??
      source.user?.age ??
      computeAgeFromDate(dob) ??
      null,
    gender: formatGenderLabel(rawGender),
    phone:
      source.phone ??
      source.phoneNumber ??
      source.user?.phone ??
      source.user?.phoneNumber ??
      "",
    bloodType: formatBloodTypeLabel(rawBlood),
    cardImage:
      source.cardImage ??
      source.profileUrl ??
      source.avatarUrl ??
      source.user?.profileUrl ??
      "",
    original: source,
  };
};

const DEFAULT_SESSION_ID = "3d2c4b28-1bed-4aa2-9298-2fcad169182b";

//fake data
//1. Family Overview data

const FamilyOverview_data = {
  familyName: "3 ae lọ chéo Family",
  address: "273 An Dương Vương",
  contactPhone: "0912345678",
  linkedDoctorsCount: "3",
  //family invite code button can be added later
};
//3. Alerts & Health Reminders data
const AlertsandHealthReminders_data = [
  {
    name: "Nguyễn Grass",
    alert: "Upcoming dental check: 20/11/2023",
  },
  {
    name: "Nguyễn Hữu Phong",
    alert: "Kid's vaccine reminder: 25/12/2023",
  },
  {
    name: "Đỗ Thiên Phú",
    alert: "Upcoming dental check: 20/11/2023",
  },
  {
    name: "Hồ Thanh Thái",
    alert: "Upcoming dental check: 20/11/2023",
  },
];
//4. Upcoming Appointments data
// const UpcomingAppointments_data = [
//   {
//     name: "Nguyễn Grass",
//     doctorName: "Dr. Lê Văn Long",
//     date: "20/11/2023",
//     time: "9:00 AM",
//     status: "Scheduled",
//     //Book new appointment button can be added later
//   },
//   {
//     name: "Nguyễn Hữu Phong",
//     doctorName: "Dr. Lê Văn Long",
//     date: "05/12/2023",
//     time: "3:00 PM",
//     status: "Scheduled",
//     //Book new appointment button can be added later
//   },
//   {
//     name: "Đỗ Thiên Phú",
//     doctorName: "Dr. Trần Thị Hương",
//     date: "15/12/2023",
//     time: "11:00 AM",
//     status: "Cancelled",
//     //Book new appointment button can be added later
//   },
// ];
//5. Recent Medical Records data
const RecentMedicalRecords_data = [
  {
    name: "Nguyễn Grass",
    visitDate: "15/10/2023",
    facility: "FV Hospital",
    diagnosis: "Blood Test",
    doctor: "Dr. Lê Văn Long",
  },
  {
    name: "Nguyễn Hữu Phong",
    visitDate: "22/10/2023",
    facility: "City Clinic",
    diagnosis: "X-Ray",
    doctor: "Dr. Trần Thị Hương",
  },
  {
    name: "Đỗ Thiên Phú",
    visitDate: "05/11/2023",
    facility: "Family Health Center",
    diagnosis: "Allergy Test",
    doctor: "Dr. Nguyễn Thị Lan",
  },
  {
    name: "Hồ Thanh Thái",
    visitDate: "10/11/2023",
    facility: "Downtown Medical",
    diagnosis: "Vision Test",
    doctor: "Dr. Phạm Văn Minh",
  },
];
export default function Dashboard() {
  const isMobile = useIsMobile();
  const storedSessionId =
    sessionStorage.getItem("sessionId") ||
    sessionStorage.getItem("session_id") ||
    "";
  const sessionId = storedSessionId || DEFAULT_SESSION_ID;
  const usingFallbackSession = !storedSessionId;
  const rawUserId = sessionStorage.getItem("user_id");
  const userId = rawUserId ? Number(rawUserId) : null;
  const [upcoming, setUpcoming] = useState(() =>
    normalizeUpcomingItems(loadStoredAppointments(userId), userId)
  );
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [vaccinationLoading, setVaccinationLoading] = useState(true);
  const [vaccinationEmptyMessage, setVaccinationEmptyMessage] = useState(
    "Chưa có dữ liệu tiêm chủng"
  );
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyLoading, setFamilyLoading] = useState(true);
  const [familyError, setFamilyError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const cached = loadStoredAppointments(userId);
      if (mounted) {
        setUpcoming(normalizeUpcomingItems(cached, userId));
      }
      try {
        // fetch upcoming for current user or family; adjust params to backend
        const res = await appointmentService.getAppointments(sessionId, {
          patientId: userId,
          upcoming: true,
        });
        const items = res?.data?.items ?? res?.data?.data ?? [];
        if (!mounted) return;
        const merged = mergeAppointmentLists(items, cached);
        setUpcoming(normalizeUpcomingItems(merged, userId));
        saveStoredAppointments(userId, merged);
      } catch (err) {
        console.error("Load upcoming failed", err);
      }
    };
    load();
    return () => (mounted = false);
  }, [sessionId, userId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchFamilyMembers() {
      try {
        setFamilyLoading(true);
        setFamilyError("");
        if (usingFallbackSession && !cancelled) {
          setFamilyError(
            "Không tìm thấy session hợp lệ. Vui lòng đăng nhập để xem thành viên gia đình."
          );
        }

        const response = await getMyFamily(sessionId);
        if (cancelled) return;
        const normalized = ensureArray(response).map(normalizeFamilyMember);
        setFamilyMembers(normalized);
        if (normalized.length === 0 && !usingFallbackSession) {
          setFamilyError("Chưa tìm thấy thành viên nào trong gia đình.");
        }
      } catch (error) {
        console.error("fetch family members error", error);
        if (!cancelled) {
          setFamilyMembers([]);
          setFamilyError("Không thể tải danh sách thành viên gia đình.");
          message.error("Không thể tải danh sách thành viên gia đình.");
        }
      } finally {
        if (!cancelled) setFamilyLoading(false);
      }
    }

    fetchFamilyMembers();
    return () => {
      cancelled = true;
    };
  }, [sessionId, usingFallbackSession]);

  useEffect(() => {
    let cancelled = false;

    async function fetchVaccinations() {
      if (!Array.isArray(familyMembers) || familyMembers.length === 0) {
        if (!familyLoading && !cancelled) {
          setVaccinationRecords([]);
          setVaccinationEmptyMessage(
            familyError || "Chưa tìm thấy thành viên nào trong gia đình."
          );
          setVaccinationLoading(false);
        }
        return;
      }

      try {
        setVaccinationLoading(true);
        if (usingFallbackSession && !cancelled) {
          setVaccinationEmptyMessage(
            "Không tìm thấy session hợp lệ. Vui lòng đăng nhập để xem hồ sơ tiêm chủng."
          );
        }

        const recordsByMember = await Promise.all(
          familyMembers.map(async (member) => {
            try {
              const resp = await vaccineService.getMemberVaccines(
                sessionId,
                member.id
              );
              return ensureArray(resp).map((item) =>
                normalizeVaccinationRecord(item, member)
              );
            } catch (error) {
              console.error(
                "getMemberVaccines failed for member",
                member?.id,
                error
              );
              message.warning(
                `Không thể tải hồ sơ tiêm chủng của ${
                  member?.name ?? "thành viên"
                }`
              );
              return [];
            }
          })
        );

        if (!cancelled) {
          const flattened = recordsByMember.flat();
          setVaccinationRecords(flattened);
          if (flattened.length === 0) {
            setVaccinationEmptyMessage(
              "Các thành viên chưa có hồ sơ tiêm chủng."
            );
          }
        }
      } catch (error) {
        console.error("fetch dashboard vaccinations error", error);
        if (!cancelled) {
          setVaccinationRecords([]);
          setVaccinationEmptyMessage("Không thể tải dữ liệu tiêm chủng.");
          message.error("Không thể tải dữ liệu tiêm chủng.");
        }
      } finally {
        if (!cancelled) setVaccinationLoading(false);
      }
    }

    if (!familyLoading) {
      fetchVaccinations();
    }
    return () => {
      cancelled = true;
    };
  }, [
    sessionId,
    familyMembers,
    familyLoading,
    familyError,
    usingFallbackSession,
  ]);

  const enrichedVaccinations = useMemo(() => {
    return (vaccinationRecords || []).map((record) => {
      const administered = record.administered_date
        ? dayjs(record.administered_date)
        : null;
      const nextDue = record.nextDueDate
        ? dayjs(record.nextDueDate)
        : administered && record.interval_days
        ? administered.add(record.interval_days, "day")
        : null;
      const today = dayjs();
      let status = "ok";
      if (!nextDue) status = "unknown";
      else if (nextDue.isBefore(today, "day")) status = "overdue";
      else if (nextDue.diff(today, "day") <= 7) status = "due_soon";

      return {
        ...record,
        administered,
        nextDue,
        status,
      };
    });
  }, [vaccinationRecords]);

  const vaccinationStats = useMemo(() => {
    const totals = {
      total: enrichedVaccinations.length,
      dueSoon: 0,
      overdue: 0,
    };
    enrichedVaccinations.forEach((item) => {
      if (item.status === "due_soon") totals.dueSoon += 1;
      if (item.status === "overdue") totals.overdue += 1;
    });
    return totals;
  }, [enrichedVaccinations]);

  const upcomingDueEntries = useMemo(() => {
    return enrichedVaccinations
      .filter((item) => item.nextDue)
      .sort((a, b) => a.nextDue.valueOf() - b.nextDue.valueOf())
      .slice(0, 3)
      .map((item) => ({
        key: item.key,
        name: item.familyMemberName,
        due: item.nextDue ? item.nextDue.format("DD/MM/YYYY") : "",
      }));
  }, [enrichedVaccinations]);

  const vaccinationColumns = useMemo(
    () => [
      {
        title: "Họ tên",
        dataIndex: "familyMemberName",
        key: "familyMemberName",
        width: 180,
        sorter: (a, b) =>
          (a.familyMemberName || "").localeCompare(b.familyMemberName || ""),
        render: (t, row) => (
          <Text>{t || row.familyMemberId || row.memberId || "—"}</Text>
        ),
      },
      {
        title: "Vaccine ID",
        dataIndex: "vaccineId",
        key: "vaccineId",
        width: 110,
        render: (t) => <Text>{t || "—"}</Text>,
      },
      {
        title: "Vaccine",
        dataIndex: "vaccineName",
        key: "vaccineName",
        ellipsis: true,
        render: (t) => <Text strong>{t || "—"}</Text>,
      },
      {
        title: "Đã tiêm",
        dataIndex: "administered",
        key: "administered",
        width: 140,
        sorter: (a, b) =>
          (a.administered?.unix() || 0) - (b.administered?.unix() || 0),
        render: (d) =>
          d ? dayjs(d).format("DD/MM/YYYY") : <Text type="secondary">—</Text>,
      },
      {
        title: "Hạn kế tiếp",
        dataIndex: "nextDue",
        key: "nextDue",
        width: 160,
        sorter: (a, b) => (a.nextDue?.unix() || 0) - (b.nextDue?.unix() || 0),
        render: (d) =>
          d ? (
            <span>
              {dayjs(d).format("DD/MM/YYYY")}
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(d).fromNow()}
              </Text>
            </span>
          ) : (
            <Text type="secondary">N/A</Text>
          ),
      },
    ],
    []
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ margin: "16px" }}>
          <Row gutter={[16, 16]}>
            {/* Family Overview Cards Grid */}
            <Col span={isMobile ? 24 : 7}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Family Overview" description={null} />
                <div>
                  <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                    <li>Family Name: {FamilyOverview_data.familyName}</li>
                    <li>Address: {FamilyOverview_data.address}</li>
                    <li>Contact Phone: {FamilyOverview_data.contactPhone}</li>
                    <li>
                      Linked Doctors Count:{" "}
                      {FamilyOverview_data.linkedDoctorsCount}
                    </li>
                  </ul>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input placeholder="Family invite code" />
                    <Button type="primary" style={{ marginBottom: "1.5px" }}>
                      Submit
                    </Button>
                  </Space.Compact>
                </div>
              </Card>
            </Col>
            {/* Upcoming Appointments Cards Grid */}
            <Col span={isMobile ? 24 : 17}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Upcoming Appointments" description={null} />

                {upcoming.length === 0 ? (
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 12 }}>
                    Không có lịch hẹn sắp tới.
                  </Text>
                ) : (
                  <List
                    style={{ marginTop: 16 }}
                    dataSource={upcoming}
                    renderItem={(item) => (
                      <List.Item key={item.key}>
                        <List.Item.Meta
                          avatar={<Badge status={item.badgeStatus} />}
                          title={
                            <span>
                              <strong>{item.patientName}</strong> ·{" "}
                              {item.doctorName}
                            </span>
                          }
                          description={
                            <>
                              <div>{item.reason}</div>
                              <div style={{ color: "var(--ant-gray-6)" }}>
                                {item.displayDate} · {item.statusLabel}
                              </div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>

            {/* Family Members Cards Grid */}
            <Col span={24}>
              <Card className="">
                <Meta title="Family Members" description={null} />
                <div style={{ marginTop: 12 }}>
                  {familyLoading ? (
                    <Text type="secondary">
                      Đang tải danh sách thành viên gia đình...
                    </Text>
                  ) : familyMembers.length === 0 ? (
                    <Empty description={familyError || "Chưa có thành viên."} />
                  ) : (
                    <Row gutter={[16, 16]}>
                      {familyMembers.map((member) => (
                        <Col key={member.id} span={isMobile ? 24 : 12}>
                          <Card className="hover-expand-card" hoverable>
                            <Flex
                              align="flex-start"
                              gap={16}
                              vertical={isMobile}
                              style={{ marginBottom: 16 }}>
                              <Avatar
                                shape="square"
                                size={isMobile ? 72 : 96}
                                src={member.cardImage || undefined}
                                icon={<UserOutlined />}
                              />
                              <div>
                                <Text strong style={{ fontSize: 16 }}>
                                  {member.name}
                                </Text>
                                <br />
                                <Text type="secondary">
                                  {member.relationship || "Chủ hộ"}
                                </Text>
                              </div>
                            </Flex>
                            <Descriptions
                              bordered
                              size="small"
                              column={isMobile ? 1 : 2}
                              labelStyle={{ width: 140 }}
                              contentStyle={{ fontWeight: 500 }}>
                              <Descriptions.Item label="Mã thành viên">
                                {member.id}
                              </Descriptions.Item>
                              <Descriptions.Item label="Ngày sinh">
                                {formatDateDisplay(member.dateOfBirth)}
                              </Descriptions.Item>
                              <Descriptions.Item label="Tuổi">
                                {new Date().getFullYear() - (new Date(member.dateOfBirth)).getFullYear() ?? "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Giới tính">
                                {member.gender || "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Điện thoại">
                                {member.phone || "—"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Nhóm máu">
                                {member.bloodType || "—"}
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              </Card>
            </Col>
            {/* Recent Medical Records Cards Grid */}
            <Col span={isMobile ? 24 : 12}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Recent Medical Records" description={null} />
                <div>
                  <ul className="list-disc ml-5 mt-2">
                    {RecentMedicalRecords_data.map((record) => (
                      <li>
                        {record.name} - {record.visitDate} - {record.facility} -{" "}
                        {record.diagnosis} - {record.doctor}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Col>

            {/* Vaccination Summary Cards Grid */}
            <Col span={isMobile ? 24 : 12}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Vaccination Summary" description={null} />
                <div>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Total Vaccines Recorded: {vaccinationStats.total}</li>
                    <li>Due Soon (≤7 ngày): {vaccinationStats.dueSoon}</li>
                    <li>Overdue: {vaccinationStats.overdue}</li>
                  </ul>
                </div>
                <div style={{ marginTop: 12 }}>
                  {vaccinationLoading ? (
                    <Text type="secondary">Đang tải hồ sơ tiêm chủng...</Text>
                  ) : enrichedVaccinations.length === 0 ? (
                    <Empty description={vaccinationEmptyMessage} />
                  ) : (
                    <Table
                      rowKey={(record) => record.key || record.id}
                      dataSource={enrichedVaccinations}
                      columns={vaccinationColumns}
                      size="small"
                      pagination={{ pageSize: isMobile ? 3 : 5 }}
                      scroll={{ x: true }}
                    />
                  )}
                </div>
              </Card>
            </Col>
            {/* Alerts & Health Reminders Cards Grid */}
            <Col span={24}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Alerts & Health Reminders" description={null} />
                <div>
                  <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                    <li>Upcoming dental check: 20/11</li>
                    <li>Kid's vaccine reminder: 25/12</li>
                    <li>Blood pressure recheck recommended</li>
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
